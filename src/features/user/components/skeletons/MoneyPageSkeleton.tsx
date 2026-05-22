import CardSkeleton from "@/components/ui/CardSkeleton";
import TableSkeleton from "@/components/ui/TableSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function MoneyPageSkeleton() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div
        className="
          flex flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />

          <Skeleton className="h-4 w-80" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-11 w-28 rounded-xl" />

          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>

      {/* STATS */}
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* MAIN GRID */}
      <div
        className="
          grid grid-cols-1
          xl:grid-cols-[1fr_360px]
          gap-6
        "
      >
        {/* LEFT */}
        <div className="space-y-6">

          {/* FUND MANAGEMENT */}
          <TableSkeleton
            columns={2}
            rows={2}
            showHeader
          />

          {/* TRANSACTIONS */}
          <TableSkeleton
            columns={4}
            rows={5}
            showHeader
          />

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="
                rounded-2xl
                border border-border
                bg-card
                p-5
                space-y-4
              "
            >
              <Skeleton className="h-5 w-40" />

              <Skeleton className="h-4 w-56" />

              <div className="space-y-3 pt-3">
                {[...Array(3)].map((_, j) => (
                  <Skeleton
                    key={j}
                    className="h-12 w-full rounded-xl"
                  />
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}