import Skeleton from "@/components/ui/Skeleton";

export default function ApiSectionSkeleton() {
  return (
    <div className="max-w-5xl mx-auto">

      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">

        {/* TITLE */}
        <Skeleton className="h-5 w-40" />

        {/* API KEY */}
        <div className="rounded-xl border border-border p-4 flex items-center justify-between">
          <Skeleton className="h-5 w-24" />

          <Skeleton className="h-5 w-48" />
        </div>

        {/* API SECRET */}
        <div className="rounded-xl border border-border p-4 flex items-center justify-between">
          <Skeleton className="h-5 w-28" />

          <Skeleton className="h-5 w-44" />
        </div>

        {/* WARNING */}
        <div className="rounded-xl border border-yellow-500/20 p-4">
          <Skeleton className="h-4 w-full" />
        </div>

        {/* EXPIRY */}
        <div className="rounded-xl border border-red-500/20 p-5 space-y-2">
          <Skeleton className="h-4 w-40" />

          <Skeleton className="h-4 w-56" />
        </div>

        {/* BUTTON */}
        <Skeleton className="h-12 w-full rounded-xl" />

      </div>

    </div>
  );
}