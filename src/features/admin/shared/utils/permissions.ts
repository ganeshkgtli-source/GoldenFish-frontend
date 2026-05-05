import type { Role } from "@/lib/auth";

export const hasAccess = (role: Role, path: string): boolean => {
  // Super-admin only routes
  if (path.startsWith("/super-admin")) {
    return role === "super_admin";
  }

  // Admin + super_admin routes
  if (path.startsWith("/admin")) {
    return role === "admin" || role === "super_admin";
  }

  return true;
};
