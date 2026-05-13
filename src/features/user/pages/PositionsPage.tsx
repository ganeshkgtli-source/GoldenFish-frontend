import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Clock3,
  IndianRupee,
  Search,
  TrendingUp,
  Wallet,
  BarChart3,
} from "lucide-react";
import MarketClock from "../components/MarketClock";
import WatchlistSidebar from "../components/WatchlistSidebar";
import SectorPerformance from "../components/SectorPerformance";
import Navbar from "../components/NavBar";
 
 

const positionsData = [
  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    qty: 10,
    avg: 2480,
    ltp: 2894.55,
    pnl: 4145.5,
    change: 3.42,
    type: "LONG",
  },
  {
    symbol: "TCS",
    company: "Tata Consultancy Services",
    qty: 5,
    avg: 3540,
    ltp: 3420.2,
    pnl: -599,
    change: -1.24,
    type: "SHORT",
  },
  {
    symbol: "INFY",
    company: "Infosys Ltd",
    qty: 15,
    avg: 1410,
    ltp: 1488.45,
    pnl: 1176.75,
    change: 2.12,
    type: "LONG",
  },
  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    qty: 8,
    avg: 1565,
    ltp: 1622.3,
    pnl: 458.4,
    change: 1.11,
    type: "LONG",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            {value}
          </h3>

          {change && (
            <p className="mt-2 text-sm font-medium text-emerald-500">
              {change}
            </p>
          )}
        </div>

        <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function PositionsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return positionsData.filter(
      (item) =>
        item.symbol.toLowerCase().includes(query.toLowerCase()) ||
        item.company.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const totalPnl = positionsData.reduce((acc, p) => acc + p.pnl, 0);

  const totalValue = positionsData.reduce(
    (acc, p) => acc + p.qty * p.ltp,
    0
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 flex overflow-hidden">

        {/* SIDEBAR */}
        <aside className="hidden lg:block w-[320px] xl:w-[360px] shrink-0 border-r border-border bg-background">
  
  <div className="sticky top-0 h-screen p-4 flex flex-col gap-4">
    
    <div className="flex-none">
      <MarketClock />
    </div>

    <div className="flex-none p-2">
      <WatchlistSidebar />
    </div>

    <div className="flex-none p-2">
      <SectorPerformance />
    </div>

  </div>
</aside>

        {/* CONTENT */}
        <section className="flex-1 overflow-y-auto">
          <div className="w-full px-4 sm:px-6 lg:px-8   space-y-3">

            {/* MOBILE */}
            <div className="xl:hidden space-y-4">

              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-4">
                <MarketClock />
              </div>

              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl overflow-hidden">
                <WatchlistSidebar />
              </div>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">

              <StatCard
                title="Open Positions"
                value={String(positionsData.length)}
                icon={<Briefcase size={20} />}
              />

              <StatCard
                title="Position Value"
                value={formatCurrency(totalValue)}
                icon={<Wallet size={20} />}
              />

              <StatCard
                title="Total P&L"
                value={formatCurrency(totalPnl)}
                change={totalPnl >= 0 ? "Overall Profit" : "Overall Loss"}
                icon={<TrendingUp size={20} />}
              />

              <StatCard
                title="Margin Used"
                value="₹48,500"
                change="+2.1% today"
                icon={<IndianRupee size={20} />}
              />

            </div>

            {/* POSITIONS */}
            <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl overflow-hidden">

              {/* HEADER */}
              <div className="px-5 py-5 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Open Positions
                  </h2>

                  <p className="text-sm text-muted-foreground mt-1">
                    Monitor your active trades and P&L.
                  </p>
                </div>

                <div className="relative w-full lg:w-[320px]">

                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search positions..."
                    className="w-full h-12 rounded-2xl border border-border bg-muted/40 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />

                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-4 font-medium">Stock</th>
                      <th className="px-5 py-4 font-medium">Type</th>
                      <th className="px-5 py-4 font-medium">Qty</th>
                      <th className="px-5 py-4 font-medium">Avg</th>
                      <th className="px-5 py-4 font-medium">LTP</th>
                      <th className="px-5 py-4 font-medium">Change</th>
                      <th className="px-5 py-4 font-medium text-right">P&L</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filtered.map((position) => {
                      const isProfit = position.pnl >= 0;

                      return (
                        <tr
                          key={position.symbol}
                          className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                        >

                          {/* STOCK */}
                          <td className="px-5 py-5">

                            <div className="flex items-center gap-4">

                              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                {position.symbol.slice(0, 2)}
                              </div>

                              <div>
                                <p className="font-semibold text-sm">
                                  {position.symbol}
                                </p>

                                <p className="text-xs text-muted-foreground mt-1">
                                  {position.company}
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* TYPE */}
                          <td className="px-5 py-5">

                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                position.type === "LONG"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {position.type}
                            </span>

                          </td>

                          {/* QTY */}
                          <td className="px-5 py-5 text-sm font-semibold">
                            {position.qty}
                          </td>

                          {/* AVG */}
                          <td className="px-5 py-5 text-sm">
                            {formatCurrency(position.avg)}
                          </td>

                          {/* LTP */}
                          <td className="px-5 py-5 text-sm font-semibold">
                            {formatCurrency(position.ltp)}
                          </td>

                          {/* CHANGE */}
                          <td className="px-5 py-5">

                            <div
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                position.change >= 0
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {position.change >= 0 ? (
                                <ArrowUpRight size={12} />
                              ) : (
                                <ArrowDownRight size={12} />
                              )}

                              {Math.abs(position.change)}%
                            </div>

                          </td>

                          {/* PNL */}
                          <td className="px-5 py-5 text-right">

                            <p
                              className={`text-base font-bold ${
                                isProfit
                                  ? "text-emerald-500"
                                  : "text-red-500"
                              }`}
                            >
                              {isProfit ? "+" : ""}
                              {formatCurrency(position.pnl)}
                            </p>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>
                </table>

              </div>
            </div>

            {/* BOTTOM */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ANALYTICS */}
              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-lg font-semibold">
                      Position Analytics
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Trading performance insights
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <BarChart3 size={20} />
                  </div>

                </div>

                <div className="mt-6 space-y-5">

                  {[
                    {
                      label: "Win Rate",
                      value: "74%",
                      pct: "74%",
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Profit Ratio",
                      value: "58%",
                      pct: "58%",
                      color: "bg-blue-500",
                    },
                    {
                      label: "Risk Level",
                      value: "Moderate",
                      pct: "42%",
                      color: "bg-yellow-500",
                    },
                  ].map((item) => (
                    <div key={item.label}>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {item.label}
                        </span>

                        <span className="text-sm font-semibold">
                          {item.value}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`${item.color} h-full rounded-full`}
                          style={{ width: item.pct }}
                        />
                      </div>

                    </div>
                  ))}

                </div>
              </div>

              {/* RECENT */}
              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-lg font-semibold">
                      Recent Trades
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Latest executed positions
                    </p>
                  </div>

                  <Clock3 size={20} className="text-muted-foreground" />

                </div>

                <div className="mt-6 space-y-5">

                  {[
                    {
                      action: "BUY RELIANCE",
                      date: "Today • 10:32 AM",
                      amount: "+₹18,540",
                      positive: true,
                    },
                    {
                      action: "SELL TCS",
                      date: "Yesterday • 3:12 PM",
                      amount: "-₹9,200",
                      positive: false,
                    },
                    {
                      action: "BUY INFY",
                      date: "2 days ago",
                      amount: "+₹11,500",
                      positive: true,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-4"
                    >

                      <div className="flex gap-3">

                        <div
                          className={`mt-1 w-2.5 h-2.5 rounded-full ${
                            item.positive
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />

                        <div>
                          <p className="text-sm font-medium">
                            {item.action}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            {item.date}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`text-sm font-semibold ${
                          item.positive
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.amount}
                      </span>

                    </div>
                  ))}

                </div>
              </div>

            </div>

          </div>
        </section>
      </main>
    </div>
  );
}