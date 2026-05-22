import { memo } from "react";

import Skeleton from "@/components/ui/Skeleton";

const CARD_ITEMS = Array.from({
  length: 4,
});

const TABLE_ROWS = Array.from({
  length: 5,
});

 

function DashboardSkeletonComponent() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* SIDEBAR */}
    

      {/* MAIN CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOPBAR */}
      

        {/* PAGE */}
        <main className="flex-1 space-y-6 p-4 sm:p-6">
          {/* STATS CARDS */}
          <div
            className="
              grid grid-cols-1 gap-4
              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            {CARD_ITEMS.map((_, index) => (
              <div
                key={index}
                className="
                  rounded-2xl
                  border border-border
                  bg-card
                  p-5
                "
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24 rounded-md bg-muted/70" />

                    <Skeleton className="h-9 w-28 rounded-lg bg-muted/70" />

                    <Skeleton className="h-3 w-20 rounded-md bg-muted/70" />
                  </div>

                  <Skeleton className="h-11 w-11 rounded-2xl bg-muted/70" />
                </div>
              </div>
            ))}
          </div>

          {/* TABLE */}
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
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-md bg-muted/70" />

                <Skeleton className="h-4 w-64 rounded-md bg-muted/70" />
              </div>

              <Skeleton className="h-10 w-52 rounded-xl bg-muted/70" />
            </div>

            {/* ROWS */}
            <div className="space-y-3 p-5">
              {TABLE_ROWS.map((_, index) => (
                <div
                  key={index}
                  className="
                    flex items-center gap-4
                    rounded-xl
                    border border-border/50
                    p-4
                  "
                >
                  {/* ICON */}
                  <Skeleton className="h-11 w-11 rounded-xl bg-muted/70" />

                  {/* TEXT */}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3 rounded-md bg-muted/70" />

                    <Skeleton className="h-4 w-2/3 rounded-md bg-muted/70" />
                  </div>

                  {/* VALUE */}
                  <div className="space-y-2">
                    <Skeleton className="ml-auto h-5 w-20 rounded-md bg-muted/70" />

                    <Skeleton className="ml-auto h-4 w-14 rounded-md bg-muted/70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const DashboardSkeleton = memo(
  DashboardSkeletonComponent,
);

export default DashboardSkeleton;