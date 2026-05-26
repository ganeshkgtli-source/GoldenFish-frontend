import { socketEngine } from "../core/socket";

import type {
  SocketEvent,
  SubscribePayload,
  UnsubscribePayload,
} from "../types/socket.types";

type EventListener<T = unknown> = (event: SocketEvent<T>) => void;

class SocketManager {
  private listeners = new Map<string, Set<EventListener>>();

  private subscribedChannels = new Set<string>();

  private initialized = false;

  init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    socketEngine.subscribe((event) => {
      this.handleSocketEvent(event);
    });
  }

  private handleSocketEvent = (event: SocketEvent) => {
    const { channel } = event;

    const channelListeners = this.listeners.get(channel);

    if (!channelListeners) {
      return;
    }

    channelListeners.forEach((listener) => {
      listener(event);
    });
  };

  subscribe<T = unknown>(channel: string, listener: EventListener<T>) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set<EventListener>());
    }

    const listeners = this.listeners.get(channel);

    listeners?.add(listener as EventListener);

    if (!this.subscribedChannels.has(channel)) {
      if (socketEngine.getStatus() === "OPEN") {
        const payload: SubscribePayload = {
          action: "subscribe",

          channels: [channel],
        };

        socketEngine.send(payload);
      }

      this.subscribedChannels.add(channel);
    }

    return () => {
      this.unsubscribe(channel, listener);
    };
  }

  unsubscribe<T = unknown>(channel: string, listener: EventListener<T>) {
    const channelListeners = this.listeners.get(channel);

    if (!channelListeners) {
      return;
    }

    channelListeners.delete(listener as EventListener);

    if (channelListeners.size === 0) {
      this.listeners.delete(channel);

      if (this.subscribedChannels.has(channel)) {
        if (socketEngine.getStatus() === "OPEN") {
          const payload: UnsubscribePayload = {
            action: "unsubscribe",

            channels: [channel],
          };

          socketEngine.send(payload);
        }

        this.subscribedChannels.delete(channel);
      }
    }
  }
}

export const socketManager = new SocketManager();
