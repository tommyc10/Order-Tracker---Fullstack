# Order Management Pro - Project Notes

## Project Overview
A full-stack order management application with real-time stock data display and trade execution capabilities. The application features a modern, dark-themed UI inspired by Dexscreener.

## Tech Stack
### Frontend
- **Framework**: React
- **Styling**: Bootstrap + Custom CSS
- **Features**:
  - Live stock data display
  - Real-time price updates (10-minute intervals)
  - Order management form
  - Search functionality
  - Pagination
  - Responsive layout
  - Dark theme

### Backend
- **Framework**: Flask (Python)
- **Database**: MySQL
- **External APIs**: yfinance for stock data
- **Features**:
  - RESTful API endpoints
  - Real-time stock data fetching
  - CRUD operations for orders
  - Error handling
  - CORS support

## API Endpoints

### Stock Data
- `GET /top-stocks`
  - Returns live data for major tech stocks (AAPL, TSLA, MSFT, GOOGL, AMZN)
  - Data includes: symbol, current price, price change percentage

### Order Management
- `GET /trades` - Retrieve all orders
- `POST /trades` - Create new order
- `PUT /trades/<id>` - Update existing order
- `DELETE /trades/<id>` - Delete order

## Database Schema
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    order_type ENUM('buy', 'sell') NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Frontend Components
1. **Main Layout**
   - Fixed sidebar (320px)
   - Full-width main content
   - Dark theme colors

2. **Order Form**
   - Asset input (stock symbol)
   - Quantity input
   - Order type selector (Buy/Sell)
   - Form validation
   - Success/error notifications

3. **Stock Table**
   - Live stock data display
   - Color-coded price changes
   - Company name lookup
   - Search functionality
   - Pagination (15 items per page)
   - Hover effects

## Styling Details
### Color Scheme
- Background: #0d1117
- Sidebar: #131722
- Card Background: #1c2030
- Border Color: #2a2e39
- Text Colors:
  - Primary: #fff
  - Secondary: #9da6b3
  - Success: #4caf50
  - Error: #ef5350
- Button Primary: #3761e9
- Button Hover: #2850d6

### UI Components
- Rounded corners (8px, 12px)
- Consistent padding (24px containers, 8-12px inputs)
- Smooth transitions
- Interactive hover states
- Clear visual hierarchy

## Features to Consider Adding
1. **Order Management**
   - Order history table
   - Order status updates
   - Bulk order operations
   - Order filtering/sorting

2. **Stock Data**
   - More technical indicators
   - Historical price charts
   - Watchlist functionality
   - Price alerts

3. **User Experience**
   - User authentication
   - Portfolio tracking
   - Performance metrics
   - Real-time notifications

4. **Data**
   - More stock symbols
   - Additional market data
   - Custom watchlists
   - Data export functionality

## Development Notes
- Backend runs on port 5001
- Frontend development server on default port
- MySQL database required
- yfinance API used for stock data
- 10-minute refresh interval for stock data
- Form validation on both frontend and backend

## Running the Application
1. **Backend**
   ```bash
   cd backend
   python app.py
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database**
   - Ensure MySQL is running
   - Database name: ordertracker
   - Create tables using setup.sql

## Maintenance
- Monitor yfinance API usage
- Regular database backups
- Check for frontend package updates
- Monitor stock data accuracy
- Regular error log review
