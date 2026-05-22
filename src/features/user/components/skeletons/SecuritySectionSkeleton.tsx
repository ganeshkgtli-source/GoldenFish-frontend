import Skeleton from "@/components/ui/Skeleton";

export default function SecuritySectionSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">

      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">

        <Skeleton className="h-5 w-40" />

        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="space-y-2"
          >
            <Skeleton className="h-4 w-32" />

            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}

        <div className="space-y-3 pt-3">

          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-2 w-full rounded-full"
            />
          ))}

        </div>

        <Skeleton className="h-12 w-full rounded-xl" />

      </div>

    </div>
  );
}