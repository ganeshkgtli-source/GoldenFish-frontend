import { useParams, useSearch, useNavigate } from "@tanstack/react-router";
import { useClient } from "../hooks/useClients";
import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";
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
import { useEffect, useRef, useState, useMemo } from "react";
import FilterBar from "../components/FilterBar";
 
import type { Order } from "../components/OrdersTable";

type TabType =
  | "trades"
  | "orders"
  | "positions"
  | "errors";

 

/* ─── DUMMY DATA (backend-ready shapes) ──────────────────── */

const DUMMY_TRADES: Trade[] = [
  {
    id: "1", date: "2026-04-12", symbol: "NIFTY", exchange: "NSE",
    type: "BUY", expiry: "2026-04-25", entryTime: "10:30 AM",
    entryPrice: 210, status: "OPEN", pnlLot: 120, totalPnl: 1200,
    ltp: 121, spot: 45, strike: 34,
  },
  {
    id: "2", date: "2026-04-13", symbol: "BANKNIFTY", exchange: "NSE",
    type: "SELL", expiry: "2026-04-25", entryTime: "11:00 AM",
    entryPrice: 480, status: "CLOSED", exitPrice: 465, exitTime: "02:15 PM",
    pnlLot: -80, totalPnl: -800, ltp: 465, spot: 46, strike: 33,
  },
];

const DUMMY_ORDERS: Order[] = [
  {
    id: "1", date: "2026-04-12", symbol: "NIFTY", exchange: "NSE",
    type: "BUY", expiry: "2026-04-25", entryTime: "10:30 AM",
    entryPrice: 210, status: "PENDING", pnlLot: 120, totalPnl: 1200,
    ltp: 121, spot: 45, strike: 34, quantity: 121,
  },
];

/* ─── PAGE ───────────────────────────────────────────────── */

export default function ClientDetailPage() {
  const { id } = useParams({ strict: false });
  const { data, isLoading } = useClient(id!);

  const searchParams = useSearch({ from: "/admin/client/$id" });
  const navigate = useNavigate({ from: "/admin/client/$id" });

  const activeTab: TabType =
  searchParams.tab ?? "trades";

 

  const handleTabChange = (tab: TabType) => {
    
    navigate({ search: (prev: { tab?: TabType }) => ({ ...(prev ?? {}), tab }) });
  };

  /* filter state */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate]   = useState("");

  /* positions with live price simulation */
  const [positions, setPositions] = useState([
    { id: "1", symbol: "NIFTY",     exchange: "NSE", quantity: 50,  avgPrice: 200, ltp: 210 },
    { id: "2", symbol: "BANKNIFTY", exchange: "NSE", quantity: 25,  avgPrice: 480, ltp: 472 },
  ]);

  // FIX: store interval ref so cleanup is guaranteed on unmount
  const priceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    priceIntervalRef.current = setInterval(() => {
      setPositions((prev) =>
        prev.map((p) => ({ ...p, ltp: +(p.ltp + (Math.random() * 10 - 5)).toFixed(2) }))
      );
    }, 2000);

    return () => {
      // FIX: was missing ref — interval persisted after tab change, stacking memory leaks
      if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    };
  }, []);

  /* filter helpers */
const matchDate = useMemo(
  () => (dateStr: string) => {
    const d = new Date(dateStr);
    const f = !fromDate || d >= new Date(fromDate);
    const t = !toDate   || d <= new Date(toDate);
    return f && t;
  },
  [fromDate, toDate]
);

  const filteredTrades = useMemo(() =>
    DUMMY_TRADES.filter((t) => {
      const matchSearch =
        t.symbol.toLowerCase().includes(search.toLowerCase()) ||
        t.exchange.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === "ALL" || t.status === status;
      return matchSearch && matchStatus && matchDate(t.date);
    }),
  [search, status, matchDate]);

  const filteredOrders = useMemo(() =>
    DUMMY_ORDERS.filter((o) => {
      const matchSearch =
        o.symbol.toLowerCase().includes(search.toLowerCase()) ||
        o.exchange.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === "ALL" || o.status === status;
      return matchSearch && matchStatus && matchDate(o.date);
    }),
  [search, status, matchDate]);

  const filteredPositions = useMemo(() =>
    positions.filter((p) =>
      p.symbol.toLowerCase().includes(search.toLowerCase())
    ),
  [positions, search]);

  const totalPnl = positions.reduce(
    (acc, p) => acc + (p.ltp - p.avgPrice) * p.quantity,
    0
  );

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ManagementAdminNavbar />

      <main className="p-4 md:p-6 space-y-6 flex-1">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* CLIENT */}
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-semibold">
                {data?.broker_session?.dhan_client_name?.[0]?.toUpperCase() ||
                  data?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {data?.broker_session?.dhan_client_name || data?.username || "Unknown User"}
                </p>
                <p className="text-xs text-muted-foreground">ID: {data?.client_id || "—"}</p>
              </div>
            </div>
            <User size={18} />
          </div>

          {/* P&L */}
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total P&L</p>
              <p className={`text-xl font-bold mt-1 ${totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                ₹{totalPnl.toFixed(0)}
              </p>
            </div>
            <TrendingUp className="text-green-500" />
          </div>

          {/* M2M */}
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">M2M</p>
              <p className="text-xl font-bold text-blue-500 mt-1">₹{totalPnl.toFixed(0)}</p>
            </div>
            <Activity className="text-blue-500" />
          </div>

          {/* JOINED */}
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-semibold mt-1">
                {data?.date_joined ? new Date(data.date_joined).toLocaleDateString() : "--"}
              </p>
            </div>
            <Clock className="text-yellow-500" />
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-border">
          {[
            { key: "trades",    label: "Trades",    icon: FileText     },
            { key: "orders",    label: "Orders",    icon: BarChart3    },
            { key: "positions", label: "Positions", icon: Activity     },
            { key: "errors",    label: "Errors",    icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key as TabType)}
                className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 ${
                  activeTab === tab.key ? "border-red-500" : "border-transparent"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
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

          {activeTab === "trades"    && <TradeTable data={filteredTrades} />}
          {activeTab === "orders"    && <OrdersTable data={filteredOrders} />}
          {activeTab === "positions" && <PositionsTable data={filteredPositions} />}
          {activeTab === "errors"    && (
            <div className="p-10 text-center text-muted-foreground text-sm">
              Error logs coming soon — backend integration pending.
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © 2026 GoldenFish • Management Panel
      </footer>
    </div>
  );
}
