import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

 
 
import { queryClient } from "@/lib/queryClient";

import {
  getFundLimit,
  getOpenPositions,
} from "@/features/user/api/getMarketData";
import DashboardSkeleton from "@/features/user/components/skeletons/DashboardSkeleton";

const DashboardPage = lazy(() =>
  import("@/features/user/pages/DashboardPage")
);

export const Route = createFileRoute("/_user/dashboard")({
  

  loader: () => {
    queryClient.prefetchQuery({
      queryKey: ["fund-limit"],

      queryFn: getFundLimit,
    });

    queryClient.prefetchQuery({
      queryKey: ["open-positions"],

      queryFn: getOpenPositions,
    });
  },

  component: () => (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage />
    </Suspense>
  ),
});