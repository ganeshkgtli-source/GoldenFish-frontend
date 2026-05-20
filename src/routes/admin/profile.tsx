import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";
import { requireAdmin } from "@/lib/auth";

const Profile = lazy(() =>
  import("@/features/admin/operations/pages/Profile"),
);

export const Route = createFileRoute("/admin/profile")({
  beforeLoad: () => {
    requireAdmin();
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Profile />
    </Suspense>
  ),
});

