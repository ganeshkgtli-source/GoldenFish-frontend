import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import PageLoader from "@/components/PageLoader";

import { requireAuth } from "@/lib/auth";

const KycVerificationPage = lazy(() =>
  import("@/features/auth/pages/KycVerificationPage")
);

export const Route = createFileRoute("/kyc_verification")({
  beforeLoad: () => {
    requireAuth();
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <KycVerificationPage />
    </Suspense>
  ),
});

