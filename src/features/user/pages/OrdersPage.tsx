import { Suspense, lazy, useState } from "react";

import TableSkeleton from "@/components/ui/TableSkeleton";

const TradeBook = lazy(() => import("../components/orders/TradeBook"));

const OrderBook = lazy(() => import("../components/orders/OrderBook"));

const Ledger = lazy(() => import("../components/orders/Ledger"));

const Reports = lazy(() => import("../components/orders/Reports"));

const tabs = [
  {
    key: "tradebook",
    label: "Trade Book",
  },

  {
    key: "orderbook",
    label: "Order Book",
  },

  {
    key: "ledger",
    label: "Ledger",
  },

  {
    key: "reports",
    label: "Reports",
  },
] as const;

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("tradebook");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div
        className="
          flex flex-col gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Orders & Reports
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track trades, orders, ledger entries and reports.
          </p>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            className="
              h-10 rounded-xl border border-border
              bg-card px-4 text-sm font-medium
              transition-colors hover:bg-muted
            "
          >
            Download Report
          </button>

          <button
            className="
              h-10 rounded-xl
              bg-emerald-500 px-4
              text-sm font-semibold text-black
              transition-opacity hover:opacity-90
            "
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="scrollbar-hide overflow-x-auto">
        <div
          className="
            inline-flex min-w-max items-center gap-2
            rounded-2xl border border-border
            bg-card p-1
          "
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  h-10 whitespace-nowrap rounded-xl
                  px-5 text-sm font-medium
                  transition-all
                  ${
                    active
                      ? "bg-emerald-500 text-black shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <Suspense fallback={<TableSkeleton rows={6} />}>
        {activeTab === "tradebook" && <TradeBook />}

        {activeTab === "orderbook" && <OrderBook />}

        {activeTab === "ledger" && <Ledger />}

        {activeTab === "reports" && <Reports />}
      </Suspense>
    </div>
  );
}
