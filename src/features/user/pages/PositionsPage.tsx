import { useMemo, useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Clock3,
  IndianRupee,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";

import AppLayout from "@/layouts/UserLayout";

import Card from "../components/Card";
import ContentTable from "../components/ContentTable";
import TableCard from "../components/TableCard";

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
] satisfies Position[];
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }
  ).format(value);
}

export default function PositionsPage() {
  const [query, setQuery] =
    useState("");

  const filtered = useMemo(() => {
    return positionsData.filter(
      (item) =>
        item.symbol
          .toLowerCase()
          .includes(
            query.toLowerCase()
          ) ||
        item.company
          .toLowerCase()
          .includes(
            query.toLowerCase()
          )
    );
  }, [query]);

  const totalPnl =
    positionsData.reduce(
      (acc, p) => acc + p.pnl,
      0
    );

  const totalValue =
    positionsData.reduce(
      (acc, p) =>
        acc + p.qty * p.ltp,
      0
    );

  const columns = [
    {
      key: "stock",
      title: "Stock",

      render: (position: Position) => (
        <div className="flex items-center gap-3">

          <div
            className="
              w-10 h-10
              rounded-xl
              bg-primary/10
              text-primary
              flex items-center justify-center
              font-bold text-sm
            "
          >
            {position.symbol.slice(
              0,
              2
            )}
          </div>

          <div>
            <p className="font-semibold">
              {position.symbol}
            </p>

            <p className="text-xs text-muted-foreground">
              {position.company}
            </p>
          </div>

        </div>
      ),
    },

    {
      key: "type",
      title: "Type",

      render: (position: Position) => (
        <span
          className={`
            inline-flex items-center
            px-3 py-1
            rounded-full
            text-xs font-semibold
            ${
              position.type ===
              "LONG"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
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

      render: (position: Position) => (
        <span>
          {formatCurrency(
            position.avg
          )}
        </span>
      ),
    },

    {
      key: "ltp",
      title: "LTP",

      render: (position: Position) => (
        <span className="font-semibold">
          {formatCurrency(
            position.ltp
          )}
        </span>
      ),
    },

    {
      key: "change",
      title: "Change",

      render: (position: Position) => (
        <span
          className={`
            inline-flex items-center gap-1
            px-3 py-1.5
            rounded-full
            text-xs font-semibold
            ${
              position.change >= 0
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
            }
          `}
        >
          {position.change >= 0 ? (
            <ArrowUpRight
              size={12}
            />
          ) : (
            <ArrowDownRight
              size={12}
            />
          )}

          {Math.abs(
            position.change
          )}
          %
        </span>
      ),
    },

    {
      key: "pnl",
      title: "P&L",

      render: (position: Position) => {
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
            {isProfit ? "+" : ""}
            {formatCurrency(
              position.pnl
            )}
          </span>
        );
      },
    },
  ];

  return (
    <AppLayout>

      {/* STATS */}
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >

        <Card
          title="Open Positions"
          value={String(
            positionsData.length
          )}
          change={`${positionsData.length} active positions`}
          icon={
            <Briefcase size={20} />
          }
          color="blue"
        />

        <Card
          title="Position Value"
          value={formatCurrency(
            totalValue
          )}
          change="Current market exposure"
          icon={<Wallet size={20} />}
          color="purple"
        />

        <Card
          title="Total P&L"
          value={formatCurrency(
            totalPnl
          )}
          change={
            totalPnl >= 0
              ? `+${formatCurrency(
                  totalPnl
                )} profit`
              : `${formatCurrency(
                  totalPnl
                )} loss`
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

      {/* TABLE */}
      <TableCard
        title="Open Positions"
        subtitle="Monitor your active trades and P&L."
        actions={
          <div className="relative w-full lg:w-[300px]">

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
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              placeholder="Search positions..."
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
          emptyText="No positions found"
          minWidth="1000px"
        />

      </TableCard>

      {/* BOTTOM CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ANALYTICS */}
        <div className="rounded-2xl border border-border bg-card p-5">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-lg font-semibold">
                Position Analytics
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                Trading performance insights
              </p>
            </div>

            <div
              className="
                w-11 h-11
                rounded-2xl
                bg-primary/10
                text-primary
                flex items-center justify-center
              "
            >
              <BarChart3 size={20} />
            </div>

          </div>

          <div className="mt-6 space-y-5">

            {[
              {
                label: "Win Rate",
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
                color: "bg-blue-500",
              },

              {
                label: "Risk Level",
                value: "Moderate",
                pct: "42%",
                color:
                  "bg-yellow-500",
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
                    style={{
                      width: item.pct,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* RECENT TRADES */}
        <div className="rounded-2xl border border-border bg-card p-5">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-lg font-semibold">
                Recent Trades
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
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
                amount: "+₹18,540",
                positive: true,
              },

              {
                action: "SELL TCS",
                date:
                  "Yesterday • 3:12 PM",
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
                      w-2.5 h-2.5
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
                      {item.action}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {item.date}
                    </p>

                  </div>

                </div>

                <span
                  className={`
                    text-sm font-semibold
                    ${
                      item.positive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  `}
                >
                  {item.amount}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </AppLayout>
  );
}