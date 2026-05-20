import { memo } from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const StatPill = memo(function StatPill({
  icon,
  label,
  value,
}: Props) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border text-sm">

      <span className="text-muted-foreground">
        {icon}
      </span>

      <div>
        <p className="text-xs text-muted-foreground leading-none">
          {label}
        </p>

        <p className="font-semibold leading-tight mt-0.5">
          {value}
        </p>
      </div>

    </div>
  );
});

export default StatPill;