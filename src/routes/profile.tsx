import { requireAuth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";

function ProfilePage() {
  return <div>Profile Page</div>;
}

export const Route = createFileRoute("/profile")({
  beforeLoad: () => {
        requireAuth();
      },
  component: ProfilePage,
});