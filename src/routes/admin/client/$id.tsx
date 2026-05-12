import { createFileRoute } from "@tanstack/react-router";
import ClientDetailPage from "@/features/admin/clients/pages/ClientDetailPage";
import { requireAdmin } from "@/lib/auth";

type TabType =
  | "trades"
  | "orders"
  | "positions"
  | "errors";

export const Route = createFileRoute("/admin/client/$id")({
  beforeLoad: () => {
    requireAdmin();
  },

  validateSearch: (
    search: unknown
  ): { tab: TabType } => {
    const s = search as Record<
      string,
      unknown
    >;

    const tab =
      typeof s.tab === "string" &&
      [
        "trades",
        "orders",
        "positions",
        "errors",
      ].includes(s.tab)
        ? (s.tab as TabType)
        : "trades";

    return { tab };
  },

  component: ClientDetailPage,
});