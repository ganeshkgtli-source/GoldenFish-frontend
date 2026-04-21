import api from "@/lib/api";
 

export const registerUser = async (data: any) => {
  const res = await api.post("/register/", data);
  return res.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await api.post("/verify-email/", {
    email,
    otp,
  });

  if (res.data.status !== "success") {
    throw new Error(
      res.data.message ||
      res.data.error ||
      "Invalid OTP"
    );
  }

  return res.data;
};
 

export const loginUser = async (data: {
  identifier: string;
  password: string;
}) => {
  const res = await api.post("/login/", data);
  return res.data;
};

export const resendOtp = async (email: string) => {
  const res = await api.post("/resend-email-otp/", {
    email,
  });

  if (res.data.status === "error" || res.data.error) {
    throw new Error(
      res.data.message ||
      res.data.error ||
      "Failed to resend OTP"
    );
  }

  return res.data;
};