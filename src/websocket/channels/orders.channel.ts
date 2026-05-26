export const ORDER_CHANNELS = {
  ALL: "orders_all",

  USER: (userId: string) =>
    `orders_user_${userId}`,

  CLIENT: (clientId: string) =>
    `orders_client_${clientId}`,
};