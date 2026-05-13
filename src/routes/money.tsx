 
import MoneyPage from "@/features/user/pages/MoneyPage";
   import { requireAuth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/money")({
  beforeLoad: () => {
      requireAuth();
    },
  component: MoneyPage,
});