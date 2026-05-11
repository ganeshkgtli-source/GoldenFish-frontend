import { createFileRoute } from "@tanstack/react-router";
 import { requireAdmin } from "@/lib/auth";
 import CreateStrategyPage from "@/features/admin/strategy/pages/CreateStrategyPage";

export const Route = createFileRoute("/super-admin/createstrategies")({
   beforeLoad: () => {
    requireAdmin(); // ✅ THIS WAS MISSING
  },
  component:  CreateStrategyPage,
});