import { createFileRoute } from "@tanstack/react-router";
import ClientListPage from "@/features/admin/clients/pages/ClientListPage";
import { requireAdmin } from "@/lib/auth";

export const Route = createFileRoute("/admin/clients")({
  beforeLoad: () => {
      requireAdmin(); // ✅ THIS WAS MISSING
    },
  component: ClientListPage,
});