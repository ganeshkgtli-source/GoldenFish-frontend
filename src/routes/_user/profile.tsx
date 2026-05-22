import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

 
 import ProfileSkeleton from "@/features/user/components/skeletons/ProfileSkeleton";

const ProfilePage = lazy(() =>
  import("@/features/user/pages/ProfilePage")
);

export const Route = createFileRoute("/_user/profile")({
  
  component: () => (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePage />
    </Suspense>
  ),
});

