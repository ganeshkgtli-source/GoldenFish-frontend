import { useState } from "react";

type DateRangeFilterProps = {
  fromDate: string;

  toDate: string;

  setFromDate: (value: string) => void;

  setToDate: (value: string) => void;

  onQuickRange?: (days: number) => void;
};

export default function DateRangeFilter({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onQuickRange,
}: DateRangeFilterProps) {
  const [mode, setMode] = useState<
    "single" | "range"
  >("single");

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const handleSingleDateChange = (
    value: string,
  ) => {
    setFromDate(value);

    /**
     * IMPORTANT
     * directly set same date
     * no useEffect loop
     */
    if (mode === "single") {
      setToDate(value);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* MODE */}
      <div
        className="
          flex items-center overflow-hidden
          rounded-xl
          border border-border
        "
      >
        <button
          type="button"
          onClick={() => {
            setMode("single");

            /**
             * sync immediately
             */
            if (fromDate) {
              setToDate(fromDate);
            }
          }}
          className={`
            h-10 px-4 text-xs font-medium
            transition-colors

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
          type="button"
          onClick={() =>
            setMode("range")
          }
          className={`
            h-10 px-4 text-xs font-medium
            transition-colors

            ${
              mode === "range"
                ? "bg-blue-500 text-white"
                : "text-muted-foreground hover:bg-muted"
            }
          `}
        >
          Date Range
        </button>
      </div>

      {/* DATES */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={fromDate}
          max={today}
          onChange={(e) =>
            handleSingleDateChange(
              e.target.value,
            )
          }
          className="
            h-10
            rounded-xl
            border border-border
            bg-[var(--input-background)]
            px-3
            text-sm text-foreground
            outline-none
            transition-colors
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
          "
        />

        {mode === "range" && (
          <>
            <span className="text-muted-foreground">
              →
            </span>

            <input
              type="date"
              value={toDate}
              max={today}
              onChange={(e) =>
                setToDate(
                  e.target.value,
                )
              }
              className="
                h-10
                rounded-xl
                border border-border
                bg-[var(--input-background)]
                px-3
                text-sm text-foreground
                outline-none
                transition-colors
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
              "
            />
          </>
        )}
      </div>

      {/* QUICK RANGE */}
      {mode === "range" &&
        onQuickRange && (
          <div className="flex items-center gap-2">
            {[
              {
                label: "Today",
                value: 0,
              },
              {
                label: "7D",
                value: 7,
              },
              {
                label: "30D",
                value: 30,
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  onQuickRange(
                    item.value,
                  )
                }
                className="
                  h-9 rounded-xl
                  border border-border
                  px-3
                  text-xs
                  text-muted-foreground
                  transition-colors
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
    </div>
  );
}