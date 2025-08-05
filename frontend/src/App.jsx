import { useState, useEffect } from "react";
import TradeTable from "./components/tradetable";
import TradeForm from "./components/tradeform";
import StockTable from "./components/StockTable";

function App() {
  const [trades, setTrades] = useState([]);
  const [formData, setFormData] = useState({
    asset: "", quantity: "", order_type: "", status: ""
  });

  useEffect(() => {
    fetch("http://localhost:5001/trades")
      .then(res => res.json())
      .then(data => setTrades(data))
      .catch(err => console.error("GET /trades failed", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:5001/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setFormData({ asset: "", quantity: "", order_type: "", status: "" });
        return fetch("http://localhost:5001/trades").then(res => res.json());
      })
      .then(setTrades)
      .catch(err => console.error("POST /trades failed", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/trades/${id}`, {
      method: "DELETE",
    })
      .then(() => fetch("http://localhost:5001/trades").then(res => res.json()))
      .then(setTrades);
  };

  return (
    <div className="flex min-h-screen bg-[#181A20] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#23272F] p-6 border-r border-[#222]">
        <h2 className="text-lg font-semibold mb-8">Menu</h2>
        {/* Sidebar links can go here */}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-x-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center">Mini Order Tracker</h1>

        {/* Stock Table */}
        <div className="mb-10 w-full max-w-[900px] mx-auto">
          <StockTable />
        </div>

        <hr className="my-8 border-[#222] max-w-[900px] mx-auto" />

        {/* Trade form + table */}
        <div className="space-y-8 w-full max-w-[900px] mx-auto">
          <TradeForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
          <TradeTable trades={trades} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
}

export default App;
