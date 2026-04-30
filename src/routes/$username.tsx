import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/$username")({
  beforeLoad: ({ params }) => {
    requireAuth();

    const user = useAuthStore.getState().user;

    if (!user || params.username !== user.username) {
      throw new Error("Unauthorized");
    }
  },
  component: Layout,
});

function Layout() {
  return <Outlet />;
}