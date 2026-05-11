import api from "@/lib/api";

/* ================= TYPES ================= */

export type ProfileResponse = {
  username: string;
  email: string;
  phone: string;
};

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export type OtpVerifyPayload = {
   otp: string;
  new_password: string;
  confirm_password: string;
};

export type ApiResponse = {
  message?: string;
  force_logout?: boolean;
};

/* ================= API ================= */

export const operationsApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const { data } = await api.get("profile/");
    return data;
  },

  changePassword: async (
    payload: ChangePasswordPayload
  ): Promise<ApiResponse> => {
    const { data } = await api.post("/profile/change-password/", payload);
    return data;
  },

  sendOtp: async (): Promise<ApiResponse> => {
    const { data } = await api.post("/profile/send-otp/");
    return data;
  },

verifyOtpPassword: async (
  payload: OtpVerifyPayload
): Promise<ApiResponse> => {
  if (!payload.otp) throw new Error("OTP is required");
  
  const { data } = await api.post(
    "/profile/verify-otp-password/",
    payload
  );
  return data;
},
};