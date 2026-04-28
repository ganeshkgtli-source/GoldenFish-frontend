import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
 
export type Order = {
  id: string;
  date: string;
  symbol: string;
  exchange: string;
  type: "BUY" | "SELL";

  // ✅ MATCH TRADE STRUCTURE
  expiry?: string;
  entryTime?: string;
  entryPrice: number;

  status: "PENDING" | "EXECUTED" | "CANCELLED";

  exitTime?: string;
  exitPrice?: number;

  pnlLot?: number;
  totalPnl?: number;
  ltp?: number;
  spot?: number;
  strike?: number;

  quantity: number; // keep order-specific
};
const columns = [
  "date",
  "symbol",
  "exchange",
  "type",
  "expiry",
  "entryTime",
  "entryPrice",
  "status",
  "exitTime",
  "exitPrice",
  "pnlLot",
  "totalPnl",
  "ltp",
  "spot",
  "strike",
] as const satisfies readonly (keyof Order)[];
export default function OrdersTable({ data }: { data: Order[] }) {
  const [sortKey, setSortKey] = useState<keyof Order>("date");
  const [asc, setAsc] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ✅ SAME COLUMN RESIZE SYSTEM
  const [colWidths, setColWidths] = useState<number[]>(
    new Array(columns.length).fill(120)
  );

  const startX = useRef(0);
  const colIndex = useRef<number | null>(null);

  const onMouseDown = (index: number, e: React.MouseEvent) => {
    startX.current = e.clientX;
    colIndex.current = index;

    const onMove = (e: MouseEvent) => {
      if (colIndex.current === null) return;

      const diff = e.clientX - startX.current;

      setColWidths((prev) => {
        const updated = [...prev];
        updated[colIndex.current!] = Math.max(
          80,
          updated[colIndex.current!] + diff
        );
        return updated;
      });

      startX.current = e.clientX;
    };

    const onUp = () => {
      colIndex.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // 🔄 SORT
  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return asc ? aVal - bVal : bVal - aVal;
      }

      return asc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, asc]);

  const handleSort = (key: keyof Order) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };

  // 📄 PAGINATION
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sorted.length / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, sortKey, asc]);

  return (
    <div className="flex flex-col h-[520px]">

      {/* SCROLL */}
      <div className="overflow-auto flex-1">

        {/* HEADER */}
        <div className="sticky top-0 z-10 flex bg-muted/40 border-b border-border">
          {columns.map((col, i) => (
            <div
              key={col}
              style={{ width: colWidths[i] }}
              className="relative px-3 py-3 text-xs flex items-center gap-1"
            >
              <button
                onClick={() => handleSort(col as keyof Order)}
                className="flex items-center gap-1 font-medium"
              >
                {col}
                <ArrowUpDown size={12} />
              </button>

              <div
                onMouseDown={(e) => onMouseDown(i, e)}
                className="absolute right-0 top-0 h-full w-[4px] cursor-col-resize hover:bg-blue-500"
              />
            </div>
          ))}
        </div>

        {/* BODY */}
        <div className="divide-y divide-border">
  {paginatedData.map((o, rowIndex) => (
    <div
      key={o.id}
      className={`flex text-sm ${
        rowIndex % 2 === 0 ? "bg-transparent" : "bg-muted/30"
      } hover:bg-muted/60 transition`}
    >
      {[
        o.date,
        o.symbol,
        o.exchange,
        o.type,
        o.expiry || "--",
        o.entryTime || "--",
        o.entryPrice, // ✅ keep number (IMPORTANT)
        o.status,
        o.exitTime || "--",
        o.exitPrice ?? null, // ✅ keep number/null
        o.pnlLot ?? null,
        o.totalPnl ?? null,
        o.ltp ?? null,
        o.spot ?? null,
        o.strike ?? "--",
      ].map((val, i) => {
        let content;

        // ✅ BUY / SELL
        if (i === 3) {
          content = (
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                val === "BUY"
                  ? "text-green-500 bg-green-500/10"
                  : "text-red-500 bg-red-500/10"
              }`}
            >
              {val}
            </span>
          );
        }

        // ✅ STATUS
        else if (i === 7) {
          content = (
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                val === "EXECUTED"
                  ? "text-green-500 bg-green-500/10"
                  : val === "PENDING"
                  ? "text-yellow-500 bg-yellow-500/10"
                  : "text-red-500 bg-red-500/10"
              }`}
            >
              {val}
            </span>
          );
        }

        // ✅ PRICE / NUMBERS
        else if (i === 6 || i === 9 || i === 12 || i === 13) {
          content = val !== null && val !== undefined ? `₹${val}` : "--";
        }

        // ✅ P&L COLORS (FIXED)
        else if (i === 10 || i === 11) {
          const num = Number(val);
          content =
            val !== null && val !== undefined ? (
              <span className={num >= 0 ? "text-green-500" : "text-red-500"}>
                {i === 11 ? `₹${num}` : num}
              </span>
            ) : (
              "--"
            );
        }

        // DEFAULT
        else {
          content = val ?? "--";
        }

        return (
          <div
            key={i}
            style={{ width: colWidths[i] }}
            className="px-3 py-3"
          >
            {content}
          </div>
        );
      })}
    </div>
  ))}
</div>
      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 z-10 flex items-center justify-between px-4 py-3 border-t border-border bg-card text-sm">

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="px-3 py-2 text-sm rounded-lg bg-[var(--input-background)] border border-border"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <span className="text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1}–
            {Math.min(currentPage * rowsPerPage, sorted.length)} of {sorted.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded-md"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            className="px-3 py-1 border rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}