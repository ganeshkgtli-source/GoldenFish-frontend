import { useEffect } from "react";

import { ORDER_CHANNELS } from "../channels/orders.channel";

import { socketEngine } from "../core/socket";

import { socketManager } from "../managers/socketManager";

import { useRealtimeStore } from "../store/realtimeStore";

import type { Order } from "../types/order.types";

import type { SocketEvent } from "../types/socket.types";

/**
 * EXAMPLE:
 * Replace with your actual auth store
 */
// import { useAuthStore } from "@/store/authStore";

type DeletePayload = {
  id: number;
};

type OrderSocketPayload =
  | Order[]
  | Order
  | DeletePayload;

export const useOrdersSocket = (
   type?: string,

  clientId?: string,
) => {
  /**
   * GET LOGGED-IN USER ID
   *
   * Replace with actual auth store.
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
      setOrders,
      addOrder,
      updateOrder,
      removeOrder,
    } =
      useRealtimeStore.getState();

    /**
     * DEFAULT USER CHANNEL
     */
    let channel =
      ORDER_CHANNELS.USER(
        String(userId),
      );

    /**
     * ADMIN CHANNEL
     */
    if (type === "admin") {
      channel =
        ORDER_CHANNELS.ALL;
    }

    /**
     * CLIENT CHANNEL
     */
    if (
      type === "client" &&
      clientId
    ) {
      channel =
        ORDER_CHANNELS.CLIENT(
          String(clientId),
        );
    }

    console.log(
      "[ORDERS SOCKET CHANNEL]",
      channel,
    );

    /**
     * SUBSCRIBE
     */
    const unsubscribe =
      socketManager.subscribe<OrderSocketPayload>(
        channel,
        (
          socketEvent,
        ) => {
          const {
            event:
              eventType,
            data,
          } =
            socketEvent as SocketEvent<OrderSocketPayload>;

          console.log(
            "[ORDER SOCKET EVENT]",
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
              const sortedOrders =
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

              setOrders(
                sortedOrders,
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
              addOrder(
                data as Order,
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
              updateOrder(
                data as Partial<Order> & {
                  id: number;
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
              removeOrder(
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
        "[ORDERS SOCKET CLEANUP]",
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