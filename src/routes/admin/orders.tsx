import { createFileRoute } from "@tanstack/react-router";
 import { requireAdmin } from "@/lib/auth";
import OrderLogPage from "@/features/admin/operations/pages/OrderLogsPage";
 
export const Route = createFileRoute("/admin/orders")({
  beforeLoad: () => {
      requireAdmin(); // ✅ THIS WAS MISSING
    },
  component: OrderLogPage,
});