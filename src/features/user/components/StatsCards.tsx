import { Wallet, TrendingUp, BarChart3, Briefcase } from "lucide-react";
import { useFundLimit, useOpenPositions } from "../hooks/useMarketData";
import Card from "./Card";

export default function StatsCards() {
  const { data: fundData } = useFundLimit();
  const { data: positionsData } = useOpenPositions();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {/* TOTAL BALANCE */}
      <Card
        title="Total Balance"
        value={`₹${
          fundData?.data?.availabelBalance?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "0.00"
        }`}
        change="Available Funds"
        icon={<Wallet size={18} />}
        color="blue"
      />

      {/* TODAY PNL */}
      <Card
        title="Today's P&L"
        value={`₹${
          positionsData?.TotalPnL?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "0.00"
        }`}
        change={
          (positionsData?.TotalPnL || 0) >= 0 ? "+ Profit Today" : "- Loss Today"
        }
        icon={<TrendingUp size={18} />}
        color={(positionsData?.TotalPnL || 0) >= 0 ? "green" : "orange"}
      />

      {/* UNREALIZED PNL */}
      <Card
        title="Unrealized P&L"
        value={`₹${
          positionsData?.unrealizedPnL?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "0.00"
        }`}
        change={
          (positionsData?.unrealizedPnL || 0) >= 0
            ? "+ Unrealized Gain"
            : "- Unrealized Loss"
        }
        icon={<BarChart3 size={18} />}
        color={
          (positionsData?.unrealizedPnL || 0) >= 0 ? "purple" : "orange"
        }
      />

      {/* OPEN POSITIONS */}
      <Card
        title="Open Positions"
        value={`${positionsData?.openPositionsCount || 0}`}
        change={`${positionsData?.openPositionsCount || 0} Active Trades`}
        icon={<Briefcase size={18} />}
        color="orange"
      />
    </div>
  );
}


