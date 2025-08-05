import TradeRow from "./traderow";


function TradeTable({ trades, onDelete }) {
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Asset</th>
          <th>Quantity</th>
          <th>Order Type</th>
          <th>Status</th>
          <th>Timestamp</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {trades.map(trade => (
          <TradeRow key={trade.id} trade={trade} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}

export default TradeTable;
