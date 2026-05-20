import api from "@/lib/api";

/* ════════════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════════════ */

export type ProfileResponse = {
  user: {
    username: string;
    email: string;
    phone: string;
    client_id: string;
    api_key: string;
    api_secret: string;
    is_email_verified: boolean;
  };

  days_left: {
    months: number;
    days: number;

    joined_month: string;
    joined_year: number;
  };

  dhan_client_ucc: string;
};

export type ApiResponse = {
  success?: boolean;

  force_logout?: boolean;

  message?: string;
};

export type UpdateApiPayload = {
  api_key: string;
  api_secret: string;
  password: string;
};

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export type VerifyOtpPayload = {
  otp: string;
  new_password: string;
  confirm_password: string;
};

/* ════════════════════════════════════════════════════════════
   GET PROFILE
════════════════════════════════════════════════════════════ */

export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await api.get("/profile/");

  return res.data.data;
};

/* ════════════════════════════════════════════════════════════
   UPDATE API CREDENTIALS
════════════════════════════════════════════════════════════ */

export const updateApiCredentials = async (
  data: UpdateApiPayload,
): Promise<ApiResponse> => {
  const res = await api.post("/profile/update-credentials/", data);

  return res.data;
};

/* ════════════════════════════════════════════════════════════
   CHANGE PASSWORD
════════════════════════════════════════════════════════════ */

export const changePassword = async (
  data: ChangePasswordPayload,
): Promise<ApiResponse> => {
  const res = await api.post("/profile/change-password/", data);

  return res.data;
};

/* ════════════════════════════════════════════════════════════
   SEND OTP
════════════════════════════════════════════════════════════ */

export const sendOtp = async (): Promise<ApiResponse> => {
  const res = await api.post("/profile/send-otp/");

  return res.data;
};

/* ════════════════════════════════════════════════════════════
   VERIFY OTP PASSWORD
════════════════════════════════════════════════════════════ */

export const verifyOtpPassword = async (
  data: VerifyOtpPayload,
): Promise<ApiResponse> => {
  const res = await api.post("/profile/verify-otp-password/", data);

  return res.data;
};
