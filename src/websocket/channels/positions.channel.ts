export const POSITIONS_CHANNELS = {
  ALL: "positions_all",

  USER: (userId: string) =>
    `positions_user_${userId}`,

  CLIENT: (clientId: string) =>
    `positions_client_${clientId}`,
};

 