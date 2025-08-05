import { useState, useEffect } from "react";
import TradeTable from "./components/tradetable";
import TradeForm from "./components/tradeform";

function App() {
  const [trades, setTrades] = useState([]);
  const [formData, setFormData] = useState({
    asset: "", quantity: "", order_type: "", status: ""
  });

 useEffect(() => {
  fetch("http://localhost:5001/trades")
    .then(res => {
      console.log("GET /trades status:", res.status);
      return res.json();
    })
    .then(data => {
      console.log("Fetched trades:", data);
      setTrades(data);
    })
    .catch(err => console.error("GET /trades failed", err));
}, []);

const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Submitting trade:", formData);

  fetch("http://127.0.0.1:5001/trades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(res => {
      console.log("POST /trades status:", res.status);
      return res.json();
    })
    .then(data => {
      console.log("POST /trades result:", data);
      setFormData({ asset: "", quantity: "", order_type: "", status: "" });

      // Fetch updated list
      return fetch("http://localhost:5001/trades").then(res => res.json());
    })
    .then(data => {
      console.log("Updated trades after submit:", data);
      setTrades(data);
    })
    .catch(err => console.error("POST /trades failed", err));
};

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/trades/${id}`, {
      method: "DELETE",
    }).then(() => {
      return fetch("http://localhost:5001/trades").then(res => res.json());
    }).then(setTrades);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mini Order Tracker</h1>
      <TradeForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
      <TradeTable trades={trades} onDelete={handleDelete} />
    </div>
  );
}

export default App;
