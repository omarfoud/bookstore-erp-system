from flask import Blueprint, jsonify, request
from db_config import get_db_connection
from middleware import get_current_user

hr_bp = Blueprint('hr', __name__)

@hr_bp.route('/employees', methods=['GET', 'POST'])
def manage_employees():
    user = get_current_user()
    if not user or user['role'] not in ['vendor', 'super_admin']: return jsonify({'message': 'Unauthorized'}), 401
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    if request.method == 'POST':
        data = request.json
        cursor.execute("INSERT INTO employees (name, position, salary, vendor_id, hire_date) VALUES (%s, %s, %s, %s, CURDATE())",
                       (data['name'], data['position'], data['salary'], user['user_id']))
        conn.commit()
        msg = {'message': "Employee added"}
    else:
        cursor.execute("SELECT * FROM employees WHERE vendor_id = %s", (user['user_id'],))
        msg = cursor.fetchall()
    conn.close()
    return jsonify(msg)

# NEW: Mark Attendance
@hr_bp.route('/attendance', methods=['POST'])
def mark_attendance():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO attendance (employee_id, date, status) VALUES (%s, CURDATE(), %s)",
                   (data['employee_id'], data['status']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Attendance Recorded'})

# NEW: Get Attendance
@hr_bp.route('/attendance/<int:emp_id>', methods=['GET'])
def get_attendance(emp_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM attendance WHERE employee_id = %s", (emp_id,))
    data = cursor.fetchall()
    conn.close()
    return jsonify(data)

@hr_bp.route('/attendance/history', methods=['GET'])
def get_attendance_history():
    user = get_current_user()
    if not user or user['role'] not in ['vendor', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Get attendance linked to this vendor's employees
    query = """
        SELECT a.id, a.date, a.status, e.name as employee_name, e.position
        FROM attendance a
        JOIN employees e ON a.employee_id = e.id
        WHERE e.vendor_id = %s
        ORDER BY a.date DESC
    """
    cursor.execute(query, (user['user_id'],))
    logs = cursor.fetchall()
    conn.close()
    return jsonify(logs)