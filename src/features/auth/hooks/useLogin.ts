import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/authApi";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};