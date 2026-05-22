import { useQuery } from "@tanstack/react-query";

import {
  getFundLimit,
  getHoldings,
  getMarketData,
  getOpenPositions,
  getOrders,
  getTrades,
} from "../api/getMarketData";

/* ================= ORDERS ================= */

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],

    queryFn: getOrders,

    staleTime: 1000 * 5,

    gcTime: 1000 * 60 * 5,

    // refetchInterval: 1000 * 5,

    refetchIntervalInBackground: true,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    retry: false,
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

    // cache fresh for 2 sec
    staleTime: 1000 * 2,

    // keep cache 10 mins
    gcTime: 1000 * 60 * 10,

    // realtime refresh
    // refetchInterval: 1000 * 2,

    refetchIntervalInBackground: true,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    retry: false,
  });
};

/* ================= TRADES ================= */

export const useTrades = () => {
  return useQuery({
    queryKey: ["trades"],

    queryFn: getTrades,

    staleTime: 1000 * 5,

    gcTime: 1000 * 60 * 5,

    // refetchInterval: 1000 * 5,

    refetchIntervalInBackground: true,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    retry: false,
  });
};

/* ================= FUND LIMIT ================= */

export const useFundLimit = () => {
  return useQuery({
    queryKey: ["fund-limit"],

    queryFn: getFundLimit,

    staleTime: 1000 * 15,

    gcTime: 1000 * 60 * 5,

    // refetchInterval: 1000 * 15,

    refetchIntervalInBackground: true,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    retry: false,
  });
};

/* ================= OPEN POSITIONS ================= */

export const useOpenPositions = () => {
  return useQuery({
    queryKey: ["open-positions"],

    queryFn: getOpenPositions,

    staleTime: 1000 * 5,

    gcTime: 1000 * 60 * 5,

    // refetchInterval: 1000 * 5,

    refetchIntervalInBackground: true,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    retry: false,
  });
};

/* ================= HOLDINGS ================= */

export const useHoldings = () => {
  return useQuery({
    queryKey: ["holdings"],

    queryFn: getHoldings,

    staleTime: 1000 * 60,

    gcTime: 1000 * 60 * 10,

    // refetchInterval: 1000 * 60,

    refetchIntervalInBackground: false,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    retry: false,
  });
};