import { useMemo, useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  IndianRupee,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";

import AppLayout from "@/layouts/UserLayout";

import { type Holding } from "../api/getMarketData";

import { useHoldings } from "../hooks/useMarketData";

import Card from "../components/Card";
import ContentTable from "../components/ContentTable";
import TableCard from "../components/TableCard";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PortfolioPage() {
  const [query, setQuery] = useState("");

  const { data: holdingsData } = useHoldings();

  const holdings = useMemo(() => holdingsData?.holdings || [], [holdingsData]);

  const filtered = useMemo(() => {
    return holdings.filter(
      (item) =>
        item.tradingSymbol?.toLowerCase().includes(query.toLowerCase()) ||
        item.isin?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, holdings]);

  const investedValue = holdingsData?.totalInvestment ?? 0;

  const portfolioValue = holdings.reduce(
    (acc, stock) => acc + stock.totalQty * stock.lastTradedPrice,
    0,
  );

  const pnl = portfolioValue - investedValue;

  const pnlPct = investedValue > 0 ? (pnl / investedValue) * 100 : 0;

  const columns = [
    {
      key: "tradingSymbol",
      title: "Stock",

      render: (stock: Holding) => (
        <span className="font-semibold">{stock.tradingSymbol}</span>
      ),
    },

    {
      key: "isin",
      title: "ISIN",

      render: (stock: Holding) => (
        <span className="font-mono text-xs text-muted-foreground">
          {stock.isin}
        </span>
      ),
    },

    {
      key: "totalQty",
      title: "Total Qty",
    },

    {
      key: "dpQty",
      title: "DP Qty",
    },

    {
      key: "t1Qty",
      title: "T1 Qty",
    },

    {
      key: "availableQty",
      title: "Avail Qty",
    },

    {
      key: "avgCostPrice",
      title: "Avg Cost",

      render: (stock: Holding) => (
        <span>{formatCurrency(stock.avgCostPrice)}</span>
      ),
    },

    {
      key: "lastTradedPrice",
      title: "LTP",

      render: (stock: Holding) => (
        <span className="font-semibold">
          {formatCurrency(stock.lastTradedPrice)}
        </span>
      ),
    },

    {
      key: "change",
      title: "Change",

      render: (stock: Holding) => {
        const change =
          stock.avgCostPrice > 0
            ? ((stock.lastTradedPrice - stock.avgCostPrice) /
                stock.avgCostPrice) *
              100
            : 0;

        return (
          <span
            className={`
              inline-flex items-center gap-1
              px-2 py-1 rounded-md
              text-xs font-medium
              ${
                change >= 0
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }
            `}
          >
            {change >= 0 ? (
              <ArrowUpRight size={11} />
            ) : (
              <ArrowDownRight size={11} />
            )}
            {Math.abs(change).toFixed(2)}%
          </span>
        );
      },
    },

    {
      key: "pnl",
      title: "P&L",

      render: (stock: Holding) => {
        const current = stock.totalQty * stock.lastTradedPrice;

        const invested = stock.totalQty * stock.avgCostPrice;

        const stockPnl = current - invested;

        const isProfit = stockPnl >= 0;

        return (
          <div className="flex flex-col">
            <span
              className={`
                font-bold text-sm
                ${isProfit ? "text-green-500" : "text-red-500"}
              `}
            >
              {isProfit ? "+" : ""}

              {formatCurrency(stockPnl)}
            </span>

            <span className="text-xs text-muted-foreground">
              {formatCurrency(current)}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <AppLayout>
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          title="Portfolio Value"
          value={formatCurrency(portfolioValue)}
          change={`${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}% overall`}
          icon={<Wallet size={20} />}
          color="blue"
        />

        <Card
          title="Invested Value"
          value={formatCurrency(investedValue)}
          change="Total invested capital"
          icon={<IndianRupee size={20} />}
          color="purple"
        />

        <Card
          title="Total P&L"
          value={formatCurrency(pnl)}
          change={
            pnl >= 0
              ? `+${formatCurrency(pnl)} profit`
              : `${formatCurrency(pnl)} loss`
          }
          icon={<TrendingUp size={20} />}
          color={pnl >= 0 ? "green" : "orange"}
        />

        <Card
          title="Total Holdings"
          value={String(holdingsData?.totalHoldings ?? 0)}
          change={`${holdingsData?.totalHoldings ?? 0} active holdings`}
          icon={<Briefcase size={20} />}
          color="orange"
        />
      </div>

      {/* TABLE */}
      <TableCard
        title="Your Holdings"
        subtitle="Live market overview of your investments."
        actions={
          <div className="relative w-full lg:w-[280px]">
            <Search
              size={14}
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search symbol or ISIN..."
              className="
                h-10 w-full
                rounded-xl
                border border-border
                bg-background
                pl-9 pr-4
                text-sm
                outline-none
                focus:ring-2
                focus:ring-primary/20
              "
            />
          </div>
        }
      >
        <ContentTable
          columns={columns}
          data={filtered}
          emptyText="No holdings found"
          minWidth="1400px"
        />
      </TableCard>
    </AppLayout>
  );
}
