import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  logoutUser,
} from "../api/authApi";

/* ================= LOGIN ================= */
export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

/* ================= REGISTER ================= */
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

/* ================= VERIFY OTP ================= */
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: ({
      email,
      otp,
    }: {
      email: string;
      otp: string;
    }) => verifyOtp(email, otp),
  });
};

/* ================= RESEND OTP ================= */
export const useResendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => resendOtp(email),
  });
};

/* ================= FORGOT PASSWORD ================= */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
};

/* ================= RESET PASSWORD ================= */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: {
      uid: string;
      token: string;
      password: string;
    }) => resetPassword(data),
  });
};
export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};