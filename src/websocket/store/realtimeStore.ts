import { create } from "zustand";

import type { RealtimeStore } from "../types/realtime.types";

const MAX_ITEMS = 1000;

export const useRealtimeStore = create<RealtimeStore>((set) => ({
  /**
   * CONNECTION
   */
  connectionStatus: "CLOSED",

  setConnectionStatus: (status) =>
    set({
      connectionStatus: status,
    }),

  /**
   * ORDERS
   */
  orders: [],

  setOrders: (orders) =>
    set({
      orders: orders.slice(0, MAX_ITEMS),
    }),

  addOrder: (order) =>
    set((state) => {
      const exists = state.orders.some(
        (item) => item.id === order.id,
      );

      if (exists) {
        return {
          orders: state.orders.map((item) =>
            item.id === order.id
              ? {
                  ...item,
                  ...order,
                }
              : item,
          ),
        };
      }

      return {
        orders: [
          order,
          ...state.orders,
        ].slice(0, MAX_ITEMS),
      };
    }),

  updateOrder: (updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === updatedOrder.id
          ? {
              ...order,
              ...updatedOrder,
            }
          : order,
      ),
    })),

  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter(
        (order) => order.id !== id,
      ),
    })),

  clearOrders: () =>
    set({
      orders: [],
    }),

  /**
   * TRADES
   */
  trades: [],

  setTrades: (trades) =>
    set({
      trades: trades.slice(0, MAX_ITEMS),
    }),

  addTrade: (trade) =>
    set((state) => {
      const exists = state.trades.some(
        (item) => item.id === trade.id,
      );

      if (exists) {
        return {
          trades: state.trades.map((item) =>
            item.id === trade.id
              ? {
                  ...item,
                  ...trade,
                }
              : item,
          ),
        };
      }

      return {
        trades: [
          trade,
          ...state.trades,
        ].slice(0, MAX_ITEMS),
      };
    }),

  updateTrade: (updatedTrade) =>
    set((state) => ({
      trades: state.trades.map((trade) =>
        trade.id === updatedTrade.id
          ? {
              ...trade,
              ...updatedTrade,
            }
          : trade,
      ),
    })),

  removeTrade: (id) =>
    set((state) => ({
      trades: state.trades.filter(
        (trade) => trade.id !== id,
      ),
    })),

  clearTrades: () =>
    set({
      trades: [],
    }),

  /**
   * POSITIONS
   */
  positions: [],

  setPositions: (positions) =>
    set({
      positions: positions.slice(
        0,
        MAX_ITEMS,
      ),
    }),

  addPosition: (position) =>
    set((state) => {
      const exists =
        state.positions.some(
          (item) =>
            item.id === position.id,
        );

      if (exists) {
        return {
          positions:
            state.positions.map((item) =>
              item.id === position.id
                ? {
                    ...item,
                    ...position,
                  }
                : item,
            ),
        };
      }

      return {
        positions: [
          position,
          ...state.positions,
        ].slice(0, MAX_ITEMS),
      };
    }),

  updatePosition: (
    updatedPosition,
  ) =>
    set((state) => ({
      positions: state.positions.map(
        (position) =>
          position.id ===
          updatedPosition.id
            ? {
                ...position,
                ...updatedPosition,
              }
            : position,
      ),
    })),

  removePosition: (id) =>
    set((state) => ({
      positions:
        state.positions.filter(
          (position) =>
            position.id !== id,
        ),
    })),

  clearPositions: () =>
    set({
      positions: [],
    }),

  /**
   * ERRORS
   */
  errors: [],

  setErrors: (errors) =>
    set({
      errors: errors.slice(0, MAX_ITEMS),
    }),

  addError: (error) =>
    set((state) => {
      const exists = state.errors.some(
        (item) => item.id === error.id,
      );

      if (exists) {
        return {
          errors: state.errors.map(
            (item) =>
              item.id === error.id
                ? {
                    ...item,
                    ...error,
                  }
                : item,
          ),
        };
      }

      return {
        errors: [
          error,
          ...state.errors,
        ].slice(0, MAX_ITEMS),
      };
    }),

  updateError: (updatedError) =>
    set((state) => ({
      errors: state.errors.map(
        (error) =>
          error.id ===
          updatedError.id
            ? {
                ...error,
                ...updatedError,
              }
            : error,
      ),
    })),

  removeError: (id) =>
    set((state) => ({
      errors: state.errors.filter(
        (error) => error.id !== id,
      ),
    })),

  clearErrors: () =>
    set({
      errors: [],
    }),

  /**
   * CLEAR ALL
   */
  clearAll: () =>
    set({
      orders: [],
      trades: [],
      positions: [],
      errors: [],
    }),
}));