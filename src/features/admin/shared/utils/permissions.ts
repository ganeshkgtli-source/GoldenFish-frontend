export type Role = "admin" | "super";

export const hasAccess = (role: Role, path: string) => {
  // 🔒 Super-only routes
  if (path.startsWith("/admin/super")) {
    return role === "super";
  }

  // ✅ Admin + Super
  if (path.startsWith("/admin")) {
    return role === "admin" || role === "super";
  }

  return true;
};