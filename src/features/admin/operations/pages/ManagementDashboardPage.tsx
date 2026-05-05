import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";
import { useEffect, useRef, useState } from "react";
import { Users, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

/* ─── TYPES ─────────────────────────────────────────────── */

type StatType = "clients" | "orders" | "errors" | "success";

type Stat = {
  type: StatType;
  value: string;
  sub: string;
  danger?: boolean;
};

type Trade = {
  client: string;
  symbol: string;
  type: "BUY" | "SELL";
  qty: string;
  price: string;
  time: string;
};

type ErrorLog = {
  client: string;
  message: string;
  type: "success" | "error" | "warning";
  time: string;
};

/* ─── DUMMY DATA ─────────────────────────────────────────── */

const INITIAL_STATS: Stat[] = [
  { type: "clients", value: "128", sub: "+12 this month" },
  { type: "orders",  value: "342", sub: "+18% vs yesterday" },
  { type: "errors",  value: "12",  sub: "-4 vs yesterday", danger: true },
  { type: "success", value: "98.6%", sub: "+2.4% vs yesterday" },
];

const INITIAL_ERRORS: ErrorLog[] = [
  { client: "Client A", message: "Trade executed",   type: "success", time: "now" },
  { client: "Client B", message: "API rejection",    type: "error",   time: "now" },
  { client: "Client C", message: "Slippage detected",type: "warning", time: "now" },
];

const INITIAL_TRADES: Trade[] = [
  { client: "Client A", symbol: "NIFTY",     type: "BUY",  qty: "50", price: "₹22,150", time: "now" },
  { client: "Client B", symbol: "BANKNIFTY", type: "SELL", qty: "25", price: "₹48,320", time: "now" },
];

const SYMBOLS = ["NIFTY", "BANKNIFTY", "RELIANCE"];
const MESSAGES: ErrorLog["message"][] = ["API rejection", "Slippage", "Order failed"];
const LOG_TYPES: ErrorLog["type"][] = ["error", "warning", "success"];

/* ─── PAGE ───────────────────────────────────────────────── */

export default function ManagementDashboardPage() {
  const user = useAuthStore((s) => s.user);

  // FIX: useState<Trade[]> and useState<ErrorLog[]> — was untyped
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>(INITIAL_ERRORS);
  const [trades, setTrades] = useState<Trade[]>(INITIAL_TRADES);
  const [limit, setLimit] = useState(10);
  const [stats, setStats] = useState<Stat[]>(INITIAL_STATS);

  // FIX: store interval refs so they can be properly cleared
  const statsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  /* responsive limit */
  useEffect(() => {
    const updateLimit = () => setLimit(window.innerWidth < 768 ? 5 : 10);
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  /* live stats ticker */
  useEffect(() => {
    statsIntervalRef.current = setInterval(() => {
      setStats((prev) =>
        prev.map((item) => {
          if (item.type === "clients")
            return { ...item, value: (Number(item.value) + 1).toString() };
          if (item.type === "orders")
            return { ...item, value: (Number(item.value) + 2).toString() };
          if (item.type === "errors")
            return { ...item, value: Math.max(0, Number(item.value) - 1).toString() };
          if (item.type === "success")
            return { ...item, value: (95 + Math.random() * 5).toFixed(1) + "%" };
          return item;
        })
      );
    }, 3000);

    return () => {
      // FIX: was not using ref — multiple intervals could stack
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    };
  }, []);

  /* live trades + errors */
  useEffect(() => {
    liveIntervalRef.current = setInterval(() => {
      const clientLetter = String.fromCharCode(65 + Math.floor(Math.random() * 5));

      const newTrade: Trade = {
        client: `Client ${clientLetter}`,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        type: Math.random() > 0.5 ? "BUY" : "SELL",
        qty: (Math.floor(Math.random() * 100) + 1).toString(),
        price: "₹" + (20000 + Math.floor(Math.random() * 5000)).toLocaleString(),
        time: "now",
      };

      const newError: ErrorLog = {
        client: `Client ${clientLetter}`,
        message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
        type: LOG_TYPES[Math.floor(Math.random() * LOG_TYPES.length)],
        time: "now",
      };

      setTrades((prev) => [newTrade, ...prev].slice(0, limit));
      setErrorLogs((prev) => [newError, ...prev].slice(0, limit));
    }, 4000);

    return () => {
      // FIX: proper cleanup of live interval
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    };
  }, [limit]);

  /* ─── RENDER ─────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ManagementAdminNavbar />

      <main className="p-6 space-y-6 flex-1 flex flex-col min-h-0">

        {/* HERO */}
        <div className="relative rounded-2xl p-6 border border-border overflow-hidden bg-card">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-400/10 to-transparent" />
          <div className="absolute right-10 top-0 w-72 h-72 bg-red-500/10 blur-[120px]" />

          <svg
            className="absolute right-0 bottom-0 w-1/2 h-full opacity-70"
            viewBox="0 0 400 200"
            preserveAspectRatio="none"
          >
            <path
              d="M0,150 C50,120 80,160 120,110 C160,60 200,140 240,100 C280,60 320,120 360,80 C380,60 400,40 400,40"
              fill="none"
              stroke="rgba(239,68,68,0.9)"
              strokeWidth="3"
            />
            <circle cx="360" cy="80" r="4" fill="red" />
            <circle cx="400" cy="40" r="5" fill="red" />
          </svg>

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <div className="w-6 h-6 bg-red-500 rounded-full" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Welcome back{" "}
                {user?.username
                  ? user.username.charAt(0).toUpperCase() + user.username.slice(1) + " 👋"
                  : "Admin 👋"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Here's what's happening with your clients, orders and system.
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.type}
              type={stat.type}
              value={stat.value}
              sub={stat.sub}
              danger={stat.danger}
            />
          ))}
        </div>

        {/* PANELS */}
        <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0">

          {/* ERROR LOG */}
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col min-h-0 h-[350px]">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">~ Overall Error Log</h3>
            <div className="space-y-3 text-sm flex-1 overflow-y-auto scrollbar-hide">
              {errorLogs.slice(0, limit).map((log, i) => (
                <p
                  key={i}
                  className={
                    log.type === "success"
                      ? "text-green-500"
                      : log.type === "error"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }
                >
                  {log.type === "success" && "✔ "}
                  {log.type === "error"   && "✖ "}
                  {log.type === "warning" && "⚠ "}
                  <span className="truncate">{log.client} — {log.message}</span>
                </p>
              ))}
            </div>
          </div>

          {/* TRADE ORDERS */}
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col min-h-0 h-[350px]">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">↗ Trade Orders</h3>
            <div className="grid grid-cols-5 text-xs text-muted-foreground px-4 mb-2">
              <span>Client</span>
              <span className="text-center">Type</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Price</span>
              <span />
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
              {trades.slice(0, limit).map((trade, i) => (
                <TradeRow key={i} {...trade} />
              ))}
            </div>
          </div>

        </div>
      </main>

      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border">
        © 2026 GoldenFish • Management Panel
      </footer>
    </div>
  );
}

