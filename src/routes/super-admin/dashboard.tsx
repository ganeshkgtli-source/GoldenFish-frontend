import { createFileRoute } from "@tanstack/react-router";
import ManagementDashboardPage from "@/features/admin/operations/pages/ManagementDashboardPage";
import { requireAdmin } from "@/lib/auth";

export const Route = createFileRoute("/super-admin/dashboard")({
   beforeLoad: () => {
    requireAdmin(); // ✅ THIS WAS MISSING
  },
  component: ManagementDashboardPage,
});