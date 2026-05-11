import { useEffect } from "react";
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
  type UserProfile,
  type LoginPayload,
  type RegisterPayload,
  type VerifyOtpPayload,
  checkUserExists,
  submitKycVerification
} from "../api/authApi";

import {
  normalizeRole,
  sessionService,
  tokenService,
 
} from "@/lib/auth";

import { useAuthStore } from "@/store/authStore";

/* ================= LOGIN ================= */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),

    retry: 1,

    onSuccess: (data) => {
      // 🔥 HANDLE OTP FLOW
      if (data?.email_verification_required) {
        return;
      }

      // 🔥 SAFE TOKEN HANDLING
      if (data?.tokens?.access && data?.tokens?.refresh) {
        tokenService.set(data.tokens.access, data.tokens.refresh);
      } else {
        console.warn("No tokens received");
        return;
      }

      const role = normalizeRole(data.role);
      
      sessionService.start();
      

      setUser({
        username: data.username ?? "",
        role,
        email: data.email ?? "",
        is_kyc_verified: data.is_kyc_verified ?? false,
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

/* ================= REGISTER ================= */

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => registerUser(data),
    retry: 1,
  });
};

/* ================= VERIFY OTP ================= */

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
    retry: 1,
  });
};

/* ================= RESEND OTP ================= */

type ResendError = {
  response?: {
    data?: {
      remaining_time?: number;
    };
  };
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => resendOtp(email),
    retry: false,

    onError: (err: unknown) => {
      const error = err as ResendError;

      if (error?.response?.data?.remaining_time) {
        console.warn("Retry after:", error.response.data.remaining_time);
      }
    },
  });
};

/* ================= FORGOT PASSWORD ================= */

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
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
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      console.log("✅ Logout API success");
    },

    onError: (err) => {
      console.log("⚠️ Logout API failed (ignored):", err);
    },

    onSettled: () => {
      // 🔥 FULL CLEANUP (CRITICAL)
      tokenService.clear();     // remove access + refresh tokens
      sessionService.clear();   // clear session flag
      clearUser();              // clear Zustand user
      queryClient.clear();      // clear React Query cache

      // 🔥 HARD REDIRECT (ensures full reset)
      window.location.href = "/signin";
    },
  });
};

// export const useLogout = () => {
//   const queryClient = useQueryClient();
//   const clearUser = useAuthStore((s) => s.clearUser);

//   return useMutation({
//     mutationFn: logoutUser,

//     onSuccess: () => {
//   console.log("✅ Logout success");
// },
//     onSettled: () => {
//       queryClient.clear();
//     },
//   });
// };

/* ================= PROFILE ================= */

export const useProfile = () => {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: getProfile,

    // ✅ FIX: reactive + stable
    enabled: !!tokenService.getAccess(),

    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!query.data) return;

    const currentUser = useAuthStore.getState().user;

    // ✅ FIX: prevent infinite loop
    if (
      currentUser?.username === query.data.username &&
      currentUser?.email === query.data.email
    ) {
      return;
    }

    setUser({
      username: query.data.username ?? "",
      email: query.data.email,
      role: currentUser?.role ?? "user",
      is_kyc_verified: false
    });
  }, [query.data, setUser]);

  return query;
};

export const useCheckUserExists = () => {
  return useMutation({
    mutationFn: checkUserExists,
  });
};


/* ================= KYC VERIFICATION ================= */

export const useKycVerification = () => {

  const setUser =
    useAuthStore((s) => s.setUser);

  const currentUser =
    useAuthStore((s) => s.user);

  return useMutation({

    mutationFn: (
      formData: FormData
    ) =>
      submitKycVerification(
        formData
      ),

    retry: 1,

    onSuccess: (data) => {

      // =========================
      // UPDATE AUTH STORE
      // =========================
      if (
        currentUser &&
        data?.is_kyc_verified
      ) {

        setUser({

          ...currentUser,

          is_kyc_verified: true,
        });
      }
    },
  });
};