const trades = [
  {
    symbol: "RELIANCE",
    type: "BUY",
    qty: 5,
    avg: 2894.2,
    status: "Executed",
    time: "10:32 AM",
  },
  {
    symbol: "INFY",
    type: "SELL",
    qty: 12,
    avg: 1488.4,
    status: "Executed",
    time: "11:04 AM",
  },
];

export default function TradeBook() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">

        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-4">Symbol</th>
            <th className="px-5 py-4">Type</th>
            <th className="px-5 py-4">Qty</th>
            <th className="px-5 py-4">Avg Price</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Time</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((trade, i) => (
            <tr
              key={i}
              className="border-b border-border/60 hover:bg-muted/30 transition-colors"
            >
              <td className="px-5 py-4 font-semibold">
                {trade.symbol}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    trade.type === "BUY"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {trade.type}
                </span>
              </td>

              <td className="px-5 py-4">
                {trade.qty}
              </td>

              <td className="px-5 py-4">
                ₹{trade.avg}
              </td>

              <td className="px-5 py-4 text-emerald-500 font-medium">
                {trade.status}
              </td>

              <td className="px-5 py-4 text-muted-foreground">
                {trade.time}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}