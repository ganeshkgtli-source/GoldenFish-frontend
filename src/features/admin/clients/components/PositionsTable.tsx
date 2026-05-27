import { useMemo, useState } from "react";

import { useParams } from "@tanstack/react-router";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type { Column } from "@/components/data-table/types";

import { usePositionsSocket } from "@/websocket/hooks/usePositions";

import { useRealtimeStore } from "@/websocket/store/realtimeStore";

import type { Position } from "@/websocket/types/position.types";

type PositionRow = {
  positionId: string;

  symbol: string;

  exchange: string;

  productType: string;

  positionType: string;

  quantity: number;

  avgPrice: number;

  sellAvg: number;

  buyAvg: number;

  realizedPnl: number;

  unrealizedPnl: number;

  totalPnl: number;

  netQty: number;

  securityId: string;

  createdAt: string;
};

export default function PositionsTable() {
  /**
   * ROUTE PARAM
   */
  const { id } = useParams({
    from: "/admin/client/$id",
  });

  /**
   * START SOCKET
   */
  usePositionsSocket("client", id);

  /**
   * STORE
   */
  const realtimePositions = useRealtimeStore((state) => state.positions);

  /**
   * FILTERS
   */
  const [filters, setFilters] = useState({
    search: "",

    type: "ALL",

    fromDate: "",

    toDate: "",
  });

  /**
   * PAGINATION
   */
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 15;

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

      type: "ALL",

      fromDate: "",

      toDate: "",
    });
  };

  /**
   * ADAPT POSITIONS
   */
  const adaptedPositions = useMemo<PositionRow[]>(() => {
    return realtimePositions
      .map((p: Position) => {
        const realized = Number(p.realizedProfit);

        const unrealized = Number(p.unrealizedProfit);

        return {
          positionId: String(p.id),

          symbol: p.tradingSymbol,

          exchange: p.exchangeSegment,

          productType: p.productType,

          positionType: p.positionType,

          quantity: p.netQty,

          avgPrice: Number(p.costPrice),

          buyAvg: Number(p.buyAvg),

          sellAvg: Number(p.sellAvg),

          realizedPnl: realized,

          unrealizedPnl: unrealized,

          totalPnl: realized + unrealized,

          netQty: p.netQty,

          securityId: p.securityId,

          createdAt: new Date(p.created_at).toLocaleString(),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [realtimePositions]);

  /**
   * FILTERED DATA
   */
  const filteredData = useMemo(() => {
    let positions = [...adaptedPositions];

    /**
     * TYPE
     */
    if (filters.type !== "ALL" && filters.type !== "") {
      positions = positions.filter((p) => p.positionType === filters.type);
    }

    /**
     * SEARCH
     */
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();

      positions = positions.filter(
        (p) =>
          p.symbol.toLowerCase().includes(query) ||
          p.exchange.toLowerCase().includes(query) ||
          p.securityId.toLowerCase().includes(query),
      );
    }

    return positions;
  }, [adaptedPositions, filters]);

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
  const columns: Column<PositionRow>[] = [
    {
      key: "createdAt",

      title: "Time",
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
      key: "positionType",

      title: "Position",

      render: (p) => (
        <span
          className={
            p.positionType === "LONG"
              ? "text-green-500 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {p.positionType}
        </span>
      ),
    },

    {
      key: "productType",

      title: "Product",
    },

    {
      key: "quantity",

      title: "Net Qty",
    },

    {
      key: "avgPrice",

      title: "Avg Price",

      render: (p) => <span>₹{p.avgPrice}</span>,
    },

    {
      key: "buyAvg",

      title: "Buy Avg",

      render: (p) => <span>₹{p.buyAvg}</span>,
    },

    {
      key: "sellAvg",

      title: "Sell Avg",

      render: (p) => <span>₹{p.sellAvg}</span>,
    },

    {
      key: "realizedPnl",

      title: "Realized",

      render: (p) => (
        <span
          className={p.realizedPnl >= 0 ? "text-green-500" : "text-red-500"}
        >
          ₹{p.realizedPnl.toFixed(2)}
        </span>
      ),
    },

    {
      key: "unrealizedPnl",

      title: "Unrealized",

      render: (p) => (
        <span
          className={p.unrealizedPnl >= 0 ? "text-green-500" : "text-red-500"}
        >
          ₹{p.unrealizedPnl.toFixed(2)}
        </span>
      ),
    },

    {
      key: "totalPnl",

      title: "Total P&L",

      render: (p) => (
        <span
          className={
            p.totalPnl >= 0
              ? "text-green-500 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          ₹{p.totalPnl.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <TableCard
      title="Live Positions"
      subtitle="Realtime websocket positions"
      headerActions={
        <FilterBar
          values={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          filters={[
            {
              type: "search",

              key: "search",

              placeholder: "Search positions...",
            },

            {
              type: "select",

              key: "type",

              placeholder: "Position Type",

              options: [
                {
                  label: "All",

                  value: "ALL",
                },

                {
                  label: "LONG",

                  value: "LONG",
                },

                {
                  label: "SHORT",

                  value: "SHORT",
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
      <DataTable
        columns={columns}
        data={paginatedData}
        emptyText="Waiting for live websocket positions..."
        minWidth="1800px"
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
