import { Outlet, createRootRoute } from "@tanstack/react-router";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
    </div>
  );
}

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFound,
});