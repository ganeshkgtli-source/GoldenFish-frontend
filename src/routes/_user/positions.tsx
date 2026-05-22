 
import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

 
 import DashboardSkeleton from "@/features/user/components/skeletons/DashboardSkeleton";

const PositionsPage = lazy(() =>
  import("@/features/user/pages/PositionsPage")
);

export const Route = createFileRoute("/_user/positions")({
  
  component: () => (
    <Suspense fallback={<DashboardSkeleton />}>
      <PositionsPage />
    </Suspense>
  ),
});

