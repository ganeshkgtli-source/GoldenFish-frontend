const reports = [
  {
    title: "P&L Statement",
    desc: "Profit and loss summary",
  },
  {
    title: "Tax Report",
    desc: "Financial year tax summary",
  },
  {
    title: "Trade Summary",
    desc: "Detailed trade history",
  },
];

export default function Reports() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">

      {reports.map((report, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-background p-5 hover:bg-muted/30 transition-colors"
        >
          <h3 className="text-lg font-semibold">
            {report.title}
          </h3>

          <p className="text-sm text-muted-foreground mt-2">
            {report.desc}
          </p>

          <button className="mt-5 h-10 px-4 rounded-xl bg-emerald-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity">
            Download
          </button>
        </div>
      ))}

    </div>
  );
}