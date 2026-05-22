import {
  Outlet,
  createFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import UserLayout from "@/layouts/UserLayout";

import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute(
  "/_user"
)({
  beforeLoad: () => {
    requireAuth();
  },

  component: UserLayoutRoute,
});

function UserLayoutRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const sidebarHiddenRoutes = [
    "/money",
    "/orders",
    "/profile"
  ];

  const sidebar = !sidebarHiddenRoutes.includes(
    pathname
  );

  return (
    <UserLayout sidebar={sidebar}>
      <Outlet />
    </UserLayout>
  );
}