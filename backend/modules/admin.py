from flask import Blueprint, jsonify
from db_config import get_db_connection
from middleware import get_current_user

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
def get_all_users():
    user = get_current_user()
    if not user or user['role'] != 'super_admin':
        return jsonify({'message': 'Access Denied'}), 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Get Vendors (exclude super admin himself)
    cursor.execute("SELECT id, name, email, 'vendor' as role FROM vendors WHERE role != 'super_admin'")
    vendors = cursor.fetchall()
    
    # Get Customers
    cursor.execute("SELECT id, name, email, 'customer' as role FROM customers")
    customers = cursor.fetchall()
    
    conn.close()
    return jsonify(vendors + customers)

@admin_bp.route('/users/<string:role>/<int:id>', methods=['DELETE'])
def delete_user(role, id):
    user = get_current_user()
    if not user or user['role'] != 'super_admin':
        return jsonify({'message': 'Access Denied'}), 403

    conn = get_db_connection()
    cursor = conn.cursor()
    
    table = 'vendors' if role == 'vendor' else 'customers'
    
    try:
        cursor.execute(f"DELETE FROM {table} WHERE id = %s", (id,))
        conn.commit()
        return jsonify({'message': f'{role} deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()