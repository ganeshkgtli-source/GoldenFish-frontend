 
import PortfolioPage from "@/client/pages/PortfolioPage";
 import { requireAuth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/portfolio")({
  beforeLoad: () => {
      requireAuth();
    },
  component: PortfolioPage,
});