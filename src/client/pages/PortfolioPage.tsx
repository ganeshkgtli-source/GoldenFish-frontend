import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
//   BarChart3,
  Briefcase,
//   ChevronRight,
//   Clock3,
  IndianRupee,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Navbar from "../components/NavBar";
import MarketClock from "../components/MarketClock";
import WatchlistSidebar from "../components/WatchlistSidebar";
import SectorPerformance from "../components/SectorPerformance";
import Footer from "../components/Footer";

const holdingsData = [
  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    qty: 12,
    avg: 2480,
    ltp: 2894.55,
    change: 3.42,
  },
  {
    symbol: "TCS",
    company: "Tata Consultancy Services",
    qty: 8,
    avg: 3540,
    ltp: 3688.2,
    change: 1.25,
  },
  {
    symbol: "INFY",
    company: "Infosys Ltd",
    qty: 20,
    avg: 1410,
    ltp: 1388.45,
    change: -0.92,
  },
  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    qty: 16,
    avg: 1565,
    ltp: 1622.3,
    change: 2.11,
  },
  {
    symbol: "ITC",
    company: "ITC Ltd",
    qty: 40,
    avg: 432,
    ltp: 446.5,
    change: 0.74,
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
    <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-foreground">
            {value}
          </h3>

          {change && (
            <p className="mt-2 text-sm text-emerald-500 font-medium">
              {change}
            </p>
          )}
        </div>

        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return holdingsData.filter(
      (item) =>
        item.symbol.toLowerCase().includes(query.toLowerCase()) ||
        item.company.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const portfolioValue = holdingsData.reduce(
    (acc, stock) => acc + stock.qty * stock.ltp,
    0
  );

  const investedValue = holdingsData.reduce(
    (acc, stock) => acc + stock.qty * stock.avg,
    0
  );

  const pnl = portfolioValue - investedValue;
  const pnlPct = (pnl / investedValue) * 100;

return (
  <div className="min-h-screen bg-background text-foreground flex flex-col">
  <Navbar />

  <main className="flex-1 flex overflow-hidden">

    {/* LEFT SIDEBAR */}
        <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 bg-background border-b lg:border-b-0 lg:border-r border-border">
              
              <div className="w-full p-4 flex flex-col gap-4 overflow-y-auto">
    <div  >
          <MarketClock />
        </div>
                <div className="p-2">
                  <WatchlistSidebar />
                </div>
     
    
                <div className="p-2">
                  <SectorPerformance />
                </div>
    
              </div>
            </aside>

    {/* CONTENT */}
    <section className="flex-1 overflow-y-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8  space-y-3">

        {/* MOBILE SIDEBAR */}
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
            title="Portfolio Value"
            value={formatCurrency(portfolioValue)}
            change={`+${pnlPct.toFixed(2)}% overall`}
            icon={<Wallet size={20} />}
          />

          <StatCard
            title="Invested"
            value={formatCurrency(investedValue)}
            icon={<IndianRupee size={20} />}
          />

          <StatCard
            title="Total P&L"
            value={formatCurrency(pnl)}
            change={pnl >= 0 ? "Profit" : "Loss"}
            icon={<TrendingUp size={20} />}
          />

          <StatCard
            title="Holdings"
            value={String(holdingsData.length)}
            icon={<Briefcase size={20} />}
          />

        </div>

        {/* HOLDINGS */}
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl overflow-hidden">

          {/* TOP */}
          <div className="px-5 py-5 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Your Holdings
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Live market overview of your investments.
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
                placeholder="Search holdings..."
                className=" wizard-input pl-9 w-full"
              />

            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-4 font-medium">Stock</th>
                  <th className="px-5 py-4 font-medium">Qty</th>
                  <th className="px-5 py-4 font-medium">Avg Price</th>
                  <th className="px-5 py-4 font-medium">LTP</th>
                  <th className="px-5 py-4 font-medium">Change</th>
                  <th className="px-5 py-4 font-medium text-right">P&L</th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((stock) => {
                  const current = stock.qty * stock.ltp;
                  const invested = stock.qty * stock.avg;
                  const stockPnl = current - invested;
                  const isProfit = stockPnl >= 0;

                  return (
                    <tr
                      key={stock.symbol}
                      className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                    >

                      {/* STOCK */}
                      <td className="px-5 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {stock.symbol.slice(0, 2)}
                          </div>

                          <div>
                            <p className="font-semibold text-sm">
                              {stock.symbol}
                            </p>

                            <p className="text-xs text-muted-foreground mt-1">
                              {stock.company}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* QTY */}
                      <td className="px-5 py-5 text-sm font-semibold">
                        {stock.qty}
                      </td>

                      {/* AVG */}
                      <td className="px-5 py-5 text-sm">
                        {formatCurrency(stock.avg)}
                      </td>

                      {/* LTP */}
                      <td className="px-5 py-5 text-sm font-semibold">
                        {formatCurrency(stock.ltp)}
                      </td>

                      {/* CHANGE */}
                      <td className="px-5 py-5">

                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            stock.change >= 0
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          )}

                          {Math.abs(stock.change)}%
                        </div>

                      </td>

                      {/* PNL */}
                      <td className="px-5 py-5 text-right">

                        <div>

                          <p
                            className={`text-base font-bold ${
                              isProfit
                                ? "text-emerald-500"
                                : "text-red-500"
                            }`}
                          >
                            {isProfit ? "+" : ""}
                            {formatCurrency(stockPnl)}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            Current: {formatCurrency(current)}
                          </p>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  </main>
  <Footer></Footer>
</div>
);
}
