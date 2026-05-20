import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

import Root from "./Root";
import { ThemeProvider } from "./context/ThemeContext";
import { queryClient } from "./lib/queryClient";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <Root />
       <ToastContainer
      position="top-right"
      theme="colored"
      autoClose={2500}
      newestOnTop
      pauseOnFocusLoss={false}
    />
    </QueryClientProvider>
  </ThemeProvider>
);