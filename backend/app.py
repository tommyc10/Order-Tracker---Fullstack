from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import yfinance as yf

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


# stock ticker
@app.route("/top-stocks")
def get_top_stocks():
    # List of major stock symbols
    symbols = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'NFLX', 'META', 'AMD', 'INTC']
    try:
        stocks_data = []
        for symbol in symbols:
            stock = yf.Ticker(symbol)
            info = stock.info
            stocks_data.append({
                'symbol': symbol,
                'price': info.get('regularMarketPrice', 0),
                'changePercent': info.get('regularMarketChangePercent', 0)
            })
        return jsonify(stocks_data)
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/all-stocks")
def get_all_stocks():
    # Get S&P 500 symbols
    sp500_url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    import pandas as pd
    try:
        df = pd.read_html(sp500_url)[0]
        symbols = df['Symbol'].tolist()[:100]  # Get first 100 symbols for better performance
        
        # Fetch data in batches
        batch_size = 10
        stocks_data = []
        
        for i in range(0, len(symbols), batch_size):
            batch_symbols = symbols[i:i + batch_size]
            # Create a string of symbols for batch download
            symbols_str = ' '.join(batch_symbols)
            
            try:
                # Download data for the batch
                data = yf.download(symbols_str, period='1d', group_by='ticker', progress=False)
                
                # Process each symbol in the batch
                for symbol in batch_symbols:
                    try:
                        if isinstance(data, pd.DataFrame):
                            # Single symbol case
                            price = data['Close'].iloc[-1]
                            prev_price = data['Open'].iloc[0]
                        else:
                            # Multiple symbols case
                            price = data[symbol]['Close'].iloc[-1]
                            prev_price = data[symbol]['Open'].iloc[0]
                            
                        change_percent = ((price - prev_price) / prev_price) * 100
                        
                        stocks_data.append({
                            'symbol': symbol,
                            'price': round(price, 2),
                            'changePercent': round(change_percent, 2)
                        })
                    except Exception as e:
                        print(f"Error processing {symbol}: {str(e)}")
                        continue
                        
            except Exception as e:
                print(f"Error fetching batch: {str(e)}")
                continue
        
        return jsonify(stocks_data)
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)