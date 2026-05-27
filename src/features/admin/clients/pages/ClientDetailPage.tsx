import { useMemo } from "react";

import { useNavigate, useParams, useSearch } from "@tanstack/react-router";

import { Activity, AlertTriangle, BarChart3, FileText } from "lucide-react";

import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";

import OrdersTable from "../components/OrdersTable";
import PositionsTable from "../components/PositionsTable";
import TradeTable from "../components/TradeTable";

import { useClient } from "../hooks/useClients";

import { useOrdersSocket } from "@/websocket/hooks/useOrdersSocket";

import { useRealtimeStore } from "@/websocket/store/realtimeStore";
import { useErrorsSocket } from "@/websocket/hooks/useErrorsSocket";
import { useTradesSocket } from "@/websocket/hooks/useTradesSocket";
import { usePositionsSocket } from "@/websocket/hooks/usePositions";

type TabType = "trades" | "orders" | "positions" | "errors";

const isTodayData = (date?: string): boolean => {
  if (!date) {
    return false;
  }

  const today = new Date();
  const itemDate = new Date(date);

  return (
    today.getDate() === itemDate.getDate() &&
    today.getMonth() === itemDate.getMonth() &&
    today.getFullYear() === itemDate.getFullYear()
  );
};

export default function ClientDetailPage() {
  const { id } = useParams({
    strict: false,
  });

  /**
   * CLIENT
   */
  const { data, isLoading } = useClient(id!);

  /**
   * SOCKET
   */
  useOrdersSocket("client", id);
  useErrorsSocket("client", id);
  useTradesSocket("client", id);
  usePositionsSocket("client", id);

  /**
   * RAW REALTIME STATE
   */
  const orders = useRealtimeStore((state) => state.orders);

  const trades = useRealtimeStore((state) => state.trades);

  const positions = useRealtimeStore((state) => state.positions);

  const errors = useRealtimeStore((state) => state.errors);

  /**
   * FILTERED DATA
   */
  const todayOrders = useMemo(() => {
    return orders.filter((order) => isTodayData(order.created_at));
  }, [orders]);

  const todayTrades = useMemo(() => {
    return trades.filter((trade) => isTodayData(trade.created_at));
  }, [trades]);

  const activePositions = useMemo(() => {
    return positions.filter((position) => Number(position.netQty) !== 0);
  }, [positions]);

  const todayErrors = useMemo(() => {
    return errors.filter((error) => isTodayData(error.created_at));
  }, [errors]);

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
   * LOADING
   */
  if (isLoading) {
    return (
      <div
        className="
          flex min-h-screen
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        flex min-h-screen flex-col

        bg-background
        text-foreground
      "
    >
      <ManagementAdminNavbar />

      <main
        className="
          flex-1

          p-4 md:p-5
        "
      >
        {/* CONTAINER */}
        <div
          className="
            overflow-hidden

            rounded-2xl
            border border-border

            bg-card
          "
        >
          {/* HEADER */}
          <div
            className="
              flex items-center justify-between

              border-b border-border

              px-4
              py-2
            "
          >
            {/* TABS */}
            <div
              className="
                flex items-center gap-1
              "
            >
              {[
                {
                  key: "trades",
                  label: "Trades",
                  icon: FileText,
                  count: todayTrades.length,
                },

                {
                  key: "orders",
                  label: "Orders",
                  icon: BarChart3,
                  count: todayOrders.length,
                },

                {
                  key: "positions",
                  label: "Positions",
                  icon: Activity,
                  count: activePositions.length,
                },

                {
                  key: "errors",
                  label: "Errors",
                  icon: AlertTriangle,
                  count: todayErrors.length,
                },
              ].map((tab) => {
                const Icon = tab.icon;

                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key as TabType)}
                    className={`
                      relative

                      flex items-center gap-2

                      px-4
                      py-3
                      pr-7

                      text-sm
                      font-medium

                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                            text-foreground
                          `
                          : `
                            text-muted-foreground
                            hover:text-foreground
                          `
                      }
                    `}
                  >
                    {/* ICON */}
                    <Icon
                      size={15}
                      className={`
                        transition-colors

                        ${isActive ? "text-red-400" : "text-muted-foreground"}
                      `}
                    />

                    {/* LABEL */}
                    <span>{tab.label}</span>

                    {/* COUNT */}
                    {tab.count > 0 && (
                      <span
                        className={`
                          absolute
                          -top-0.5
                          right-0

                          text-[11px]
                          font-semibold

                          ${
                            tab.key === "errors"
                              ? `
                                text-red-500
                                dark:text-red-400
                              `
                              : `
                                text-yellow-500
                                dark:text-yellow-400
                              `
                          }
                        `}
                      >
                        +{tab.count > 99 ? "99" : tab.count}
                      </span>
                    )}

                    {/* ACTIVE UNDERLINE */}
                    {isActive && (
                      <div
                        className="
                          absolute
                          bottom-0
                          left-3
                          right-3

                          h-[2px]

                          rounded-full

                          bg-red-500
                        "
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CLIENT INFO */}
            <div
              className="
                flex items-center

                rounded-xl
                border border-border/70

                bg-muted/20

                px-4
                py-2.5
              "
            >
              <div
                className="
                  flex items-center gap-3

                  overflow-hidden
                "
              >
                {/* CLIENT NAME */}
                <p
                  className="
                    max-w-[220px]
                    truncate

                    text-[14px]
                    font-semibold
                    tracking-tight

                    text-foreground
                  "
                >
                  {data?.broker_session?.dhan_client_name ||
                    data?.username ||
                    "Unknown User"}
                </p>

                {/* DIVIDER */}
                <div
                  className="
                    h-4
                    w-px

                    bg-border/80
                  "
                />

                {/* CLIENT ID */}
                <p
                  className="
                    whitespace-nowrap

                    text-[13px]
                    font-medium
                    tracking-wide

                    text-muted-foreground
                  "
                >
                  ID: {data?.client_id || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div
            className="
              min-h-[600px]

              bg-background/30
            "
          >
            {/* TRADES */}
            {activeTab === "trades" && (
              <div
                className="
                  animate-in
                  fade-in-0
                  duration-200
                "
              >
                <TradeTable />
              </div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <div
                className="
                  animate-in
                  fade-in-0
                  duration-200
                "
              >
                <OrdersTable />
              </div>
            )}

            {/* POSITIONS */}
            {activeTab === "positions" && (
              <div
                className="
                  animate-in
                  fade-in-0
                  duration-200
                "
              >
                <PositionsTable />
              </div>
            )}

            {/* ERRORS */}
            {activeTab === "errors" && (
              <div
                className="
                  flex min-h-[600px]
                  flex-col
                  items-center
                  justify-center

                  gap-3

                  text-center
                "
              >
                <div
                  className="
                    flex h-14 w-14
                    items-center
                    justify-center

                    rounded-2xl

                    border border-red-500/10

                    bg-red-500/5
                  "
                >
                  <AlertTriangle
                    size={26}
                    className="
                      text-red-400
                    "
                  />
                </div>

                <div
                  className="
                    space-y-1
                  "
                >
                  <p
                    className="
                      text-[15px]
                      font-semibold

                      text-foreground
                    "
                  >
                    No Error Logs
                  </p>

                  <p
                    className="
                      text-sm

                      text-muted-foreground
                    "
                  >
                    Rejected orders and websocket errors will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
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
