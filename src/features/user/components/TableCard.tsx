type TableCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export default function TableCard({
  title,
  subtitle,
  children,
  actions,
}: TableCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* HEADER */}
      <div
        className="
          px-5 py-4
          border-b border-border
          flex flex-col gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* TITLE */}
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>

          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        {/* ACTIONS */}
        {actions && (
          <div className="flex items-center gap-2 flex-wrap">{actions}</div>
        )}
      </div>

      {/* CONTENT */}
      {children}
    </div>
  );
}
