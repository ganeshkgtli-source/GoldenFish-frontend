import { useEffect, useRef, useState } from "react";
import { RouterProvider } from "@tanstack/react-router";

import { initApiAuth } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

import { queryClient } from "./lib/queryClient";
import { router } from "./router";

export default function Root() {
  const [ready, setReady] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;

    const init = async () => {
      try {
        await initApiAuth();

        if (!isAuthenticated()) {
          useAuthStore.getState().clearUser();
        }

        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });
      } catch (err) {
        console.error("Auth init failed:", err);
        useAuthStore.getState().clearUser();
      } finally {
        setReady(true);
      }
    };

    init();
  }, []);

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}