
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { routeTree } from "./routeTree.gen";

import { initApiAuth } from "@/lib/api"; // 🔥 IMPORTANT

// ✅ Create router
const router = createRouter({ routeTree });

// ✅ Root Component
function Root() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initApiAuth(); // 🔥 wait for auth
      } catch (err) {
        console.error("Auth init failed:", err);
      } finally {
        setReady(true);
      }
    };

    init();
  }, []);

  // ⛔ Block app until auth is checked
  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

// ✅ Render App
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
 
