import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";
import { requireAdmin } from "@/lib/auth";

const ClientDetailPage = lazy(() =>
  import("@/features/admin/clients/pages/ClientDetailPage"),
);

type TabType = "trades" | "orders" | "positions" | "errors";

export const Route = createFileRoute("/admin/client/$id")({
  beforeLoad: () => {
    requireAdmin();
  },

  validateSearch: (search: unknown): { tab: TabType } => {
    const s = search as Record<string, unknown>;

    const tab =
      typeof s.tab === "string" &&
      ["trades", "orders", "positions", "errors"].includes(s.tab)
        ? (s.tab as TabType)
        : "trades";

    return { tab };
  },

  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ClientDetailPage />
    </Suspense>
  ),
});

