import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";
import { requireAdmin } from "@/lib/auth";

const SuperAdminDashboardPage = lazy(() =>
  import("@/features/admin/strategy/pages/DashboardPage"),
);

export const Route = createFileRoute("/super-admin/dashboard")({
  beforeLoad: () => {
    requireAdmin();
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SuperAdminDashboardPage />
    </Suspense>
  ),
});

