import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  operationsApi,
  type ChangePasswordPayload,
  type OtpVerifyPayload,
  type ProfileResponse,
} from "../api/operationsApi";
import { tokenService } from "@/lib/auth";

/* ================= GLOBAL HELPERS ================= */

const handleForceLogout = (res?: { force_logout?: boolean }) => {
  if (res?.force_logout) {
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/login";
    }, 3000); // ⏳ delay
  }
};

/* ================= PROFILE ================= */

export const useProfile = () => {
  return useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: operationsApi.getProfile,

    enabled: !!tokenService.getAccess(),

    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/* ================= CHANGE PASSWORD ================= */

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      operationsApi.changePassword(payload),

    onSuccess: (res) => {
      handleForceLogout(res);

      // refresh profile cache
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

/* ================= SEND OTP ================= */

export const useSendOtp = () => {
  return useMutation({
    mutationFn: operationsApi.sendOtp,
  });
};

/* ================= VERIFY OTP ================= */

export const useVerifyOtpPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OtpVerifyPayload) =>
      operationsApi.verifyOtpPassword(payload),

    retry: false,   // ✅ prevent double calls

    onSuccess: (res) => {
      // ✅ refresh profile
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      // ✅ delayed logout
      if (res?.force_logout) {
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, 3000); // ⏳ 3 sec delay
      }
    },
  });
};