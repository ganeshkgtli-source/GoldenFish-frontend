import { createFileRoute } from "@tanstack/react-router";
 import { requireAdmin } from "@/lib/auth";
import SuperAdminDashboardPage from "@/features/admin/strategy/pages/DashboardPage";

export const Route = createFileRoute("/super-admin/dashboard")({
   beforeLoad: () => {
    requireAdmin(); // ✅ THIS WAS MISSING
  },
  component: SuperAdminDashboardPage,
});