import { Plus } from 'lucide-react';

function TradeForm({ formData, setFormData, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Asset</label>
          <input
            type="text"
            placeholder="e.g., TSLA"
            value={formData.asset}
            onChange={e => setFormData({ ...formData, asset: e.target.value.toUpperCase() })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Quantity</label>
          <input
            type="number"
            placeholder="100"
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Order Type</label>
          <select
            value={formData.order_type}
            onChange={e => setFormData({ ...formData, order_type: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          >
            <option value="">Select Type</option>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          Add Trade
        </button>
      </div>
    </form>
  );
}

export default TradeForm;