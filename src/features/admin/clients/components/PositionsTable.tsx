import { useMemo, useState, useEffect } from "react";

export type Position = {
  id: string;
  symbol: string;
  exchange: string;
  quantity: number;
  avgPrice: number;
  ltp: number;
};

export default function PositionsTable({ data }: { data: Position[] }) {

  // ✅ pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 🔢 CALCULATE PNL
  const calculated = useMemo(() => {
    return data.map((p) => {
      const pnl = (p.ltp - p.avgPrice) * p.quantity;
      return { ...p, pnl };
    });
  }, [data]);

  // 📄 PAGINATION
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return calculated.slice(start, start + rowsPerPage);
  }, [calculated, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(calculated.length / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col h-[400px]">

      {/* SCROLL AREA */}
      <div className="overflow-auto flex-1">

        {/* HEADER */}
        <div className="sticky top-0 z-10 grid grid-cols-[120px_100px_100px_120px_120px_120px] text-xs px-4 py-3 border-b border-border bg-blue-500/10 dark:bg-blue-500/20 min-w-[700px]">
          <span>Symbol</span>
          <span>Exchange</span>
          <span>Qty</span>
          <span>Avg Price</span>
          <span>LTP</span>
          <span className="text-right">P&L</span>
        </div>

        {/* BODY */}
        <div className="divide-y divide-border min-w-[700px]">
          {paginatedData.map((p, i) => (
            <div
              key={p.id}
              className={`grid grid-cols-[120px_100px_100px_120px_120px_120px] px-4 py-3 text-sm ${
                i % 2 === 0 ? "bg-transparent" : "bg-muted/30"
              } hover:bg-muted/50 transition`}
            >
              <span className="font-medium">{p.symbol}</span>
              <span>{p.exchange}</span>
              <span>{p.quantity}</span>
              <span>₹{p.avgPrice}</span>
              <span>₹{p.ltp}</span>

              {/* P&L */}
              <span
                className={`text-right font-medium ${
                  p.pnl >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ₹{p.pnl}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 z-10 flex items-center justify-between px-4 py-3 border-t border-border bg-card text-sm">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="
                px-3 py-2 text-sm rounded-lg
                bg-[var(--input-background)]
                border border-border
                text-foreground
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <span className="text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1}–
            {Math.min(currentPage * rowsPerPage, calculated.length)} of {calculated.length}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-border disabled:opacity-40 hover:bg-muted"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-border hover:bg-muted"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-border disabled:opacity-40 hover:bg-muted"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}