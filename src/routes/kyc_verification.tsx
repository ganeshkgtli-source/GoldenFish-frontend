import { createFileRoute } from "@tanstack/react-router";

import KycVerificationPage
from "@/features/auth/pages/KycVerificationPage";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute( "/kyc_verification")({
    beforeLoad: () => {
          requireAuth();
        },
    component:
      KycVerificationPage,
  });