// ✅ REUSABLE FILTER + TABLE SYSTEM
// Drop this into your project (e.g., /components/log-system.tsx)

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type Option = { label: string; value: string };

// 🔹 FILTER DROPDOWN (Reusable)
export function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const display = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-[var(--input-background)] border border-border hover:bg-muted"
      >
        {display}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-52 rounded-lg border border-border bg-card shadow-lg">
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

// 🔹 TABLE WRAPPER (Reusable)
export function DataTable({
  columns,
  data,
  renderRow,
}: {
  columns: string[];
  data: any[];
  renderRow: (row: any, i: number) => React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto max-h-[540px]">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 text-left text-muted-foreground">
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-muted-foreground">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🔹 PAGINATION
export function Pagination({ page, setPage, totalPages }: any) {
  function range(current: number, total: number) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  }

  return (
    <div className="flex justify-center mt-4">
      <div className="flex gap-1 bg-muted px-2 py-1 rounded-lg">
        <button onClick={() => setPage((p: number) => Math.max(1, p - 1))}>←</button>
        {range(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2">…</span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={page === p ? "bg-red-600 text-white px-2" : "px-2"}
            >
              {p}
            </button>
          )
        )}
        <button onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}>→</button>
      </div>
    </div>
  );
}

// ✅ UPGRADED ERROR LOG PAGE (MATCHES ORDER LOG UI)

import { Search, XCircle, AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";
 

export default function ErrorLogPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const data = Array.from({ length: 50 }, (_, i) => ({
    client: `Client ${i}`,
    symbol: "NIFTY",
    message: "Error occurred",
    status: i % 3 === 0 ? "Error" : i % 3 === 1 ? "Warning" : "Resolved",
  }));

  const filtered = data.filter((d) => {
    if (status && d.status !== status) return false;
    if (search && !d.client.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pageSize = 10;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 space-y-5">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Error Log</h1>
        <p className="text-sm text-muted-foreground">Upgraded UI (same as Order Log)</p>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-8 px-3 py-2 border rounded-lg"
          />
        </div>

        <Filter
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { label: "Error", value: "Error" },
            { label: "Warning", value: "Warning" },
            { label: "Resolved", value: "Resolved" },
          ]}
        />

        <button
          onClick={() => {
            setSearch("");
            setStatus("");
          }}
          className="flex items-center gap-2 px-3 py-2 border text-red-500 rounded-lg"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* TABLE */}
      <DataTable
        columns={["Client", "Symbol", "Message", "Status"]}
        data={paged}
        renderRow={(row, i) => (
          <tr key={i} className="border-t">
            <td className="px-4 py-3">{row.client}</td>
            <td className="px-4 py-3">{row.symbol}</td>
            <td className="px-4 py-3">{row.message}</td>
            <td className="px-4 py-3 flex gap-2 items-center">
              {row.status === "Error" && <XCircle size={14} className="text-red-500" />}
              {row.status === "Warning" && <AlertTriangle size={14} className="text-yellow-500" />}
              {row.status === "Resolved" && <CheckCircle size={14} className="text-green-500" />}
              {row.status}
            </td>
          </tr>
        )}
      />

      {/* PAGINATION */}
      <Pagination page={page} setPage={setPage} totalPages={Math.ceil(filtered.length / pageSize)} />

    </div>
  );
}
