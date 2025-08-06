import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from 'lucide-react';

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
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-slate-400">Loading market data...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/20">
              <tr className="text-slate-400 text-sm">
                <th className="text-left px-6 py-4 font-medium">Symbol</th>
                <th className="text-right px-6 py-4 font-medium">Price</th>
                <th className="text-right px-6 py-4 font-medium">24h Change</th>
                <th className="text-right px-6 py-4 font-medium">Volume</th>
                <th className="text-right px-6 py-4 font-medium">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr key={stock.symbol} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold">
                        {stock.symbol.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-200">{stock.symbol}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-slate-200 font-mono text-lg">${parseFloat(stock.price).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      parseFloat(stock.changePercent) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {parseFloat(stock.changePercent) >= 0 ? 
                        <TrendingUp className="w-4 h-4" /> : 
                        <TrendingDown className="w-4 h-4" />
                      }
                      <span className="font-medium">
                        {parseFloat(stock.changePercent) > 0 ? '+' : ''}{parseFloat(stock.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 font-mono">
                    {/* Mock volume data since your API doesn't provide it */}
                    {(Math.random() * 100).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 font-mono">
                    {/* Mock market cap data */}
                    ${(Math.random() * 5).toFixed(1)}T
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockTable;