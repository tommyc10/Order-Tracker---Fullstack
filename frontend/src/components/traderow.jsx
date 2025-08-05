function TradeRow({ trade, onDelete }) {
  return (
    <tr>
      <td>{trade.id}</td>
      <td>{trade.asset}</td>
      <td>{trade.quantity}</td>
      <td>{trade.order_type}</td>
      <td>{trade.status}</td>
      <td>{trade.timestamp}</td>
      <td><button onClick={() => onDelete(trade.id)}>Delete</button></td>
    </tr>
  );
}

export default TradeRow;
