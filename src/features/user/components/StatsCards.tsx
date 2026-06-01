import {
  Wallet,
  TrendingUp,
  BarChart3,
  Briefcase,
} from "lucide-react";

import {
  useFundLimit,
  useOpenPositions,
} from "../hooks/useMarketData";

import Card from "./Card";

import CardSkeleton from "@/components/ui/CardSkeleton";

export default function StatsCards() {
  const {
    data: fundData,
    isLoading: fundLoading,
  } = useFundLimit();

  const {
    data: positionsData,
    isLoading: positionsLoading,
  } = useOpenPositions();

  if (
    fundLoading ||
    positionsLoading
  ) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map(
          (_, i) => (
            <CardSkeleton key={i} />
          ),
        )}
      </div>
    );
  }

  const totalBalance =
    fundData?.data
      ?.availabelBalance ?? 0;

  const totalPnL =
    positionsData?.TotalPnL ??
    0;

  const unrealizedPnL =
    positionsData?.totalUnrealizedPnL ??
    0;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* TOTAL BALANCE */}
      <Card
        title="Total Balance"
        value={`₹${totalBalance.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}`}
        change="Available Funds"
        icon={<Wallet size={18} />}
        color="blue"
      />

      {/* TODAY PNL */}
      <Card
        title="Today's P&L"
        value={`₹${totalPnL.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}`}
        change={
          totalPnL >= 0
            ? "+ Profit Today"
            : "- Loss Today"
        }
        icon={
          <TrendingUp size={18} />
        }
        color={
          totalPnL >= 0
            ? "green"
            : "orange"
        }
      />

      {/* UNREALIZED PNL */}
      <Card
        title="Unrealized P&L"
        value={`₹${unrealizedPnL.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}`}
        change={
          unrealizedPnL >= 0
            ? "+ Unrealized Gain"
            : "- Unrealized Loss"
        }
        icon={
          <BarChart3 size={18} />
        }
        color={
          unrealizedPnL >= 0
            ? "purple"
            : "orange"
        }
      />

      {/* OPEN POSITIONS */}
      <Card
        title="Open Positions"
        value={`${positionsData?.openPositionsCount ?? 0}`}
        change={`${positionsData?.openPositionsCount ?? 0} Active Trades`}
        icon={
          <Briefcase size={18} />
        }
        color="orange"
      />
    </div>
  );
}