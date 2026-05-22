import { useMemo, useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  IndianRupee,
  TrendingUp,
  Wallet,
} from "lucide-react";

 
import type { Column } from "@/components/data-table/types";

import Card from "../components/Card";

import type { Holding } from "../api/getMarketData";

import { useHoldings } from "../hooks/useMarketData";

import CardSkeleton from "@/components/ui/CardSkeleton";
import TableSkeleton from "@/components/ui/TableSkeleton";
import TableCard from "@/components/data-table/TableCard";
import FilterBar from "@/components/data-table/FilterBar";
import DataTable from "@/components/data-table/DataTable";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PortfolioPage() {
  // FILTERS
  const [filters, setFilters] = useState({
    search: "",
    sort: "",
  });

  const {
    data: holdingsData,
    isLoading,
  } = useHoldings();

  const holdings = useMemo(
    () => holdingsData?.holdings || [],
    [holdingsData],
  );

  // FILTER HANDLER
  const handleFilterChange = (
    key: string,
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // RESET
  const handleReset = () => {
    setFilters({
      search: "",
      sort: "",
    });
  };

  // FILTERED DATA
  const filtered = useMemo(() => {
    let data = [...holdings];

    // SEARCH
    if (filters.search.trim()) {
      const query =
        filters.search.toLowerCase();

      data = data.filter(
        (item) =>
          item.tradingSymbol
            ?.toLowerCase()
            .includes(query) ||
          item.isin
            ?.toLowerCase()
            .includes(query),
      );
    }

    // SORT
    switch (filters.sort) {
      case "profit_high":
        data.sort((a, b) => {
          const aPnl =
            a.totalQty *
              a.lastTradedPrice -
            a.totalQty *
              a.avgCostPrice;

          const bPnl =
            b.totalQty *
              b.lastTradedPrice -
            b.totalQty *
              b.avgCostPrice;

          return bPnl - aPnl;
        });

        break;

      case "profit_low":
        data.sort((a, b) => {
          const aPnl =
            a.totalQty *
              a.lastTradedPrice -
            a.totalQty *
              a.avgCostPrice;

          const bPnl =
            b.totalQty *
              b.lastTradedPrice -
            b.totalQty *
              b.avgCostPrice;

          return aPnl - bPnl;
        });

        break;

      case "qty_high":
        data.sort(
          (a, b) =>
            b.totalQty - a.totalQty,
        );

        break;

      case "qty_low":
        data.sort(
          (a, b) =>
            a.totalQty - b.totalQty,
        );

        break;
    }

    return data;
  }, [filters, holdings]);

  // STATS
  const investedValue =
    holdingsData?.totalInvestment ?? 0;

  const portfolioValue =
    holdings.reduce(
      (acc, stock) =>
        acc +
        stock.totalQty *
          stock.lastTradedPrice,
      0,
    );

  const pnl =
    portfolioValue - investedValue;

  const pnlPct =
    investedValue > 0
      ? (pnl / investedValue) * 100
      : 0;

  // TABLE COLUMNS
  const columns: Column<Holding>[] = [
    {
      key: "tradingSymbol",
      title: "Stock",

      render: (stock) => (
        <span className="font-semibold">
          {stock.tradingSymbol}
        </span>
      ),
    },

    {
      key: "isin",
      title: "ISIN",

      render: (stock) => (
        <span
          className="
            font-mono
            text-xs
            text-muted-foreground
          "
        >
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

      render: (stock) => (
        <span>
          {formatCurrency(
            stock.avgCostPrice,
          )}
        </span>
      ),
    },

    {
      key: "lastTradedPrice",
      title: "LTP",

      render: (stock) => (
        <span className="font-semibold">
          {formatCurrency(
            stock.lastTradedPrice,
          )}
        </span>
      ),
    },

    {
      key: "change",
      title: "Change",

      render: (stock) => {
        const change =
          stock.avgCostPrice > 0
            ? ((stock.lastTradedPrice -
                stock.avgCostPrice) /
                stock.avgCostPrice) *
              100
            : 0;

        return (
          <span
            className={`
              inline-flex
              items-center gap-1

              rounded-md

              px-2 py-1

              text-xs
              font-medium

              ${
                change >= 0
                  ? `
                    bg-green-500/20
                    text-green-500
                  `
                  : `
                    bg-red-500/20
                    text-red-500
                  `
              }
            `}
          >
            {change >= 0 ? (
              <ArrowUpRight
                size={11}
              />
            ) : (
              <ArrowDownRight
                size={11}
              />
            )}

            {Math.abs(change).toFixed(
              2,
            )}
            %
          </span>
        );
      },
    },

    {
      key: "pnl",
      title: "P&L",

      render: (stock) => {
        const current =
          stock.totalQty *
          stock.lastTradedPrice;

        const invested =
          stock.totalQty *
          stock.avgCostPrice;

        const stockPnl =
          current - invested;

        const isProfit =
          stockPnl >= 0;

        return (
          <div className="flex flex-col">
            <span
              className={`
                text-sm
                font-bold

                ${
                  isProfit
                    ? "text-green-500"
                    : "text-red-500"
                }
              `}
            >
              {isProfit ? "+" : ""}

              {formatCurrency(
                stockPnl,
              )}
            </span>

            <span
              className="
                text-xs
                text-muted-foreground
              "
            >
              {formatCurrency(current)}
            </span>
          </div>
        );
      },
    },
  ];

  // LOADING
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* TOP CARDS */}
        <div
          className="
            grid grid-cols-1 gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {[...Array(4)].map(
            (_, i) => (
              <CardSkeleton key={i} />
            ),
          )}
        </div>

        {/* TABLE */}
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <>
      {/* STATS */}
      <div
        className="
          grid grid-cols-1 gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <Card
          title="Portfolio Value"
          value={formatCurrency(
            portfolioValue,
          )}
          change={`${
            pnlPct >= 0 ? "+" : ""
          }${pnlPct.toFixed(
            2,
          )}% overall`}
          icon={<Wallet size={20} />}
          color="blue"
        />

        <Card
          title="Invested Value"
          value={formatCurrency(
            investedValue,
          )}
          change="Total invested capital"
          icon={
            <IndianRupee size={20} />
          }
          color="purple"
        />

        <Card
          title="Total P&L"
          value={formatCurrency(pnl)}
          change={
            pnl >= 0
              ? `+${formatCurrency(
                  pnl,
                )} profit`
              : `${formatCurrency(
                  pnl,
                )} loss`
          }
          icon={
            <TrendingUp size={20} />
          }
          color={
            pnl >= 0
              ? "green"
              : "orange"
          }
        />

        <Card
          title="Total Holdings"
          value={String(
            holdingsData?.totalHoldings ??
              0,
          )}
          change={`${
            holdingsData?.totalHoldings ??
            0
          } active holdings`}
          icon={
            <Briefcase size={20} />
          }
          color="orange"
        />
      </div>

      {/* TABLE */}
     {/* TABLE */}
<TableCard
  title="Your Holdings"
  subtitle="Live market overview of your investments."
  headerActions={
    <FilterBar
      values={filters}
      onChange={handleFilterChange}
      onReset={handleReset}
      filters={[
        {
          type: "search",
          key: "search",
          placeholder:
            "Search symbol or ISIN...",
        },

        {
          type: "sort",
          key: "sort",
          options: [
            {
              label:
                "Highest Profit",
              value:
                "profit_high",
            },

            {
              label:
                "Lowest Profit",
              value:
                "profit_low",
            },

            {
              label:
                "Highest Qty",
              value: "qty_high",
            },

            {
              label:
                "Lowest Qty",
              value: "qty_low",
            },
          ],
        },

        {
          type: "reset",
          key: "reset",
        },
      ]}
    />
  }
>
  {/* TABLE */}
  <DataTable
    columns={columns}
    data={filtered}
    emptyText="No holdings found"
    minWidth="1400px"
  />
</TableCard>
    </>
  );
}