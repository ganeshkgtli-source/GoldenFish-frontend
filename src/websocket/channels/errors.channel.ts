export const ERRORS_CHANNELS = {
  ALL: "errors_all",

  USER: (userId: string) =>
    `errors_user_${userId}`,

  CLIENT: (clientId: string) =>
    `errors_client_${clientId}`,
};

 