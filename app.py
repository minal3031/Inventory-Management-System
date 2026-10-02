from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

DATABASE = "database.db"


# Connect to database
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# Create database table
def init_db():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# GET - View all products
@app.route("/api/products", methods=["GET"])
def get_products():

    conn = get_db_connection()

    products = conn.execute(
        "SELECT * FROM products ORDER BY id DESC"
    ).fetchall()

    conn.close()

    return jsonify([dict(product) for product in products])


# POST - Add product
@app.route("/api/products", methods=["POST"])
def add_product():

    data = request.get_json()

    product_id = data.get("product_id")
    name = data.get("name")
    category = data.get("category")
    quantity = data.get("quantity")
    price = data.get("price")

    if not product_id or not name or not category:
        return jsonify({
            "error": "Required fields are missing"
        }), 400

    if quantity is None or price is None:
        return jsonify({
            "error": "Quantity and price are required"
        }), 400

    try:
        quantity = int(quantity)
        price = float(price)

    except ValueError:
        return jsonify({
            "error": "Quantity and price must be valid numbers"
        }), 400

    if quantity < 0 or price < 0:
        return jsonify({
            "error": "Quantity and price cannot be negative"
        }), 400

    try:

        conn = get_db_connection()

        conn.execute("""
            INSERT INTO products
            (product_id, name, category, quantity, price)
            VALUES (?, ?, ?, ?, ?)
        """, (
            product_id,
            name,
            category,
            quantity,
            price
        ))

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Product added successfully"
        }), 201

    except sqlite3.IntegrityError:

        return jsonify({
            "error": "Product ID already exists"
        }), 409


# PUT - Update product
@app.route("/api/products/<product_id>", methods=["PUT"])
def update_product(product_id):

    data = request.get_json()

    quantity = data.get("quantity")
    price = data.get("price")

    if quantity is None or price is None:
        return jsonify({
            "error": "Quantity and price are required"
        }), 400

    try:
        quantity = int(quantity)
        price = float(price)

    except ValueError:
        return jsonify({
            "error": "Quantity and price must be valid numbers"
        }), 400

    if quantity < 0 or price < 0:
        return jsonify({
            "error": "Quantity and price cannot be negative"
        }), 400

    conn = get_db_connection()

    product = conn.execute(
        "SELECT * FROM products WHERE product_id = ?",
        (product_id,)
    ).fetchone()

    if product is None:
        conn.close()

        return jsonify({
            "error": "Product not found"
        }), 404

    conn.execute("""
        UPDATE products
        SET quantity = ?, price = ?
        WHERE product_id = ?
    """, (
        quantity,
        price,
        product_id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Product updated successfully"
    })


# DELETE - Delete product
@app.route("/api/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):

    conn = get_db_connection()

    product = conn.execute(
        "SELECT * FROM products WHERE product_id = ?",
        (product_id,)
    ).fetchone()

    if product is None:
        conn.close()

        return jsonify({
            "error": "Product not found"
        }), 404

    conn.execute(
        "DELETE FROM products WHERE product_id = ?",
        (product_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Product deleted successfully"
    })


# Start application
if __name__ == "__main__":

    init_db()

    app.run(debug=True)