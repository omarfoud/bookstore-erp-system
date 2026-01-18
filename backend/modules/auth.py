from flask import Blueprint, request, jsonify
from db_config import get_db_connection
from flask_bcrypt import Bcrypt 
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()
SECRET_KEY = "super_secret_erp_key"

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    # We don't rely solely on this 'role' from frontend anymore for the final logic,
    # but we use it to decide which table to check.
    requested_role = data.get('role') 

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # 1. Decide which table to check
    # If the user selected 'vendor' or 'super_admin' in the dropdown, check the vendors table.
    table = 'vendors' if requested_role in ['vendor', 'super_admin'] else 'customers'
    
    cursor.execute(f"SELECT * FROM {table} WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    # 2. Validate User and Password
    if user and bcrypt.check_password_hash(user['password'], password):
        
        # --- ROLE NORMALIZATION LOGIC ---
        db_role = user.get('role', 'customer')
        
        # If the user is in the 'vendors' table...
        if table == 'vendors':
            # If they are explicitly a super_admin, keep it.
            if db_role == 'super_admin':
                final_role = 'super_admin'
            else:
                # Otherwise, force the role to be 'vendor' for the app logic
                # (Even if the DB says 'admin')
                final_role = 'vendor'
        else:
            final_role = 'customer'

        # Security Check: Prevent non-super-admins from logging in as super_admin
        if requested_role == 'super_admin' and final_role != 'super_admin':
             return jsonify({'message': 'Access Denied: You are not a Super Admin'}), 403

        # 3. Generate Token with the CORRECT 'final_role'
        token = jwt.encode({
            'user_id': user['id'],
            'role': final_role, # Important: This allows middleware.py to filter data correctly
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            'token': token, 
            'role': final_role, 
            'name': user['name']
        })
    
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'customer')

    if not name or not email or not password:
        return jsonify({'message': 'All fields required'}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    table = 'vendors' if role == 'vendor' else 'customers'
    
    try:
        cursor.execute(f"SELECT * FROM {table} WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'message': 'Email exists'}), 409

        # Insert
        if role == 'vendor':
            # We save as 'admin' in DB, but the login logic above handles the translation
            cursor.execute(f"INSERT INTO {table} (name, email, password, role) VALUES (%s, %s, %s, 'admin')", (name, email, hashed_pw))
        else:
             cursor.execute(f"INSERT INTO {table} (name, email, password) VALUES (%s, %s, %s)", (name, email, hashed_pw))
        
        conn.commit()
        new_id = cursor.lastrowid
        
        # Auto-login token
        token = jwt.encode({'user_id': new_id, 'role': role, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, SECRET_KEY, algorithm="HS256")

        return jsonify({'message': 'Registered', 'token': token, 'role': role, 'name': name, 'user_id': new_id}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        conn.close()