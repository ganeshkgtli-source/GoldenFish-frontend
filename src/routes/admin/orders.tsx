import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";
import { requireAdmin } from "@/lib/auth";

const OrderLogPage = lazy(() =>
  import("@/features/admin/operations/pages/OrderLogsPage"),
);

export const Route = createFileRoute("/admin/orders")({
  beforeLoad: () => {
    requireAdmin();
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <OrderLogPage />
    </Suspense>
  ),
});

