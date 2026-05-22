 
import { Suspense, lazy } from "react";

import { createFileRoute } from "@tanstack/react-router";

import UserDashboardLoader from "@/components/UserDashboardLoader";

 
const OrdersPage = lazy(() =>
  import("@/features/user/pages/OrdersPage")
);

export const Route = createFileRoute("/_user/orders")({
  
  component: () => (
<Suspense fallback={<UserDashboardLoader sidebar={false} />}>      <OrdersPage />
    </Suspense>
  ),
});

