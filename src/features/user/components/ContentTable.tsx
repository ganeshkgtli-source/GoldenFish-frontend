type Column<T> = {
  key: keyof T | string;
  title: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type ContentTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  minWidth?: string;
};

export default function ContentTable<T>({
  columns,
  data,
  emptyText = "No data found",
  minWidth = "1200px",
}: ContentTableProps<T>) {
  return (
    <div className="overflow-auto">
      <table
        className="w-full"
        style={{
          minWidth,
        }}
      >
        {/* HEADER */}
        <thead className="sticky top-0 z-20 bg-background border-b border-border">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="
                  px-5 py-4
                  text-left
                  text-xs
                  uppercase
                  tracking-wider
                  text-muted-foreground
                  font-semibold
                  whitespace-nowrap
                "
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="
                  text-center
                  py-16
                  text-muted-foreground
                "
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="
                  border-b border-border/60
                  hover:bg-muted/30
                  transition-colors
                "
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`
                      px-5 py-4
                      text-sm
                      whitespace-nowrap
                      ${col.className || ""}
                    `}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T] ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
