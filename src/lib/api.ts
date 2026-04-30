import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { isTokenValid, tokenService } from "@/lib/auth";

/* ================= ENV ================= */

const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) throw new Error("VITE_API_URL is missing");
console.log(import.meta.env.VITE_API_URL);

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
baseURL: BASE_URL,
timeout: 10000,
headers: { "Content-Type": "application/json" },
});

/* ================= PUBLIC ROUTES ================= */

const PUBLIC_ROUTES = new Set([
"/register/",
"/login/",
"/verify-email/",
"/resend-email-otp/",
"/token/refresh/",
"/forgot-password/",
"/reset-password/",
]);

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
(config: InternalAxiosRequestConfig) => {
const token = tokenService.getAccess();

if (token && config.url && !PUBLIC_ROUTES.has(config.url)) {
  config.headers.set("Authorization", `Bearer ${token}`);
}

return config;
 
}
);

/* ================= REFRESH CONTROL ================= */

let refreshPromise: Promise<boolean> | null = null;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

/* ================= TOKEN EXPIRY ================= */

const getRefreshDelay = (token: string) => {
try {
const decoded: any = jwtDecode(token);
return Math.max(decoded.exp * 1000 - Date.now() - 5000, 0);
} catch {
return 0;
}
};

/* ================= SCHEDULER ================= */

const scheduleRefresh = (token: string) => {
stopRefresh();

const delay = getRefreshDelay(token);

refreshTimeout = setTimeout(() => {
refreshAccessToken();
}, delay);
};

const stopRefresh = () => {
if (refreshTimeout) {
clearTimeout(refreshTimeout);
refreshTimeout = null;
}
};

/* ================= LOGOUT ================= */

export const logout = () => {
stopRefresh();
tokenService.clear();
sessionStorage.clear();

window.location.replace("/login");
};

/* ================= REFRESH ================= */

export const refreshAccessToken = async (): Promise<boolean> => {
if (refreshPromise) return refreshPromise;

refreshPromise = (async () => {
try {
const refresh = tokenService.getRefresh();
if (!refresh) throw new Error("No refresh token");

 
  const res = await axios.post(`${BASE_URL}token/refresh/`, {
    refresh,
  });

  tokenService.set(res.data.access, res.data.refresh);
  scheduleRefresh(res.data.access);

  return true;
}catch (err: any) {
  // 🔥 ONLY logout if refresh token is invalid
  if (err?.response?.status === 401) {
    logout();
  }

  return false;
} finally {
  refreshPromise = null;
}
 

})();

return refreshPromise;
};

/* ================= INIT SESSION ================= */

export const initApiAuth = async () => {
  const access = tokenService.getAccess();
  const refresh = tokenService.getRefresh();
  const rememberMe = localStorage.getItem("rememberMe");

  if (!refresh) return false;

  // 🔥 if access token expired → try refresh
  if (!access || !isTokenValid(access)) {
    const success = await refreshAccessToken();
    return success;
  }

  if (rememberMe === "false" && !sessionStorage.getItem("sessionAlive")) {
    logout();
    return false;
  }

  sessionStorage.setItem("sessionAlive", "true");

  scheduleRefresh(access);

  return true;
};

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const req: any = error.config;
    if (!req) return Promise.reject(error);

    const isPublic = PUBLIC_ROUTES.has(req.url);
    req._retryCount = req._retryCount || 0;

    // 🔥 only handle 401 from protected routes
    if (
      error.response?.status === 401 &&
      !isPublic &&
      req._retryCount < 1
    ) {
      req._retryCount++;

      const success = await refreshAccessToken();

      if (success) {
        req.headers.set(
          "Authorization",
          `Bearer ${tokenService.getAccess()}`
        );
        return api(req);
      }

      // ❌ refresh failed → logout
      logout();
    }

    return Promise.reject(error);
  }
);

/* ================= CROSS TAB SYNC ================= */

window.addEventListener("storage", (e) => {
if (e.key === "access" && !e.newValue) {
window.location.replace("/login");
}
});

export default api;
