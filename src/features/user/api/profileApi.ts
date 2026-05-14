import api from "@/lib/api";

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

  dhan_client_ucc: string;
};
 

/* ================= GET PROFILE ================= */
export const getProfile = async (): Promise<ProfileResponse> => {

  const res = await api.get(
    "/profile/"
  );
console.log("PROFILE RESPONSE:", res.data);
  return res.data.data;
};

/* ================= UPDATE API ================= */
export const updateApiCredentials = async (data: {
  api_key: string;
  api_secret: string;
  password: string;
}) => {
  const res = await api.post("/profile/update-credentials/", data);
  return res.data;
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (data: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  const res = await api.post("/profile/change-password/", data);
  return res.data;
};

/* ================= SEND OTP ================= */
export const sendOtp = async () => {
  const res = await api.post("/profile/send-otp/");
  return res.data;
};

/* ================= VERIFY OTP ================= */
export const verifyOtpPassword = async (data: {
  otp: string;
  new_password: string;
  confirm_password: string;
}) => {
  const res = await api.post("/profile/verify-otp-password/", data);
  return res.data;
};


 
