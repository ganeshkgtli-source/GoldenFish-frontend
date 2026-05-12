import { memo } from "react";

import { BarChart3, Save, Zap } from "lucide-react";

import { CF, CS, ModeSwitch, TBtn } from "../components/strategy/ui";

type ST = {
  name: string;
  symbol: string;
  timeframe: string;
  mode: string;
  description: string;
};

type Props = {
  strategy: ST;

  onChange: (key: keyof ST, value: string) => void;
};

const TIMEFRAMES = ["1m", "3m", "5m", "15m", "30m", "1h", "4h", "1D", "1W"];

function StrategyHeader({ strategy, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap items-end gap-3 px-4 py-3 border-b sticky top-0 z-30"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* ================================= */}
      {/* STRATEGY NAME */}
      {/* ================================= */}

      <CF
        label="Strategy Name"
        v={strategy.name}
        onChange={(v) => onChange("name", v)}
        placeholder="Mean Reversion Pro"
        w="200px"
      />

      {/* ================================= */}
      {/* SYMBOL */}
      {/* ================================= */}

      <CF
        label="Symbol"
        v={strategy.symbol}
        onChange={(v) => onChange("symbol", v.toUpperCase())}
        placeholder="NIFTY"
        w="90px"
      />

      {/* ================================= */}
      {/* TIMEFRAME */}
      {/* ================================= */}

      <CS
        label="Timeframe"
        v={strategy.timeframe}
        onChange={(v) => onChange("timeframe", v)}
        opts={TIMEFRAMES}
        w="90px"
      />

      {/* ================================= */}
      {/* MODE */}
      {/* ================================= */}

      <ModeSwitch v={strategy.mode} onChange={(v) => onChange("mode", v)} />

      {/* ================================= */}
      {/* DESCRIPTION */}
      {/* ================================= */}

      <CF
        label="Description (optional)"
        v={strategy.description}
        onChange={(v) => onChange("description", v)}
        placeholder="RSI+VWAP mean reversion…"
        w="260px"
      />

      {/* ================================= */}
      {/* ACTIONS */}
      {/* ================================= */}

      <div className="ml-auto flex items-center gap-2 pb-0.5">
        <TBtn icon={<BarChart3 size={13} />} label="Backtest" />

        <TBtn icon={<Save size={13} />} label="Save" />

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg,#0ea5e9,#0284c7)",

            boxShadow: "0 2px 10px #0ea5e940",
          }}
        >
          <Zap size={13} />
          Save &amp; Activate
        </button>
      </div>
    </div>
  );
}

export default memo(StrategyHeader);
