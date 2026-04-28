import HomePage from "@/features/home/pages/HomePage";
import { requireAuth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/home")({
  beforeLoad: () => {
      requireAuth();
    },
  component: HomePage,
});