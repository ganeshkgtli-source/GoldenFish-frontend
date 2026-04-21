import axios from "axios";

/* ================= API INSTANCE ================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // ✅ prevents hanging requests
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= AUTH HEADER ================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  const publicRoutes = [
    "/register/",
    "/login/",
    "/verify-email/",
    "/resend-email-otp/", // ✅ added
    "/token/refresh/",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.includes(route)
  );

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= REFRESH CONTROL ================= */
let refreshTimer: ReturnType<typeof setInterval> | null = null;
let refreshPromise: Promise<boolean> | null = null;

/* ================= LOGOUT ================= */
export const logout = () => {
  stopRefreshTimer();

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  window.location.href = "/login";
};

/* ================= REFRESH TOKEN ================= */
export const refreshAccessToken = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refresh = localStorage.getItem("refresh");

      if (!refresh) throw new Error("No refresh token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/token/refresh/`,
        { refresh }
      );

      localStorage.setItem("access", res.data.access);

      if (res.data.refresh) {
        localStorage.setItem("refresh", res.data.refresh);
      }

      if (import.meta.env.DEV) {
        console.log("✅ Access token refreshed");
      }

      return true;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.log("❌ Refresh failed");
      }

      logout();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/* ================= AUTO REFRESH TIMER ================= */
export const startRefreshTimer = () => {
  stopRefreshTimer();

  if (!localStorage.getItem("access")) return; // ✅ safety

  refreshTimer = setInterval(async () => {
    await refreshAccessToken();
  }, 50 * 1000);

  if (import.meta.env.DEV) {
    console.log("⏱️ Auto refresh started");
  }
};

/* ================= STOP TIMER ================= */
export const stopRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

/* ================= SESSION VALIDATION ================= */
export const validateSession = async () => {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) {
    logout();
    return false;
  }

  startRefreshTimer();
  return true;
};

/* ================= 401 FALLBACK ================= */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error); // ✅ safety

    const authExcludedRoutes = [
      "/register/",
      "/login/",
      "/verify-email/",
      "/resend-email-otp/", // ✅ added
      "/token/refresh/",
    ];

    const shouldSkipRefresh = authExcludedRoutes.some((route) =>
      originalRequest.url?.includes(route)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      originalRequest._retry = true;

      const success = await refreshAccessToken();

      if (success) {
        originalRequest.headers.Authorization =
          `Bearer ${localStorage.getItem("access")}`;

        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;