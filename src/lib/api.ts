import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

import { isTokenValid, tokenService } from "@/lib/auth";

/* ================= ENV ================= */

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is missing");
}

/* ================= TYPES ================= */

type RefreshResponse = {
  access: string;
  refresh: string;
};

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: BASE_URL,

  timeout: 60000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",

    Accept: "application/json",
  },
});

/* ================= PUBLIC ROUTES ================= */

const PUBLIC_ROUTES = [
  "/register/",
  "/signin/",
  "/verify-email/",
  "/resend-email-otp/",
  "/token/refresh/",
  "/forgot-password/",
  "/reset-password/",
];

const isPublicRoute = (url?: string) => {
  if (!url) return false;

  return PUBLIC_ROUTES.some((route) => url.includes(route));
};

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenService.getAccess();

  if (token && config.url && !isPublicRoute(config.url)) {
    config.headers.set("Authorization", `Bearer ${token}`);

    config.headers.set("X-Requested-With", "XMLHttpRequest");
  }

  return config;
});

/* ================= REFRESH CONTROL ================= */

let refreshPromise: Promise<boolean> | null = null;

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

/* ================= TOKEN EXPIRY ================= */

const getRefreshDelay = (token: string) => {
  try {
    const decoded: {
      exp: number;
    } = jwtDecode(token);

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

  sessionStorage.removeItem("sessionAlive");

  window.location.replace("/signin");
};

/* ================= REFRESH TOKEN ================= */

export const refreshAccessToken = async (): Promise<boolean> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refresh = tokenService.getRefresh();

      if (!refresh) {
        throw new Error("No refresh token");
      }

      const res = await axios.post<RefreshResponse>(
        `${BASE_URL}/token/refresh/`,
        { refresh },
        {
          withCredentials: true,

          timeout: 10000,

          headers: {
            "Content-Type": "application/json",

            Accept: "application/json",
          },
        },
      );

      tokenService.set(res.data.access, res.data.refresh);

      scheduleRefresh(res.data.access);

      return true;
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number;
        };
      };

      if (
        axiosErr?.response?.status === 401 ||
        axiosErr?.response?.status === 403
      ) {
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

  if (!refresh) {
    return false;
  }

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
    const req = error.config as InternalAxiosRequestConfig & {
      _retryCount?: number;
    };

    if (!req) {
      return Promise.reject(error);
    }

    /* ========== NETWORK ERROR ========== */

    if (!error.response) {
      console.error("Network error");

      return Promise.reject(error);
    }

    const isPublic = isPublicRoute(req.url);

    req._retryCount = req._retryCount ?? 0;

    /* ========== ACCESS DENIED ========== */

    if (error.response?.status === 403) {
      console.error("Access denied");

      return Promise.reject(error);
    }

    /* ========== TOKEN EXPIRED ========== */

    if (error.response?.status === 401 && !isPublic && req._retryCount < 1) {
      req._retryCount++;

      const success = await refreshAccessToken();

      if (success) {
        req.headers.set("Authorization", `Bearer ${tokenService.getAccess()}`);

        return api(req);
      }

      logout();
    }

    return Promise.reject(error);
  },
);

/* ================= EXPORT ================= */

export default api;
