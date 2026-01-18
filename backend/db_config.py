import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",      # Default XAMPP password is empty
        database="bookstore_erp"
    )