// /// <reference types="vitest" />
// import { defineConfig } from "vitest/config";
// import react from "@vitejs/plugin-react";
// import { tanstackRouter } from "@tanstack/router-plugin/vite";
// import path from "path";

// export default defineConfig({
//   plugins: [
//     tanstackRouter(),
//     react(),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   test: {
//     globals: true,
//     environment: "jsdom",
//   },
// });

/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig({
  plugins: [
    tanstackRouter(),
    react(),
  ],

  server: {
    host: "0.0.0.0",
    port: 5173,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
  },
});