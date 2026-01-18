from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt # <--- Import

# Modules
from modules.auth import auth_bp
from modules.inventory import inventory_bp
from modules.sales import sales_bp
from modules.finance import finance_bp
from modules.hr import hr_bp
from modules.admin import admin_bp

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app) # <--- Initialize

# Pass bcrypt to blueprint context if needed, or import app in modules
# For simplicity, we will import bcrypt from a shared file or create a separate extensions file.
# To keep it simple for you: We will initialize Bcrypt inside auth.py using the app context if needed, 
# but the standard way is creating an extensions.py. 
# Let's do the simplest way: Update auth.py to use the library directly.

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
app.register_blueprint(sales_bp, url_prefix='/api/sales')
app.register_blueprint(finance_bp, url_prefix='/api/finance')
app.register_blueprint(hr_bp, url_prefix='/api/hr')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

if __name__ == '__main__':
    app.run(debug=True, port=5000)