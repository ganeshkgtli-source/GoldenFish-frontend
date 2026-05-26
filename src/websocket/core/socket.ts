import type { ConnectionStatus, SocketEvent } from "../types/socket.types";

type Listener = (event: SocketEvent) => void;

class SocketEngine {
  private socket: WebSocket | null = null;

  private listeners = new Set<Listener>();

  private reconnectTimer: number | null = null;

  private reconnectAttempts = 0;

  private status: ConnectionStatus = "CLOSED";

  /**
   * Prevent duplicate connect
   */
  private isConnecting = false;

  /**
   * Connect websocket
   */
  connect() {
    /**
     * Prevent duplicate connections
     */
    if (
      this.isConnecting ||
      (this.socket &&
        (this.socket.readyState === WebSocket.OPEN ||
          this.socket.readyState === WebSocket.CONNECTING))
    ) {
      console.log("[WS ENGINE] Already connected/connecting");

      return;
    }

    console.log("[WS ENGINE] Connecting...");

    this.isConnecting = true;

    this.status = "CONNECTING";

    /**
     * Create websocket
     */
    this.socket = new WebSocket("ws://127.0.0.1:8000/ws/");

    /**
     * OPEN
     */
    this.socket.onopen = () => {
      console.log("[WS ENGINE] Connected");

      this.status = "OPEN";

      this.isConnecting = false;

      this.reconnectAttempts = 0;
    };

    /**
     * MESSAGE
     */
    this.socket.onmessage = (event) => {
      try {
        console.log("[RAW WS MESSAGE]", event.data);

        const parsed = JSON.parse(event.data) as SocketEvent;

        console.log("[PARSED WS MESSAGE]", parsed);

        /**
         * Dispatch listeners
         */
        this.listeners.forEach((listener) => {
          try {
            listener(parsed);
          } catch (error) {
            console.error("[WS LISTENER ERROR]", error);
          }
        });
      } catch (error) {
        console.error("[WS PARSE ERROR]", error);
      }
    };

    /**
     * ERROR
     */
    this.socket.onerror = (error) => {
      console.error("[WS ERROR]", error);

      this.status = "ERROR";

      this.isConnecting = false;
    };

    /**
     * CLOSE
     */
    this.socket.onclose = (event) => {
      console.warn("[WS CLOSED]", event.reason);

      this.status = "CLOSED";

      this.isConnecting = false;

      this.socket = null;

      /**
       * Auto reconnect
       */
      this.reconnect();
    };
  }

  /**
   * Disconnect websocket
   */
  disconnect() {
    console.log("[WS ENGINE] Disconnect");

    /**
     * Stop reconnect
     */
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);

      this.reconnectTimer = null;
    }

    this.isConnecting = false;

    /**
     * Close socket
     */
    if (this.socket) {
      this.socket.close();

      this.socket = null;
    }

    this.status = "CLOSED";
  }

  /**
   * Send data
   */
  send(data: unknown) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("[WS SEND FAILED] Socket not open");

      return;
    }

    try {
      console.log("[WS SEND]", data);

      this.socket.send(JSON.stringify(data));
    } catch (error) {
      console.error("[WS SEND ERROR]", error);
    }
  }

  /**
   * Subscribe listener
   */
  subscribe(listener: Listener) {
    console.log("[WS SUBSCRIBE LISTENER]");

    this.listeners.add(listener);

    console.log("[TOTAL WS LISTENERS]", this.listeners.size);

    /**
     * Cleanup
     */
    return () => {
      console.log("[WS UNSUBSCRIBE LISTENER]");

      this.listeners.delete(listener);

      console.log("[TOTAL WS LISTENERS]", this.listeners.size);
    };
  }

  /**
   * Auto reconnect
   */
  private reconnect() {
    /**
     * Prevent duplicate reconnects
     */
    if (this.reconnectTimer) {
      return;
    }

    const timeout = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);

    this.reconnectAttempts += 1;

    console.log(`[WS RECONNECT IN ${timeout}ms]`);

    this.reconnectTimer = window.setTimeout(() => {
      console.log("[WS RECONNECTING]");

      this.reconnectTimer = null;

      this.connect();
    }, timeout);
  }

  /**
   * Get connection status
   */
  getStatus() {
    return this.status;
  }

  /**
   * Is socket open
   */
  isOpen() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const socketEngine = new SocketEngine();
