from flask import Blueprint, request, jsonify
from db_config import get_db_connection
from middleware import get_current_user

inventory_bp = Blueprint('inventory', __name__)

# READ (Robust Search + Pagination + Safety Checks)
@inventory_bp.route('/books', methods=['GET'])
def get_books():
    user = get_current_user() # This might be None!
    search_query = request.args.get('q', '')
    
    # Pagination
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 8, type=int)
    offset = (page - 1) * limit

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    sql = "SELECT * FROM books"
    params = []
    conditions = []

    # --- SAFETY FIX ---
    # Only filter by vendor_id if user exists AND is a vendor.
    # If user is None (Guest) or Customer or Super Admin, show ALL books.
    if user and user.get('role') == 'vendor':
        conditions.append("vendor_id = %s")
        params.append(user['user_id'])

    # Search Logic
    if search_query:
        conditions.append("(title LIKE %s OR author LIKE %s)")
        search_term = f"%{search_query}%"
        params.extend([search_term, search_term])

    if conditions:
        sql += " WHERE " + " AND ".join(conditions)
    
    sql += " ORDER BY id DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])

    cursor.execute(sql, tuple(params))
    books = cursor.fetchall()
    conn.close()
    return jsonify(books)

# CREATE
@inventory_bp.route('/books', methods=['POST'])
def add_book():
    user = get_current_user()
    if not user or user['role'] not in ['vendor', 'super_admin']: 
        return jsonify({'message': 'Unauthorized'}), 401
    
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO books (title, author, price, cost_price, stock, vendor_id, image_url) VALUES (%s, %s, %s, %s, %s, %s, %s)",
        (data['title'], data['author'], data['price'], data.get('cost', 0), data['stock'], user['user_id'], data.get('image_url', ''))
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Book added'})

# PROCUREMENT
@inventory_bp.route('/procure', methods=['POST'])
def procure_books():
    user = get_current_user()
    if not user or user['role'] not in ['vendor', 'super_admin']: 
        return jsonify({'message': 'Unauthorized'}), 401
    
    data = request.json
    book_id = data['book_id']
    quantity = int(data['quantity'])
    cost_per_unit = float(data['cost'])
    total_cost = quantity * cost_per_unit

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE books SET stock = stock + %s WHERE id = %s", (quantity, book_id))
        cursor.execute("INSERT INTO purchase_orders (book_id, vendor_id, quantity, total_cost) VALUES (%s, %s, %s, %s)",
                       (book_id, user['user_id'], quantity, total_cost))
        cursor.execute("INSERT INTO finances (transaction_type, amount, description) VALUES ('Expense', %s, %s)",
                       (total_cost, f"Procurement Order for Book ID {book_id}"))
        conn.commit()
        return jsonify({'message': 'Procurement successful'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# UPDATE & DELETE
@inventory_bp.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    user = get_current_user()
    if not user or user['role'] not in ['vendor', 'super_admin']: return jsonify({'message': 'Unauthorized'}), 401
    # ... (Add update logic if needed later)
    return jsonify({'message': 'Not implemented yet'})

@inventory_bp.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    user = get_current_user()
    if not user or user['role'] not in ['vendor', 'super_admin']: return jsonify({'message': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM books WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'})