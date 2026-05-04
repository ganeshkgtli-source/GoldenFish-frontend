import {
  Wallet,
  TrendingUp,
  BarChart3,
  Briefcase,
} from "lucide-react";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

      <Card
        title="Total Balance"
        value="₹1,24,500.00"
        change="+2.40% today"
        icon={<Wallet size={18} />}
        color="blue"
      />

      <Card
        title="Today's P&L"
        value="+₹2,450.00"
        change="+1.98%"
        icon={<TrendingUp size={18} />}
        color="green"
      />

      <Card
        title="Unrealized P&L"
        value="+₹1,250.00"
        change="+0.95%"
        icon={<BarChart3 size={18} />}
        color="purple"
      />

      <Card
        title="Open Positions"
        value="3"
        change="Active trades"
        icon={<Briefcase size={18} />}
        color="orange"
      />

    </div>
  );
}

/* ================= CARD ================= */

function Card({ title, value, change, icon, color }: any) {
  const colorMap: any = {
    blue: {
      bg: "from-blue-500/10 to-transparent",
      border: "border-blue-500/20",
      icon: "text-blue-400 bg-blue-500/10",
    },
    green: {
      bg: "from-green-500/10 to-transparent",
      border: "border-green-500/20",
      icon: "text-green-400 bg-green-500/10",
    },
    purple: {
      bg: "from-purple-500/10 to-transparent",
      border: "border-purple-500/20",
      icon: "text-purple-400 bg-purple-500/10",
    },
    orange: {
      bg: "from-orange-500/10 to-transparent",
      border: "border-orange-500/20",
      icon: "text-orange-400 bg-orange-500/10",
    },
  };

  const isPositive = change.includes("+");
  const isNegative = change.includes("-");

  const changeColor = isPositive
    ? "text-green-400"
    : isNegative
    ? "text-red-400"
    : "text-muted-foreground";

  return (
    <div
      className={`relative rounded-xl p-4 border bg-gradient-to-br ${colorMap[color].bg} ${colorMap[color].border}
      backdrop-blur-xl hover:scale-[1.015] hover:border-white/20 transition-all duration-200`}
    >
      {/* 🔥 Glow Layer */}
      <div className="absolute inset-0 opacity-10 blur-2xl pointer-events-none bg-gradient-to-r from-white/10 to-transparent" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3 relative z-10">

        <p className="text-xs text-muted-foreground tracking-wide">
          {title}
        </p>

        {/* ICON */}
        <div className={`p-2 rounded-lg ${colorMap[color].icon}`}>
          {icon}
        </div>
      </div>

      {/* VALUE (🔥 BIG IMPACT) */}
      <h2 className="text-2xl font-bold tracking-tight leading-none relative z-10">
        {value}
      </h2>

      {/* CHANGE */}
      <p className={`text-xs mt-2 font-medium ${changeColor} relative z-10`}>
        {change}
      </p>

      {/* 🔥 subtle bottom glow line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
    </div>
  );
}