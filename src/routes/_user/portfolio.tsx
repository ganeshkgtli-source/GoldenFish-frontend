 
import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

 
 import DashboardSkeleton from "@/features/user/components/skeletons/DashboardSkeleton";

const PortfolioPage = lazy(() =>
  import("@/features/user/pages/PortfolioPage")
);

export const Route = createFileRoute("/_user/portfolio")({
   
  component: () => (
    <Suspense fallback={<DashboardSkeleton  />}>
      <PortfolioPage />
    </Suspense>
  ),
});

