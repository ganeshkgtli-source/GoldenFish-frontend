export default function RegisterSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 w-full">

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl animate-pulse">

        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">

            <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-700" />

            <div className="space-y-2">
              <div className="h-6 w-40 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="h-3 w-28 rounded bg-gray-300 dark:bg-gray-700" />
            </div>

          </div>
        </div>

        {/* CARD */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xl">

          {/* STEPS */}
          <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-gray-200 dark:border-gray-800">

            <div className="flex items-center justify-between">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mb-2" />

                  <div className="h-3 w-16 rounded bg-gray-300 dark:bg-gray-700" />
                </div>
              ))}

            </div>
          </div>

          {/* FORM */}
          <div className="px-6 sm:px-10 py-8 space-y-6">

            {/* TITLE */}
            <div className="space-y-3">
              <div className="h-8 w-64 rounded bg-gray-300 dark:bg-gray-700" />

              <div className="h-4 w-48 rounded bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* INPUTS */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-2">

                <div className="h-4 w-28 rounded bg-gray-300 dark:bg-gray-700" />

                <div className="h-[52px] rounded-lg bg-gray-300 dark:bg-gray-700" />

              </div>
            ))}

          </div>

          {/* FOOTER */}
          <div className="px-6 sm:px-10 py-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">

            <div className="h-11 w-28 rounded-lg bg-gray-300 dark:bg-gray-700" />

          </div>

        </div>

        {/* BOTTOM TEXT */}
        <div className="mt-6 flex justify-center">
          <div className="h-4 w-52 rounded bg-gray-300 dark:bg-gray-700" />
        </div>

      </div>
    </div>
  );
}