 import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/auth";
import Profile from "@/features/admin/operations/pages/Profile";

export const Route = createFileRoute("/admin/profile")({
  beforeLoad: () => {
    requireAdmin(); // 🔐 only admin & super_admin
  },
  component: Profile,
});