import { useEffect } from "react";

import { TRADE_CHANNELS } from "../channels/trades.channel";

import { socketEngine } from "../core/socket";

import { socketManager } from "../managers/socketManager";

import { useRealtimeStore } from "../store/realtimeStore";

import type { Trade } from "../types/trade.types";

import type { SocketEvent } from "../types/socket.types";

/**
 * EXAMPLE:
 * Replace with your actual auth store
 */
// import { useAuthStore } from "@/store/authStore";

type DeletePayload = {
  id: string;
};

type TradeSocketPayload =
  | Trade[]
  | Trade
  | DeletePayload;

export const useTradesSocket = (
  type: string = "self",
  clientId?: string,
) => {
  /**
   * GET LOGGED-IN USER ID
   *
   * Replace this with your real auth store.
   */
  // const userId =
  //   useAuthStore(
  //     (state) => state.user?.id,
  //   );

  /**
   * TEMP USER ID
   */
  const userId = "current_user";

  useEffect(() => {
    /**
     * INIT SOCKET MANAGER
     */
    socketManager.init();

    /**
     * CONNECT WEBSOCKET
     */
    socketEngine.connect();

    /**
     * REALTIME STORE
     */
    const {
      setTrades,
      addTrade,
      updateTrade,
      removeTrade,
    } =
      useRealtimeStore.getState();

    /**
     * DEFAULT USER CHANNEL
     */
    let channel =
      TRADE_CHANNELS.USER(
        String(userId),
      );

    /**
     * ADMIN CHANNEL
     */
    if (type === "admin") {
      channel =
        TRADE_CHANNELS.ALL;
    }

    /**
     * CLIENT CHANNEL
     */
    if (
      type === "client" &&
      clientId
    ) {
      channel =
        TRADE_CHANNELS.CLIENT(
          String(clientId),
        );
    }

    console.log(
      "[TRADES SOCKET CHANNEL]",
      channel,
    );

    /**
     * SUBSCRIBE TO CHANNEL
     */
    const unsubscribe =
      socketManager.subscribe<TradeSocketPayload>(
        channel,
        (
          socketEvent,
        ) => {
          const {
            event:
              eventType,
            data,
          } =
            socketEvent as SocketEvent<TradeSocketPayload>;

          console.log(
            "[TRADE SOCKET EVENT]",
            socketEvent,
          );

          /**
           * SNAPSHOT
           */
          if (
            eventType ===
            "snapshot"
          ) {
            if (
              Array.isArray(
                data,
              )
            ) {
              const sortedTrades =
                [
                  ...data,
                ].sort(
                  (
                    a,
                    b,
                  ) =>
                    new Date(
                      b.created_at,
                    ).getTime() -
                    new Date(
                      a.created_at,
                    ).getTime(),
                );

              setTrades(
                sortedTrades,
              );
            }

            return;
          }

          /**
           * CREATED
           */
          if (
            eventType ===
            "created"
          ) {
            if (
              data &&
              typeof data ===
                "object" &&
              "id" in data
            ) {
              addTrade(
                data as Trade,
              );
            }

            return;
          }

          /**
           * UPDATED
           */
          if (
            eventType ===
            "updated"
          ) {
            if (
              data &&
              typeof data ===
                "object" &&
              "id" in data
            ) {
              updateTrade(
                data as Partial<Trade> & {
                  id: string;
                },
              );
            }

            return;
          }

          /**
           * DELETED
           */
          if (
            eventType ===
            "deleted"
          ) {
            if (
              data &&
              typeof data ===
                "object" &&
              "id" in data
            ) {
              removeTrade(
                data.id,
              );
            }
          }
        },
      );

    /**
     * CLEANUP
     */
    return () => {
      console.log(
        "[TRADES SOCKET CLEANUP]",
        channel,
      );

      unsubscribe();
    };
  }, [
    type,
    clientId,
    userId,
  ]);
};