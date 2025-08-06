import { Trash2, BarChart3 } from 'lucide-react';

function TradeTable({ trades, onDelete }) {
  return (
    <div className="w-full">
      {trades.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No orders yet. Create your first order above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/20">
              <tr className="text-slate-400 text-sm">
                <th className="text-left px-6 py-4 font-medium">ID</th>
                <th className="text-left px-6 py-4 font-medium">Asset</th>
                <th className="text-center px-6 py-4 font-medium">Quantity</th>
                <th className="text-center px-6 py-4 font-medium">Type</th>
                <th className="text-center px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Timestamp</th>
                <th className="text-center px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-mono">#{trade.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-200">{trade.asset}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-200 font-mono">{trade.quantity}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trade.order_type === 'Buy' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {trade.order_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trade.status === 'completed' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : trade.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-sm">{trade.timestamp}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(trade.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TradeTable;