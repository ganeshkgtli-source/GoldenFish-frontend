 
import OrdersPage from "@/client/pages/OrdersPage";
  import { requireAuth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/orders")({
  beforeLoad: () => {
      requireAuth();
    },
  component: OrdersPage,
});