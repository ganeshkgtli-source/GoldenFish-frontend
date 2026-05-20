import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";
import { requireAdmin } from "@/lib/auth";

const ManagementDashboardPage = lazy(() =>
  import("@/features/admin/operations/pages/ManagementDashboardPage"),
);

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: () => {
    requireAdmin();
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ManagementDashboardPage />
    </Suspense>
  ),
});

