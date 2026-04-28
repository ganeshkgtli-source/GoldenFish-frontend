import ClientDetailPage from '@/features/admin/clients/pages/ClientDetailPage';
import { requireAdmin } from '@/lib/auth';
import { createFileRoute } from '@tanstack/react-router';

const validTabs = ["trades", "orders", "positions", "errors"] as const;
type TabType = (typeof validTabs)[number];

const isValidTab = (value: unknown): value is TabType =>
  typeof value === "string" &&
  (validTabs as readonly string[]).includes(value);

export const Route = createFileRoute("/admin/client/$id")({
  beforeLoad: () => {
    requireAdmin();
  },

  validateSearch: (search: unknown): { tab: TabType } => {
    const s = search as Record<string, unknown>;

    return {
      tab: isValidTab(s.tab) ? s.tab : "trades",
    };
  },

  component: ClientDetailPage,
});