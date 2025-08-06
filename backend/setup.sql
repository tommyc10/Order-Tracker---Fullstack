CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    order_type ENUM('buy', 'sell') NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
