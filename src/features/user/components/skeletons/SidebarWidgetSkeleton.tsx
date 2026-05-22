import { memo } from "react";

import Skeleton from "@/components/ui/Skeleton";

const WATCHLIST_ITEMS = Array.from({
  length: 6,
});

const SECTOR_ITEMS = Array.from({
  length: 5,
});

function SidebarWidgetSkeletonComponent() {
  return (
    <div className="space-y-4">
      {/* MARKET CLOCK */}
      <div
        className="
          rounded-2xl
          border border-border
          bg-card
          p-4
          space-y-4
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded-md bg-muted/70" />

          <Skeleton className="h-7 w-7 rounded-lg bg-muted/70" />
        </div>

        {/* TIME */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-32 rounded-lg bg-muted/70" />

          <Skeleton className="h-3 w-24 rounded-md bg-muted/70" />
        </div>

        {/* STATUS */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20 rounded-md bg-muted/70" />

          <Skeleton className="h-3 w-14 rounded-md bg-muted/70" />
        </div>

        {/* PROGRESS */}
        <Skeleton className="h-2 w-full rounded-full bg-muted/70" />
      </div>

      {/* WATCHLIST */}
      <div
        className="
          rounded-2xl
          border border-border
          bg-card
          overflow-hidden
        "
      >
        {/* SEARCH */}
        <div className="p-4 border-b border-border">
          <Skeleton className="h-10 w-full rounded-xl bg-muted/70" />
        </div>

        {/* LIST */}
        <div className="divide-y divide-border/50">
          {WATCHLIST_ITEMS.map(
            (_, index) => (
              <div
                key={index}
                className="
                  flex items-center justify-between
                  px-4 py-3
                "
              >
                {/* LEFT */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded-md bg-muted/70" />

                  <Skeleton className="h-3 w-10 rounded-md bg-muted/70" />
                </div>

                {/* RIGHT */}
                <div className="space-y-2 text-right">
                  <Skeleton className="ml-auto h-4 w-16 rounded-md bg-muted/70" />

                  <Skeleton className="ml-auto h-3 w-12 rounded-md bg-muted/70" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* SECTOR PERFORMANCE */}
      <div
        className="
          rounded-2xl
          border border-border
          bg-card
          p-4
          space-y-4
        "
      >
        {/* HEADER */}
        <Skeleton className="h-5 w-36 rounded-md bg-muted/70" />

        {/* ITEMS */}
        <div className="space-y-4">
          {SECTOR_ITEMS.map(
            (_, index) => (
              <div
                key={index}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded-md bg-muted/70" />

                  <Skeleton className="h-4 w-12 rounded-md bg-muted/70" />
                </div>

                <Skeleton className="h-2 w-full rounded-full bg-muted/70" />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

const SidebarWidgetSkeleton = memo(
  SidebarWidgetSkeletonComponent,
);

export default SidebarWidgetSkeleton;