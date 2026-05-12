import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

import Root from "./Root";
import { ThemeProvider } from "./context/ThemeContext";
import { queryClient } from "./lib/queryClient";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </ThemeProvider>
);