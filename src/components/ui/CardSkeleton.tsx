import Skeleton from "@/components/ui/Skeleton";

type Props = {
  showIcon?: boolean;

  showChange?: boolean;

  compact?: boolean;
};

export default function CardSkeleton({
  showIcon = true,
  showChange = true,
  compact = false,
}: Props) {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl
        border border-border
        bg-card
        p-5
        ${compact ? "min-h-[110px]" : "min-h-[140px]"}
      `}
    >
      <div className="flex items-start justify-between">

        {/* LEFT CONTENT */}
        <div className="space-y-3 flex-1">

          {/* TITLE */}
          <Skeleton className="h-3 w-24 rounded-md" />

          {/* VALUE */}
          <Skeleton className="h-10 w-32 rounded-lg" />

          {/* CHANGE */}
          {showChange && (
            <Skeleton className="h-4 w-20 rounded-md" />
          )}

        </div>

        {/* ICON */}
        {showIcon && (
          <Skeleton className="w-12 h-12 rounded-2xl" />
        )}

      </div>
    </div>
  );
}