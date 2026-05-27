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

const ROW_HEIGHT = 42;

function DataTableComponent<T>({
  columns,
  data,
  emptyText = "No data found",
  loading = false,
  virtualized = false,
}: DataTableProps<T>) {
  "use no memo";

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
            text-base
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
        flex h-16
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

  /* eslint-disable react-hooks/incompatible-library */

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
          className="
            table-auto
            w-max
            min-w-full
            border-collapse
          "
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
                    className={`
                      whitespace-nowrap
                      px-4 py-2.5
                      text-left
                      text-[13px]
                      font-semibold
                      uppercase
                      text-muted-foreground
                      ${
                        col.className ||
                        ""
                      }
                    `}
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
                          px-4 py-2.5
                          text-[15px]
                          font-medium
                          leading-none
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
          overflow-auto
        "
      >
        <div className="inline-flex min-w-full">
          {columns.map(
            (col: Column<T>) => (
              <div
                key={String(
                  col.key,
                )}
                className={`
                  whitespace-nowrap
                  px-4 py-2.5
                  text-left
                  text-[13px]
                  font-semibold
                  uppercase
                  text-muted-foreground
                  min-w-[140px]
                  ${
                    col.className ||
                    ""
                  }
                `}
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
            width: "max-content",
            position: "relative",
            minWidth: "100%",
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
                    inline-flex min-w-full
                    border-b
                    border-border/60
                    transition-colors
                    hover:bg-muted/30
                  "
                  style={{
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
                          whitespace-nowrap
                          px-4 py-2.5
                          text-[15px]
                          font-medium
                          leading-none
                          min-w-[140px]
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