export const TRADE_CHANNELS = {
  ALL: "trades_all",

  USER: (userId: string) =>
    `trades_user_${userId}`,

  CLIENT: (clientId: string) =>
    `trades_client_${clientId}`,
};