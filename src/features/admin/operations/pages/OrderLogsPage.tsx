import {
  // Download,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RotateCcw,
} from "lucide-react";
import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

/* ─── TYPES ─────────────────────────────────────────────────── */
type Option = { label: string; value: string };

type FilterProps = {
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
};

/* ─── valid tabs — must match ClientDetailPage ───────────────── */
type TabType = "trades" | "orders" | "positions" | "errors";

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const allOrders = Array.from({ length: 57 }, (_, i) => ({
  date: "May 16, 2025 13:45:21",
  client: `Client ${i}`,
  clientId: `CL${i}`,
  symbol: "NIFTY 23MAY25 CE 22500",
  exchange: "NFO",
  type: i % 2 === 0 ? "BUY" : "SELL",
  expiry: "23-May-2025",
  status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Rejected" : "Pending",
  pnlLot: i % 2 === 0 ? 120 : -80,
  totalPnl: i % 2 === 0 ? 1200 : -800,
}));

// /* ─── FILTER OPTIONS ─────────────────────────────────────────── */
const clientOptions: Option[] = [
  { label: "All Clients", value: "" },
  ...Array.from({ length: 10 }, (_, i) => ({
    label: `Client ${i}`,
    value: `CL${i}`,
  })),
];

const statusOptions: Option[] = [
  // { label: "All Status",  value: ""          },
  { label: "Completed", value: "Completed" },
  { label: "Rejected", value: "Rejected" },
  { label: "Pending", value: "Pending" },
];

const exchangeOptions: Option[] = [
  // { label: "All Exchanges", value: ""    },
  { label: "NFO", value: "NFO" },
  { label: "NSE", value: "NSE" },
  { label: "BSE", value: "BSE" },
];

const typeOptions: Option[] = [
  // { label: "All Types", value: ""     },
  { label: "BUY", value: "BUY" },
  { label: "SELL", value: "SELL" },
];

const statusStyle: Record<string, string> = {
  Completed: "text-green-500",
  Rejected: "text-red-500",
  Pending: "text-yellow-500",
};

const today = new Date().toISOString().split("T")[0];

