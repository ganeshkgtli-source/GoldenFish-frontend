 
import OrdersPage from "@/features/user/pages/OrdersPage";
  import { requireAuth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/orders")({
  beforeLoad: () => {
      requireAuth();
    },
  component: OrdersPage,
});