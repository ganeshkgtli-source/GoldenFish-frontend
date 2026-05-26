import { create } from "zustand";

import type { RealtimeStore } from "../types/realtime.types";

export const useRealtimeStore = create<RealtimeStore>((set) => ({
  /**
   * Connection
   */
  connectionStatus: "CLOSED",

  setConnectionStatus: (status) =>
    set({
      connectionStatus: status,
    }),

  /**
   * Orders
   */
  orders: [],

  /**
   * Replace full order snapshot
   */
  setOrders: (orders) =>
    set({
      orders,
    }),

  /**
   * Add new realtime order
   */
  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  /**
   * Update existing order
   */
  updateOrder: (updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id === updatedOrder.id) {
          return {
            ...order,
            ...updatedOrder,
          };
        }

        return order;
      }),
    })),

  /**
   * Remove order
   */
  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    })),

  /**
   * Clear all orders
   */
  clearOrders: () =>
    set({
      orders: [],
    }),

  /**
   * Trades
   */
  trades: [],

  /**
   * Replace full trade snapshot
   */
  setTrades: (trades) =>
    set({
      trades,
    }),

  /**
   * Add new realtime trade
   */
  addTrade: (trade) =>
    set((state) => ({
      trades: [trade, ...state.trades],
    })),

  /**
   * Update existing trade
   */
  updateTrade: (updatedTrade) =>
    set((state) => ({
      trades: state.trades.map((trade) => {
        if (trade.id === updatedTrade.id) {
          return {
            ...trade,
            ...updatedTrade,
          };
        }

        return trade;
      }),
    })),

  /**
   * Remove trade
   */
  removeTrade: (id) =>
    set((state) => ({
      trades: state.trades.filter((trade) => trade.id !== id),
    })),

  /**
   * Clear all trades
   */
  clearTrades: () =>
    set({
      trades: [],
    }),
}));
