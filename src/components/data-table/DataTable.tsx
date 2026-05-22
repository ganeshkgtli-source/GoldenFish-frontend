import {
  memo,
  useMemo,
  useRef,
} from "react";

import {
  useVirtualizer,
} from "@tanstack/react-virtual";

import type {
  Column,
  DataTableProps,
} from "./types";

const ROW_HEIGHT = 56;

function DataTableComponent<T>({
  columns,
  data,
  emptyText = "No data found",
  loading = false,
  minWidth = "1200px",
  virtualized = false,
}: DataTableProps<T>) {
  const parentRef =
    useRef<HTMLDivElement>(null);

  // =========================================
  // EMPTY STATES
  // =========================================

  const emptyState = useMemo(() => {
    if (loading) {
      return (
        <div
          className="
            flex h-[300px]
            items-center justify-center

            text-sm
            text-muted-foreground
          "
        >
          Loading...
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div
          className="
            flex h-[300px]
            items-center justify-center

            text-sm
            text-muted-foreground
          "
        >
          {emptyText}
        </div>
      );
    }

    return null;
  }, [
    loading,
    data.length,
    emptyText,
  ]);

  // =========================================
  // VIRTUALIZATION
  // =========================================

  const rowVirtualizer =
    useVirtualizer({
      count: virtualized
        ? data.length
        : 0,

      getScrollElement: () =>
        parentRef.current,

      estimateSize: () =>
        ROW_HEIGHT,

      overscan: 8,
    });

  const virtualRows =
    rowVirtualizer.getVirtualItems();

  const totalHeight =
    rowVirtualizer.getTotalSize();

  // =========================================
  // EMPTY STATE
  // =========================================

  if (emptyState) {
    return emptyState;
  }

  // =========================================
  // NORMAL TABLE MODE
  // =========================================

  if (!virtualized) {
    return (
      <div className="overflow-auto">
        <table
          className="w-full"
          style={{
            minWidth,
          }}
        >
          {/* HEADER */}
          <thead
            className="
              sticky top-0 z-20

              border-b border-border

              bg-background
            "
          >
            <tr>
              {columns.map(
                (
                  col: Column<T>,
                ) => (
                  <th
                    key={String(
                      col.key,
                    )}
                    className="
                      whitespace-nowrap

                      px-5 py-4

                      text-left text-xs
                      font-semibold
                      uppercase tracking-wider

                      text-muted-foreground
                    "
                  >
                    {col.title}
                  </th>
                ),
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map(
              (
                row,
                rowIndex,
              ) => (
                <tr
                  key={rowIndex}
                  className="
                    border-b
                    border-border/60

                    transition-colors

                    hover:bg-muted/30
                  "
                >
                  {columns.map(
                    (
                      col: Column<T>,
                    ) => (
                      <td
                        key={String(
                          col.key,
                        )}
                        className={`
                          whitespace-nowrap

                          px-5 py-4

                          text-sm

                          ${
                            col.className ||
                            ""
                          }
                        `}
                      >
                        {col.render
                          ? col.render(
                              row,
                            )
                          : String(
                              row[
                                col.key as keyof T
                              ] ??
                                "-",
                            )}
                      </td>
                    ),
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // =========================================
  // VIRTUALIZED MODE
  // =========================================

  return (
    <div className="overflow-hidden">
      {/* HEADER */}
      <div
        className="
          sticky top-0 z-30

          border-b border-border

          bg-background
        "
      >
        <div
          className="flex min-w-max"
          style={{
            minWidth,
          }}
        >
          {columns.map(
            (col: Column<T>) => (
              <div
                key={String(col.key)}
                className="
                  min-w-[160px]

                  whitespace-nowrap

                  px-5 py-4

                  text-left text-xs
                  font-semibold
                  uppercase tracking-wider

                  text-muted-foreground
                "
              >
                {col.title}
              </div>
            ),
          )}
        </div>
      </div>

      {/* BODY */}
      <div
        ref={parentRef}
        className="
          h-[600px]
          overflow-auto
        "
      >
        <div
          style={{
            height: `${totalHeight}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualRows.map(
            (virtualRow) => {
              const row =
                data[
                  virtualRow.index
                ];

              return (
                <div
                  key={
                    virtualRow.key
                  }
                  data-index={
                    virtualRow.index
                  }
                  ref={rowVirtualizer.measureElement}
                  className="
                    absolute left-0 top-0

                    flex min-w-max

                    border-b
                    border-border/60

                    transition-colors

                    hover:bg-muted/30
                  "
                  style={{
                    minWidth,

                    height: `${virtualRow.size}px`,

                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {columns.map(
                    (
                      col: Column<T>,
                    ) => (
                      <div
                        key={String(
                          col.key,
                        )}
                        className={`
                          min-w-[160px]

                          whitespace-nowrap

                          px-5 py-4

                          text-sm

                          ${
                            col.className ||
                            ""
                          }
                        `}
                      >
                        {col.render
                          ? col.render(
                              row,
                            )
                          : String(
                              row[
                                col.key as keyof T
                              ] ??
                                "-",
                            )}
                      </div>
                    ),
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

const DataTable = memo(
  DataTableComponent,
) as typeof DataTableComponent;

export default DataTable;