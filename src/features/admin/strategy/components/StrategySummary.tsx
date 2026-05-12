import { memo } from "react";

import { BarChart3, Copy } from "lucide-react";

import { JHL } from "./strategy/ui";

type Props = {
  liveJson: string;
};

function StrategySummary({ liveJson }: Props) {
  return (
    <div className="p-3 flex-1 flex flex-col gap-2">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3
            size={12}
            style={{
              color: "#f59e0b",
            }}
          />

          <span
            className="text-[10px] font-bold tracking-widest"
            style={{
              color: "var(--muted-foreground)",
            }}
          >
            STRATEGY SUMMARY
          </span>
        </div>

        <button
          onClick={() => navigator.clipboard.writeText(liveJson)}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border hover:opacity-70"
          style={{
            borderColor: "var(--border)",

            color: "var(--muted-foreground)",
          }}
        >
          <Copy size={10} />
          Copy
        </button>
      </div>

      {/* JSON */}

      <pre
        className="flex-1 rounded-lg p-2.5 text-[12px] leading-relaxed overflow-auto scrollbar-hide font-mono"
        style={{
          border: "1px solid var(--border)",

          color: "#4ade80",

          maxHeight: 680,
        }}
      >
        <JHL json={liveJson} />
      </pre>
    </div>
  );
}

export default memo(StrategySummary);
