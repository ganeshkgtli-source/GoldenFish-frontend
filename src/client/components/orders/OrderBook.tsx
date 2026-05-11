const orders = [
  {
    symbol: "TCS",
    type: "BUY",
    qty: 3,
    price: 3420,
    status: "Pending",
  },
  {
    symbol: "HDFCBANK",
    type: "SELL",
    qty: 8,
    price: 1622,
    status: "Completed",
  },
];

export default function OrderBook() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">

        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-4">Symbol</th>
            <th className="px-5 py-4">Order Type</th>
            <th className="px-5 py-4">Qty</th>
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, i) => (
            <tr
              key={i}
              className="border-b border-border/60 hover:bg-muted/30 transition-colors"
            >
              <td className="px-5 py-4 font-semibold">
                {order.symbol}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.type === "BUY"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {order.type}
                </span>
              </td>

              <td className="px-5 py-4">
                {order.qty}
              </td>

              <td className="px-5 py-4">
                ₹{order.price}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`text-sm font-medium ${
                    order.status === "Completed"
                      ? "text-emerald-500"
                      : "text-yellow-500"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}