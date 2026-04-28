import { redirect } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";

/* ================= TYPES ================= */

export type Role = "user" | "admin" | "super_admin";
export const normalizeRole = (
  role: "USER" | "ADMIN" | "SUPER_ADMIN"
): "user" | "admin" | "super_admin" => {
  return role.toLowerCase() as "user" | "admin" | "super_admin";
};
type JWTPayload = {
  exp: number;
  [key: string]: unknown;
};

/* ================= STORAGE ================= */

const getStorage = () =>
  localStorage.getItem("rememberMe") === "true"
    ? localStorage
    : sessionStorage;

/* ================= TOKEN SERVICE ================= */

export const tokenService = {
  getAccess(): string | null {
    return getStorage().getItem("access");
  },

  getRefresh(): string | null {
    return getStorage().getItem("refresh");
  },

  set(access: string, refresh?: string) {
    const s = getStorage();
    s.setItem("access", access);
    if (refresh) s.setItem("refresh", refresh);
  },

  clear() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    localStorage.removeItem("rememberMe");

    roleService.clear(); 
    userService.clear();
  },
};

/* ================= ROLE SERVICE ================= */

export const roleService = {
  get(): Role | null {
    return (
      (localStorage.getItem("role") ||
        sessionStorage.getItem("role")) as Role | null
    );
  },

  set(role: Role) {
    const storage = getStorage();
    storage.setItem("role", role);
  },

  clear() {
    localStorage.removeItem("role");
    sessionStorage.removeItem("role");
  },
};

/* ================= AUTH CHECK ================= */

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  const token = tokenService.getAccess();
  return !!token && isTokenValid(token);
};

/* ================= ROLE CHECK ================= */

export const hasRole = (allowed: Role[]): boolean => {
  const role = roleService.get();
  return !!role && allowed.includes(role);
};

/* ================= ROUTE GUARDS ================= */

export const requireAuth = () => {
  if (!isAuthenticated()) {
    throw redirect({ to: "/login" });
  }
};

export const requireGuest = () => {
  if (isAuthenticated()) {
    throw redirect({ to: "/" });
  }
};

export const requireRole = (allowed: Role[]) => {
  const role = roleService.get();

  if (!role || !allowed.includes(role)) {
    throw redirect({ to: "/" }); // or "/403"
  }
};

/* ================= HELPER GUARDS ================= */

export const requireAdmin = () => {
  requireAuth();
  requireRole(["admin", "super_admin"]);
};

export const requireSuperAdmin = () => {
  requireAuth();
  requireRole(["super_admin"]);
};

/* ================= CROSS TAB SYNC ================= */

window.addEventListener("storage", (e) => {
  if (
    (e.key === "access" || e.key === "refresh") &&
    !e.newValue
  ) {
    tokenService.clear();
  }
});
export const getUserRole = () => {
  return roleService.get();
};

/* ================= USER SERVICE ================= */

export const userService = {
  get(): string | null {
    return (
      localStorage.getItem("username") ||
      sessionStorage.getItem("username")
    );
  },

  set(username: string) {
    const storage = getStorage();
    storage.setItem("username", username);
  },

  clear() {
    localStorage.removeItem("username");
    sessionStorage.removeItem("username");
  },
};