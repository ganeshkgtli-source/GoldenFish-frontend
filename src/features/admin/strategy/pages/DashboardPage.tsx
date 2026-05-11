import SANavbar from "../components/NavBAr";
import {
  TrendingUp,
  BrainCircuit,
  Activity,
  ShieldCheck,
  AlertTriangle,
  CandlestickChart,
  Cpu,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
// import { useAuthStore } from "@/store/authStore";

/* ───────────────────────────────────────────── */

type Strategy = {
  name: string;
  pnl: string;
  winRate: string;
  trades: number;
  status: "RUNNING" | "STOPPED";
};

type Log = {
  message: string;
  type: "success" | "error" | "warning";
};

/* ───────────────────────────────────────────── */

const INITIAL_STRATEGIES: Strategy[] = [
  {
    name: "BANKNIFTY SCALPER",
    pnl: "+₹12,540",
    winRate: "78%",
    trades: 128,
    status: "RUNNING",
  },
  {
    name: "NIFTY REVERSAL AI",
    pnl: "+₹8,120",
    winRate: "71%",
    trades: 92,
    status: "RUNNING",
  },
  {
    name: "OPTIONS HEDGE PRO",
    pnl: "-₹2,340",
    winRate: "64%",
    trades: 51,
    status: "STOPPED",
  },
];

const INITIAL_LOGS: Log[] = [
  { message: "[09:32:12] BANKNIFTY BUY EXECUTED", type: "success" },
  { message: "[09:32:14] SL MODIFIED", type: "warning" },
  { message: "[09:32:18] API LATENCY 42ms", type: "success" },
  { message: "[09:32:20] ORDER REJECTED", type: "error" },
];

/* ───────────────────────────────────────────── */

export default function SuperAdminDashboardPage() {
//   const user = useAuthStore((s) => s.user);

  const [strategies] = useState<Strategy[]>(INITIAL_STRATEGIES);

  const [logs, setLogs] = useState<Log[]>(INITIAL_LOGS);

  const [livePnl, setLivePnl] = useState(124560);

  /* live simulation */
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePnl((prev) => prev + Math.floor(Math.random() * 4000 - 1000));

      const newLog: Log = {
        message:
          Math.random() > 0.5
            ? `[${new Date().toLocaleTimeString()}] TRADE EXECUTED`
            : `[${new Date().toLocaleTimeString()}] API RESPONSE RECEIVED`,
        type:
          Math.random() > 0.85
            ? "error"
            : Math.random() > 0.65
            ? "warning"
            : "success",
      };

      setLogs((prev) => [newLog, ...prev].slice(0, 20));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ───────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SANavbar />

      <main className="flex-1 p-6 space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-8 shadow-2xl">

          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[140px]" />

          <div className="relative z-10">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  Strategy Control Center
                </h1>

                <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-2xl">
                  Monitor live execution, strategy performance,
                  risk exposure and broker infrastructure in real time.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-6">

                  <StatusPill
                    label="Market Open"
                    color="green"
                  />

                  <StatusPill
                    label="12 Strategies Running"
                    color="cyan"
                  />

                  <StatusPill
                    label="Broker Connected"
                    color="purple"
                  />

                </div>
              </div>

              <div className="hidden xl:flex items-center justify-center">

                <div className="w-44 h-44 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-border flex items-center justify-center backdrop-blur-2xl shadow-[0_0_80px_rgba(34,211,238,0.15)]">

                  <BrainCircuit
                    size={64}
                    className="text-cyan-400"
                  />

                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-10">

              <StatsCard
                title="Live PnL"
                value={`₹${livePnl.toLocaleString()}`}
                sub="+12.4% Today"
                icon={<TrendingUp size={22} />}
                positive
              />

              <StatsCard
                title="Running Strategies"
                value="12"
                sub="2 Added Today"
                icon={<BrainCircuit size={22} />}
              />

              <StatsCard
                title="Execution Rate"
                value="99.2%"
                sub="Stable Infrastructure"
                icon={<Activity size={22} />}
              />

              <StatsCard
                title="Risk Exposure"
                value="34%"
                sub="Within Limits"
                icon={<ShieldCheck size={22} />}
              />

            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* STRATEGIES */}
          <div className="xl:col-span-2 rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-xl p-6">

            <div className="flex items-center justify-between mb-8">

              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CandlestickChart size={20} />
                  Live Strategies
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Real-time strategy execution overview
                </p>
              </div>

              <div className="px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                LIVE
              </div>
            </div>

            <div className="space-y-4">

              {strategies.map((strategy, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center rounded-2xl border border-border bg-muted/20 p-5 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]"
                >

                  <div className="min-w-0">

                    <p className="font-semibold truncate">
                      {strategy.name}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      AI Momentum Strategy
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      PnL
                    </p>

                    <p
                      className={`font-semibold mt-1 ${
                        strategy.pnl.startsWith("+")
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {strategy.pnl}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Win Rate
                    </p>

                    <p className="font-semibold mt-1">
                      {strategy.winRate}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Trades
                    </p>

                    <p className="font-semibold mt-1">
                      {strategy.trades}
                    </p>

                  </div>

                  <div className="flex md:justify-end">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        strategy.status === "RUNNING"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {strategy.status}
                    </span>

                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* SIDE PANELS */}
          <div className="space-y-6">

            {/* API HEALTH */}
            <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-xl p-6">

              <div className="flex items-center gap-2 mb-6">

                <Wifi
                  size={18}
                  className="text-cyan-400"
                />

                <h2 className="text-lg font-semibold">
                  Broker & API Health
                </h2>

              </div>

              <div className="space-y-5">

                <HealthRow
                  label="Dhan API"
                  status="Connected"
                />

                <HealthRow
                  label="Execution Engine"
                  status="Stable"
                />

                <HealthRow
                  label="Websocket"
                  status="Realtime"
                />

                <HealthRow
                  label="Latency"
                  status="42ms"
                />

              </div>
            </div>

            {/* RISK ENGINE */}
            <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-xl p-6">

              <div className="flex items-center gap-2 mb-6">

                <Cpu
                  size={18}
                  className="text-purple-400"
                />

                <h2 className="text-lg font-semibold">
                  Risk Engine
                </h2>

              </div>

              <div className="space-y-5">

                <RiskItem
                  label="Daily Drawdown"
                  value="12%"
                />

                <RiskItem
                  label="Margin Used"
                  value="48%"
                />

                <RiskItem
                  label="Open Exposure"
                  value="₹3.2L"
                />

                <RiskItem
                  label="Max Daily Loss"
                  value="₹50,000"
                />

              </div>
            </div>

          </div>
        </section>

        {/* TERMINAL */}
        <section className="rounded-3xl border border-border bg-card/80 backdrop-blur-xl shadow-xl p-6">

          <div className="flex items-center gap-2 mb-6">

            <AlertTriangle
              size={18}
              className="text-yellow-400"
            />

            <h2 className="text-lg font-semibold">
              Execution Terminal
            </h2>

          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto scrollbar-hide font-mono text-xs">

            {logs.map((log, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3 border ${
                  log.type === "success"
                    ? "border-emerald-500/10 text-emerald-400 bg-emerald-500/5"
                    : log.type === "warning"
                    ? "border-yellow-500/10 text-yellow-400 bg-yellow-500/5"
                    : "border-red-500/10 text-red-400 bg-red-500/5"
                }`}
              >
                {log.message}
              </div>
            ))}

          </div>
        </section>

      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 GoldenFish • Institutional Algo Trading Terminal
      </footer>
    </div>
  );
}

/* ───────────────────────────────────────────── */

function StatsCard({
  title,
  value,
  sub,
  icon,
  positive,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-5 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h3
            className={`text-2xl font-bold mt-2 ${
              positive
                ? "text-emerald-400"
                : "text-foreground"
            }`}
          >
            {value}
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            {sub}
          </p>

        </div>

        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/10">
          {icon}
        </div>

      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */

function StatusPill({
  label,
  color,
}: {
  label: string;
  color: "green" | "cyan" | "purple";
}) {
  const styles = {
    green:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

    cyan:
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",

    purple:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div
      className={`px-4 py-2 rounded-full border text-xs font-medium ${styles[color]}`}
    >
      {label}
    </div>
  );
}

/* ───────────────────────────────────────────── */

function HealthRow({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <div className="flex items-center gap-2">

        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

        <span className="text-sm font-medium text-emerald-400">
          {status}
        </span>

      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */

function RiskItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <div className="flex items-center justify-between mb-2">

        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <span className="text-sm font-semibold">
          {value}
        </span>

      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden">

        <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-primary to-cyan-500" />

      </div>
    </div>
  );
}