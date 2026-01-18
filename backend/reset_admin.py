from flask import Flask
from flask_bcrypt import Bcrypt
import mysql.connector

# Initialize minimal app context
app = Flask(__name__)
bcrypt = Bcrypt(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="bookstore_erp"
    )

def fix_table(table_name):
    print(f"\nScanning table: {table_name}...")
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # 1. Get all users
    cursor.execute(f"SELECT id, password, email FROM {table_name}")
    users = cursor.fetchall()
    
    fixed_count = 0
    
    for user in users:
        stored_pw = user['password']
        
        # Check if password is NOT hashed (Bcrypt hashes start with $2b$)
        if not stored_pw.startswith('$2b$'):
            print(f" -> Fixing password for: {user['email']}")
            
            # Generate Hash
            hashed_pw = bcrypt.generate_password_hash(stored_pw).decode('utf-8')
            
            # Update DB
            update_cursor = conn.cursor()
            update_query = f"UPDATE {table_name} SET password = %s WHERE id = %s"
            update_cursor.execute(update_query, (hashed_pw, user['id']))
            update_cursor.close()
            
            fixed_count += 1
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ Fixed {fixed_count} accounts in {table_name}.")

if __name__ == "__main__":
    print("=== STARTING PASSWORD MIGRATION ===")
    try:
        fix_table('vendors')
        fix_table('customers')
        print("\n=== MIGRATION COMPLETE ===")
        print("You can now login with your old passwords.")
    except Exception as e:
        print(f"\n❌ Database Error: {e}")