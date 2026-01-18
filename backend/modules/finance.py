from flask import Blueprint, jsonify
from db_config import get_db_connection

finance_bp = Blueprint('finance', __name__)

@finance_bp.route('/report', methods=['GET'])
def get_report():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM finances ORDER BY transaction_date DESC")
    records = cursor.fetchall()
    
    # Simple Analytics
    cursor.execute("SELECT SUM(amount) as total FROM finances WHERE transaction_type='Income'")
    income = cursor.fetchone()['total'] or 0
    
    cursor.close()
    conn.close()
    return jsonify({'records': records, 'total_income': float(income)})