const ledger = [
  {
    date: "05 May 2026",
    remark: "Funds Added",
    amount: "+₹50,000",
    type: "credit",
  },
  {
    date: "04 May 2026",
    remark: "Brokerage Charges",
    amount: "-₹120",
    type: "debit",
  },
];

export default function Ledger() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">

        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-4">Date</th>
            <th className="px-5 py-4">Remark</th>
            <th className="px-5 py-4">Amount</th>
            <th className="px-5 py-4">Type</th>
          </tr>
        </thead>

        <tbody>
          {ledger.map((item, i) => (
            <tr
              key={i}
              className="border-b border-border/60 hover:bg-muted/30 transition-colors"
            >
              <td className="px-5 py-4">
                {item.date}
              </td>

              <td className="px-5 py-4 font-medium">
                {item.remark}
              </td>

              <td
                className={`px-5 py-4 font-semibold ${
                  item.type === "credit"
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {item.amount}
              </td>

              <td className="px-5 py-4 uppercase text-xs text-muted-foreground">
                {item.type}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}