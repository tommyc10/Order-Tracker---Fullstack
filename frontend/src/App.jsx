// maps stock tickers to company names - no ticker = symbol
const stockNames = {
  AAPL: 'Apple Inc.',
  TSLA: 'Tesla Inc.',
  MSFT: 'Microsoft Corp.',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com Inc.',
  NVDA: 'NVIDIA Corp.',
  NFLX: 'Netflix Inc.',
  META: 'Meta Platforms',
  AMD: 'Advanced Micro Devices',
  INTC: 'Intel Corp.'
};

function getStockName(symbol) {
  return stockNames[symbol] || symbol;
}

import React, { useEffect, useState } from 'react';
import './App.css';

// fetches the live stock from the backend
function useLiveStocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStocks() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5001/top-stocks');
        if (!res.ok) throw new Error('Failed to fetch stocks');
        const data = await res.json();
        setStocks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    console.log('Fetching stocks...');
    fetchStocks();
    const TEN_MINUTES = 10 * 60 * 1000; // 600000 milliseconds
    const interval = setInterval(fetchStocks, TEN_MINUTES);
    return () => clearInterval(interval);
  }, []);

  return { stocks, loading, error };
}
// gets the live stock data
function App() {
  const { stocks, loading, error } = useLiveStocks();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [trades, setTrades] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const itemsPerPage = 15;

  // Handle status update
  const handleStatusUpdate = async (tradeId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5001/trades/${tradeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trades.find(t => t.id === tradeId),
          status: newStatus
        })
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Update local state
      setTrades(trades.map(trade =>
        trade.id === tradeId
          ? { ...trade, status: newStatus }
          : trade
      ));

    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // handle trade deletion
  const handleDelete = async (tradeId) => {
    if (!confirm('Are you sure you want to delete this trade?')) return;

    try {
      const res = await fetch(`http://localhost:5001/trades/${tradeId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete trade');

      // Remove the trade from local state
      setTrades(trades.filter(trade => trade.id !== tradeId));
      alert('Trade deleted successfully');
    } catch (err) {
      alert('Failed to delete trade: ' + err.message);
    }
  };

  // Fetch trades
  useEffect(() => {
    async function fetchTrades() {
      try {
        setLoadingTrades(true);
        const res = await fetch('http://localhost:5001/trades');
        if (!res.ok) throw new Error('Failed to fetch trades');
        const data = await res.json();
        setTrades(data);
      } catch (err) {
        console.error('Error fetching trades:', err);
      } finally {
        setLoadingTrades(false);
      }
    }

    fetchTrades();
    // Refresh trades every minute
    const interval = setInterval(fetchTrades, 60000);
    return () => clearInterval(interval);
  }, []);

  // form for new trades
  const [formData, setFormData] = useState({
    asset: '',
    quantity: '',
    order_type: 'buy',
    status: 'completed'
  });

  // handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the asset exists in our stockNames
    const assetExists = Object.keys(stockNames).includes(formData.asset.toUpperCase());
    if (!assetExists) {
      alert('Invalid ticker symbol. Please enter a valid stock ticker from the list.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          asset: formData.asset.toUpperCase() // Ensure ticker is uppercase
        })
      });

      if (!res.ok) throw new Error('Failed to submit order');

      // clear form on success
      setFormData({
        asset: '',
        quantity: '',
        order_type: 'buy',
        status: 'completed'
      });

      alert('Order submitted successfully!');
    } catch (err) {
      alert('Failed to submit order: ' + err.message);
    }
  };

  // filter stocks based on search
  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
    getStockName(stock.symbol).toLowerCase().includes(search.toLowerCase())
  );

  // calculate pagination
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const paginatedStocks = filteredStocks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div style={{
      background: '#0d1117',
      minHeight: '100vh',
      minWidth: '100vw',
      color: '#fff',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '320px',
        background: '#131722',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
        padding: '24px',
        borderRight: '1px solid #1c2030'
      }}>
        <div className="d-flex align-items-center mb-4">
          <span style={{ fontSize: '24px', marginRight: '8px' }}>📊</span>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#fff',
            margin: 0
          }}>Order Management Pro</h1>
        </div>

        <div style={{
          background: '#1c2030',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '16px'
          }}>
            + Create New Order
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label style={{
                color: '#9da6b3',
                fontSize: '14px',
                marginBottom: '8px',
                display: 'block'
              }}>Asset</label>
              <input
                type="text"
                name="asset"
                value={formData.asset}
                onChange={handleInputChange}
                placeholder="e.g. TSLA"
                list="stocksList"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#131722',
                  border: '1px solid #2a2e39',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px'
                }}
                required
              />
              <datalist id="stocksList">
                {Object.keys(stockNames).map(symbol => (
                  <option key={symbol} value={symbol}>
                    {stockNames[symbol]}
                  </option>
                ))}
              </datalist>
            </div>
            <div className="mb-3">
              <label style={{
                color: '#9da6b3',
                fontSize: '14px',
                marginBottom: '8px',
                display: 'block'
              }}>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="100"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#131722',
                  border: '1px solid #2a2e39',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px'
                }}
                required
                min="1"
              />
            </div>
            <div className="mb-4">
              <label style={{
                color: '#9da6b3',
                fontSize: '14px',
                marginBottom: '8px',
                display: 'block'
              }}>Order Type</label>
              <select
                name="order_type"
                value={formData.order_type}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#131722',
                  border: '1px solid #2a2e39',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                background: '#3761e9',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#2850d6'}
              onMouseOut={(e) => e.currentTarget.style.background = '#3761e9'}
            >
              Submit Order
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '320px',
        flex: 1,
        padding: '24px',
        maxWidth: 'calc(100vw - 320px)',
        width: '100%'
      }}>
        <div style={{
          background: '#131722',
          borderRadius: '12px',
          padding: '24px',
          height: '100%'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#fff',
              margin: 0
            }}>Stocks</h2>
            <input
              type="text"
              placeholder="Search stocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                background: '#1c2030',
                border: '1px solid #2a2e39',
                borderRadius: '8px',
                color: '#fff',
                width: '240px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{
            width: '100%',
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 4px',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ color: '#9da6b3' }}>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: 500
                  }}>Symbol</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: 500
                  }}>Name</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontWeight: 500
                  }}>Price</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontWeight: 500
                  }}>Change %</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{
                      padding: '16px',
                      textAlign: 'center',
                      background: '#1c2030',
                      borderRadius: '8px',
                      color: '#9da6b3'
                    }}>Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" style={{
                      padding: '16px',
                      textAlign: 'center',
                      background: '#1c2030',
                      borderRadius: '8px',
                      color: '#ef5350'
                    }}>{error}</td>
                  </tr>
                ) : paginatedStocks.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{
                      padding: '16px',
                      textAlign: 'center',
                      background: '#1c2030',
                      borderRadius: '8px',
                      color: '#9da6b3'
                    }}>No stocks found</td>
                  </tr>
                ) : (
                  paginatedStocks.map((stock) => (
                    <tr key={stock.symbol} style={{
                      background: '#1c2030',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#252c3e'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#1c2030'}
                    >
                      <td style={{
                        padding: '12px 16px',
                        borderTopLeftRadius: '8px',
                        borderBottomLeftRadius: '8px'
                      }}>{stock.symbol}</td>
                      <td style={{
                        padding: '12px 16px'
                      }}>{getStockName(stock.symbol)}</td>
                      <td style={{
                        padding: '12px 16px',
                        textAlign: 'right'
                      }}>${Number(stock.price).toFixed(2)}</td>
                      <td style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        color: stock.changePercent > 0 ? '#4caf50' : stock.changePercent < 0 ? '#ef5350' : '#fff',
                        borderTopRightRadius: '8px',
                        borderBottomRightRadius: '8px'
                      }}>
                        {stock.changePercent > 0 ? '▲ ' : stock.changePercent < 0 ? '▼ ' : ''}
                        {Number(stock.changePercent).toFixed(2)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && !error && stocks.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div style={{ color: '#9da6b3', fontSize: '14px' }}>
                Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, filteredStocks.length)} of {filteredStocks.length} stocks
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '6px 12px',
                    background: '#1c2030',
                    border: '1px solid #2a2e39',
                    borderRadius: '6px',
                    color: page === 1 ? '#6b7280' : '#fff',
                    fontSize: '14px',
                    cursor: page === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    style={{
                      padding: '6px 12px',
                      background: page === i + 1 ? '#3761e9' : '#1c2030',
                      border: '1px solid #2a2e39',
                      borderRadius: '6px',
                      color: page === i + 1 ? '#fff' : '#9da6b3',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = page === i + 1 ? '#2850d6' : '#2a2e39'}
                    onMouseOut={(e) => e.currentTarget.style.background = page === i + 1 ? '#3761e9' : '#1c2030'}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: '6px 12px',
                    background: '#1c2030',
                    border: '1px solid #2a2e39',
                    borderRadius: '6px',
                    color: page === totalPages ? '#6b7280' : '#fff',
                    fontSize: '14px',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Order History Section */}
          <div className="mt-5">
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '24px'
            }}>Order History</h2>

            <div style={{
              width: '100%',
              overflowX: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 4px',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ color: '#9da6b3' }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: 500
                    }}>ID</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: 500
                    }}>Asset</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 500
                    }}>Quantity</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontWeight: 500
                    }}>Type</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontWeight: 500
                    }}>Status</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 500
                    }}>Timestamp</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontWeight: 500
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTrades ? (
                    <tr>
                      <td colSpan="6" style={{
                        padding: '16px',
                        textAlign: 'center',
                        background: '#1c2030',
                        borderRadius: '8px',
                        color: '#9da6b3'
                      }}>Loading orders...</td>
                    </tr>
                  ) : trades.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{
                        padding: '16px',
                        textAlign: 'center',
                        background: '#1c2030',
                        borderRadius: '8px',
                        color: '#9da6b3'
                      }}>No orders found</td>
                    </tr>
                  ) : (
                    trades.map((trade) => (
                      <tr key={trade.id} style={{
                        background: '#1c2030',
                        transition: 'all 0.2s'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#252c3e'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#1c2030'}
                      >
                        <td style={{
                          padding: '12px 16px',
                          borderTopLeftRadius: '8px',
                          borderBottomLeftRadius: '8px'
                        }}>#{trade.id}</td>
                        <td style={{
                          padding: '12px 16px'
                        }}>{trade.asset}</td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'right'
                        }}>{trade.quantity}</td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'center',
                          color: trade.order_type === 'buy' ? '#4caf50' : '#ef5350'
                        }}>{trade.order_type.toUpperCase()}</td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            background: trade.status === 'completed' ? '#4caf5033' :
                              trade.status === 'pending' ? '#ff980033' : '#ef535033',
                            color: trade.status === 'completed' ? '#4caf50' :
                              trade.status === 'pending' ? '#ff9800' : '#ef5350'
                          }}>
                            {trade.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          color: '#9da6b3',
                          borderTopRightRadius: '8px',
                          borderBottomRightRadius: '8px'
                        }}>{trade.timestamp}</td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'center'
                        }}>
                          <button
                            onClick={() => handleDelete(trade.id)}
                            style={{
                              padding: '6px 12px',
                              background: '#ef535033',
                              border: 'none',
                              borderRadius: '4px',
                              color: '#ef5350',
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#ef535066'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#ef535033'}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
