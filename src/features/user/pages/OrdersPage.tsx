import { useState } from "react";

import AppLayout from "@/layouts/UserLayout";

import TradeBook from "../components/orders/TradeBook";
import OrderBook from "../components/orders/OrderBook";
import Ledger from "../components/orders/Ledger";
import Reports from "../components/orders/Reports";

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
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("tradebook");

  return (
    <AppLayout sidebar={false}>
      {/* HEADER */}
      <div
        className="
          flex flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Orders & Reports
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Track trades, orders, ledger entries and reports.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            className="
              h-10 px-4
              rounded-xl
              border border-border
              bg-card
              text-sm font-medium
              hover:bg-muted
              transition-colors
            "
          >
            Download Report
          </button>

          <button
            className="
              h-10 px-4
              rounded-xl
              bg-emerald-500
              text-black
              text-sm font-semibold
              hover:opacity-90
              transition-opacity
            "
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="overflow-x-auto scrollbar-hide">
        <div
          className="
            inline-flex items-center gap-2
            rounded-2xl
            border border-border
            bg-card
            p-1
            min-w-max
          "
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  h-10 px-5
                  rounded-xl
                  text-sm font-medium
                  transition-all
                  whitespace-nowrap
                  ${
                    active
                      ? "bg-emerald-500 text-black shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
      {activeTab === "tradebook" && <TradeBook />}

      {activeTab === "orderbook" && <OrderBook />}

      {activeTab === "ledger" && <Ledger />}

      {activeTab === "reports" && <Reports />}
    </AppLayout>
  );
}
