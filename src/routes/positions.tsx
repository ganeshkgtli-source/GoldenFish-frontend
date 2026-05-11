 
 import PositionsPage from "@/client/pages/PositionsPage";
  import { requireAuth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/positions")({
  beforeLoad: () => {
      requireAuth();
    },
  component: PositionsPage,
});