import DashboardPage from "@/client/pages/DashboardPage";
// import HomePage from "@/features/home/pages/HomePage";
import { requireAuth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
      requireAuth();
    },
  component: DashboardPage,
});