function TradeForm({ formData, setFormData, onSubmit }) {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: "2rem" }}>
      <input type="text" placeholder="Asset"
        value={formData.asset}
        onChange={e => setFormData({ ...formData, asset: e.target.value })}
      />
      <input type="number" placeholder="Quantity"
        value={formData.quantity}
        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
      />
      <input type="text" placeholder="Buy/Sell"
        value={formData.order_type}
        onChange={e => setFormData({ ...formData, order_type: e.target.value })}
      />
      <input type="text" placeholder="Status"
        value={formData.status}
        onChange={e => setFormData({ ...formData, status: e.target.value })}
      />
      <button type="submit">Add Trade</button>
    </form>
  );
}

export default TradeForm;
