import { useParams, useSearch, useNavigate } from "@tanstack/react-router";
import { useClient } from "../hooks/useClients";
import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";
import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  TrendingUp,
  Activity,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
} from "lucide-react";
import TradeTable from "../components/TradeTable";
import type { Trade } from "../components/TradeTable";
import OrdersTable from "../components/OrdersTable";
import PositionsTable from "../components/PositionsTable";
import { useEffect, useState, useMemo } from "react";
import FilterBar from "../components/FilterBar";
import { requireAdmin } from "@/lib/auth";
import type { Order } from "../components/OrdersTable"; // ✅ ADD

/* ✅ ADDED TYPES (no removal) */
const validTabs = ["trades", "orders", "positions", "errors"] as const;
type TabType = (typeof validTabs)[number];

export const Route = createFileRoute("/admin/client/$id")({
  beforeLoad: () => {
    requireAdmin();
  },

  /* ✅ FIXED validateSearch (typed properly) */
  validateSearch: (search: unknown): { tab: TabType } => {
    const s = search as Record<string, unknown>;

    const tab =
      typeof s.tab === "string" &&
      (validTabs as readonly string[]).includes(s.tab)
        ? (s.tab as TabType)
        : "trades";

    return { tab };
  },

  component: ClientDetailPage,
});

export default function ClientDetailPage() {
  const { id } = useParams({ strict: false });
  const { data, isLoading } = useClient(id!);

  /* ✅ FIXED useSearch typing */
  const searchParams = useSearch({
    from: "/admin/client/$id",
  });

const navigate = useNavigate({
  from: "/admin/client/$id",
});
  /* ✅ FIXED initial state typing */
  const [activeTab, setActiveTab] = useState<TabType>(
    () => searchParams.tab ?? "trades"
  );

  /* 🔥 SYNC URL → STATE */
  useEffect(() => {
    if (searchParams.tab && searchParams.tab !== activeTab) {
      setActiveTab(searchParams.tab);
    }
  }, [searchParams.tab]);

  /* 🔥 HANDLE TAB CHANGE */
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);

    /* ✅ FIXED navigate typing */
    navigate({
  search: (prev: { tab?: TabType }) => ({
    ...(prev ?? {}),
    tab,
  }),
});
  };

  /* 🔥 FILTER STATES */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* 🔥 MOCK DATA */
  const trades: Trade[] = [
    {
      id: "1",
      date: "2026-04-12",
      symbol: "NIFTY",
      exchange: "NSE",
      type: "BUY",
      expiry: "2026-04-25",
      entryTime: "10:30 AM",
      entryPrice: 210,
      status: "OPEN",
      pnlLot: 120,
      totalPnl: 1200,
      ltp: 121,
      spot: 45,
      strike: 34,
    },
  ];

const orders: Order[] = [
     {
      id: "1",
      date: "2026-04-12",
      symbol: "NIFTY",
      exchange: "NSE",
      type: "BUY",
      expiry: "2026-04-25",
      entryTime: "10:30 AM",
      entryPrice: 210,
      status: "PENDING",
      pnlLot: 120,
      totalPnl: 1200,
      ltp: 121,
      spot: 45,
      strike: 34,
      quantity:121
    },
];
 

  const [positions, setPositions] = useState([
    {
      id: "1",
      symbol: "NIFTY",
      exchange: "NSE",
      quantity: 50,
      avgPrice: 200,
      ltp: 210,
    },
  ]);

  /* 🔥 FILTER LOGIC */
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      const s =
        t.symbol.toLowerCase().includes(search.toLowerCase()) ||
        t.exchange.toLowerCase().includes(search.toLowerCase());

      const st = status === "ALL" || t.status === status;

      const d = new Date(t.date);
      const f = !fromDate || d >= new Date(fromDate);
      const to = !toDate || d <= new Date(toDate);

      return s && st && f && to;
    });
  }, [trades, search, status, fromDate, toDate]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const s =
        o.symbol.toLowerCase().includes(search.toLowerCase()) ||
        o.exchange.toLowerCase().includes(search.toLowerCase());

      const st = status === "ALL" || o.status === status;

      const d = new Date(o.date);
      const f = !fromDate || d >= new Date(fromDate);
      const to = !toDate || d <= new Date(toDate);

      return s && st && f && to;
    });
  }, [orders, search, status, fromDate, toDate]);

  const filteredPositions = useMemo(() => {
    return positions.filter((p) =>
      p.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [positions, search]);

  /* 🔥 LIVE PRICE */
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((p) => ({
          ...p,
          ltp: p.ltp + (Math.random() * 10 - 5),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalPnl = positions.reduce(
    (acc, p) => acc + (p.ltp - p.avgPrice) * p.quantity,
    0
  );

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ManagementAdminNavbar />

      <main className="p-4 md:p-6 space-y-6 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* CLIENT */}
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-semibold">
                {
                  data?.broker_session?.dhan_client_name?.[0]?.toUpperCase() ||
                  data?.username?.[0]?.toUpperCase() ||
                  "U"
                }
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {
                    data?.broker_session?.dhan_client_name ||
                    data?.username ||
                    "Unknown User"
                  }
                </p>

                <p className="text-xs text-muted-foreground">
                  ID: {data?.client_id || "—"}
                </p>
              </div>

            </div>

            <User size={18} />
          </div>

          {/* P&L */}
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total P&L</p>
              <p
                className={`text-xl font-bold mt-1 ${
                  totalPnl >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ₹{totalPnl.toFixed(0)}
              </p>
            </div>
            <TrendingUp className="text-green-500" />
          </div>

          {/* M2M */}
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">M2M</p>
              <p className="text-xl font-bold text-blue-500 mt-1">
                ₹{totalPnl.toFixed(0)}
              </p>
            </div>
            <Activity className="text-blue-500" />
          </div>

          {/* JOINED */}
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-semibold mt-1">
                {data?.date_joined
                  ? new Date(data.date_joined).toLocaleDateString()
                  : "--"}
              </p>
            </div>
            <Clock className="text-yellow-500" />
          </div>
        </div>

        {/* 🔥 TABS */}
        <div className="flex gap-2 border-b border-border">
          {[
            { key: "trades", label: "Trades", icon: FileText },
            { key: "orders", label: "Orders", icon: BarChart3 },
            { key: "positions", label: "Positions", icon: Activity },
            { key: "errors", label: "Errors", icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key as TabType)} /* ✅ fixed */
                className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 ${
                  activeTab === tab.key
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 🔥 CONTENT */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <FilterBar
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
              onQuickRange={() => {}}
            />
          </div>

          {activeTab === "trades" && (
            <TradeTable data={filteredTrades} />
          )}
          {activeTab === "orders" && (
            <OrdersTable data={filteredOrders} />
          )}
          {activeTab === "positions" && (
            <PositionsTable data={filteredPositions} />
          )}
          {activeTab === "errors" && (
            <div className="p-10 text-center">Error logs coming soon</div>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © 2026 GoldenFish • Management Panel
      </footer>
    </div>
  );
}