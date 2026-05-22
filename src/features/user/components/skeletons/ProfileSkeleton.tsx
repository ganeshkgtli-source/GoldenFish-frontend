import Skeleton from "@/components/ui/Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* MAIN */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* HERO CARD */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

            {/* LEFT */}
            <div className="flex items-center gap-5">

              <Skeleton className="w-20 h-20 rounded-2xl" />

              <div className="space-y-3">
                <Skeleton className="h-7 w-44" />

                <Skeleton className="h-4 w-64" />

                <Skeleton className="h-4 w-40" />
              </div>

            </div>

            {/* RIGHT STAT PILLS */}
            <div className="flex flex-wrap gap-3">

              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="
                    rounded-xl
                    border border-border
                    bg-card
                    px-4 py-3
                    w-32
                    space-y-2
                  "
                >
                  <Skeleton className="h-3 w-16" />

                  <Skeleton className="h-4 w-20" />
                </div>
              ))}

            </div>

          </div>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-4 gap-3">

          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-11 rounded-xl"
            />
          ))}

        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* LEFT CARD */}
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

          {/* RIGHT CARD */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-6">

            <Skeleton className="h-5 w-40" />

            {/* PLAN CARD */}
            <div className="rounded-2xl border border-border p-5 space-y-3">

              <div className="flex items-center justify-between">

                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />

                  <Skeleton className="h-4 w-40" />
                </div>

                <Skeleton className="h-7 w-16 rounded-full" />

              </div>

            </div>

            {/* STATS */}
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

      </main>
    </div>
  );
}