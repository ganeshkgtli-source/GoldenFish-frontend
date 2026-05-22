import { useMemo, useState } from "react";

import TableSkeleton from "@/components/ui/TableSkeleton";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type { Column } from "@/components/data-table/types";

import type { Trade } from "../../api/getMarketData";

import { useTrades } from "../../hooks/useMarketData";

export default function TradeBook() {
  // =========================================
  // FILTERS
  // =========================================

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    fromDate: "",
    toDate: "",
  });

  // =========================================
  // PAGINATION
  // =========================================

  const [page, setPage] = useState(1);

  const PAGE_SIZE = 9;

  // =========================================
  // API
  // =========================================

  const { data: tradesData, isLoading, error } = useTrades();

  // =========================================
  // FILTER CHANGE
  // =========================================

  const handleFilterChange = (key: string, value: string) => {
    setPage(1);

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================================
  // RESET
  // =========================================

  const handleReset = () => {
    setPage(1);

    setFilters({
      search: "",
      type: "",
      fromDate: "",
      toDate: "",
    });
  };

  // =========================================
  // QUICK RANGE
  // =========================================

  const handleQuickRange = (days: number) => {
    const today = new Date();

    const from = new Date();

    from.setDate(today.getDate() - days);

    setFilters((prev) => ({
      ...prev,

      fromDate: from.toISOString().split("T")[0],

      toDate: today.toISOString().split("T")[0],
    }));
  };

  // =========================================
  // FILTERED DATA
  // =========================================

  const filteredTrades = useMemo(() => {
    let trades = tradesData || [];

    // SEARCH
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();

      trades = trades.filter(
        (trade) =>
          trade.tradingSymbol?.toLowerCase().includes(query) ||
          trade.orderId?.toString().includes(query) ||
          trade.exchangeTradeId?.toLowerCase().includes(query),
      );
    }

    // TYPE FILTER
    if (filters.type) {
      trades = trades.filter((trade) => trade.transactionType === filters.type);
    }

    // DATE FILTER
    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);

      const to = new Date(filters.toDate);

      trades = trades.filter((trade) => {
        const tradeDate = new Date(trade.exchangeTime);

        return tradeDate >= from && tradeDate <= to;
      });
    }

    return trades;
  }, [filters, tradesData]);

  // =========================================
  // PAGINATION
  // =========================================

  const totalPages = Math.ceil(filteredTrades.length / PAGE_SIZE);

  const paginatedTrades = filteredTrades.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // =========================================
  // COLUMNS
  // =========================================

  const columns: Column<Trade>[] = [
    {
      key: "orderId",
      title: "Order ID",

      render: (trade) => <span className="font-medium">#{trade.orderId}</span>,
    },

    {
      key: "exchangeOrderId",
      title: "Exchange Order",
    },

    {
      key: "exchangeTradeId",
      title: "Trade ID",
    },

    {
      key: "transactionType",
      title: "Type",

      render: (trade) => (
        <span
          className={`
              rounded-md

              px-2 py-1

              text-xs
              font-medium

              ${
                trade.transactionType === "BUY"
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
          {trade.transactionType}
        </span>
      ),
    },

    {
      key: "exchangeSegment",
      title: "Exchange",
    },

    {
      key: "productType",
      title: "Product",
    },

    {
      key: "orderType",
      title: "Order Type",
    },

    {
      key: "tradingSymbol",
      title: "Stock",

      render: (trade) => (
        <span className="font-medium">{trade.tradingSymbol}</span>
      ),
    },

    {
      key: "tradedQuantity",
      title: "Qty",
    },

    {
      key: "tradedPrice",
      title: "Trade Price",

      render: (trade) => <span>₹{trade.tradedPrice}</span>,
    },

    {
      key: "exchangeTime",
      title: "Exchange Time",

      render: (trade) => (
        <span>{new Date(trade.exchangeTime).toLocaleString()}</span>
      ),
    },
  ];

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return <TableSkeleton />;
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div
        className="
          rounded-2xl

          border border-red-500/20

          bg-red-500/5

          p-6
        "
      >
        <p
          className="
            text-sm
            font-medium
            text-red-500
          "
        >
          Failed to load trades
        </p>

        <p
          className="
            mt-2
            text-xs
            text-muted-foreground
          "
        >
          Please try again later.
        </p>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <TableCard
      title="Trade Book"
      subtitle="View all executed trades"
      headerActions={
        <FilterBar
          values={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          onQuickRange={handleQuickRange}
          filters={[
            {
              type: "search",
              key: "search",
              placeholder: "Search trades...",
            },

            {
  type: "select",
  key: "type",
  placeholder: "All",
  options: [
    
    {
      label: "BUY",
      value: "BUY",
    },

    {
      label: "SELL",
      value: "SELL",
    },
  ],
},

            // {
            //   type: "date-range",
            //   key: "date",
            // },

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
        data={paginatedTrades}
        emptyText="No trades found"
        minWidth="1400px"
      />

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={filteredTrades.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </TableCard>
  );
}
