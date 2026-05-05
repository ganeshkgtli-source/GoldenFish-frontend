 
import   { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { routeTree } from "./routeTree.gen";

import { initApiAuth } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

const router = createRouter({ routeTree });

function Root() {
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

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    </ThemeProvider>
  // </React.StrictMode>
);
 