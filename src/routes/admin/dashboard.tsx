import { createFileRoute } from "@tanstack/react-router";
import ManagementDashboardPage from "@/features/admin/operations/pages/ManagementDashboardPage";

export const Route = createFileRoute("/admin/dashboard")({
  component: ManagementDashboardPage,
});