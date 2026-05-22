import {
  useMemo,
  useState,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Clock3,
  IndianRupee,
  TrendingUp,
  Wallet,
} from "lucide-react";

import Card from "../components/Card";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type {
  Column,
} from "@/components/data-table/types";

type Position = {
  symbol: string;
  company: string;
  qty: number;
  avg: number;
  ltp: number;
  pnl: number;
  change: number;
  type: "LONG" | "SHORT";
};

const positionsData: Position[] = [
  {
    symbol: "RELIANCE",
    company:
      "Reliance Industries",
    qty: 10,
    avg: 2480,
    ltp: 2894.55,
    pnl: 4145.5,
    change: 3.42,
    type: "LONG",
  },

  {
    symbol: "TCS",
    company:
      "Tata Consultancy Services",
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
    type: "SHORT",
  },
];

function formatCurrency(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    },
  ).format(value);
}

export default function PositionsPage() {
  // =========================================
  // FILTERS
  // =========================================

  const [openFilters, setOpenFilters] =
    useState({
      search: "",
    });

  const [
    closedFilters,
    setClosedFilters,
  ] = useState({
    search: "",
  });

  // =========================================
  // PAGINATION
  // =========================================

  const [openPage, setOpenPage] =
    useState(1);

  const [
    closedPage,
    setClosedPage,
  ] = useState(1);

  const PAGE_SIZE = 5;

  // =========================================
  // FILTERED DATA
  // =========================================

  const openPositions =
    useMemo(() => {
      return positionsData.filter(
        (item) =>
          item.type === "LONG",
      );
    }, []);

  const closedPositions =
    useMemo(() => {
      return positionsData.filter(
        (item) =>
          item.type === "SHORT",
      );
    }, []);

  const filteredOpenPositions =
    useMemo(() => {
      const query =
        openFilters.search.toLowerCase();

      return openPositions.filter(
        (item) =>
          item.symbol
            .toLowerCase()
            .includes(query) ||
          item.company
            .toLowerCase()
            .includes(query),
      );
    }, [
      openFilters.search,
      openPositions,
    ]);

  const filteredClosedPositions =
    useMemo(() => {
      const query =
        closedFilters.search.toLowerCase();

      return closedPositions.filter(
        (item) =>
          item.symbol
            .toLowerCase()
            .includes(query) ||
          item.company
            .toLowerCase()
            .includes(query),
      );
    }, [
      closedFilters.search,
      closedPositions,
    ]);

  // =========================================
  // PAGINATION DATA
  // =========================================

  const openTotalPages =
    Math.ceil(
      filteredOpenPositions.length /
        PAGE_SIZE,
    );

  const closedTotalPages =
    Math.ceil(
      filteredClosedPositions.length /
        PAGE_SIZE,
    );

  const paginatedOpenPositions =
    filteredOpenPositions.slice(
      (openPage - 1) * PAGE_SIZE,
      openPage * PAGE_SIZE,
    );

  const paginatedClosedPositions =
    filteredClosedPositions.slice(
      (closedPage - 1) *
        PAGE_SIZE,
      closedPage * PAGE_SIZE,
    );

  // =========================================
  // STATS
  // =========================================

  const totalPnl = useMemo(() => {
    return positionsData.reduce(
      (acc, p) => acc + p.pnl,
      0,
    );
  }, []);

  const totalValue = useMemo(() => {
    return positionsData.reduce(
      (acc, p) =>
        acc + p.qty * p.ltp,
      0,
    );
  }, []);

  // =========================================
  // TABLE COLUMNS
  // =========================================

  const columns: Column<Position>[] =
    [
      {
        key: "stock",
        title: "Stock",

        render: (
          position,
        ) => (
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center

                rounded-xl

                bg-primary/10

                text-sm
                font-bold
                text-primary
              "
            >
              {position.symbol.slice(
                0,
                2,
              )}
            </div>

            <div>
              <p className="font-semibold">
                {
                  position.symbol
                }
              </p>

              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                {
                  position.company
                }
              </p>
            </div>
          </div>
        ),
      },

      {
        key: "type",
        title: "Type",

        render: (
          position,
        ) => (
          <span
            className={`
              inline-flex
              items-center

              rounded-full

              px-3 py-1

              text-xs
              font-semibold

              ${
                position.type ===
                "LONG"
                  ? `
                    bg-emerald-500/10
                    text-emerald-500
                  `
                  : `
                    bg-red-500/10
                    text-red-500
                  `
              }
            `}
          >
            {position.type}
          </span>
        ),
      },

      {
        key: "qty",
        title: "Qty",
      },

      {
        key: "avg",
        title: "Avg",

        render: (
          position,
        ) => (
          <span>
            {formatCurrency(
              position.avg,
            )}
          </span>
        ),
      },

      {
        key: "ltp",
        title: "LTP",

        render: (
          position,
        ) => (
          <span className="font-semibold">
            {formatCurrency(
              position.ltp,
            )}
          </span>
        ),
      },

      {
        key: "change",
        title: "Change",

        render: (
          position,
        ) => (
          <span
            className={`
              inline-flex
              items-center gap-1

              rounded-full

              px-3 py-1.5

              text-xs
              font-semibold

              ${
                position.change >=
                0
                  ? `
                    bg-emerald-500/10
                    text-emerald-500
                  `
                  : `
                    bg-red-500/10
                    text-red-500
                  `
              }
            `}
          >
            {position.change >=
            0 ? (
              <ArrowUpRight
                size={12}
              />
            ) : (
              <ArrowDownRight
                size={12}
              />
            )}

            {Math.abs(
              position.change,
            )}
            %
          </span>
        ),
      },

      {
        key: "pnl",
        title: "P&L",

        render: (
          position,
        ) => {
          const isProfit =
            position.pnl >= 0;

          return (
            <span
              className={`
                font-bold

                ${
                  isProfit
                    ? "text-emerald-500"
                    : "text-red-500"
                }
              `}
            >
              {isProfit
                ? "+"
                : ""}

              {formatCurrency(
                position.pnl,
              )}
            </span>
          );
        },
      },
    ];

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
          title="Open Positions"
          value={String(
            openPositions.length,
          )}
          change={`${openPositions.length} active positions`}
          icon={
            <Briefcase size={20} />
          }
          color="blue"
        />

        <Card
          title="Position Value"
          value={formatCurrency(
            totalValue,
          )}
          change="Current market exposure"
          icon={
            <Wallet size={20} />
          }
          color="purple"
        />

        <Card
          title="Total P&L"
          value={formatCurrency(
            totalPnl,
          )}
          change={
            totalPnl >= 0
              ? `+${formatCurrency(totalPnl)} profit`
              : `${formatCurrency(totalPnl)} loss`
          }
          icon={
            <TrendingUp size={20} />
          }
          color={
            totalPnl >= 0
              ? "green"
              : "orange"
          }
        />

        <Card
          title="Margin Used"
          value="₹48,500"
          change="+2.1% today"
          icon={
            <IndianRupee size={20} />
          }
          color="orange"
        />
      </div>

      {/* TABLES */}
      <div className="space-y-6">
        {/* OPEN POSITIONS */}
        <TableCard
          title="Open Positions"
          subtitle="Monitor your active trades and P&L."
          headerActions={
            <FilterBar
              values={openFilters}
              onChange={(
                key,
                value,
              ) => {
                setOpenPage(1);

                setOpenFilters({
                  ...openFilters,
                  [key]:
                    value,
                });
              }}
              onReset={() => {
                setOpenPage(1);

                setOpenFilters({
                  search: "",
                });
              }}
              filters={[
                {
                  type: "search",
                  key: "search",
                  placeholder:
                    "Search open positions...",
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
            data={
              paginatedOpenPositions
            }
            emptyText="No open positions"
            minWidth="1000px"
          />

          <Pagination
            page={openPage}
            totalPages={
              openTotalPages
            }
            totalItems={
              filteredOpenPositions.length
            }
            pageSize={PAGE_SIZE}
            onPageChange={
              setOpenPage
            }
          />
        </TableCard>

        {/* CLOSED POSITIONS */}
        <TableCard
          title="Closed Positions"
          subtitle="Completed and exited trades."
          headerActions={
            <FilterBar
              values={
                closedFilters
              }
              onChange={(
                key,
                value,
              ) => {
                setClosedPage(1);

                setClosedFilters({
                  ...closedFilters,
                  [key]:
                    value,
                });
              }}
              onReset={() => {
                setClosedPage(1);

                setClosedFilters({
                  search: "",
                });
              }}
              filters={[
                {
                  type: "search",
                  key: "search",
                  placeholder:
                    "Search closed positions...",
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
            data={
              paginatedClosedPositions
            }
            emptyText="No closed positions"
            minWidth="1000px"
          />

          <Pagination
            page={closedPage}
            totalPages={
              closedTotalPages
            }
            totalItems={
              filteredClosedPositions.length
            }
            pageSize={PAGE_SIZE}
            onPageChange={
              setClosedPage
            }
          />
        </TableCard>
      </div>

      {/* BOTTOM CARDS */}
      <div
        className="
          grid grid-cols-1 gap-6

          lg:grid-cols-2
        "
      >
        {/* ANALYTICS */}
        <div
          className="
            rounded-2xl
            border border-border
            bg-card
            p-5
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Position Analytics
              </h3>

              <p
                className="
                  mt-1 text-sm
                  text-muted-foreground
                "
              >
                Trading performance insights
              </p>
            </div>

            <div
              className="
                flex h-11 w-11
                items-center justify-center

                rounded-2xl

                bg-primary/10
                text-primary
              "
            >
              <BarChart3
                size={20}
              />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {[
              {
                label:
                  "Win Rate",
                value: "74%",
                pct: "74%",
                color:
                  "bg-emerald-500",
              },

              {
                label:
                  "Profit Ratio",
                value: "58%",
                pct: "58%",
                color:
                  "bg-blue-500",
              },

              {
                label:
                  "Risk Level",
                value:
                  "Moderate",
                pct: "42%",
                color:
                  "bg-yellow-500",
              },
            ].map((item) => (
              <div
                key={item.label}
              >
                <div
                  className="
                    mb-2 flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    {
                      item.label
                    }
                  </span>

                  <span className="text-sm font-semibold">
                    {
                      item.value
                    }
                  </span>
                </div>

                <div
                  className="
                    h-2 overflow-hidden
                    rounded-full
                    bg-muted
                  "
                >
                  <div
                    className={`${item.color} h-full rounded-full`}
                    style={{
                      width:
                        item.pct,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT TRADES */}
        <div
          className="
            rounded-2xl
            border border-border
            bg-card
            p-5
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Recent Trades
              </h3>

              <p
                className="
                  mt-1 text-sm
                  text-muted-foreground
                "
              >
                Latest executed positions
              </p>
            </div>

            <Clock3
              size={20}
              className="text-muted-foreground"
            />
          </div>

          <div className="mt-6 space-y-5">
            {[
              {
                action:
                  "BUY RELIANCE",
                date:
                  "Today • 10:32 AM",
                amount:
                  "+₹18,540",
                positive: true,
              },

              {
                action:
                  "SELL TCS",
                date:
                  "Yesterday • 3:12 PM",
                amount:
                  "-₹9,200",
                positive: false,
              },

              {
                action:
                  "BUY INFY",
                date:
                  "2 days ago",
                amount:
                  "+₹11,500",
                positive: true,
              },
            ].map(
              (
                item,
                index,
              ) => (
                <div
                  key={index}
                  className="
                    flex items-start
                    justify-between
                    gap-4
                  "
                >
                  <div className="flex gap-3">
                    <div
                      className={`
                        mt-1
                        h-2.5 w-2.5
                        rounded-full

                        ${
                          item.positive
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }
                      `}
                    />

                    <div>
                      <p className="text-sm font-medium">
                        {
                          item.action
                        }
                      </p>

                      <p
                        className="
                          mt-1 text-xs
                          text-muted-foreground
                        "
                      >
                        {
                          item.date
                        }
                      </p>
                    </div>
                  </div>

                  <span
                    className={`
                      text-sm
                      font-semibold

                      ${
                        item.positive
                          ? "text-emerald-500"
                          : "text-red-500"
                      }
                    `}
                  >
                    {
                      item.amount
                    }
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}