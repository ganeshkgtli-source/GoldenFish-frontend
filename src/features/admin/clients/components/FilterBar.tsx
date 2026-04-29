import { Search,  RotateCcw } from "lucide-react";import { useState, useEffect } from "react";

type Props = {
  search: string;
  setSearch: (v: string) => void;

  status: string;
  setStatus: (v: string) => void;

  fromDate: string;
  toDate: string;
  setFromDate: (v: string) => void;
  setToDate: (v: string) => void;

  onQuickRange: (days: number) => void;
};

export default function FilterBar({
  search,
  setSearch,
  status,
  setStatus,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onQuickRange,
}: Props) {
  const [mode, setMode] = useState<"single" | "range">("single");

  // ✅ sync single mode
  useEffect(() => {
    if (mode === "single") {
      setToDate(fromDate);
    }
  }, [mode, fromDate]);
const today = new Date().toISOString().split("T")[0];
  const handleReset = () => {
    setSearch("");
    setStatus("ALL");
    setFromDate("");
    setToDate("");
    setMode("single");
  };

  return (
     <div className="flex flex-wrap items-center gap-3">

      {/* 🔍 SEARCH (same as your previous style) */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          placeholder="Search symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            pl-9 pr-3 py-2 text-sm rounded-lg
            bg-[var(--input-background)]
            border border-border
            text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      {/* STATUS (same style) */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="
          px-3 py-2 text-sm rounded-lg
          bg-[var(--input-background)]
          border border-border
          text-foreground
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      >
        <option value="ALL">All Status</option>
        <option value="OPEN">Open</option>
        <option value="CLOSED">Closed</option>
      </select>

      {/* 🔥 MODE SWITCH (NEW but SIMPLE) */}
      <div className="flex items-center border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setMode("single")}
          className={`
            px-3 py-2 text-xs transition
            ${
              mode === "single"
                ? "bg-blue-500 text-white"
                : "text-muted-foreground hover:bg-muted"
            }
          `}
        >
          Single Day
        </button>

        <button
          onClick={() => setMode("range")}
          className={`
            px-3 py-2 text-xs transition
            ${
              mode === "range"
                ? "bg-blue-500 text-white"
                : "text-muted-foreground hover:bg-muted"
            }
          `}
        >
        Date  Range
        </button>
      </div>

      {/* 📅 DATE INPUTS (same feel as old) */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={fromDate}
            max={today}
          onChange={(e) => setFromDate(e.target.value)}
          className="
            px-3 py-2 text-sm rounded-lg
            bg-[var(--input-background)]
            border border-border
            text-foreground
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        {mode === "range" && (
          <>
            <span className="text-muted-foreground text-sm">→</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="
                px-3 py-2 text-sm rounded-lg
                bg-[var(--input-background)]
                border border-border
                text-foreground
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </>
        )}
      </div>

      {/* ⚡ QUICK RANGE */}
      {mode === "range" && (
        <div className="flex items-center gap-1">
          {[
            { label: "Today", value: 0 },
            { label: "7D", value: 7 },
            { label: "30D", value: 30 },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={() => onQuickRange(btn.value)}
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

      {/* RESET */}
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
  );
}