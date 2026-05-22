import Skeleton from "@/components/ui/Skeleton";

type PageLoaderProps = {
  sidebar?: boolean;
};

export default function UserDashboardLoader({
  sidebar = true,
}: PageLoaderProps) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-background">
      
      {/* =========================
          TOP NAVBAR
      ========================= */}
      {/* <div className="w-full border-b border-border bg-background px-4 sm:px-6 lg:px-8 py-3 shrink-0">
        
        <div className="flex items-center justify-between gap-4">

    
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <Skeleton className="h-5 w-28" />
          </div>

 
          <div className="hidden lg:flex items-center gap-10 flex-1 justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2"
              >
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

           <div className="flex items-center gap-4 shrink-0">

             <Skeleton className="h-10 w-10 rounded-xl" />

             <div className="flex items-center gap-3 border border-border rounded-xl px-3 py-2">
              <Skeleton className="h-9 w-9 rounded-full" />

              <Skeleton className="hidden sm:block h-4 w-16" />

              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>

          </div>

        </div>

      </div> */}

      {/* =========================
          PAGE BODY
      ========================= */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* =========================
            SIDEBAR
        ========================= */}
        {sidebar && (
          <aside className="hidden lg:flex lg:w-[320px] xl:w-[340px] shrink-0 border-r border-border bg-background">
            
            <div className="w-full overflow-y-auto p-6 space-y-6 scrollbar-hide">

              {/* MARKET TIME */}
              <div className="rounded-2xl border border-border p-5 space-y-5">
                
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>

                <Skeleton className="h-9 w-36" />

                <Skeleton className="h-7 w-32 rounded-full" />

                <Skeleton className="h-4 w-40" />

                <div className="space-y-2">
                  <Skeleton className="h-2 w-full rounded-full" />

                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>

              </div>

              {/* SEARCH */}
              <Skeleton className="h-12 w-full rounded-xl" />

              {/* WATCHLIST */}
              <div className="space-y-4">

                <Skeleton className="h-5 w-24" />

                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-14" />
                    </div>

                    <div className="space-y-2 flex flex-col items-end">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}

              </div>

              {/* SECTOR PERFORMANCE */}
              <div className="space-y-5 pt-4">

                <Skeleton className="h-5 w-40" />

                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>

                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}

              </div>

            </div>

          </aside>
        )}

        {/* =========================
            MAIN CONTENT
        ========================= */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            
            <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-6">

              {/* TOP STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="flex items-start justify-between">

                      <div className="space-y-4 flex-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-4 w-24" />
                      </div>

                      <Skeleton className="h-12 w-12 rounded-2xl" />

                    </div>
                  </div>
                ))}

              </div>

              {/* ORDERS TABLE */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">

                  <div className="space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64" />
                  </div>

                  <div className="flex items-center gap-6">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                </div>

                {/* TABLE HEADER */}
                <div className="grid grid-cols-10 gap-4 px-6 py-4 border-b border-border">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-4 w-full"
                    />
                  ))}
                </div>

                {/* TABLE ROWS */}
                <div className="p-6 space-y-5">

                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-10 gap-4 items-center"
                    >
                      {[...Array(10)].map((_, j) => (
                        <Skeleton
                          key={j}
                          className="h-4 w-full"
                        />
                      ))}
                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              FOOTER
          ========================= */}
          <div className="border-t border-border px-6 py-4 bg-background shrink-0">

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

              <Skeleton className="h-4 w-60" />

              <div className="flex items-center gap-5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>

              <Skeleton className="h-4 w-40" />

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}