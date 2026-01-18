import jwt
from flask import request, jsonify

SECRET_KEY = "super_secret_erp_key"

def get_current_user():
    token = None
    # 1. Check Header
    if 'Authorization' in request.headers:
        token = request.headers['Authorization'].split(" ")[1] # Bearer <token>
    
    if not token:
        return None

    try:
        # 2. Decode Token
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return data # Returns {'user_id': 1, 'role': 'vendor'}
    except:
        return None