/* ═══════════════════════════════════════════════════════════════
   ORDER LOG PAGE
═══════════════════════════════════════════════════════════════ */
export default function OrderLogPage() {
  /* ── TanStack Router navigate ──────────────────────────────── */
  const navigate = useNavigate();

  /* ── Pagination ────────────────────────────────────────────── */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ── Filter state ──────────────────────────────────────────── */
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [exchangeFilter, setExchangeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* sync single mode → toDate mirrors fromDate */

  /* ── Filtered rows ─────────────────────────────────────────── */
  const filtered = allOrders.filter((o) => {
    if (clientFilter && o.clientId !== clientFilter) return false;
    if (statusFilter && o.status !== statusFilter) return false;
    if (exchangeFilter && o.exchange !== exchangeFilter) return false;
    if (typeFilter && o.type !== typeFilter) return false;
    if (
      search &&
      !o.symbol.toLowerCase().includes(search.toLowerCase()) &&
      !o.client.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  /* reset page when filters change */

  const orders = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* ── Handlers ──────────────────────────────────────────────── */
  const handleReset = () => {
    setSearch("");
    setClientFilter("");
    setStatusFilter("");
    setExchangeFilter("");
    setTypeFilter("");
    setFromDate("");
    setToDate("");
    setDateMode("single");
    setPage(1);
  };

  const handleQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    if (days > 0) start.setDate(end.getDate() - days);
    setFromDate(start.toISOString().split("T")[0]);
    setToDate(end.toISOString().split("T")[0]);
  };

  /* navigate to client detail — matches your route exactly */
  const goToClient = (clientId: string, tab: TabType = "orders") => {
    navigate({
      to: "/admin/client/$id",
      params: { id: clientId },
      search: { tab },
    });
  };

  /* ── Summary values ────────────────────────────────────────── */
  const completed = allOrders.filter((o) => o.status === "Completed").length;
  const rejected = allOrders.filter((o) => o.status === "Rejected").length;
  const pending = allOrders.filter((o) => o.status === "Pending").length;
  const totalPnl = allOrders.reduce((s, o) => s + o.totalPnl, 0);
  const avgPnlLot = allOrders.length
    ? allOrders.reduce((s, o) => s + o.pnlLot, 0) / allOrders.length
    : 0;

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ManagementAdminNavbar />

      <main className="p-4 md:p-6 space-y-5 flex-1">
        {/* ── HEADER ───────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Order Log</h1>
            <p className="text-sm text-muted-foreground">
              Track all client orders with execution status and P&amp;L
            </p>
          </div>
          {/* <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg hover:bg-accent text-sm w-fit">
            <Download size={16} /> Export CSV
          </button> */}
        </div>

        {/* ── SUMMARY CARDS ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <SummaryCard title="Total Orders" value={allOrders.length} />
          <SummaryCard title="Completed" value={completed} color="green" />
          <SummaryCard title="Rejected" value={rejected} color="red" />
          <SummaryCard title="Pending" value={pending} color="yellow" />
          <SummaryCard
            title="Total PnL"
            value={`₹${totalPnl.toLocaleString("en-IN")}`}
            color={totalPnl >= 0 ? "green" : "red"}
          />
          <SummaryCard
            title="Avg PnL / Lot"
            value={`₹${avgPnlLot.toFixed(2)}`}
            color={avgPnlLot >= 0 ? "green" : "red"}
          />
        </div>

        {/* ── FILTER BAR ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              placeholder="Search client / symbol..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="
                pl-9 pr-3 py-2 text-sm rounded-lg w-52
                bg-[var(--input-background)]
                border border-border
                text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition
              "
            />
          </div>

          {/* Dropdowns */}
          <Filter
            label="All Clients"
            value={clientFilter}
            options={clientOptions}
            onChange={(v) => {
              setClientFilter(v);
              setPage(1);
            }}
          />
          <Filter
            label="All Status"
            value={statusFilter}
            options={statusOptions}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          />
          <Filter
            label="All Exchanges"
            value={exchangeFilter}
            options={exchangeOptions}
            onChange={(v) => {
              setExchangeFilter(v);
              setPage(1);
            }}
          />
          <Filter
            label="All Types"
            value={typeFilter}
            options={typeOptions}
            onChange={(v) => {
              setTypeFilter(v);
              setPage(1);
            }}
          />

          {/* Single / Range toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setDateMode("single")}
              className={`px-3 py-2 text-xs transition ${
                dateMode === "single"
                  ? "bg-blue-500 text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Single Day
            </button>
            <button
              onClick={() => setDateMode("range")}
              className={`px-3 py-2 text-xs transition ${
                dateMode === "range"
                  ? "bg-blue-500 text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Date Range
            </button>
          </div>

          {/* Date inputs */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              max={today}
              onChange={(e) => {
                const value = e.target.value;

                setFromDate(value);

                if (dateMode === "single") {
                  setToDate(value);
                }
              }}
              className="
                px-3 py-2 text-sm rounded-lg
                bg-[var(--input-background)]
                border border-border text-foreground
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition
              "
            />
            {dateMode === "range" && (
              <>
                <span className="text-muted-foreground text-sm">→</span>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  max={today}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPage(1);
                  }}
                  className="
                    px-3 py-2 text-sm rounded-lg
                    bg-[var(--input-background)]
                    border border-border text-foreground
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition
                  "
                />
              </>
            )}
          </div>

          {/* Quick range chips */}
          {dateMode === "range" && (
            <div className="flex items-center gap-1">
              {[
                { label: "Today", value: 0 },
                { label: "7D", value: 7 },
                { label: "30D", value: 30 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleQuickRange(btn.value)}
                  className="
                    px-3 py-1.5 text-xs rounded-lg
                    border border-border
                    text-muted-foreground
                    hover:bg-muted hover:text-foreground
                    transition
                  "
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            className="
              ml-auto flex items-center gap-2
              px-3 py-2 text-xs rounded-lg
              border border-red-500 text-red-500
              hover:bg-red-500 hover:text-white
              transition-all duration-200
            "
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* ── TABLE ────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto max-h-[540px]">
            <table className="w-full text-sm min-w-[900px]">
              {/* HEADER */}
              <thead className="bg-muted text-muted-foreground sticky top-0 z-10">
                <tr>
                  {[
                    "Date & Time",
                    "Client Name",
                    "Client ID",
                    "Symbol",
                    "Exchange",
                    "Type",
                    "Expiry",
                    "Status",
                    "PnL / Lot",
                    "Total PnL",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      No orders match the selected filters.
                    </td>
                  </tr>
                ) : (
                  orders.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t border-border hover:bg-muted/50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                        {row.date}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => goToClient(row.clientId, "orders")}
                          className="font-medium text-left text-blue-500 hover:text-blue-400 hover:underline underline-offset-2 transition-colors"
                        >
                          {row.client}
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => goToClient(row.clientId, "orders")}
                          className="font-mono text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                        >
                          {row.clientId}
                        </button>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {row.symbol}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {row.exchange}
                      </td>

                      <td
                        className={`px-4 py-3 font-semibold ${row.type === "BUY" ? "text-green-500" : "text-red-500"}`}
                      >
                        {row.type}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                        {row.expiry}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {row.status === "Completed" && (
                            <CheckCircle size={14} className="text-green-500" />
                          )}
                          {row.status === "Rejected" && (
                            <XCircle size={14} className="text-red-500" />
                          )}
                          {row.status === "Pending" && (
                            <Clock size={14} className="text-yellow-500" />
                          )}
                          <span
                            className={`text-xs font-medium ${statusStyle[row.status] ?? ""}`}
                          >
                            {row.status}
                          </span>
                        </div>
                      </td>

                      <td
                        className={`px-4 py-3 font-medium ${row.pnlLot >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        ₹{row.pnlLot}
                      </td>

                      <td
                        className={`px-4 py-3 font-medium ${row.totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        ₹{row.totalPnl}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <div className="  flex justify-center">
        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-2 py-1 text-xs rounded-md disabled:opacity-40 hover:bg-accent"
          >
            ←
          </button>

          {getPaginationRange(page, totalPages).map((p, idx) =>
            p === "..." ? (
              <span
                key={idx}
                className="px-2 py-1 text-xs text-muted-foreground"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`px-2 py-1 text-xs rounded-md ${
                  page === p
                    ? "bg-red-600 text-white"
                    : "hover:bg-accent text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 text-xs rounded-md disabled:opacity-40 hover:bg-accent"
          >
            →
          </button>
        </div>
      </div>

      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © 2026 GoldenFish • Management Panel
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FILTER DROPDOWN
═══════════════════════════════════════════════════════════════ */
export function Filter({ label, icon, value, options, onChange }: FilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayLabel = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="
          flex items-center gap-2
          px-3 py-2 text-sm rounded-lg
          bg-[var(--input-background)]
          border border-border
          text-muted-foreground
          hover:bg-muted
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition
        "
      >
        {icon && icon}
        {displayLabel}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-52 rounded-lg border border-border bg-card shadow-lg overflow-hidden backdrop-blur-sm">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-accent ${
                value === opt.value ? "bg-muted font-medium" : ""
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUMMARY CARD
═══════════════════════════════════════════════════════════════ */
function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color?: "green" | "red" | "yellow";
}) {
  const colors = {
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
  };
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className={`text-lg font-semibold ${color ? colors[color] : ""}`}>
        {value}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGINATION HELPER
═══════════════════════════════════════════════════════════════ */
function getPaginationRange(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}
