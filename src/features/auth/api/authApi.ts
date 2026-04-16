import api from "@/lib/api";
 

export const registerUser = async (data: any) => {
  const res = await api.post("/register/", {
    ...data,
    terms_accepted: data.terms,
  });

  return res.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await api.post("/verify-email/", {
    email,
    otp,
  });

  return res.data;
};