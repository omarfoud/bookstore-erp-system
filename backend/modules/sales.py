from flask import Blueprint, request, jsonify
from db_config import get_db_connection
from middleware import get_current_user
sales_bp = Blueprint('sales', __name__)

@sales_bp.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    customer_id = data.get('customer_id')
    cart = data.get('cart') 

    # 1. Validation
    if not customer_id:
        return jsonify({'message': 'User ID missing. Please login again.'}), 400
    
    if not cart:
        return jsonify({'message': 'Cart is empty'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        total_revenue = 0
        
        for item in cart:
            # 2. Safe Conversions (Fixes Math Errors)
            book_id = item.get('book_id')
            qty = int(item.get('quantity', 1))
            price = float(item.get('price', 0)) # Ensure price is a number

            total = qty * price
            total_revenue += total
            
            # 3. Insert Order
            # Note: This might fail if 'customer_id' belongs to a Vendor and not a Customer
            cursor.execute("INSERT INTO sales_orders (customer_id, book_id, quantity, total_price) VALUES (%s, %s, %s, %s)",
                           (customer_id, book_id, qty, total))
            
            # 4. Update Stock
            cursor.execute("UPDATE books SET stock = stock - %s WHERE id = %s", 
                           (qty, book_id))

        # 5. Update Finances
        cursor.execute("INSERT INTO finances (transaction_type, amount, description) VALUES ('Income', %s, 'Book Sale Revenue')", 
                       (total_revenue,))
        
        conn.commit()
        return jsonify({'message': 'Order placed successfully'})

    except Exception as e:
        conn.rollback()
        # This will print the exact error to your Python terminal
        print("\n\n=== CHECKOUT ERROR ===\n", str(e), "\n======================\n")
        return jsonify({'error': str(e)}), 500
        
    finally:
        cursor.close()
        conn.close()
@sales_bp.route('/subscribe', methods=['POST'])
def subscribe():
    data = request.json
    customer_id = data.get('customer_id')
    plan = data.get('plan', 'Gold')
    price = 20.00 # Flat rate for demo

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Create Subscription
    cursor.execute("INSERT INTO subscriptions (customer_id, plan_name, price, start_date) VALUES (%s, %s, %s, CURDATE())",
                   (customer_id, plan, price))
    
    # 2. Record Revenue
    cursor.execute("INSERT INTO finances (transaction_type, amount, description) VALUES ('Income', %s, %s)",
                   (price, f"New Subscription: {plan}"))
    
    conn.commit()
    conn.close()
    return jsonify({'message': 'Subscribed successfully!'})

@sales_bp.route('/orders/<int:customer_id>', methods=['GET'])
def get_customer_orders(customer_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT s.id, s.order_date, s.status, s.total_price, s.quantity, b.title, b.image_url 
        FROM sales_orders s
        JOIN books b ON s.book_id = b.id
        WHERE s.customer_id = %s
        ORDER BY s.order_date DESC
    """
    cursor.execute(query, (customer_id,))
    orders = cursor.fetchall()
    conn.close()
    return jsonify(orders)

@sales_bp.route('/vendor/history', methods=['GET'])
def get_vendor_sales_history():
    user = get_current_user()
    if not user or user['role'] not in ['vendor', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Join Sales Orders with Books and Customers to get full details
    query = """
        SELECT s.id, s.order_date, s.quantity, s.total_price, 
               b.title as book_title, c.name as customer_name
        FROM sales_orders s
        JOIN books b ON s.book_id = b.id
        JOIN customers c ON s.customer_id = c.id
        WHERE b.vendor_id = %s
        ORDER BY s.order_date DESC
    """
    cursor.execute(query, (user['user_id'],))
    sales = cursor.fetchall()
    conn.close()
    return jsonify(sales)
