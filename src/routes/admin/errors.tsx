import { createFileRoute } from "@tanstack/react-router";
 import { requireAdmin } from "@/lib/auth";
import ErrorLogPage from "@/features/admin/operations/pages/ErrorLogsPage";
 
export const Route = createFileRoute("/admin/errors")({
  beforeLoad: () => {
      requireAdmin(); // ✅ THIS WAS MISSING
    },
  component: ErrorLogPage,
});