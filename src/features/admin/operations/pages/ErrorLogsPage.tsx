import {
  Search,
  
  XCircle,
   
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Filter } from "./OrderLogsPage";

/* ─── TYPES ───────────────────────── */
type Option = { label: string; value: string };
const clientOptions: Option[] = [
  { label: "All Clients", value: "" },
  ...Array.from({ length: 10 }, (_, i) => ({
    label: `Client ${i}`,
    value: `CL${i}`,
  })),
];


 


 
 

/* ─── MOCK ERROR DATA ─────────────── */
const allErrors = Array.from({ length: 87 }, (_, i) => ({
  date: "May 16, 2025 13:45:21",
  client: `Client ${i}`,
  clientId: `CL${i}`,
  symbol: "NIFTY 23MAY25 CE 22500",
  exchange: "NFO",
  type: i % 2 === 0 ? "API Rejection" : "Slippage",
  errorCode: `ERR_${100 + i}`,
  message:
    i % 2 === 0
      ? "Order rejected by broker"
      : "Slippage exceeded threshold",
  severity: i % 4 === 0 ? "Critical" : "Normal",
  status:
    i % 3 === 0 ? "Error" : i % 3 === 1 ? "Warning" : "Resolved",
}));

/* ─── FILTER OPTIONS ─────────────── */
const statusOptions = [
  { label: "Error", value: "Error" },
  { label: "Warning", value: "Warning" },
  { label: "Resolved", value: "Resolved" },
];

const typeOptions = [
  { label: "API Rejection", value: "API Rejection" },
  { label: "Slippage", value: "Slippage" },
];

/* ═══════════════════════════════════ */
export default function ErrorLogPage() {
  const navigate = useNavigate();

  /* STATE */
  const [page, setPage] = useState(1);
  const pageSize = 10;

 /* ── Filter state ──────────────────────────────────────────── */
  const [search,         setSearch]         = useState("");
  const [clientFilter,   setClientFilter]   = useState("");
  const [statusFilter,   setStatusFilter]   = useState("");
  const [exchangeFilter, setExchangeFilter] = useState("");
  const [typeFilter,     setTypeFilter]     = useState("");
  const [dateMode,       setDateMode]       = useState<"single" | "range">("single");
  const [fromDate,       setFromDate]       = useState("");
  const [toDate,         setToDate]         = useState("");
useEffect(() => {
  setPage(1);
}, [clientFilter, statusFilter, exchangeFilter, typeFilter, search]);
  /* FILTER */
 const filtered = allErrors.filter((o) => {
  if (clientFilter   && o.clientId !== clientFilter)   return false;
  if (statusFilter   && o.status   !== statusFilter)   return false;
  if (exchangeFilter && o.exchange !== exchangeFilter) return false;
  if (typeFilter     && o.type     !== typeFilter)     return false;

  if (
    search &&
    !o.client.toLowerCase().includes(search.toLowerCase()) &&
    !o.symbol.toLowerCase().includes(search.toLowerCase()) &&
    !o.message.toLowerCase().includes(search.toLowerCase())
  ) return false;

  return true;
});

  const totalPages = Math.ceil(filtered.length / pageSize);
  const errors = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* SUMMARY */
  const total = allErrors.length;
  const errorCount = allErrors.filter((e) => e.status === "Error").length;
  const warning = allErrors.filter((e) => e.status === "Warning").length;
  const resolved = allErrors.filter((e) => e.status === "Resolved").length;
  const critical = allErrors.filter((e) => e.severity === "Critical").length;
const today = new Date().toISOString().split("T")[0];
  /* RESET */
 const handleReset = () => {
  setSearch("");
  setClientFilter("");
  setStatusFilter("");
  setExchangeFilter("");
  setTypeFilter("");
  setFromDate("");
  setToDate("");
  setPage(1);
};

  /* NAV */
  const goToClient = (id: string) => {
    navigate({
      to: "/admin/client/$id",
      params: { id },
      search: { tab: "errors" },
    });
  };
const handleQuickRange = (days: number) => {
    const end   = new Date();
    const start = new Date();
    if (days > 0) start.setDate(end.getDate() - days);
    setFromDate(start.toISOString().split("T")[0]);
    setToDate(end.toISOString().split("T")[0]);
  };
  /* ─── UI ───────────────────────── */
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ManagementAdminNavbar />

      <main className="flex flex-col flex-1 p-4 md:p-6">
        <div className="space-y-5">

          {/* HEADER */}
          <div>
            <h1 className="text-xl font-semibold">Error Log</h1>
            <p className="text-sm text-muted-foreground">
              Monitor system & order failures across clients
            </p>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card title="Total Logs" value={total} />
            <Card title="Errors" value={errorCount} color="red" />
            <Card title="Warnings" value={warning} color="yellow" />
            <Card title="Resolved" value={resolved} color="green" />
            <Card title="Critical" value={critical} color="red" />
          </div>

          {/* FILTER BAR */}
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
                         onChange={(e) => setSearch(e.target.value)}
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
                     <Filter label="All Clients"   value={clientFilter}   options={clientOptions}   onChange={setClientFilter}   />
                     <Filter label="All Status"    value={statusFilter}   options={statusOptions}   onChange={setStatusFilter}   />
                      <Filter label="All Types"     value={typeFilter}     options={typeOptions}     onChange={setTypeFilter}     />
           
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
                         onChange={(e) => setFromDate(e.target.value)}
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
                             onChange={(e) => setToDate(e.target.value)}
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
                           { label: "Today", value: 0  },
                           { label: "7D",    value: 7  },
                           { label: "30D",   value: 30 },
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
           
          {/* TABLE */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto max-h-[540px]">
              <table className="w-full text-sm min-w-[900px]">

                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    {[
                      "Date & Time",
                      "Client",
                      "Symbol",
                      "Type",
                      "Error Code",
                      "Message",
                      "Status",
                    ].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {errors.map((row, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/50">

                      <td className="px-4 py-3 text-xs">{row.date}</td>

                      <td className="px-4 py-3">
                        <button onClick={() => goToClient(row.clientId)} className="text-blue-500 hover:underline">
                          {row.client}
                        </button>
                      </td>

                      <td className="px-4 py-3">{row.symbol}</td>

                      <td className="px-4 py-3 text-yellow-500">{row.type}</td>

                      <td className="px-4 py-3 text-red-400 font-mono">
                        {row.errorCode}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                        {row.message}
                      </td>

                      <td className="px-4 py-3 flex items-center gap-2">
                        {row.status === "Error" && <XCircle size={14} className="text-red-500" />}
                        {row.status === "Warning" && <AlertTriangle size={14} className="text-yellow-500" />}
                        {row.status === "Resolved" && <CheckCircle size={14} className="text-green-500" />}
                        {row.status}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

        </div>

        {/* PAGINATION */}
        <div className="mt-auto pt-4 flex justify-center">
          <div className="flex gap-1 bg-muted px-2 py-1 rounded-lg">
            <button onClick={() => setPage(p => Math.max(1, p - 1))}>←</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "text-white bg-red-600 px-2" : "px-2"}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}>→</button>
          </div>
        </div>

      </main>

      <footer className="text-center py-4 text-sm border-t border-border text-muted-foreground">
        © 2026 GoldenFish • Management Panel
      </footer>
    </div>
  );
}

/* FILTER */
 


/* CARD */

type CardColor = "red" | "green" | "yellow";

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color?: CardColor;
}) {
  const c: Record<CardColor, string> = {
    red: "text-red-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`text-lg font-semibold ${color ? c[color] : ""}`}>
        {value}
      </p>
    </div>
  );
}