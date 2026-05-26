import { useMemo, useState } from "react";

import { Link, useParams } from "@tanstack/react-router";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type { Column } from "@/components/data-table/types";

import { useTradesSocket } from "@/websocket/hooks/useTradesSocket";

import { useRealtimeStore } from "@/websocket/store/realtimeStore";

import type { Trade } from "@/websocket/types/trade.types";

type TradeRow = {
  clientId: string;

  tradeId: string;

  date: string;

  symbol: string;

  exchange: string;

  type: string;

  status: string;

  expiry: string;

  entryTime: string;

  entryPrice: number;

  exitTime: string;

  exitPrice: number;

  pnlLot: number;

  totalPnl: number;

  ltp: number;

  spot: number;

  strike: number;
};

export default function TradeTable() {
  /**
   * ROUTE PARAM
   */
  const { id } = useParams({
    from: "/admin/client/$id",
  });

  /**
   * START SOCKET
   */
  useTradesSocket("client", id);

  /**
   * STORE
   */
  const realtimeTrades = useRealtimeStore((state) => state.trades);

  /**
   * FILTERS
   */
  const [filters, setFilters] = useState({
    search: "",

    status: "ALL",

    fromDate: "",

    toDate: "",
  });

  /**
   * PAGINATION
   */
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  /**
   * FILTER CHANGE
   */
  const handleFilterChange = (key: string, value: string) => {
    setPage(1);

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * RESET
   */
  const handleReset = () => {
    setPage(1);

    setFilters({
      search: "",

      status: "ALL",

      fromDate: "",

      toDate: "",
    });
  };

  /**
   * ADAPT TRADES
   */
  const adaptedTrades = useMemo<TradeRow[]>(() => {
    return realtimeTrades
      .map((t: Trade) => ({
        clientId: String(t.user_id),

        tradeId: String(t.id),

        date: new Date(t.created_at).toLocaleString(),

        symbol: t.symbol,

        exchange: t.exchange,

        type: t.type,

        status: t.status,

        expiry: t.expiry,

        entryTime: t.entryTime,

        entryPrice: t.entryPrice,

        exitTime: t.exitTime || "--",

        exitPrice: t.exitPrice || 0,

        pnlLot: t.pnlLot,

        totalPnl: t.totalPnl,

        ltp: t.ltp,

        spot: t.spot,

        strike: t.strike,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [realtimeTrades]);

  /**
   * FILTERED DATA
   */
  const filteredData = useMemo(() => {
    let trades = [...adaptedTrades];

    /**
     * STATUS
     */
    if (filters.status !== "ALL" && filters.status !== "") {
      trades = trades.filter((t) => t.status === filters.status);
    }

    /**
     * SEARCH
     */
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();

      trades = trades.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query) ||
          t.exchange.toLowerCase().includes(query) ||
          t.tradeId.toLowerCase().includes(query),
      );
    }

    /**
     * FROM DATE
     */
    if (filters.fromDate) {
      const from = new Date(filters.fromDate);

      trades = trades.filter((t) => new Date(t.date) >= from);
    }

    /**
     * TO DATE
     */
    if (filters.toDate) {
      const to = new Date(filters.toDate);

      to.setHours(23, 59, 59, 999);

      trades = trades.filter((t) => new Date(t.date) <= to);
    }

    return trades;
  }, [adaptedTrades, filters]);

  /**
   * PAGINATION
   */
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginatedData = filteredData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  /**
   * COLUMNS
   */
  const columns: Column<TradeRow>[] = [
    {
      key: "date",

      title: "Time",

      render: (t) => <div className="whitespace-nowrap">{t.date}</div>,
    },

    {
      key: "clientId",

      title: "Client",

      render: (t) => (
        <Link
          to="/admin/client/$id"
          params={{
            id: t.clientId,
          }}
          search={{
            tab: "trades",
          }}
          className="
              text-primary
              font-semibold
              hover:underline
            "
        >
          Client {t.clientId}
        </Link>
      ),
    },

    {
      key: "tradeId",

      title: "Trade ID",

      render: (t) => <span className="font-medium">#{t.tradeId}</span>,
    },

    {
      key: "symbol",

      title: "Symbol",
    },

    {
      key: "exchange",

      title: "Exchange",
    },

    {
      key: "type",

      title: "Type",

      render: (t) => (
        <span
          className={
            t.type === "BUY"
              ? "text-green-500 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {t.type}
        </span>
      ),
    },

    {
      key: "status",

      title: "Status",

      render: (t) => (
        <span
          className={`
              rounded-md
              px-2 py-1
              text-xs
              font-semibold

              ${
                t.status === "OPEN"
                  ? `
                    bg-green-500/10
                    text-green-500
                  `
                  : `
                    bg-gray-500/10
                    text-gray-400
                  `
              }
            `}
        >
          {t.status}
        </span>
      ),
    },

    {
      key: "entryPrice",

      title: "Entry",

      render: (t) => <span>₹{t.entryPrice}</span>,
    },

    {
      key: "exitPrice",

      title: "Exit",

      render: (t) => <span>₹{t.exitPrice}</span>,
    },

    {
      key: "quantity",

      title: "LTP",

      render: (t) => <span>₹{t.ltp}</span>,
    },

    {
      key: "totalPnl",

      title: "P&L",

      render: (t) => (
        <span
          className={
            Number(t.totalPnl) >= 0 ? "text-green-500" : "text-red-500"
          }
        >
          ₹{t.totalPnl}
        </span>
      ),
    },
  ];

  return (
    <TableCard
      title="Live Trades"
      subtitle="Realtime websocket trades"
      headerActions={
        <FilterBar
          values={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          filters={[
            {
              type: "search",

              key: "search",

              placeholder: "Search trades...",
            },

            {
              type: "select",

              key: "status",

              placeholder: "Status",

              options: [
                {
                  label: "All",

                  value: "ALL",
                },

                {
                  label: "Open",

                  value: "OPEN",
                },

                {
                  label: "Closed",

                  value: "CLOSED",
                },
              ],
            },

            {
              type: "date-range",

              key: "dateRange",
            },

            {
              type: "reset",

              key: "reset",
            },
          ]}
        />
      }
    >
      <DataTable
        columns={columns}
        data={paginatedData}
        emptyText="Waiting for live websocket trades..."
        minWidth="1600px"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={filteredData.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </TableCard>
  );
}
