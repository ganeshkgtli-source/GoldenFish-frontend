import { useState } from "react";
import SANavbar from "../components/NavBAr";

import {
  OHLCV_FIELDS,
  // COMPARE_OPS,
} from "../components/strategy/constants";

import type {
  Side,
  Row,
  Group,
  ActiveInd,
  OField,
  OpType,
} from "../components/strategy/types";

import { useAuthStore } from "@/store/authStore";
import StrategyHeader from "../components/StrategyHeader";
import EntryConditions from "../components/EntryConditions";
import ExitConditions from "../components/ExitConditions";
import RiskManagementPanel from "../components/RiskManagementPanel";
import ExecutionPanel from "../components/ExecutionPanel";
import TimeFilterPanel from "../components/TimeFilterPanel";
import IndicatorLibrary from "../components/IndicatorLibrary";
import StrategySummary from "../components/StrategySummary";
const EXIT_EXTRA: OField[] = [
  { name: "TARGET", label: "Target", color: "#22c55e", group: "current" },
  { name: "STOPLOSS", label: "Stop Loss", color: "#ef4444", group: "current" },
];

// ─── INDICATORS ─────────────────────────────────────────────

type Category = "trend" | "momentum" | "volume" | "volatility";

type ParamDef = {
  key: string;
  label: string;
  default: number;
  min: number;
  max: number;
  step: number;
};

type IndDef = {
  name: string;
  label: string;
  color: string;
  category: Category;
  paramDefs: ParamDef[];
};

const IND_LIB: IndDef[] = [
  {
    name: "SMA",
    label: "Simple Moving Average",
    color: "#3b82f6",
    category: "trend",
    paramDefs: [
      {
        key: "period",
        label: "Period",
        default: 20,
        min: 1,
        max: 500,
        step: 1,
      },
    ],
  },
  {
    name: "EMA",
    label: "Exponential Moving Average",
    color: "#6366f1",
    category: "trend",
    paramDefs: [
      {
        key: "period",
        label: "Period",
        default: 20,
        min: 1,
        max: 500,
        step: 1,
      },
    ],
  },
  {
    name: "RSI",
    label: "Relative Strength Index",
    color: "#f59e0b",
    category: "momentum",
    paramDefs: [
      {
        key: "period",
        label: "Period",
        default: 14,
        min: 2,
        max: 100,
        step: 1,
      },
    ],
  },
  {
    name: "MACD",
    label: "MACD",
    color: "#ec4899",
    category: "momentum",
    paramDefs: [
      { key: "fast", label: "Fast", default: 12, min: 1, max: 200, step: 1 },
      { key: "slow", label: "Slow", default: 26, min: 1, max: 200, step: 1 },
      { key: "signal", label: "Signal", default: 9, min: 1, max: 100, step: 1 },
    ],
  },
  {
    name: "VWAP",
    label: "Volume Weighted Average Price",
    color: "#22c55e",
    category: "trend",
    paramDefs: [
      {
        key: "period",
        label: "Period",
        default: 14,
        min: 1,
        max: 200,
        step: 1,
      },
    ],
  },
  {
    name: "ATR",
    label: "Average True Range",
    color: "#f97316",
    category: "volatility",
    paramDefs: [
      {
        key: "period",
        label: "Period",
        default: 14,
        min: 1,
        max: 200,
        step: 1,
      },
    ],
  },
  {
    name: "BB",
    label: "Bollinger Bands",
    color: "#8b5cf6",
    category: "volatility",
    paramDefs: [
      {
        key: "period",
        label: "Period",
        default: 20,
        min: 2,
        max: 200,
        step: 1,
      },
      { key: "std", label: "Std Dev", default: 2, min: 0.5, max: 5, step: 0.5 },
    ],
  },
  {
    name: "Stoch",
    label: "Stochastic Oscillator",
    color: "#06b6d4",
    category: "momentum",
    paramDefs: [
      { key: "k", label: "%K", default: 14, min: 1, max: 100, step: 1 },
      { key: "d", label: "%D", default: 3, min: 1, max: 50, step: 1 },
    ],
  },
  {
    name: "OBV",
    label: "On Balance Volume",
    color: "#10b981",
    category: "volume",
    paramDefs: [],
  },
  {
    name: "ADX",
    label: "Average Directional Index",
    color: "#a855f7",
    category: "trend",
    paramDefs: [
      {
        key: "period",
        label: "Period",
        default: 14,
        min: 1,
        max: 200,
        step: 1,
      },
    ],
  },
  {
    name: "CCI",
    label: "Commodity Channel Index",
    color: "#ef4444",
    category: "momentum",
    paramDefs: [
      {
        key: "period",
        label: "Period",
        default: 20,
        min: 2,
        max: 200,
        step: 1,
      },
    ],
  },
  {
    name: "WMA",
    label: "Weighted Moving Average",
    color: "#14b8a6",
    category: "trend",
    paramDefs: [
      {
        key: "period",
        label: "Period",
        default: 14,
        min: 1,
        max: 500,
        step: 1,
      },
    ],
  },
];

