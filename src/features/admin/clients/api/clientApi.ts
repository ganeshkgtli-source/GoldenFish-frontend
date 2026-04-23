import api from "@/lib/api";
export const getClients = async () => {
  const res = await api.get("/operations/clients/");
  return res.data;
};

// ✅ get single client
export const getClient = async (id: string) => {
  const res = await api.get(`/operations/users/${id}/`);
  return res.data;
};