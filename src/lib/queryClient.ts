// import { QueryClient } from "@tanstack/react-query";

// export const queryClient = new QueryClient();


import { QueryClient } from "@tanstack/react-query";

// FIX: was created with zero config — now has sensible global defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,    // 2 min before refetch
      gcTime: 1000 * 60 * 10,      // 10 min cache lifetime
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
