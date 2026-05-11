import { redirect } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/authStore";

/* ================= TYPES ================= */

type JWTPayload = {
  exp: number;
  [key: string]: unknown;
};

// FIX: unified Role type — was "admin"|"super" in permissions.ts vs "admin"|"super_admin" here
export type Role = "user" | "admin" | "super_admin";

export const normalizeRole = (role?: string): Role => {
  const normalized = role?.trim().toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "super_admin") return "super_admin";
  return "user";
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
    useAuthStore.getState().clearUser();
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

/* ================= TOKEN CHECK ================= */

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
  const roleStr = useAuthStore.getState().user?.role;
  const role = normalizeRole(roleStr);
  return !!roleStr && allowed.includes(role);
};


/* ================= ROUTE GUARDS ================= */

export const requireAuth = () => {
  const { user } = useAuthStore.getState();
  if (!user) throw redirect({ to: "/signin" });
};

export const requireGuest = () => {
  const { user } = useAuthStore.getState();
  if (user) throw redirect({ to: "/" });
};

export const requireRole = (allowed: Role[]) => {
  const roleStr = useAuthStore.getState().user?.role;
  const role = normalizeRole(roleStr);
  if (!roleStr || !allowed.includes(role)) throw redirect({ to: "/" });
};


export const requireAdmin = () => {
  const { user } = useAuthStore.getState();
  if (!user) throw redirect({ to: "/signin" });
  if (user.role !== "admin" && user.role !== "super_admin") throw redirect({ to: "/" });
};

export const requireSuperAdmin = () => {
  const { user } = useAuthStore.getState();
  if (!user) throw redirect({ to: "/signin" });
  if (user.role !== "super_admin") throw redirect({ to: "/" });
};

/* ================= HELPERS ================= */

export const getUserRole = (): Role | null => {
  const roleStr = useAuthStore.getState().user?.role;
  return roleStr ? normalizeRole(roleStr) : null;
};


// FIX: cross-tab logout listener kept in ONE place only (removed from api.ts duplicate)
// api.ts no longer registers this — auth.ts is the single source
window.addEventListener("storage", (e) => {
  if (e.key === "access" && !e.newValue) {
    window.location.replace("/signin");
  }
});




// import { redirect } from "@tanstack/react-router";
// import { jwtDecode } from "jwt-decode";
// import { useAuthStore } from "@/store/authStore";

// /* ================= TYPES ================= */

// type JWTPayload = {
//   exp: number;
//   [key: string]: unknown;
// };

// export type Role = "user" | "admin" | "super_admin";

// export const normalizeRole = (role?: string): Role => {
//   const normalized = role?.trim().toLowerCase();

//   if (normalized === "admin") return "admin";
//   if (normalized === "super_admin") return "super_admin";

//   return "user"; // fallback
// };

// /* ================= TOKEN SERVICE ================= */

// export const tokenService = {
//   getAccess: () => localStorage.getItem("access"),
//   getRefresh: () => localStorage.getItem("refresh"),

//   set: (access: string, refresh?: string) => {
//     localStorage.setItem("access", access);
//     if (refresh) localStorage.setItem("refresh", refresh);
//   },

//   clear: () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     localStorage.removeItem("rememberMe");

//     // ✅ clear Zustand
//     useAuthStore.getState().clearUser();
//   },
// };

// /* ================= SESSION SERVICE ================= */

// export const sessionService = {
//   start() {
//     sessionStorage.setItem("sessionAlive", "true");
//   },

//   isAlive() {
//     return sessionStorage.getItem("sessionAlive") === "true";
//   },

//   clear() {
//     sessionStorage.removeItem("sessionAlive");
//   },
// };

// /* ================= TOKEN CHECK ================= */

// export const isTokenValid = (token: string): boolean => {
//   try {
//     const decoded = jwtDecode<JWTPayload>(token);
//     return decoded.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// export const isAuthenticated = (): boolean => {
//   const token = tokenService.getAccess();
//   return !!token && isTokenValid(token);
// };

// /* ================= ROLE CHECK ================= */

// export const hasRole = (allowed: Role[]): boolean => {
//   const role = useAuthStore.getState().user?.role;
//   return !!role && allowed.includes(role);
// };

// /* ================= ROUTE GUARDS ================= */

// export const requireAuth = () => {
//   const token = tokenService.getAccess();
//   // const { user } = useAuthStore.getState();

//   // ❌ No token → logout
//   if (!token || !isTokenValid(token)) {
//     throw redirect({ to: "/signin" });
//   }

//   // ✅ Token exists → allow (user will be restored)
//   return;
// };

// // export const requireAuth = () => {
// //   const { user } = useAuthStore.getState();

// //   if (!user) {
// //     throw redirect({ to: "/signin" });
// //   }
// // };

// export const requireGuest = () => {
//   const { user } = useAuthStore.getState();

//   if (user) {
//     throw redirect({ to: "/" });
//   }
// };

// export const requireRole = (allowed: Role[]) => {
//   const role = useAuthStore.getState().user?.role;

//   if (!role || !allowed.includes(role)) {
//     throw redirect({ to: "/" });
//   }
// };

// export const requireAdmin = () => {
//   const { user } = useAuthStore.getState();

//   if (!user) {
//     throw redirect({ to: "/signin" });
//   }

//   if (user.role !== "admin" && user.role !== "super_admin") {
//     throw redirect({ to: "/" });
//   }
// };

// export const requireSuperAdmin = () => {
//   const { user } = useAuthStore.getState();

//   if (!user) {
//     throw redirect({ to: "/signin" });
//   }

//   if (user.role !== "super_admin") {
//     throw redirect({ to: "/" });
//   }
// };

// /* ================= HELPERS ================= */

// export const getUserRole = (): Role | null =>
//   useAuthStore.getState().user?.role ?? null;

// /* ================= CROSS TAB SYNC ================= */

// window.addEventListener("storage", (e) => {
//   if (e.key === "access" && !e.newValue) {
//     window.location.replace("/signin");
//   }
// });