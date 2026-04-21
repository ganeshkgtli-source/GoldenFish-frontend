import { useMutation } from "@tanstack/react-query";
import { registerUser, verifyOtp,resendOtp } from "../api/authApi";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

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


export const useResendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => resendOtp(email),
  });
};