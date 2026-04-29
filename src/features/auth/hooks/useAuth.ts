import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  logoutUser,
  getProfile,
 
} from "../api/authApi";
import type { UserProfile } from "../api/authApi";
import { normalizeRole, roleService, sessionService, tokenService } from "@/lib/auth";

/* ================= LOGIN ================= */
export const useLogin = () => {
const queryClient = useQueryClient();

return useMutation({
mutationFn: loginUser,

onSuccess: (data) => {
  /* ================= STORE AUTH ================= */

  // ✅ ALWAYS store tokens in localStorage (via service)
  tokenService.set(data.tokens.access, data.tokens.refresh);

  // ✅ normalize and store role
  const role = normalizeRole(data.role);
  roleService.set(role);

  // ✅ start session (important for non-remember users)
  sessionService.start();

  /* ================= REFETCH ================= */

  queryClient.invalidateQueries({ queryKey: ["profile"] });
},

retry: 1,

});
};

/* ================= REGISTER ================= */
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    retry: 1,
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

    retry: 1,
  });
};

/* ================= RESEND OTP ================= */
export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,

    retry: 1,

    // 🔥 useful for rate limit UI
    onError: (err: any) => {
      if (err?.response?.data?.remaining_time) {
        console.warn("Retry after:", err.response.data.remaining_time);
      }
    },
  });
};

/* ================= FORGOT PASSWORD ================= */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    retry: 1,
  });
};

/* ================= RESET PASSWORD ================= */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    retry: 1,
  });
};

/* ================= LOGOUT ================= */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      // ✅ clear all cached data
      queryClient.clear();
    },

    onSettled: () => {
      // fallback (even if API fails)
      queryClient.clear();
    },
  });
};

/* ================= PROFILE ================= */
export const useProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: getProfile,

    retry: 1,

    staleTime: 1000 * 60 * 5, // ✅ cache for 5 min
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    // 🔥 only fetch if logged in
    enabled:
      !!localStorage.getItem("access") ||
      !!sessionStorage.getItem("access"),
  });
};