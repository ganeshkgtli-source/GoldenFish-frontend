import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PaginationProps = {
  page: number;

  totalPages: number;

  totalItems?: number;

  pageSize?: number;

  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  // prevent invalid render
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  const startPage = Math.max(
    1,
    page - 2
  );

  const endPage = Math.min(
    totalPages,
    page + 2
  );

  for (
    let i = startPage;
    i <= endPage;
    i++
  ) {
    pages.push(i);
  }

  return (
    <div
      className="
        flex flex-col gap-4

        border-t border-border

        px-5 py-4

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* INFO */}
      <div
        className="
          text-sm
          text-muted-foreground
        "
      >
        {typeof totalItems ===
          "number" && (
          <>
            Showing page{" "}
            <span className="font-medium text-foreground">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {totalPages}
            </span>

            {pageSize && (
              <>
                {" "}
                • {pageSize} per page
              </>
            )}

            {" • "}

            <span className="font-medium text-foreground">
              {totalItems}
            </span>{" "}
            total records
          </>
        )}
      </div>

      {/* CONTROLS */}
      <div
        className="
          flex items-center gap-2
        "
      >
        {/* PREVIOUS */}
        <button
          type="button"
          disabled={page === 1}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="
            flex h-10 w-10
            items-center justify-center

            rounded-xl
            border border-border

            transition-colors

            hover:bg-muted

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ChevronLeft size={16} />
        </button>

        {/* PAGE NUMBERS */}
        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                onPageChange(1)
              }
              className="
                flex h-10 min-w-[40px]
                items-center justify-center

                rounded-xl
                border border-border

                px-3

                text-sm

                transition-colors

                hover:bg-muted
              "
            >
              1
            </button>

            {startPage > 2 && (
              <span
                className="
                  px-1
                  text-muted-foreground
                "
              >
                ...
              </span>
            )}
          </>
        )}

        {pages.map((pageNumber) => {
          const active =
            pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() =>
                onPageChange(
                  pageNumber
                )
              }
              className={`
                flex h-10 min-w-[40px]
                items-center justify-center

                rounded-xl
                border

                px-3

                text-sm
                font-medium

                transition-colors

                ${
                  active
                    ? `
                      border-blue-500
                      bg-blue-500
                      text-white
                    `
                    : `
                      border-border
                      hover:bg-muted
                    `
                }
              `}
            >
              {pageNumber}
            </button>
          );
        })}

        {endPage < totalPages && (
          <>
            {endPage <
              totalPages - 1 && (
              <span
                className="
                  px-1
                  text-muted-foreground
                "
              >
                ...
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                onPageChange(
                  totalPages
                )
              }
              className="
                flex h-10 min-w-[40px]
                items-center justify-center

                rounded-xl
                border border-border

                px-3

                text-sm

                transition-colors

                hover:bg-muted
              "
            >
              {totalPages}
            </button>
          </>
        )}

        {/* NEXT */}
        <button
          type="button"
          disabled={
            page === totalPages
          }
          onClick={() =>
            onPageChange(page + 1)
          }
          className="
            flex h-10 w-10
            items-center justify-center

            rounded-xl
            border border-border

            transition-colors

            hover:bg-muted

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}