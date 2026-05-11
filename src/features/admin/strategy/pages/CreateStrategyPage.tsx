import   { useState } from "react";
import SANavbar from "../components/NavBAr";
import {
  // BrainCircuit,
  Plus,
  // Trash2,
  Settings2,
  ShieldCheck,
  Clock3,
  BarChart3,
  // GripVertical,
  // ChevronDown,
  Zap,
  CheckCircle2,
  X,
  Copy,
  Save,
  Activity,
  // AlertTriangle,
  Search,
  // Edit3,
  // ChevronRight,
} from "lucide-react";

import {
  IS,
  OHLCV_FIELDS,
  // COMPARE_OPS,
} from "../components/strategy/constants";

import {
  // SBtn,
  // LgSel,
  Panel,
  SR,
  CF,
  CS,
  Tog,
  ModeSwitch,
  TBtn,
  JHL,
  // TableOfContents,
} from "../components/strategy/ui";
import type {
  Side,
  Row,
  Group,
  ActiveInd,
  OField,
  OpType,
} from "../components/strategy/types";
import CondBlock from "../components/strategy/CondBlock";
import { useAuthStore } from "@/store/authStore";
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

// ─── OPERATORS + OPERAND TYPES ───────────────────────────────

const ORDER_TYPES = ["MARKET", "LIMIT", "SL", "SL-M"];
const TIMEFRAMES = ["1m", "3m", "5m", "15m", "30m", "1h", "4h", "1D", "1W"];
// const MODES = ["Long & Short", "Long Only", "Short Only"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
      <div
        className="flex flex-wrap items-end gap-3 px-4 py-3 border-b sticky top-0 z-30"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <CF
          label="Strategy Name"
          v={st.name}
          onChange={(v) => set("name", v)}
          placeholder="Mean Reversion Pro"
          w="200px"
        />
        <CF
          label="Symbol"
          v={st.symbol}
          onChange={(v) => set("symbol", v.toUpperCase())}
          placeholder="NIFTY"
          w="90px"
        />
        <CS
          label="Timeframe"
          v={st.timeframe}
          onChange={(v) => set("timeframe", v)}
          opts={TIMEFRAMES}
          w="90px"
        />
        <ModeSwitch v={st.mode} onChange={(v) => set("mode", v)} />
        <CF
          label="Description (optional)"
          v={st.description}
          onChange={(v) => set("description", v)}
          placeholder="RSI+VWAP mean reversion…"
          w="260px"
        />
        <div className="ml-auto flex items-center gap-2 pb-0.5">
          <TBtn icon={<BarChart3 size={13} />} label="Backtest" />

          <TBtn icon={<Save size={13} />} label="Save" />

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
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

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT ── */}
<div className="flex-1 min-w-0 overflow-y-auto scrollbar-hide p-4 space-y-4">          <CondBlock
            title="ENTRY CONDITIONS"
            subtitle="Define conditions for entering a position"
            titleColor="#22d3ee"
            groups={entryGrps}
            kind="entry"
            activeInds={activeInds}
            extras={[]}
            onAddGrp={() => addGrp("entry")}
            onRemGrp={(gid: string) => remGrp("entry", gid)}
            onAddRow={(gid: string) => addRow("entry", gid)}
            onRemRow={(gid: string, rid: string) => remRow("entry", gid, rid)}
            onUpdSide={(gid: string, rid: string, patch: any) =>
              updSide("entry", gid, rid, patch)
            }
            onUpdOp={(gid: string, rid: string, op: any) =>
              updOp("entry", gid, rid, op)
            }
            onUpdOpType={(gid: string, rid: string, ot: any) =>
              updOpType("entry", gid, rid, ot)
            }
            onUpdValue={(gid: string, rid: string, value: any) =>
              updValue("entry", gid, rid, value)
            }
            onUpdRange={(gid: string, rid: string, which: any, value: any) =>
              updRange("entry", gid, rid, which, value)
            }
            onUpdJoiner={(gid: string, rid: string, value: any) =>
              updJoiner("entry", gid, rid, value)
            }
            availOhlcv={availOhlcv}
          />

          <CondBlock
            title="EXIT CONDITIONS"
            subtitle="Define conditions for exiting a position"
            titleColor="#f59e0b"
            groups={exitGrps}
            kind="exit"
            activeInds={activeInds}
            extras={EXIT_EXTRA}
            onAddGrp={() => addGrp("exit")}
            onRemGrp={(gid: string) => remGrp("exit", gid)}
            onAddRow={(gid: string) => addRow("exit", gid)}
            onRemRow={(gid: string, rid: string) => remRow("exit", gid, rid)}
            onUpdSide={(gid: string, rid: string, patch: any) =>
              updSide("exit", gid, rid, patch)
            }
            onUpdOp={(gid: string, rid: string, op: any) =>
              updOp("exit", gid, rid, op)
            }
            onUpdOpType={(gid: string, rid: string, ot: any) =>
              updOpType("exit", gid, rid, ot)
            }
            onUpdValue={(gid: string, rid: string, value: any) =>
              updValue("exit", gid, rid, value)
            }
            onUpdRange={(gid: string, rid: string, which: any, value: any) =>
              updRange("exit", gid, rid, which, value)
            }
            onUpdJoiner={(gid: string, rid: string, value: any) =>
              updJoiner("exit", gid, rid, value)
            }
            availOhlcv={availOhlcv}
          />

          {/* SETTINGS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Panel
              title="RISK MANAGEMENT"
              accent="#34d399"
              icon={<ShieldCheck size={13} style={{ color: "#34d399" }} />}
            >
              <SR label="Position Size">
                <div className="flex gap-1">
                  <input
                    value={st.pos_size}
                    onChange={(e) => set("pos_size", e.target.value)}
                    style={{ ...IS, width: 60 }}
                  />
                  <span
                    style={{
                      ...IS,
                      padding: "0 8px",
                      fontSize: 10,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    %
                  </span>
                  <CS
                    label=""
                    v={st.pos_type}
                    onChange={(v) => set("pos_type", v)}
                    opts={["% of Equity", "Fixed Lot", "Fixed Amount"]}
                    w="120px"
                    nolabel
                  />
                </div>
              </SR>
              <SR label="Stop Loss">
                <div className="flex gap-1 items-center flex-wrap">
                  <CS
                    label=""
                    v={st.sl_type}
                    onChange={(v) => set("sl_type", v)}
                    opts={["ATR", "Fixed %", "Points"]}
                    w="80px"
                    nolabel
                  />
                  {st.sl_type === "ATR" ? (
                    <>
                      <span
                        style={{
                          ...IS,
                          padding: "0 8px",
                          fontSize: 11,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {st.sl_period}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        ×
                      </span>
                      <input
                        value={st.sl_mult}
                        onChange={(e) => set("sl_mult", e.target.value)}
                        style={{ ...IS, width: 40 }}
                      />
                    </>
                  ) : (
                    <input
                      value={st.sl_val}
                      onChange={(e) => set("sl_val", e.target.value)}
                      style={{ ...IS, flex: 1 }}
                      placeholder="1.5"
                    />
                  )}
                </div>
              </SR>
              <SR label="Take Profit">
                <div className="flex gap-1">
                  <CS
                    label=""
                    v={st.tp_type}
                    onChange={(v) => set("tp_type", v)}
                    opts={["RR Ratio", "Fixed %", "Points"]}
                    w="100px"
                    nolabel
                  />
                  <input
                    value={st.tp_val}
                    onChange={(e) => set("tp_val", e.target.value)}
                    style={{ ...IS, width: 60 }}
                  />
                </div>
              </SR>
              <SR label="Max Daily Loss">
                <div className="flex gap-1 items-center">
                  <input
                    value={st.max_loss}
                    onChange={(e) => set("max_loss", e.target.value)}
                    style={{ ...IS, flex: 1 }}
                  />
                  <span
                    style={{ fontSize: 10, color: "var(--muted-foreground)" }}
                  >
                    %
                  </span>
                </div>
              </SR>
              <SR label="Trailing Stop">
                <Tog v={st.trailing} onChange={(v) => set("trailing", v)} />
              </SR>
            </Panel>

            <Panel
              title="EXECUTION SETTINGS"
              accent="#22d3ee"
              icon={<Settings2 size={13} style={{ color: "#22d3ee" }} />}
            >
              <SR label="Order Type">
                {" "}
                <CS
                  label=""
                  v={st.order_type}
                  onChange={(v) => set("order_type", v)}
                  opts={ORDER_TYPES}
                  w="100%"
                  nolabel
                />
              </SR>
              <SR label="Slippage">
                {" "}
                <input
                  value={st.slippage}
                  onChange={(e) => set("slippage", e.target.value)}
                  style={{ ...IS, width: "100%" }}
                />
              </SR>
              <SR label="Time in Force">
                {" "}
                <CS
                  label=""
                  v={st.tif}
                  onChange={(v) => set("tif", v)}
                  opts={["DAY", "IOC", "GTC"]}
                  w="100%"
                  nolabel
                />
              </SR>
              <SR label="Max Position">
                {" "}
                <input
                  value={st.max_pos}
                  onChange={(e) => set("max_pos", e.target.value)}
                  style={{ ...IS, width: "100%" }}
                />
              </SR>
              <SR label="Cooldown (min)">
                <input
                  value={st.cooldown}
                  onChange={(e) => set("cooldown", e.target.value)}
                  style={{ ...IS, width: "100%" }}
                />
              </SR>
              <SR label="Allow Re-entry">
                <Tog v={st.reentry} onChange={(v) => set("reentry", v)} />
              </SR>
            </Panel>
<Panel
  title="TIME FILTER"
  accent="#f59e0b"
  icon={
    <Clock3
      size={13}
      style={{
        color: "#f59e0b",
      }}
    />
  }
>
  <SR label="Enable">
    <Tog
      v={st.use_time}
      onChange={(v) =>
        set("use_time", v)
      }
    />
  </SR>

  {/* START */}
  <SR label="Start">
    <input
      type="time"
      value={st.t_start}
      onChange={(e) =>
        set(
          "t_start",
          e.target.value
        )
      }
      onBlur={() => {

        if (
          st.t_start < "09:15" ||
          st.t_start > "15:30"
        ) {
          alert(
            "Start time must be between 09:15 AM and 03:30 PM"
          );

          set(
            "t_start",
            "09:15"
          );
        }
      }}
      style={{
        ...IS,

        width: "100%",

        opacity: st.use_time
          ? 1
          : 0.35,
      }}
      disabled={!st.use_time}
    />
  </SR>

  {/* END */}
  <SR label="End">
    <input
      type="time"
      value={st.t_end}
      onChange={(e) =>
        set(
          "t_end",
          e.target.value
        )
      }
      onBlur={() => {

        if (
          st.t_end < "09:15" ||
          st.t_end > "15:30"
        ) {
          alert(
            "End time must be between 09:15 AM and 03:30 PM"
          );

          set(
            "t_end",
            "15:30"
          );

          return;
        }

        if (
          st.t_end <=
          st.t_start
        ) {
          alert(
            "End time must be greater than Start time"
          );

          set(
            "t_end",
            "15:30"
          );
        }
      }}
      style={{
        ...IS,

        width: "100%",

        opacity: st.use_time
          ? 1
          : 0.35,
      }}
      disabled={!st.use_time}
    />
  </SR>

  {/* TIMEZONE */}
  <SR label="Timezone">
    <CS
      label=""
      v={st.timezone}
      onChange={(v) =>
        set("timezone", v)
      }
      opts={[
        "Asia/Kolkata",
        "UTC",
        "America/New_York",
        "Europe/London",
      ]}
      w="100%"
      nolabel
    />
  </SR>

  {/* DAYS */}
  <SR label="Days">
    <div className="flex flex-wrap gap-1 mt-0.5">

      {WEEKDAYS.map((d) => {

        const on = (
          st.days as string[]
        ).includes(d);

        return (
          <button
            key={d}
            onClick={() =>
              set(
                "days",

                on
                  ? (
                      st.days as string[]
                    ).filter(
                      (x) =>
                        x !== d
                    )

                  : [
                      ...(st.days as string[]),
                      d,
                    ]
              )
            }
            className="px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all"
            style={{
              background: on
                ? "#0ea5e9"
                : "var(--muted)",

              color: on
                ? "#fff"
                : "var(--muted-foreground)",

              borderColor: on
                ? "#0ea5e9"
                : "var(--border)",
            }}
          >
            {d}
          </button>
        );
      })}

    </div>
  </SR>
