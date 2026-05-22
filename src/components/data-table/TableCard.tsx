import type { ReactNode } from "react";

type TableCardProps = {
  title: string;

  subtitle?: string;

  children: ReactNode;

  headerActions?: ReactNode;
};

export default function TableCard({
  title,
  subtitle,
  children,
  headerActions,
}: TableCardProps) {
  return (
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
          flex flex-col gap-4

          border-b border-border

          px-5 py-4

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* LEFT */}
        <div>
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          {subtitle && (
            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* RIGHT */}
        {headerActions && (
          <div
            className="
              flex flex-wrap
              items-center gap-3
            "
          >
            {headerActions}
          </div>
        )}
      </div>

      {/* CONTENT */}
      {children}
    </div>
  );
}