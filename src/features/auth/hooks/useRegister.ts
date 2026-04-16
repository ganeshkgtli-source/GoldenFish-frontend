import { useMutation } from "@tanstack/react-query";
import { registerUser, verifyOtp } from "../api/authApi";

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