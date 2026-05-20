import { memo } from "react";

type Props = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const SectionCard = memo(function SectionCard({
  title,
  icon,
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm font-semibold border-b border-border pb-3">
        <span className="text-red-500">
          {icon}
        </span>

        {title}
      </div>

      {children}
    </div>
  );
});

export default SectionCard;