import ProfilePage from "@/client/pages/ProfilePage";
import { requireAuth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";

 
export const Route = createFileRoute("/profile")({
  beforeLoad: () => {
        requireAuth();
      },
  component: ProfilePage,
});