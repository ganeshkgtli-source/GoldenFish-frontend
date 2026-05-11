import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProfile,
  updateApiCredentials,
  changePassword,
  sendOtp,
  verifyOtpPassword,
  getMarketData,
} from "@/client/api/profileApi";

/* ================= PROFILE ================= */
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

/* ================= UPDATE API ================= */
export const useUpdateApi = () => {
  return useMutation({
    mutationFn: updateApiCredentials,
  });
};

/* ================= PASSWORD ================= */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

/* ================= OTP ================= */
export const useSendOtp = () => {
  return useMutation({
    mutationFn: sendOtp,
  });
};

export const useVerifyOtpPassword = () => {
  return useMutation({
    mutationFn: verifyOtpPassword,
  });
};

/* ================= MARKET DATA ================= */

export const useMarketData = () => {
  return useQuery({
    queryKey: ["marketdata"],

    queryFn: async () => {

      console.log(
        "🔄 MARKET API CALLED:",
        new Date().toLocaleTimeString()
      );

      return await getMarketData();
    },

    refetchInterval: 5*60 *1000,

    refetchIntervalInBackground: true,

    refetchOnWindowFocus: true,

    staleTime: 0,
  });
};