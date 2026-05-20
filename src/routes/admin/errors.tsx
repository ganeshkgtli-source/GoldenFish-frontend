import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";
import { requireAdmin } from "@/lib/auth";

const ErrorLogPage = lazy(() =>
  import("@/features/admin/operations/pages/ErrorLogsPage"),
);

export const Route = createFileRoute("/admin/errors")({
  beforeLoad: () => {
    requireAdmin();
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ErrorLogPage />
    </Suspense>
  ),
});

