import api from "@/lib/api";
import axios from "axios";

/* ================= TYPES ================= */

export type RegisterPayload = {
  email: string;
  password: string;
  username?: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type AuthResponse = {
  access: string;
  refresh: string;
  user?: {
    id: string;
    email: string;
  };
};
export type LoginResponse = {
  message: string;
username: string;
  tokens: {
    access: string;
    refresh: string;
  };

  role: "ADMIN" | "SUPER_ADMIN" | "USER";

  redirect_to: string;

  dhan_login_url: string | null;

  email_verification_required?: boolean;
  email?: string;
};
/* ================= ERROR HANDLER ================= */

type ApiError = {
  message?: string;
  error?: string;
  detail?: string;
  [key: string]: any;
};

export const parseError = (err: unknown): string => {
  // ✅ Axios error (backend response)
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined;

    if (!data) return err.message || "Request failed";

    // 1️⃣ direct fields
    if (typeof data.message === "string") return data.message;
    if (typeof data.error === "string") return data.error;
    if (typeof data.detail === "string") return data.detail;

    // 2️⃣ array response
    if (Array.isArray(data)) {
      return data.join(", ");
    }

    // 3️⃣ nested validation errors (Django / DRF / custom)
    const messages: string[] = [];

    Object.values(data).forEach((value) => {
      if (Array.isArray(value)) {
        messages.push(...value.map(String));
      } else if (typeof value === "string") {
        messages.push(value);
      }
    });

    if (messages.length > 0) {
      return messages.join(", ");
    }

    // fallback
    return err.message || "Request failed";
  }

  // ✅ JS error
  if (err instanceof Error) {
    return err.message;
  }

  return "Something went wrong";
};

/* ================= REGISTER ================= */

export const registerUser = async (data: RegisterPayload): Promise<any> => {
  try {
    const res = await api.post("/register/", data);
    return res.data;
  } catch (err) {
    throw new Error(parseError(err));
  }
};

/* ================= LOGIN ================= */

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await api.post("/login/", data);

    if (res.data?.error) {
      throw new Error(res.data.error);
    }

    return res.data;
  } catch (err) {
    throw new Error(parseError(err));
  }
};

/* ================= VERIFY OTP ================= */

export const verifyOtp = async (email: string, otp: string): Promise<any> => {
  try {
    const res = await api.post("/verify-email/", { email, otp });

    if (res.data.status !== "success") {
      throw new Error(res.data.message || res.data.error || "Invalid OTP");
    }

    return res.data;
  } catch (err) {
    throw new Error(parseError(err));
  }
};

/* ================= RESEND OTP ================= */

export const resendOtp = async (email: string): Promise<any> => {
  try {
    const res = await api.post("/resend-email-otp/", { email });
    return res.data;
  } catch (err: unknown) {
    // preserve backend response (rate limit, blocked, etc.)
    if (axios.isAxiosError(err) && err.response) {
      throw err;
    }

    throw new Error(parseError(err));
  }
};

/* ================= FORGOT PASSWORD ================= */

export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const res = await api.post("/forgot-password/", { email });

    if (res.data?.error) {
      throw new Error(
        res.data.message || res.data.error || "Failed to send reset link",
      );
    }

    return res.data;
  } catch (err) {
    throw new Error(parseError(err));
  }
};

/* ================= RESET PASSWORD ================= */

export const resetPassword = async (data: {
  uid: string;
  token: string;
  password: string;
}): Promise<any> => {
  try {
    const res = await api.post("/reset-password/", data);

    if (res.data?.error) {
      throw new Error(
        res.data.error || res.data.message || "Failed to reset password",
      );
    }

    return res.data;
  } catch (err) {
    throw new Error(parseError(err));
  }
};

/* ================= LOGOUT ================= */

export const logoutUser = async (): Promise<void> => {
  try {
    const refresh =
      localStorage.getItem("refresh") || sessionStorage.getItem("refresh");

    if (refresh) {
      await api.post("/logout/", { refresh });
    }
  } catch {
    // silent fail → don't block logout
  } finally {
    // always clear storage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    localStorage.removeItem("rememberMe");
  }
};

/* ================= PROFILE ================= */

export type UserProfile = {
  id: string;
  email: string;
  username?: string;
};

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const res = await api.get("/profile/");
    return res.data;
  } catch (err) {
    throw new Error(parseError(err));
  }
};
