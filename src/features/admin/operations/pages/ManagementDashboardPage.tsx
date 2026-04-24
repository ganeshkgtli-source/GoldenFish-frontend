import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";
import { useEffect, useState } from "react";
import {
  Users,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import api from "@/lib/api";
// import { useTheme } from "@/context/ThemeContext";
// import api from "@/lib/api"; connect to bckend to fetch real stats and logs

export default function ManagementDashboardPage() {
//   type Stat = {
//   type: "clients" | "orders" | "errors" | "success";
//   value: string;
//   sub: string;
//   danger?: boolean;
// };
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

// const [stats, setStats] = useState<Stat[]>([]);
// const [loading, setLoading] = useState(true); backend integration to fetch real stats
// useEffect(() => {
//   const fetchStats = async () => {
//     try {
//       const res = await api.get("/dashboard/stats/");
//       setStats(res.data);
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchStats(); // first load

//   const interval = setInterval(fetchStats, 5000); // refresh every 5s

//   return () => clearInterval(interval);
// }, []);

const dummyStats = [
  { type: "clients", value: "128", sub: "+12 this month" },
  { type: "orders", value: "342", sub: "+18% vs yesterday" },
  { type: "errors", value: "12", sub: "-4 vs yesterday", danger: true },
  { type: "success", value: "98.6%", sub: "+2.4% vs yesterday" },
];
const dummyErrors: ErrorLog[] = [
  { client: "Client A", message: "Trade executed", type: "success", time: "now" },
  { client: "Client B", message: "API rejection", type: "error", time: "now" },
  { client: "Client C", message: "Slippage detected", type: "warning", time: "now" },
];
const USE_DUMMY = true; // 🔁 change to false when backend ready
const dummyTrades: Trade[] = [
  { client: "Client A", symbol: "NIFTY", type: "BUY", qty: "50", price: "₹22,150", time: "now" },
  { client: "Client B", symbol: "BANKNIFTY", type: "SELL", qty: "25", price: "₹48,320", time: "now" },
];
const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
const [trades, setTrades] = useState<Trade[]>([]);
const [limit, setLimit] = useState(10);
const [stats, setStats] = useState(dummyStats);

useEffect(() => {
  const updateLimit = () => {
    setLimit(window.innerWidth < 768 ? 5 : 10);
  };

  updateLimit();
  window.addEventListener("resize", updateLimit);

  return () => window.removeEventListener("resize", updateLimit);
}, []);
useEffect(() => {
  const interval = setInterval(() => {
    setStats((prev) =>
      prev.map((item) => {
        if (item.type === "clients") {
          return {
            ...item,
            value: (Number(item.value) + 1).toString(),
          };
        }

        if (item.type === "orders") {
          return {
            ...item,
            value: (Number(item.value) + 2).toString(),
          };
        }

        if (item.type === "errors") {
          return {
            ...item,
            value: Math.max(0, Number(item.value) - 1).toString(),
          };
        }

        if (item.type === "success") {
          return {
            ...item,
            value: (95 + Math.random() * 5).toFixed(1) + "%",
          };
        }

        return item;
      })
    );
  }, 3000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (USE_DUMMY) {
    setErrorLogs(dummyErrors);
    setTrades(dummyTrades);

    // 🔁 simulate live updates
    const interval = setInterval(() => {
      const newTrade: Trade = {
        client: "Client " + String.fromCharCode(65 + Math.floor(Math.random() * 5)),
        symbol: ["NIFTY", "BANKNIFTY", "RELIANCE"][Math.floor(Math.random() * 3)],
        type: Math.random() > 0.5 ? "BUY" : "SELL",
        qty: (Math.floor(Math.random() * 100) + 1).toString(),
        price: "₹" + (20000 + Math.floor(Math.random() * 5000)).toLocaleString(),
        time: "now",
      };

      const newError: ErrorLog = {
        client: "Client " + String.fromCharCode(65 + Math.floor(Math.random() * 5)),
        message: ["API rejection", "Slippage", "Order failed"][Math.floor(Math.random() * 3)],
        type: ["error", "warning", "success"][Math.floor(Math.random() * 3)] as any,
        time: "now",
      };

   setTrades((prev) => [newTrade, ...prev].slice(0, limit));
setErrorLogs((prev) => [newError, ...prev].slice(0, limit));
    }, 4000);

    return () => clearInterval(interval);
  } else {
    // ✅ BACKEND MODE
    const fetchData = async () => {
      try {
        const [errRes, tradeRes] = await Promise.all([
          api.get("/dashboard/errors/"),
          api.get("/dashboard/trades/"),
        ]);

        setErrorLogs(errRes.data);
        setTrades(tradeRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }
}, []);
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">


      {/* NAVBAR */}
      <ManagementAdminNavbar   />

      {/* MAIN */}
       <main className="p-6 space-y-6 flex-1 flex flex-col min-h-0">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"></div> */}

        {/* HERO */}
        <div className="relative rounded-2xl p-6 border border-border overflow-hidden bg-card">

          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-400/10 to-transparent" />
          <div className="absolute right-10 top-0 w-72 h-72 bg-red-500/10 blur-[120px]" />

          {/* GRAPH */}
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
                Welcome back, Admin!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Here's what's happening with your clients, orders and system.
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}

        {/*
        live stat up date throuch backend <div className="grid md:grid-cols-4 gap-4">
  {loading
    ? Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-xl bg-muted animate-pulse"
        />
      ))
    : stats.map((stat) => (
        <StatCard
          key={stat.type}
          type={stat.type}
          value={stat.value}
          sub={stat.sub}
          danger={stat.danger}
        />
      ))}
</div> */}
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
 {/* ===================== PANELS (ERROR + TRADES) ===================== */}
<div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0">

  {/* ===================== ERROR LOG PANEL ===================== */}
  <div className="rounded-2xl border border-border bg-card p-5 flex flex-col min-h-0 h-[350px]">

    {/* HEADER (clickable later if needed) */}
    <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
      ~ Overall Error Log
    </h3>

    {/* SCROLLABLE CONTENT */}
    <div className="space-y-3 text-sm flex-1 overflow-y-auto scrollbar-hide">

      {/* MAP ERROR LOGS */}
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
          {/* ICON BASED ON TYPE */}
          {log.type === "success" && "✔ "}
          {log.type === "error" && "✖ "}
          {log.type === "warning" && "⚠ "}

          {/* CLIENT + MESSAGE */}
          <span className="truncate">
            {log.client} — {log.message}
          </span>
        </p>
      ))}

    </div>
  </div>

  {/* ===================== TRADE ORDERS PANEL ===================== */}
  <div className="rounded-2xl border border-border bg-card p-5 flex flex-col min-h-0 h-[350px]">

    {/* HEADER */}
    <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
      ↗ Trade Orders
    </h3>
<div className="grid grid-cols-5 text-xs text-muted-foreground px-4 mb-2">
  <span>Client</span>
  <span className="text-center">Type</span>
  <span className="text-center">Qty</span>
  <span className="text-right">Price</span>
  <span></span>
</div>
    {/* SCROLLABLE CONTENT */}
    <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">

      {/* MAP TRADES */}
      {trades.slice(0, limit).map((trade, i) => (
        <TradeRow
          key={i}
          client={trade.client}
          symbol={trade.symbol}
          type={trade.type}
          qty={trade.qty}
          price={trade.price}
        />
      ))}

    </div>
  </div>

</div>
 
        
      </main>

      {/* FOOTER */}
      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border">
        © 2026 GoldenFish • Management Panel
      </footer>
    </div>
  );
}

