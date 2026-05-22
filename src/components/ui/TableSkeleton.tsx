import { memo, useMemo } from "react";

import Skeleton from "@/components/ui/Skeleton";

type Props = {
  rows?: number;

  columns?: number;

  showHeader?: boolean;

  showActions?: boolean;
};

function TableSkeleton({
  rows = 4,
  columns = 5,
  showHeader = true,
  showActions = false,
}: Props) {
  const rowItems = useMemo(
    () => Array.from({ length: rows }),
    [rows],
  );

  const columnItems = useMemo(
    () => Array.from({ length: columns }),
    [columns],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* CARD HEADER */}
      {showHeader && (
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
          {/* TITLE */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 rounded-md" />

            <Skeleton className="h-4 w-56 rounded-md" />
          </div>

          {/* ACTIONS */}
          {showActions && (
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-xl" />

              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          )}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-auto">
        <table className="min-w-full">
          {/* HEADER */}
          <thead className="border-b border-border">
            <tr>
              {columnItems.map((_, index) => (
                <th
                  key={index}
                  className="px-5 py-4"
                >
                  <Skeleton className="h-4 w-20 rounded-md" />
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {rowItems.map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-border/60"
              >
                {columnItems.map(
                  (_, columnIndex) => (
                    <td
                      key={columnIndex}
                      className="px-5 py-4"
                    >
                      <Skeleton className="h-4 w-full rounded-md" />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const MemoizedTableSkeleton =
  memo(TableSkeleton);

export default MemoizedTableSkeleton;