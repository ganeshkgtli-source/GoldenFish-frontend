import { useEffect } from "react";

import { socketEngine } from "../core/socket";

import { socketManager } from "../managers/socketManager";

import { useRealtimeStore } from "../store/realtimeStore";

import type { SocketEvent } from "../types/socket.types";
import type { Position } from "../types/position.types";
import { POSITIONS_CHANNELS } from "../channels/positions.channel";

type DeletePayload = {
  id: number;
};

type PositionSocketPayload = Position[] | Position | DeletePayload;

export const usePositionsSocket = (
  type: string = "self",
  clientId?: string,
) => {
  useEffect(() => {
    /**
     * INIT
     */
    socketManager.init();

    socketEngine.connect();
    const userId = "current_user";
    /**
     * STORE
     */
    const { setPositions, addPosition, updatePosition, removePosition } =
      useRealtimeStore.getState();

    /**
     * CHANNEL
     */
    let channel = POSITIONS_CHANNELS.USER(String(userId));

    /**
     * ADMIN CHANNEL
     */
    if (type === "admin") {
      channel = POSITIONS_CHANNELS.ALL;
    }

    /**
     * CLIENT CHANNEL
     */
    if (type === "client" && clientId) {
      channel = POSITIONS_CHANNELS.CLIENT(String(clientId));
    }

    console.log("[ORDERS SOCKET CHANNEL]", channel);

    /**
     * SUBSCRIBE
     */
    const unsubscribe = socketManager.subscribe<PositionSocketPayload>(
      channel,
      (socketEvent) => {
        const { event: eventType, data } =
          socketEvent as SocketEvent<PositionSocketPayload>;

        /**
         * SNAPSHOT
         */
        if (eventType === "snapshot") {
          if (Array.isArray(data)) {
            const sorted = [...data].sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            );

            setPositions(sorted);
          }

          return;
        }

        /**
         * CREATED
         */
        if (eventType === "created") {
          if (data && typeof data === "object" && "id" in data) {
            addPosition(data as Position);
          }

          return;
        }

        /**
         * UPDATED
         */
        if (eventType === "updated") {
          if (data && typeof data === "object" && "id" in data) {
            updatePosition(
              data as Partial<Position> & {
                id: number;
              },
            );
          }

          return;
        }

        /**
         * DELETED
         */
        if (eventType === "deleted") {
          if (data && typeof data === "object" && "id" in data) {
            removePosition(data.id);
          }
        }
      },
    );

    /**
     * CLEANUP
     */
    return () => {
      console.log("[POSITIONS SOCKET CLEANUP]", channel);

      unsubscribe();
    };
  }, [type, clientId]);
};
