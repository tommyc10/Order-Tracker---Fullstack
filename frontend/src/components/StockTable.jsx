import React, { useEffect, useState } from "react";

const StockTable = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/top-stocks")
      .then((res) => res.json())
      .then((data) => {
        setStocks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

return (
  <div style={{ width: "100%", margin: "0 0 2rem 0" }}>    <h2 style={{ marginBottom: "1rem", fontWeight: 600 }}>Stock Screener</h2>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <table style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        background: "#222",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px #0002"
      }}>
        <thead>
          <tr style={{ background: "#23272F" }}>
            <th style={{ padding: "1rem", fontWeight: 600, fontSize: "1.1rem", borderBottom: "2px solid #333" }}>Symbol</th>
            <th style={{ padding: "1rem", fontWeight: 600, fontSize: "1.1rem", borderBottom: "2px solid #333" }}>Price</th>
            <th style={{ padding: "1rem", fontWeight: 600, fontSize: "1.1rem", borderBottom: "2px solid #333" }}>% Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, i) => (
            <tr key={stock.symbol} style={{
              background: i % 2 === 0 ? "#181A20" : "#222",
              transition: "background 0.2s",
              borderBottom: "1px solid #222"
            }}>
              <td style={{ padding: "1rem", fontWeight: 500 }}>{stock.symbol}</td>
              <td style={{ padding: "1rem" }}>${stock.price}</td>
              <td style={{
                padding: "1rem",
                color: stock.changePercent > 0 ? "#4caf50" : stock.changePercent < 0 ? "#f44336" : "#fff",
                fontWeight: 700
              }}>
                {stock.changePercent}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}

export default StockTable;