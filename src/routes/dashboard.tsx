import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";
import { requireAuth } from "@/lib/auth";

const DashboardPage = lazy(() =>
  import("@/features/user/pages/DashboardPage")
);

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    requireAuth();
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DashboardPage />
    </Suspense>
  ),
});
