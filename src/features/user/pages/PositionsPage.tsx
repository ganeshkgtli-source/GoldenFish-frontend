import { useMemo, useState } from "react";

import {
  Briefcase,
  IndianRupee,
  TrendingUp,
  Wallet,
} from "lucide-react";

import Card from "../components/Card";

import CardSkeleton from "@/components/ui/CardSkeleton";
import TableSkeleton from "@/components/ui/TableSkeleton";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type { Column } from "@/components/data-table/types";

import { useOpenPositions } from "../hooks/useMarketData";

import type {
  OpenPosition,
} from "../api/getMarketData";

export default function PositionsPage() {
  const PAGE_SIZE = 10;

  const [page, setPage] =
    useState(1);

  const [filters, setFilters] =
    useState({
      search: "",
    });

  const {
    data,
    isLoading,
    error,
  } = useOpenPositions();

const positions = useMemo(
  () => data?.openPositions ?? [],
  [data?.openPositions],
);
  const filteredPositions =
    useMemo(() => {
      let rows = [...positions];

      if (
        filters.search.trim()
      ) {
        const query =
          filters.search.toLowerCase();

        rows = rows.filter(
          (position) =>
            position.tradingSymbol
              ?.toLowerCase()
              .includes(query) ||
            position.securityId
              ?.toString()
              .includes(query),
        );
      }

      return rows;
    }, [positions, filters]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredPositions.length /
          PAGE_SIZE,
      ),
    );

  const paginatedPositions =
    filteredPositions.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE,
    );

  const realizedPnL =
    positions.reduce(
      (sum, position) =>
        sum +
        position.realizedProfit,
      0,
    );

  const unrealizedPnL =
    data?.totalUnrealizedPnL ??
    0;

  const totalPnL =
    data?.TotalPnL ?? 0;

  const columns: Column<OpenPosition>[] =
    [
      {
        key: "tradingSymbol",
        title: "Symbol",

        render: (
          position,
        ) => (
          <span className="font-semibold">
            {
              position.tradingSymbol
            }
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
        key: "positionType",
        title: "Position",
      },

      {
        key: "netQty",
        title: "Net Qty",
      },

      {
        key: "buyAvg",
        title: "Buy Avg",

        render: (p) =>
          `₹${p.buyAvg.toFixed(
            2,
          )}`,
      },

      {
        key: "sellAvg",
        title: "Sell Avg",

        render: (p) =>
          `₹${p.sellAvg.toFixed(
            2,
          )}`,
      },

      {
        key: "realizedProfit",
        title: "Realized P&L",

        render: (p) => (
          <span
            className={
              p.realizedProfit >=
              0
                ? "font-semibold text-green-500"
                : "font-semibold text-red-500"
            }
          >
            ₹
            {p.realizedProfit.toFixed(
              2,
            )}
          </span>
        ),
      },

      {
        key: "unrealizedProfit",
        title:
          "Unrealized P&L",

        render: (p) => (
          <span
            className={
              p.unrealizedProfit >=
              0
                ? "font-semibold text-green-500"
                : "font-semibold text-red-500"
            }
          >
            ₹
            {p.unrealizedProfit.toFixed(
              2,
            )}
          </span>
        ),
      },
    ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div
          className="
            grid grid-cols-1 gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {[...Array(4)].map(
            (_, i) => (
              <CardSkeleton
                key={i}
              />
            ),
          )}
        </div>

        <TableSkeleton />
      </div>
    );
  }

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
          Failed to load
          positions
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="
          grid grid-cols-1 gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
     
        <Card
          title="Realized P&L"
          value={`₹${realizedPnL.toFixed(
            2,
          )}`}
          change="Booked profit & loss"
          icon={
            <Wallet size={20} />
          }
          color={
            realizedPnL >= 0
              ? "green"
              : "orange"
          }
        />

        <Card
          title="Unrealized P&L"
          value={`₹${unrealizedPnL.toFixed(
            2,
          )}`}
          change="Live mark-to-market"
          icon={
            <TrendingUp size={20} />
          }
          color={
            unrealizedPnL >= 0
              ? "green"
              : "orange"
          }
        />

        <Card
          title="Total P&L"
          value={`₹${totalPnL.toFixed(
            2,
          )}`}
          change="Overall trading performance"
          icon={
            <IndianRupee size={20} />
          }
          color={
            totalPnL >= 0
              ? "green"
              : "orange"
          }
        />
           <Card
          title="Open Positions"
          value={String(
            data?.openPositionsCount ??
              0,
          )}
          change="Currently active positions"
          icon={
            <Briefcase size={20} />
          }
          color="orange"
        />

      </div>

      <TableCard
        title="Open Positions"
        subtitle="Monitor active positions and live profit & loss"
        headerActions={
          <FilterBar
            values={filters}
            onChange={(
              key,
              value,
            ) => {
              setPage(1);

              setFilters(
                (
                  prev,
                ) => ({
                  ...prev,
                  [key]:
                    value,
                }),
              );
            }}
            onReset={() => {
              setPage(1);

              setFilters({
                search:
                  "",
              });
            }}
            filters={[
              {
                type:
                  "search",
                key:
                  "search",
                placeholder:
                  "Search positions...",
              },
              {
                type:
                  "reset",
                key:
                  "reset",
              },
            ]}
          />
        }
      >
        <DataTable
          columns={
            columns
          }
          data={
            paginatedPositions
          }
          emptyText="No open positions found"
          minWidth="1400px"
        />

        <Pagination
          page={page}
          totalPages={
            totalPages
          }
          totalItems={
            filteredPositions.length
          }
          pageSize={
            PAGE_SIZE
          }
          onPageChange={
            setPage
          }
        />
      </TableCard>
    </>
  );
}