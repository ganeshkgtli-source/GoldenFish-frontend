/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";

import { visualizer } from "rollup-plugin-visualizer";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import path from "path";

export default defineConfig({
  plugins: [
    tanstackRouter(),

    react(),

    visualizer({
      filename: "stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("react-dom") || id.includes("/react/")) {
            return "react";
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (id.includes("@tanstack/react-query")) {
            return "query";
          }

          if (id.includes("axios")) {
            return "axios";
          }

          if (id.includes("react-toastify")) {
            return "toast";
          }
        },
      },
    },
  },

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