</Panel>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div
  className="w-72 flex-shrink-0 flex flex-col border-l overflow-y-auto scrollbar-hide"          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          {/* INDICATORS */}
          <div
            className="p-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            {/* HEADER */}
            <div className="flex items-center gap-2 mb-2">
              <Activity size={12} style={{ color: "#22d3ee" }} />

              <span
                className="text-[10px] font-bold tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                INDICATORS
              </span>
            </div>

            {/* SEARCH */}
            <div className="relative mb-2">
              <Search
                size={11}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 "
                style={{ color: "var(--muted-foreground)" }}
              />

              <input
                value={libQ}
                onChange={(e) => setLibQ(e.target.value)}
                placeholder="Search indicators…"
                className="w-full pl-7 pr-3 py-1.5 rounded-lg text-[11px] outline-none"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            {/* CATEGORY FILTER */}
            <div className="flex flex-wrap gap-1 mb-2">
              {["all", "trend", "momentum", "volume", "volatility"].map((c) => (
                <button
                  key={c}
                  onClick={() => setLibCat(c)}
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize transition-all "
                  style={{
                    background: libCat === c ? "#0ea5e9" : "var(--muted)",
                    color: libCat === c ? "#fff" : "var(--muted-foreground)",
                    borderColor: libCat === c ? "#0ea5e9" : "var(--border)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* ACTIVE INDICATORS */}
            <div
              className="rounded-lg border p-1.5 min-h-[40px] mb-2"
              style={{
                borderColor: "var(--border)",
                background: "transparent",
              }}
            >
              {activeInds.length === 0 ? (
                <p
                  className="text-center text-[10px] py-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Click + to add indicators
                </p>
              ) : (
                <div className="space-y-1 scrollbar-hide">
                  {activeInds.map((i) => (
                    <div
                      key={i.uid}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg border"
                      style={{
                        background: i.color + "14",
                        borderColor: i.color + "30",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: i.color }}
                      />

                      <span
                        className="text-[11px] font-bold flex-1"
                        style={{ color: i.color }}
                      >
                        {i.name}
                      </span>

                      <button
                        onClick={() => remInd(i.uid)}
                        className="hover:opacity-60"
                      >
                        <X
                          size={10}
                          style={{ color: "var(--muted-foreground)" }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INDICATOR LIBRARY */}
            <div className="space-y-0.5 max-h-52 overflow-y-auto scrollbar-hide">
              {filteredLib.map((ind) => {
                const added = !!activeInds.find((a) => a.name === ind.name);

                return (
                  <div
                    key={ind.name}
                    onClick={() => !added && addInd(ind.name)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs transition-all select-none"
                    style={{
                      border: "1px solid var(--border)",
                      background: "transparent",
                      opacity: added ? 0.4 : 1,
                      cursor: added ? "default" : "pointer",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: ind.color }}
                    />

                    <span
                      className="font-bold w-10 flex-shrink-0 text-[11px]"
                      style={{ color: ind.color }}
                    >
                      {ind.name}
                    </span>

                    <span
                      className="flex-1 truncate text-[10px]"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {ind.label}
                    </span>

                    <span
                      className={`text-[9px] px-1 py-0.5 rounded border flex-shrink-0 ${CAT_STYLE[ind.category]}`}
                    >
                      {ind.category.slice(0, 3)}
                    </span>

                    {added ? (
                      <CheckCircle2 size={11} className="text-green-500" />
                    ) : (
                      <Plus
                        size={11}
                        style={{ color: "var(--muted-foreground)" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

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

          {/* STRATEGY SUMMARY */}
          <div className="p-3 flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={12} style={{ color: "#f59e0b" }} />
                <span
                  className="text-[10px] font-bold tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
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
                <Copy size={10} /> Copy
              </button>
            </div>
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
