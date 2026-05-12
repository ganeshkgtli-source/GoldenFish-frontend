import api from "@/lib/api";
import { tokenService } from "@/lib/auth";
import axios from "axios";

/* ================= TYPES ================= */

export type Tokens = {
  access: string;
  refresh: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  username?: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  username: string;
  tokens: Tokens;
  role: "ADMIN" | "SUPER_ADMIN" | "USER";
  redirect_to: string;
  dhan_login_url: string | null;

  login_state?: string;
  is_kyc_verified?: boolean;
  email_verification_required?: boolean;
  email?: string;
};
export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export interface KycResponse {
  status: string;

  message: string;

  is_kyc_verified?: boolean;
}
export type ApiResponse = {
  status?: string;
  message?: string;
  error?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  username?: string;
};

/* ================= ERROR HANDLER ================= */

type ApiError = {
  message?: string;
  error?: string;
  detail?: string;
  [key: string]: unknown;
};
export type CheckUserExistsResponse = {
  exists: boolean;
  message?: string;
};
export const parseError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const responseData = err.response?.data;

    // =====================================
    // ARRAY RESPONSE
    // =====================================
    if (Array.isArray(responseData)) {
      return responseData.map(String).join(", ");
    }

    // =====================================
    // OBJECT RESPONSE
    // =====================================
    const data = responseData as ApiError | undefined;

    if (!data) {
      return err.message || "Request failed";
    }

    // =====================================
    // COMMON FIELDS
    // =====================================
    if (typeof data.message === "string") {
      return data.message;
    }

    if (typeof data.error === "string") {
      return data.error;
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }

    // =====================================
    // VALIDATION ERRORS
    // =====================================
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

    return err.message || "Request failed";
  }

  // =====================================
  // NORMAL JS ERROR
  // =====================================
  if (err instanceof Error) {
    return err.message;
  }

  // =====================================
  // UNKNOWN ERROR
  // =====================================
  return "Something went wrong";
};
/* ================= REGISTER ================= */

export const registerUser = async (
  data: RegisterPayload,
): Promise<ApiResponse> => {
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
export const submitKycVerification = async (
  formData: FormData,
): Promise<KycResponse> => {
  try {
    const res = await api.post(
      "/kyc_verify/",

      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (res.data?.error) {
      throw new Error(res.data.error);
    }

    return res.data;
  } catch (err) {
    throw new Error(parseError(err));
  }
};

export const checkUserExists = async (payload: {
  username: string;
  email: string;
  phone: string;
}): Promise<CheckUserExistsResponse> => {
  const res = await api.post<CheckUserExistsResponse>(
    "/check-user-exists/",
    payload,
  );

  return res.data;
};
/* ================= VERIFY OTP ================= */

export const verifyOtp = async (
  payload: VerifyOtpPayload,
): Promise<ApiResponse> => {
  try {
    const res = await api.post("/verify-email/", payload);

    // ✅ HANDLE FAILURE RESPONSE (if backend returns 200 but error inside)
    if (
      res.data?.status === "error" ||
      res.data?.error ||
      res.data?.success === false
    ) {
      throw new Error(res.data.message || res.data.error || "Invalid OTP");
    }

    return res.data;
  } catch (err) {
    // if (axios.isAxiosError(err) && err.response?.data) {
    //     const data = err.response.data;

    //     throw new Error(
    //       data.message ||
    //       data.error ||
    //       "Invalid OTP"
    //     );
    //   }

    throw new Error(parseError(err));
  }
};
/* ================= RESEND OTP ================= */

export const resendOtp = async (email: string): Promise<ApiResponse> => {
  try {
    const res = await api.post("/resend-email-otp/", { email });
    return res.data;
  } catch (err) {
    throw new Error(parseError(err)); // ✅ FIXED (no raw axios throw)
  }
};

/* ================= FORGOT PASSWORD ================= */

export const forgotPassword = async (email: string): Promise<ApiResponse> => {
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
}): Promise<ApiResponse> => {
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
    // silent fail
  } finally {
    tokenService.clear();
  }
};

/* ================= PROFILE ================= */

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const res = await api.get("/profile/");
    return res.data;
  } catch (err) {
    throw new Error(parseError(err));
  }
};
