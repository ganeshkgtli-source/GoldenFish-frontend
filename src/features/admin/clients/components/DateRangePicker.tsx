"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  fromDate: string;
  toDate: string;
  setFromDate: (v: string) => void;
  setToDate: (v: string) => void;
};

export default function DateRangePicker({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: Props) {
  const [open, setOpen] = useState(false);

  const from = fromDate ? new Date(fromDate) : undefined;
  const to = toDate ? new Date(toDate) : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) return;

    if (range.from) {
      setFromDate(range.from.toISOString().slice(0, 10));
    }

    if (range.to) {
      setToDate(range.to.toISOString().slice(0, 10));
      setOpen(false); // close after selecting range
    }
  };

  return (
    <div className="relative">

      {/* INPUT DISPLAY */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-2 px-3 py-2 text-sm rounded-lg
          bg-[var(--input-background)]
          border border-border
          text-foreground
          hover:border-red-500 transition
        "
      >
        <Calendar size={14} className="text-muted-foreground" />

        {fromDate && toDate ? (
          <span>
            {fromDate} → {toDate}
          </span>
        ) : (
          <span className="text-muted-foreground">
            Select date range
          </span>
        )}
      </button>

      {/* POPUP */}
      {open && (
        <div className="absolute z-50 mt-2 rounded-xl border border-border bg-card shadow-xl p-3">

          <DayPicker
            mode="range"
            selected={{ from, to }}
            onSelect={handleSelect}
            numberOfMonths={2}
          />

        </div>
      )}

    </div>
  );
}