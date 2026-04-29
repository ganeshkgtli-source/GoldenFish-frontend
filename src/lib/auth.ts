import { redirect } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";

/* ================= TYPES ================= */

export type Role = "user" | "admin" | "super_admin";

export const normalizeRole = (
role: "USER" | "ADMIN" | "SUPER_ADMIN"
): Role => {
return role.toLowerCase() as Role;
};

type JWTPayload = {
exp: number;
[key: string]: unknown;
};

/* ================= TOKEN SERVICE ================= */

export const tokenService = {
getAccess: () => localStorage.getItem("access"),
getRefresh: () => localStorage.getItem("refresh"),

set: (access: string, refresh?: string) => {
localStorage.setItem("access", access);
if (refresh) localStorage.setItem("refresh", refresh);
},

clear: () => {
localStorage.removeItem("access");
localStorage.removeItem("refresh");
localStorage.removeItem("rememberMe");

 
roleService.clear();
userService.clear();
 

},
};

/* ================= SESSION SERVICE ================= */

export const sessionService = {
start() {
sessionStorage.setItem("sessionAlive", "true");
},

isAlive() {
return sessionStorage.getItem("sessionAlive") === "true";
},

clear() {
sessionStorage.removeItem("sessionAlive");
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
localStorage.setItem("role", role);
},

clear() {
localStorage.removeItem("role");
sessionStorage.removeItem("role");
},
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
localStorage.setItem("username", username);
},

clear() {
localStorage.removeItem("username");
sessionStorage.removeItem("username");
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
throw redirect({ to: "/" });
}
};

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
if (e.key === "access" && !e.newValue) {
window.location.replace("/login");
}
});

/* ================= HELPERS ================= */

export const getUserRole = () => roleService.get();
