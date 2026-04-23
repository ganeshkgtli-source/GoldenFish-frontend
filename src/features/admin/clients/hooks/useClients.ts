import { useQuery } from "@tanstack/react-query";
import { getClient, getClients } from "../api/clientApi";
export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
};