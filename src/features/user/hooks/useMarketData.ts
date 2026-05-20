import { useQuery } from "@tanstack/react-query";
import { getFundLimit, getHoldings, getMarketData, getOpenPositions, getOrders, getTrades } from "../api/getMarketData";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],

    queryFn: getOrders,

    refetchOnWindowFocus: false,
    //  refetchInterval:1000,

    refetchOnReconnect: false,

    retry: false,
  });
};


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

    // Refresh every 5 minutes
    // refetchInterval: 5 * 60 * 1000,

    // Continue interval in background
    // refetchIntervalInBackground: true,

    // DO NOT refetch on tab switch
    // refetchOnWindowFocus: false,

    // Keep cache fresh for 5 mins
    // staleTime: 5 * 60 * 1000,
  });
};


export const useTrades = () => {
  return useQuery({
    queryKey: ["trades"],

    queryFn: getTrades,

    refetchOnMount: true,

    refetchOnWindowFocus: false,
    //  refetchInterval:1000,

    staleTime: 0,
  });
};

export const useFundLimit = () => {
  return useQuery({
    queryKey: ["fund-limit"],

    queryFn: getFundLimit,

    refetchOnMount: true,
    // refetchInterval: 1000,

    staleTime: 0,
  });
};

export const useOpenPositions = () => {
  return useQuery({
    queryKey: ["open-positions"],

    queryFn: getOpenPositions,
    //  refetchInterval: 1000,

    refetchOnMount: true,

    staleTime: 0,
  });
};

export const useHoldings = () => {
  return useQuery({
    queryKey: ["holdings"],

    queryFn: getHoldings,

    refetchOnMount: true,
        // refetchInterval: 1000,


    staleTime: 0,
  });
};