import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { routeTree } from "./routeTree.gen";

import { initApiAuth } from "@/lib/api";
import { isAuthenticated, tokenService, isTokenValid } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";

/* ================= ROUTER ================= */

const router = createRouter({ routeTree });

/* ================= AUTH HYDRATOR ================= */

function hydrateUserFromToken() {
  const token = tokenService.getAccess();

  if (!token || !isTokenValid(token)) return;

  try {
    const decoded: any = jwtDecode(token);

    useAuthStore.getState().setUser({
      username: decoded.username || "",
      role: decoded.role || "user",
    });

    console.log("✅ USER RESTORED FROM TOKEN");
  } catch (err) {
    console.log("❌ Invalid token");
  }
}

/* ================= ROOT ================= */

function Root() {
  const [ready, setReady] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      try {
        // 🔥 1. Refresh token if needed
        await initApiAuth();

        // 🔥 2. Restore user from token (CRITICAL FIX)
        hydrateUserFromToken();

        // 🔥 3. If still not authenticated → clear store
        if (!isAuthenticated()) {
          useAuthStore.getState().clearUser();
        }

        // 🔥 4. Refetch profile
        queryClient.invalidateQueries({ queryKey: ["profile"] });

      } catch (err) {
        console.error("Auth init failed:", err);
        useAuthStore.getState().clearUser();
      } finally {
        setReady(true);
      }
    };

    init();
  }, []);

  /* ================= LOADING ================= */

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

/* ================= APP ================= */

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </ThemeProvider>
);