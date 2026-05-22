import api from "@/lib/api";

/* ================= TYPES ================= */

export type ClientListItem = {
  id: number;
  username: string;
  email: string;
  client_id: string | null;
  is_active: boolean;
  subscription?: { plan: string };
};

export type Client = {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  client_id: string | null;
  is_active: boolean;
  is_email_verified: boolean;
  date_joined: string;
  broker_credentials: { client_id: string } | null;
  subscription: { plan: string; active: boolean; expiry_date: string } | null;
  broker_session: {
    access_token: string | null;
    expires_at: string;
    is_active: boolean;
    dhan_client_name?: string;
  } | null;
};

export type ClientsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClientListItem[];
};

// FIX: was params: any — now typed
export type ClientsParams = {
  page?: number;
  search?: string;
  ordering?: string;
  is_active?: boolean;
};

/* ================= API ================= */

export const getClients = async (params: ClientsParams): Promise<ClientsResponse> => {
  const res = await api.get("/operations/clients/", { params });
  return res.data;
};

export const getClient = async (id: string): Promise<Client> => {
  const res = await api.get(`/operations/users/${id}/`);
  console.log("API Response:", res); // Debug log
  return res.data;
};



 

// /* ================= TYPES ================= */

// /* 🔹 LIST ITEM (for table view) */
// export type ClientListItem = {
//   id: number;
//   username: string;
//   email: string;
//   client_id: string | null;
//   is_active: boolean;
// };

// /* 🔹 FULL DETAIL (for detail page) */
// export type Client = {
//   id: number;
//   username: string;
//   email: string;
//   phone: string;
//   role: string;

//   client_id: string | null;

//   is_active: boolean;
//   is_email_verified: boolean;
//   date_joined: string;

//   broker_credentials: {
//     client_id: string;
    
//   } | null;

//   subscription: {
//     plan: string;
//     active: boolean;
//     expiry_date: string;
//   } | null;

//   broker_session: {
//   access_token: string | null;
//   expires_at: string;
//   is_active: boolean;

//   /* ✅ ADD THIS */
//   dhan_client_name?: string;
// } | null;
// };

// /* 🔹 PAGINATED RESPONSE */
// export type ClientsResponse = {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: ClientListItem[];
// };

// /* ================= API ================= */

// /* ✅ GET ALL CLIENTS */
// export const getClients = async (
//   params: any
// ): Promise<ClientsResponse> => {
//   const res = await api.get("/operations/clients/", { params });
//   return res.data;
// };

// /* ✅ GET SINGLE CLIENT */
// export const getClient = async (id: string): Promise<Client> => {
//   const res = await api.get(`/operations/users/${id}/`);
//   return res.data;
// };