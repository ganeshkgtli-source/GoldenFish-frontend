import api from "@/lib/api";

/* ================= REGISTER ================= */
export const registerUser = async (data: any) => {
  const res = await api.post("/register/", data);
  return res.data;
};

/* ================= LOGIN ================= */
export const loginUser = async (data: {
  identifier: string;
  password: string;
}) => {
  const res = await api.post("/login/", data);

  if (res.data?.error) {
    throw new Error(res.data.error);
  }

  return res.data;
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (email: string, otp: string) => {
  const res = await api.post("/verify-email/", { email, otp });

  if (res.data.status !== "success") {
    throw new Error(
      res.data.message ||
      res.data.error ||
      "Invalid OTP"
    );
  }

  return res.data;
};

/* ================= RESEND OTP ================= */
import axios from "axios";

export const resendOtp = async (email: string) => {
  try {
    const res = await api.post("/resend-email-otp/", { email });
    console.log("Resend OTP response:",res,"data:", res.data); 
    return res.data;

  } catch (err: any) {
    // 🔥 VERY IMPORTANT: preserve backend response
    console.error("Resend OTP error:", err);
    if (axios.isAxiosError(err) && err.response) {
      throw err; // ✅ keep full response (blocked, remaining_time, etc)
    }

    // fallback
    throw new Error("Network error");
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (email: string) => {
  const res = await api.post("/forgot-password/", { email });

  if (res.data.error) {
    throw new Error(
      res.data.message ||
      res.data.error ||
      "Failed to send reset link"
    );
  }

  return res.data;
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (data: {
  uid: string;
  token: string;
  password: string;
}) => {
  const res = await api.post("/reset-password/", data);

  if (res.data.error) {
    throw new Error(
      res.data.error ||
      res.data.message ||
      "Failed to reset password"
    );
  }

  return res.data;
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  try {
    await api.post("/logout/", {
      refresh: localStorage.getItem("refresh"),
    });
  } catch {}

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  sessionStorage.removeItem("access");
  sessionStorage.removeItem("refresh");
  localStorage.removeItem("rememberMe");
};