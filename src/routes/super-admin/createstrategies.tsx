import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";
import { requireAdmin } from "@/lib/auth";

const CreateStrategyPage = lazy(() =>
  import("@/features/admin/strategy/pages/CreateStrategyPage"),
);

export const Route = createFileRoute("/super-admin/createstrategies")({
  beforeLoad: () => {
    requireAdmin();
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <CreateStrategyPage />
    </Suspense>
  ),
});