/* ─── STAT CARD ──────────────────────────────────────────── */

// FIX: was typed as any — now fully typed
const STAT_CONFIG: Record<StatType, { icon: React.ReactNode; color: string; label: string }> = {
  clients: { icon: <Users size={18} />,         color: "bg-red-500/10 text-red-500",     label: "Total Clients" },
  orders:  { icon: <ShoppingCart size={18} />,  color: "bg-blue-500/10 text-blue-500",   label: "Orders Today"  },
  errors:  { icon: <AlertTriangle size={18} />, color: "bg-yellow-500/10 text-yellow-500", label: "Total Errors" },
  success: { icon: <TrendingUp size={18} />,    color: "bg-purple-500/10 text-purple-500", label: "Success Rate" },
};

function StatCard({ type, value, sub, danger }: Stat) {
  const item = STAT_CONFIG[type];
  return (
    <div className="rounded-2xl p-4 bg-card border border-border flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
        {item.icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{item.label}</p>
        <p className={`text-xl font-semibold ${danger ? "text-red-500" : ""}`}>{value}</p>
        <p className="text-xs text-green-500 mt-1">{sub}</p>
      </div>
    </div>
  );
}

/* ─── TRADE ROW ──────────────────────────────────────────── */

// FIX: was typed as any — now uses Trade type
function TradeRow({ client, symbol, type, qty, price }: Trade) {
  return (
    <div className="grid grid-cols-5 items-center px-4 py-3 rounded-xl bg-muted hover:bg-accent transition text-sm">
      <div className="flex flex-col min-w-0">
        <span className="font-semibold truncate">{client}</span>
        <span className="text-xs text-muted-foreground truncate">{symbol}</span>
      </div>
      <div className="text-center">
        <span className={type === "BUY" ? "text-green-500" : "text-red-500"}>{type}</span>
      </div>
      <div className="text-center text-muted-foreground truncate">{qty}</div>
      <div className="text-right font-semibold truncate">{price}</div>
      <div />
    </div>
  );
}
