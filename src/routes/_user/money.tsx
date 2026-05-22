 
import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

 
 import MoneyPageSkeleton from "@/features/user/components/skeletons/MoneyPageSkeleton";

const MoneyPage = lazy(() =>
  import("@/features/user/pages/MoneyPage")
);

export const Route = createFileRoute("/_user/money")({
 
  component: () => (
<Suspense fallback={<MoneyPageSkeleton   />}>
      <MoneyPage />
    </Suspense>
  ),
});

