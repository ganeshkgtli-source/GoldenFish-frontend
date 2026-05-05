// import { useQuery } from "@tanstack/react-query";
// import { getClient, getClients } from "../api/clientApi";

// import type { ClientsResponse } from "../api/clientApi";

// export const useClients = (params: any) => {
//   return useQuery<ClientsResponse>({
//     queryKey: ["clients", params],
//     queryFn: () => getClients(params),

//     // 🔥 v5 replacement (IMPORTANT)
//     placeholderData: (prev) => prev,

//     staleTime: 1000 * 60 * 2, // cache 2 min
//   });
// };

// export const useClient = (id: string) => {
//   return useQuery({
//     queryKey: ["client", id],
//     queryFn: () => getClient(id),
//     enabled: !!id,
//   });
// };


import { useQuery } from "@tanstack/react-query";
import { getClient, getClients } from "../api/clientApi";
import type { ClientsResponse, ClientsParams } from "../api/clientApi";

// FIX: was params: any — now uses ClientsParams type
export const useClients = (params: ClientsParams) => {
  return useQuery<ClientsResponse>({
    queryKey: ["clients", params],
    queryFn: () => getClients(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
};
