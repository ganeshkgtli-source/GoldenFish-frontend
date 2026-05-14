import type { ReactNode } from "react";

type CardProps = {
  title: string;
  value: string;
  change?: string;
  icon: ReactNode;
  color?: "blue" | "green" | "purple" | "orange";
};

const colorStyles = {
  blue: {
    border: "border-blue-500/20",
    bg: "from-blue-500/10 to-transparent",
    icon: "bg-blue-500/10 text-blue-500",
    text: "text-blue-500",
  },

  green: {
    border: "border-emerald-500/20",
    bg: "from-emerald-500/10 to-transparent",
    icon: "bg-emerald-500/10 text-emerald-500",
    text: "text-emerald-500",
  },

  purple: {
    border: "border-violet-500/20",
    bg: "from-violet-500/10 to-transparent",
    icon: "bg-violet-500/10 text-violet-500",
    text: "text-violet-500",
  },

  orange: {
    border: "border-orange-500/20",
    bg: "from-orange-500/10 to-transparent",
    icon: "bg-orange-500/10 text-orange-500",
    text: "text-orange-500",
  },
};

export default function Card({
  title,
  value,
  change,
  icon,
  color = "blue",
}: CardProps) {
  const style = colorStyles[color];

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl
        border
        ${style.border}
        bg-gradient-to-br ${style.bg}
        bg-card
        p-5
        min-h-[140px]
      `}
    >
      <div className="flex items-start justify-between">

        <div className="space-y-3">

          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            {title}
          </p>

          <h3 className="text-4xl font-bold tracking-tight">
            {value}
          </h3>

          {change && (
            <p className={`text-sm font-medium ${style.text}`}>
              {change}
            </p>
          )}

        </div>

        <div
          className={`
            w-12 h-12 rounded-2xl
            flex items-center justify-center
            ${style.icon}
          `}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}