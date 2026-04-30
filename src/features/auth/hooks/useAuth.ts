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
      clearUser();
    },

    onSettled: () => {
      queryClient.clear();
    },
  });
};

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
    });
  }, [query.data, setUser]);

  return query;
};

export const useCheckUserExists = () => {
  return useMutation({
    mutationFn: checkUserExists,
  });
};

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   loginUser,
//   registerUser,
//   verifyOtp,
//   resendOtp,
//   forgotPassword,
//   resetPassword,
//   logoutUser,
//   getProfile,
 
 
// } from "../api/authApi";
// import type { UserProfile } from "../api/authApi";
// import { normalizeRole, roleService, sessionService, tokenService } from "@/lib/auth";
// import { useAuthStore } from "@/store/authStore";

// /* ================= LOGIN ================= */
// export const useLogin = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: loginUser,

//     retry: 1,

//     onSuccess: (data) => {
//       // ✅ store tokens
//       tokenService.set(data.tokens.access, data.tokens.refresh);

//       // ✅ normalize role
//       const role = normalizeRole(data.role);

//       // ❌ optional (remove if using Zustand everywhere)
//       // roleService.set(role);

//       // ✅ start session
//       sessionService.start();

//       // ✅ store user in Zustand
//       useAuthStore.getState().setUser({
//         username: data.username,
//         role: role,
//       });

//       // ✅ refresh profile
//       queryClient.invalidateQueries({ queryKey: ["profile"] });
//     },
//   });
// };

// /* ================= REGISTER ================= */
// // export const useRegister = () => {
// //   return useMutation({
// //     mutationFn: registerUser,
// //     retry: 1,
// //   });
// // };
// export const useRegister = () => {
//   return useMutation({
//     mutationFn: registerUser,
//     retry: 1,

//     onSuccess: (data) => {
//       // normalize email here (centralized)
//       return {
//         email: data.email?.trim().toLowerCase(),
//       };
//     },
//   });
// };
// /* ================= VERIFY OTP ================= */
// // export const useVerifyOtp = () => {
// //   return useMutation({
// //     mutationFn: ({
// //       email,
// //       otp,
// //     }: {
// //       email: string;
// //       otp: string;
// //     }) => verifyOtp(email, otp),

// //     retry: 1,
// //   });
// // };
//  export const useVerifyOtp = () => {
//   return useMutation({
//     mutationFn: ({
//       email,
//       otp,
//     }: {
//       email: string;
//       otp: string;
//     }) => verifyOtp(email, otp),

//     retry: 1,
//   });
// };

// /* ================= RESEND OTP ================= */
// export const useResendOtp = () => {
//   return useMutation({
//     mutationFn: resendOtp,

//     retry: false,

//     // 🔥 useful for rate limit UI
//     onError: (err: any) => {
//       if (err?.response?.data?.remaining_time) {
//         console.warn("Retry after:", err.response.data.remaining_time);
//       }
//     },
//   });
// };

// /* ================= FORGOT PASSWORD ================= */
// export const useForgotPassword = () => {
//   return useMutation({
//     mutationFn: forgotPassword,
//     retry: 1,
//   });
// };

// /* ================= RESET PASSWORD ================= */
// export const useResetPassword = () => {
//   return useMutation({
//     mutationFn: resetPassword,
//     retry: 1,
//   });
// };

// /* ================= LOGOUT ================= */
// export const useLogout = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: logoutUser,

//     onSuccess: () => {
//       // ✅ clear all cached data
//   useAuthStore.getState().clearUser();    },

//     onSettled: () => {
//       // fallback (even if API fails)
//       queryClient.clear();
//     },
//   });
// };

// /* ================= PROFILE ================= */
// /* ================= PROFILE ================= */
// import { useEffect } from "react";

// export const useProfile = () => {
//   const query = useQuery<UserProfile>({
//     queryKey: ["profile"],
//     queryFn: getProfile,

//     enabled: !!tokenService.getAccess(),

//     staleTime: 1000 * 60 * 5,
//     retry: 1,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: true,
//   });

//   // ✅ React Query v5 replacement for onSuccess
//   useEffect(() => {
//     if (query.data) {
//       useAuthStore.getState().setUser({
//         username: query.data.username ?? "",
//         email: query.data.email,
//       });
//     }
//   }, [query.data]);

//   return query;
// };
 