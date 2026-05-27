import type { Order } from "./order.types";
import type { Trade } from "./trade.types";
import type { Position } from "./position.types";
import type { Error } from "./error.types";

export type RealtimeStore = {
  /**
   * CONNECTION
   */
  connectionStatus: "CONNECTING" | "OPEN" | "CLOSED";

  setConnectionStatus: (
    status: "CONNECTING" | "OPEN" | "CLOSED"
  ) => void;

  /**
   * ORDERS
   */
  orders: Order[];

  setOrders: (orders: Order[]) => void;

  addOrder: (order: Order) => void;

  updateOrder: (
    order: Partial<Order> & {
      id: number;
    }
  ) => void;

  removeOrder: (id: number) => void;

  clearOrders: () => void;

  /**
   * TRADES
   */
  trades: Trade[];

  setTrades: (trades: Trade[]) => void;

  addTrade: (trade: Trade) => void;

  updateTrade: (
    trade: Partial<Trade> & {
      id: number;
    }
  ) => void;

  removeTrade: (id: number) => void;

  clearTrades: () => void;

  /**
   * POSITIONS
   */
  positions: Position[];

  setPositions: (positions: Position[]) => void;

  addPosition: (position: Position) => void;

  updatePosition: (
    position: Partial<Position> & {
      id: number;
    }
  ) => void;

  removePosition: (id: number) => void;

  clearPositions: () => void;

  /**
   * ERRORS
   */
  errors: Error[];

  setErrors: (errors: Error[]) => void;

  addError: (error: Error) => void;

  updateError: (
    error: Partial<Error> & {
      id: number;
    }
  ) => void;

  removeError: (id: number) => void;

  clearErrors: () => void;

  /**
   * CLEAR ALL
   */
  clearAll: () => void;
};