const CAT_STYLE: Record<Category, string> = {
  trend: "text-blue-400   bg-blue-500/10   border-blue-500/20",
  momentum: "text-amber-400  bg-amber-500/10  border-amber-500/20",
  volume: "text-green-400  bg-green-500/10  border-green-500/20",
  volatility: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

// ─── TYPES ───────────────────────────────────────────────────

type ST = {
  name: string;
  symbol: string;
  timeframe: string;
  mode: string;
  description: string;
  pos_size: string;
  pos_type: string;
  sl_type: string;
  sl_period: string;
  sl_mult: string;
  sl_val: string;
  tp_type: string;
  tp_val: string;
  max_loss: string;
  trailing: boolean;
  trail_period: string;
  trail_mult: string;
  order_type: string;
  slippage: string;
  tif: string;
  max_pos: string;
  cooldown: string;
  reentry: boolean;
  use_time: boolean;
  t_start: string;
  t_end: string;
  timezone: string;
  days: string[];
};

let _n = 0;
const nid = () => `i${++_n}${Math.random().toString(36).slice(2, 4)}`;

// const blankSide = (): Side => ({ src:"ohlcv", field:"CLOSE", indicator:"", ohlc:"CLOSE", literal:"" });
// const blankSide = (): Side => ({
//   type: "ohlc",
//   field: "CLOSE",
// });
const blankRow = (): Row => ({
  id: crypto.randomUUID(),

  name: "",

  left: {
    type: "ohlc",

    field: "",
  },

  opType: "compare",

  op: ">",

  value: "",

  rangeLow: "",

  rangeHigh: "",

  joiner: "AND",
});

// const blankGrp  = (): Group => ({ id:nid(), logic:"AND", rows:[blankRow()] });
const blankGrp = (): Group => ({
  id: nid(),
  rows: [blankRow()],
});

// ════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════

export default function CreateStrategyPage() {
  const [st, setST] = useState<ST>({
    name: "",
    symbol: "NIFTY",
    timeframe: "5m",
    mode: "Long & Short",
    description: "",
    pos_size: "1.00",
    pos_type: "% of Equity",
    sl_type: "ATR",
    sl_period: "14",
    sl_mult: "1.5",
    sl_val: "",
    tp_type: "RR Ratio",
    tp_val: "2.0",
    max_loss: "3.00",
    trailing: false,
    trail_period: "14",
    trail_mult: "1.0",
    order_type: "LIMIT",
    slippage: "1",
    tif: "DAY",
    max_pos: "1",
    cooldown: "5",
    reentry: true,
    use_time: true,
    t_start: "09:15",
    t_end: "15:30",
    timezone: "Asia/Kolkata",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  });
  const set = (k: keyof ST, v: string | boolean | string[]) =>
    setST((s) => ({ ...s, [k]: v }));
  const user = useAuthStore((s) => s.user);
  // indicator library
  const [libQ, setLibQ] = useState("");
  const [libCat, setLibCat] = useState("all");

  const [activeInds, setActiveInds] = useState<ActiveInd[]>([]);
  const [editingIndUid, setEditingIndUid] = useState<string | null>(null);

  const addInd = (name: string) => {
    if (activeInds.find((i) => i.name === name)) return;
    const def = IND_LIB.find((i) => i.name === name)!;
    setActiveInds((p) => [
      ...p,
      {
        ...def,
        uid: nid(),
        editParams: Object.fromEntries(
          def.paramDefs.map((p) => [p.key, String(p.default)]),
        ),
      },
    ]);
  };
  const remInd = (uid: string) => {
    setActiveInds((p) => p.filter((i) => i.uid !== uid));
    if (editingIndUid === uid) setEditingIndUid(null);
  };

  // conditions
  const [entryGrps, setEntryGrps] = useState<Group[]>([blankGrp()]);
  const [exitGrps, setExitGrps] = useState<Group[]>([blankGrp()]);

  const mut = (t: "entry" | "exit", fn: (gs: Group[]) => Group[]) =>
    t === "entry" ? setEntryGrps(fn) : setExitGrps(fn);

  const addGrp = (t: "entry" | "exit") => mut(t, (gs) => [...gs, blankGrp()]);
  const remGrp = (t: "entry" | "exit", gid: string) =>
    mut(t, (gs) => gs.filter((g) => g.id !== gid));
  // const setGLg = (t:"entry"|"exit", gid:string, l:"AND"|"OR") => mut(t, gs=>gs.map(g=>g.id===gid?{...g,logic:l}:g));
  const addRow = (t: "entry" | "exit", gid: string) =>
    mut(t, (gs) =>
      gs.map((g) => {
        if (g.id !== gid) return g;

        return {
          ...g,
          rows: [
            ...g.rows,
            {
              ...blankRow(),
              name: `Condition ${g.rows.length + 1}`,
            },
          ],
        };
      }),
    );
  const remRow = (t: "entry" | "exit", gid: string, rid: string) =>
    mut(t, (gs) =>
      gs.map((g) =>
        g.id === gid ? { ...g, rows: g.rows.filter((r) => r.id !== rid) } : g,
      ),
    );

  const updRow = (
    t: "entry" | "exit",
    gid: string,
    rid: string,
    fn: (r: Row) => Row,
  ) =>
    mut(t, (gs) =>
      gs.map((g) =>
        g.id === gid
          ? { ...g, rows: g.rows.map((r) => (r.id === rid ? fn(r) : r)) }
          : g,
      ),
    );

  const updSide = (
    t: "entry" | "exit",
    gid: string,
    rid: string,
    patch: Partial<Side>,
  ) => updRow(t, gid, rid, (r) => ({ ...r, left: { ...r.left, ...patch } }));

  const updOp = (t: "entry" | "exit", gid: string, rid: string, op: string) =>
    updRow(t, gid, rid, (r) => ({ ...r, op }));

  const updOpType = (
    t: "entry" | "exit",
    gid: string,
    rid: string,
    opType: OpType,
  ) => updRow(t, gid, rid, (r) => ({ ...r, opType }));

  const updRange = (
    t: "entry" | "exit",
    gid: string,
    rid: string,
    which: "rangeLow" | "rangeHigh",
    v: string,
  ) => updRow(t, gid, rid, (r) => ({ ...r, [which]: v }));
  const updJoiner = (
    t: "entry" | "exit",
    gid: string,
    rid: string,
    joiner: "AND" | "OR",
  ) =>
    updRow(t, gid, rid, (r) => ({
      ...r,
      joiner,
    }));
  const updValue = (
    t: "entry" | "exit",
    gid: string,
    rid: string,
    value: string,
  ) =>
    updRow(t, gid, rid, (r) => ({
      ...r,
      value,
    }));

  // dedup OHLCV: used fields in group (skip current row+side)
  const usedInGrp = (g: Group, skipRid?: string) =>
    g.rows.filter((r) => r.id !== skipRid).map((r) => r.left.field);

  const availOhlcv = (g: Group, rid: string, extras: OField[]) => {
    const current = g.rows.find((r) => r.id === rid)?.left.field;

    const used = usedInGrp(g, rid);

    return [...OHLCV_FIELDS, ...extras].filter(
      (f) => f.name === current || !used.includes(f.name),
    );
  };
  const strategyJson = {
    name: st.name || "Unnamed",
    created_by: user?.username || "",
    symbol: st.symbol,

    timeframe: st.timeframe,

    mode: st.mode,
    description: st.description || "",
    indicators: activeInds.map((i) => ({
      name: i.name,

      params: i.editParams,
    })),

    entry: entryGrps.map((g) => ({
      conditions: g.rows.map((r, idx) => ({
        name: r.name,

        left: {
          type: r.left.type,

          ...(r.left.type === "indicator"
            ? {
                indicator: r.left.indicator,

                params: r.left.params,
              }
            : {}),

          field: r.left.field,
        },

        opType: r.opType,

        ...(r.opType === "compare"
          ? {
              op: r.op,

              value: r.value,
            }
          : {
              rangeLow: r.rangeLow,

              rangeHigh: r.rangeHigh,
            }),

        ...(idx > 0 && r.joiner
          ? {
              joiner: r.joiner,
            }
          : {}),
      })),
    })),

    exit: exitGrps.map((g) => ({
      conditions: g.rows.map((r, idx) => ({
        name: r.name,

        left: {
          type: r.left.type,

          ...(r.left.type === "indicator"
            ? {
                indicator: r.left.indicator,

                params: r.left.params,
              }
            : {}),

          field: r.left.field,
        },

        opType: r.opType,

        ...(r.opType === "compare"
          ? {
              op: r.op,

              value: r.value,
            }
          : {
              rangeLow: r.rangeLow,

              rangeHigh: r.rangeHigh,
            }),

        ...(idx > 0 && r.joiner
          ? {
              joiner: r.joiner,
            }
          : {}),
      })),
    })),

    risk: {
      position_size: {
        value: st.pos_size,

        type: st.pos_type,
      },

      stop_loss: {
        type: st.sl_type,

        ...(st.sl_type === "ATR"
          ? {
              atr_period: st.sl_period,

              atr_multiplier: st.sl_mult,
            }
          : {
              value: st.sl_val,
            }),
      },

      take_profit: {
        type: st.tp_type,

        value: st.tp_val,
      },

      max_daily_loss: st.max_loss,

      trailing_stop: {
        enabled: st.trailing,

        atr_period: st.trail_period,

        atr_multiplier: st.trail_mult,
      },
    },

    execution: {
      order_type: st.order_type,

      slippage: st.slippage,

      time_in_force: st.tif,

      max_position: st.max_pos,

      cooldown_minutes: st.cooldown,

      allow_reentry: st.reentry,
    },
    time_filter: {
      enabled: st.use_time,

      timezone: st.timezone,

      session: {
        start: st.t_start,

        end: st.t_end,
      },

      trading_days: st.days,
    },
  };

  // live JSON
  const liveJson = JSON.stringify(strategyJson, null, 2);

  // validation
  // const checks = [
  //   { label: "Strategy name", ok: !!st.name },
  //   { label: "Symbol", ok: !!st.symbol },
  //   { label: "Indicators added", ok: activeInds.length > 0 },
  //   { label: "Entry conditions", ok: entryGrps.some((g) => g.rows.length > 0) },
  //   { label: "Exit conditions", ok: exitGrps.some((g) => g.rows.length > 0) },
  //   { label: "Risk configured", ok: !!(st.sl_val || st.sl_period) },
  // ];
  // const readiness = Math.round(
  //   (checks.filter((c) => c.ok).length / checks.length) * 100,
  // );

  const filteredLib = IND_LIB.filter(
    (i) => libCat === "all" || i.category === libCat,
  ).filter(
    (i) =>
      i.name.toLowerCase().includes(libQ.toLowerCase()) ||
      i.label.toLowerCase().includes(libQ.toLowerCase()),
  );

  // ── RENDER ────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <SANavbar />

      {/* CONFIG ROW */}
      <StrategyHeader
        strategy={{
          name: st.name,
          symbol: st.symbol,
          timeframe: st.timeframe,
          mode: st.mode,
          description: st.description,
        }}
        onChange={(key, value) => set(key, value)}
      />
      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT ── */}
        <div className="flex-1 min-w-0 overflow-y-auto scrollbar-hide p-4 space-y-4">
          <EntryConditions
            groups={entryGrps}
            activeIndicators={activeInds}
            availableOhlcv={availOhlcv}
            onAddGroup={() => addGrp("entry")}
            onRemoveGroup={(gid) => remGrp("entry", gid)}
            onAddRow={(gid) => addRow("entry", gid)}
            onRemoveRow={(gid, rid) => remRow("entry", gid, rid)}
            onUpdateSide={(gid, rid, patch) =>
              updSide("entry", gid, rid, patch)
            }
            onUpdateOperator={(gid, rid, op) => updOp("entry", gid, rid, op)}
            onUpdateOperatorType={(gid, rid, opType) =>
              updOpType("entry", gid, rid, opType)
            }
            onUpdateValue={(gid, rid, value) =>
              updValue("entry", gid, rid, value)
            }
            onUpdateRange={(gid, rid, which, value) =>
              updRange("entry", gid, rid, which, value)
            }
            onUpdateJoiner={(gid, rid, joiner) =>
              updJoiner("entry", gid, rid, joiner)
            }
          />
          <ExitConditions
            groups={exitGrps}
            extras={EXIT_EXTRA}
            activeInds={activeInds}
            availOhlcv={availOhlcv}
            onAddGrp={() => addGrp("exit")}
            onRemGrp={(gid) => remGrp("exit", gid)}
            onAddRow={(gid) => addRow("exit", gid)}
            onRemRow={(gid, rid) => remRow("exit", gid, rid)}
            onUpdSide={(gid, rid, patch) => updSide("exit", gid, rid, patch)}
            onUpdOp={(gid, rid, op) => updOp("exit", gid, rid, op)}
            onUpdOpType={(gid, rid, ot) => updOpType("exit", gid, rid, ot)}
            onUpdValue={(gid, rid, value) => updValue("exit", gid, rid, value)}
            onUpdRange={(gid, rid, which, value) =>
              updRange("exit", gid, rid, which, value)
            }
            onUpdJoiner={(gid, rid, value) =>
              updJoiner("exit", gid, rid, value)
            }
          />

          {/* SETTINGS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RiskManagementPanel strategy={st} onChange={set} />

            <ExecutionPanel strategy={st} onChange={set} />

            <TimeFilterPanel strategy={st} onChange={set} />
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div
          className="w-72 flex-shrink-0 flex flex-col border-l overflow-y-auto scrollbar-hide"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          {/* INDICATORS */}
          <IndicatorLibrary
            libQ={libQ}
            setLibQ={setLibQ}
            libCat={libCat}
            setLibCat={setLibCat}
            activeInds={activeInds}
            filteredLib={filteredLib}
            addInd={addInd}
            remInd={remInd}
            catStyle={CAT_STYLE}
          />

          <StrategySummary liveJson={liveJson} />

          {/* OPERATORS REF */}
          {/* <div className="p-3 border-b" style={{borderColor:"var(--border)"}}>
            <span className="text-[10px] font-bold tracking-widest block mb-2" style={{color:"var(--muted-foreground)"}}>OPERATORS</span>
            {[
              {label:"Arithmetic",ops:["+","-","*","/"],       sty:"text-blue-400  bg-blue-500/10  border-blue-500/20"},
              {label:"Comparison",ops:[">","<",">=","<=","==","!="], sty:"text-amber-400 bg-amber-500/10 border-amber-500/20"},
              {label:"Logical",   ops:["AND","OR","NOT"],      sty:"text-cyan-400  bg-cyan-500/10  border-cyan-500/20"},
              {label:"Special",   ops:["between","crosses"],   sty:"text-purple-400 bg-purple-500/10 border-purple-500/20"},
            ].map(g=>(
              <div key={g.label} className="mb-2">
                <p className="text-[9px] font-semibold mb-1" style={{color:"var(--muted-foreground)"}}>{g.label}</p>
                <div className="flex flex-wrap gap-1">
                  {g.ops.map(op=><span key={op} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${g.sty}`}>{op}</span>)}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        className="flex items-center gap-4 px-4 py-2 border-t sticky bottom-0 z-30"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="ml-auto flex gap-2">
          <button
            className="px-4 py-1.5 rounded-lg text-xs font-medium border hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            Reset
          </button>
          <button
            className="px-5 py-1.5 rounded-lg text-xs font-bold text-white"
            style={{ background: "#0ea5e9", boxShadow: "0 2px 8px #0ea5e940" }}
          >
            Save Strategy
          </button>
        </div>
      </div>
    </div>
  );
}
