export type SocketEvent<T = unknown> = {
  channel: string;
  event: string;
  data: T;
};

export type SubscribePayload = {
  action: "subscribe";
  channels: string[];
};

export type UnsubscribePayload = {
  action: "unsubscribe";
  channels: string[];
};

export type ConnectionStatus =
  | "CONNECTING"
  | "OPEN"
  | "CLOSED"
  | "ERROR";