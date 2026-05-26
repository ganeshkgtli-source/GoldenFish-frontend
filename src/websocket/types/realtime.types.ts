import type { Order } from "./order.types";

import type { Trade } from "./trade.types";

export type RealtimeStore = {
  /**
   * Connection
   */
  connectionStatus:
    | "CONNECTING"
    | "OPEN"
    | "CLOSED";

  setConnectionStatus: (
    status:
      | "CONNECTING"
      | "OPEN"
      | "CLOSED",
  ) => void;

  /**
   * Orders
   */
  orders: Order[];

  setOrders: (
    orders: Order[],
  ) => void;

  addOrder: (
    order: Order,
  ) => void;

  updateOrder: (
    order: Partial<Order> & {
      id: number;
    },
  ) => void;

  removeOrder: (
    id: number,
  ) => void;

  clearOrders: () => void;

  /**
   * Trades
   */
  trades: Trade[];

  setTrades: (
    trades: Trade[],
  ) => void;

  addTrade: (
    trade: Trade,
  ) => void;

  updateTrade: (
    trade: Partial<Trade> & {
      id: string;
    },
  ) => void;

  removeTrade: (
    id: string,
  ) => void;

  clearTrades: () => void;
};