/* STAT CARD */

function StatCard({ type, value, sub, danger }: any) {
  const config: any = {
    clients: {
      icon: <Users size={18} />,
      color: "bg-red-500/10 text-red-500",
      label: "Total Clients",
    },
    orders: {
      icon: <ShoppingCart size={18} />,
      color: "bg-blue-500/10 text-blue-500",
      label: "Orders Today",
    },
    errors: {
      icon: <AlertTriangle size={18} />,
      color: "bg-yellow-500/10 text-yellow-500",
      label: "Total Errors",
    },
    success: {
      icon: <TrendingUp size={18} />,
      color: "bg-purple-500/10 text-purple-500",
      label: "Success Rate",
    },
  };

  const item = config[type];

  return (
    <div className="rounded-2xl p-4 bg-card border border-border flex items-center gap-4">

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
        {item.icon}
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{item.label}</p>
        <p className={`text-xl font-semibold ${danger ? "text-red-500" : ""}`}>
          {value}
        </p>
        <p className="text-xs text-green-500 mt-1">{sub}</p>
      </div>
    </div>
  );
}

/* TRADE ROW */

function TradeRow({ client, symbol, type, qty, price }: any) {
  return (
    <div className="grid grid-cols-5 items-center px-4 py-3 rounded-xl bg-muted hover:bg-accent transition text-sm">

      {/* CLIENT */}
      <div className="flex flex-col min-w-0">
        <span className="font-semibold truncate">{client}</span>
        <span className="text-xs text-muted-foreground truncate">
          {symbol}
        </span>
      </div>

      {/* TYPE */}
      <div className="text-center">
        <span className={type === "BUY" ? "text-green-500" : "text-red-500"}>
          {type}
        </span>
      </div>

      {/* QTY */}
      <div className="text-center text-muted-foreground truncate">
        {qty}
      </div>

      {/* PRICE */}
      <div className="text-right font-semibold truncate">
        {price}
      </div>

      <div />
    </div>
  );
}