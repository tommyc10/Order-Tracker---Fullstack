from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)





# MySQL database config
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "plutopodge",
    "database": "ordertracker"
}

# Helper to connect to MySQL
def get_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print("Database connection failed:", e)
        return None

# GET all orders
@app.route("/trades", methods=["GET"])
def get_trades():
    conn = get_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders")
        rows = cursor.fetchall()
        conn.close()

        trades = []
        for row in rows:
            trades.append({
                "id": row[0],
                "asset": row[1],
                "quantity": row[2],
                "order_type": row[3],
                "status": row[4],
                "timestamp": row[5].strftime("%Y-%m-%d %H:%M:%S")
            })
        return jsonify(trades)
    else:
        return jsonify({"error": "Database connection failed"}), 500

# POST a new order
@app.route("/trades", methods=["POST"])
def add_trade():
    data = request.get_json()
    conn = get_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO orders (asset, quantity, order_type, status) VALUES (%s, %s, %s, %s)",
            (data["asset"], data["quantity"], data["order_type"], data["status"])
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Trade added"}), 201
    else:
        return jsonify({"error": "Database connection failed"}), 500

# PUT update an order
@app.route("/trades/<int:trade_id>", methods=["PUT"])
def update_trade(trade_id):
    data = request.get_json()
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor()
    cursor.execute(
        "UPDATE orders SET asset=%s, quantity=%s, order_type=%s, status=%s WHERE id=%s",
        (data["asset"], data["quantity"], data["order_type"], data["status"], trade_id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Trade updated"})

# DELETE an order
@app.route("/trades/<int:trade_id>", methods=["DELETE"])
def delete_trade(trade_id):
    conn = get_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor()
    cursor.execute("DELETE FROM orders WHERE id=%s", (trade_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Trade deleted"})

if __name__ == "__main__":
    app.run(debug=True, port=5001)


