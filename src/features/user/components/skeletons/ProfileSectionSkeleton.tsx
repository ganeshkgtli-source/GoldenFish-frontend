import Skeleton from "@/components/ui/Skeleton";

export default function ProfileSectionSkeleton() {
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-6">

          <Skeleton className="h-5 w-40" />

          <div className="grid grid-cols-2 gap-6">

            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="space-y-2"
              >
                <Skeleton className="h-3 w-20" />

                <Skeleton className="h-5 w-32" />
              </div>
            ))}

          </div>

        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-6">

          <Skeleton className="h-5 w-40" />

          <div className="rounded-2xl border border-border p-5 space-y-3">

            <div className="flex items-center justify-between">

              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />

                <Skeleton className="h-4 w-40" />
              </div>

              <Skeleton className="h-7 w-16 rounded-full" />

            </div>

          </div>

          <div className="grid grid-cols-3 gap-4">

            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="space-y-2 text-center"
              >
                <Skeleton className="h-7 w-12 mx-auto" />

                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}