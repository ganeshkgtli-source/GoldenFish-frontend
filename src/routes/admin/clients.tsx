import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";
import { requireAdmin } from "@/lib/auth";

const ClientListPage = lazy(() =>
  import("@/features/admin/clients/pages/ClientListPage"),
);

export const Route = createFileRoute("/admin/clients")({
  beforeLoad: () => {
    requireAdmin();
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ClientListPage />
    </Suspense>
  ),
});

