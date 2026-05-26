import { useParams, useSearch, useNavigate } from "@tanstack/react-router";

import {
  User,
  TrendingUp,
  Activity,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
} from "lucide-react";

import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";

import { useClient } from "../hooks/useClients";

import TradeTable from "../components/TradeTable";

import OrdersTable from "../components/OrdersTable";

import { useOrdersSocket } from "@/websocket/hooks/useOrdersSocket";

import { useRealtimeStore } from "@/websocket/store/realtimeStore";

type TabType = "trades" | "orders" | "positions" | "errors";

export default function ClientDetailPage() {
  const { id } = useParams({
    strict: false,
  });

  const { data, isLoading } = useClient(id!);

  /**
   * REALTIME SOCKET
   */
  useOrdersSocket("client", id);

  /**
   * REALTIME ORDERS
   */
  const realtimeOrders = useRealtimeStore((state) => state.orders);

  /**
   * ROUTER
   */
  const searchParams = useSearch({
    from: "/admin/client/$id",
  });

  const navigate = useNavigate({
    from: "/admin/client/$id",
  });

  /**
   * ACTIVE TAB
   */
  const activeTab: TabType = searchParams.tab ?? "trades";

  const handleTabChange = (tab: TabType) => {
    navigate({
      search: (prev: { tab?: TabType }) => ({
        ...(prev ?? {}),

        tab,
      }),
    });
  };

  /**
   * TOTAL PNL
   */
  const totalPnl = 0;

  /**
   * LOADING
   */
  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div
      className="
        min-h-screen
        bg-background
        text-foreground
        flex flex-col
      "
    >
      <ManagementAdminNavbar />

      <main
        className="
          flex-1
          space-y-6
          p-4 md:p-6
        "
      >
        {/* SUMMARY */}
        <div
          className="
            grid
            grid-cols-1
            gap-4

            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {/* CLIENT */}
          <div
            className="
              flex items-center
              justify-between

              rounded-2xl
              border border-border
              bg-card
              p-5

              transition
              hover:shadow-md
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10
                  items-center justify-center

                  rounded-full

                  bg-red-500/10
                  font-semibold
                  text-red-500
                "
              >
                {data?.broker_session?.dhan_client_name?.[0]?.toUpperCase() ||
                  data?.username?.[0]?.toUpperCase() ||
                  "U"}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {data?.broker_session?.dhan_client_name ||
                    data?.username ||
                    "Unknown User"}
                </p>

                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  ID: {data?.client_id || "—"}
                </p>
              </div>
            </div>

            <User size={18} />
          </div>

          {/* PNL */}
          <div
            className="
              flex items-center
              justify-between

              rounded-2xl
              border border-border
              bg-card
              p-5
            "
          >
            <div>
              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Total P&L
              </p>

              <p
                className={`
                  mt-1 text-xl font-bold

                  ${totalPnl >= 0 ? "text-green-500" : "text-red-500"}
                `}
              >
                ₹{totalPnl.toFixed(0)}
              </p>
            </div>

            <TrendingUp className="text-green-500" />
          </div>

          {/* LIVE ORDERS */}
          <div
            className="
              flex items-center
              justify-between

              rounded-2xl
              border border-border
              bg-card
              p-5
            "
          >
            <div>
              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Live Orders
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-bold
                  text-blue-500
                "
              >
                {realtimeOrders.length}
              </p>
            </div>

            <Activity className="text-blue-500" />
          </div>

          {/* JOINED */}
          <div
            className="
              flex items-center
              justify-between

              rounded-2xl
              border border-border
              bg-card
              p-5
            "
          >
            <div>
              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Joined
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                "
              >
                {data?.date_joined
                  ? new Date(data.date_joined).toLocaleDateString()
                  : "--"}
              </p>
            </div>

            <Clock className="text-yellow-500" />
          </div>
        </div>

        {/* TABS */}
        <div
          className="
            flex gap-2
            border-b border-border
          "
        >
          {[
            {
              key: "trades",
              label: "Trades",
              icon: FileText,
            },

            {
              key: "orders",
              label: "Orders",
              icon: BarChart3,
            },

            {
              key: "positions",
              label: "Positions",
              icon: Activity,
            },

            {
              key: "errors",
              label: "Errors",
              icon: AlertTriangle,
            },
          ].map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key as TabType)}
                className={`
                  flex items-center gap-2

                  border-b-2
                  px-4 py-2
                  text-sm

                  ${
                    activeTab === tab.key
                      ? "border-red-500"
                      : "border-transparent"
                  }
                `}
              >
                <Icon size={16} />

                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div
          className="
            overflow-hidden
            rounded-2xl
            border border-border
            bg-card
          "
        >
          {/* FILTER */}
          <div
            className="
              border-b border-border
              p-3
            "
          ></div>

          {/* TRADES */}
          {activeTab === "trades" && <TradeTable />}

          {/* ORDERS */}
          {activeTab === "orders" && <OrdersTable />}

          {/* POSITIONS */}
          {activeTab === "positions" && (
            <div
              className="
                p-10
                text-center
                text-sm
                text-muted-foreground
              "
            >
              No live positions available
            </div>
          )}

          {/* ERRORS */}
          {activeTab === "errors" && (
            <div
              className="
                p-10
                text-center
                text-sm
                text-muted-foreground
              "
            >
              Error logs coming soon.
            </div>
          )}
        </div>
      </main>

      <footer
        className="
          mt-auto
          border-t border-border
          py-4
          text-center
          text-sm
          text-muted-foreground
        "
      >
        © 2026 GoldenFish • Management Panel
      </footer>
    </div>
  );
}
