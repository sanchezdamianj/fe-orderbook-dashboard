import type { IOrderbookRepository } from "@/domain/repositories/IOrderbookRepository";
import { Orderbook } from "@/domain/entities/Orderbook";
import { OrderbookLevel } from "@/domain/valueObjects/OrderbookLevel";

export class BinanceWebSocketRepository implements IOrderbookRepository {
  private ws: WebSocket | null = null;
  private currentSymbol: string | null = null;
  private callback: ((orderbook: Orderbook) => void) | null = null;
  private onError: ((error: Error) => void) | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 3;
  private readonly RECONNECT_DELAY = 3000;

  async fetchOrderbook(symbol: string): Promise<Orderbook> {
    // If symbol changed, close existing connection
    if (this.currentSymbol !== symbol && this.ws) {
      this.disconnect();
    }

    this.currentSymbol = symbol;

    const initialOrderbook = await this.fetchInitialSnapshot(symbol);

    if (typeof window !== "undefined") {
      this.setupWebSocket(symbol);
    }

    return initialOrderbook;
  }

  subscribe(callback: (orderbook: Orderbook) => void): void {
    this.callback = callback;
  }

  setErrorCallback(onError: (error: Error) => void): void {
    this.onError = onError;
  }

  unsubscribe(): void {
    this.callback = null;
    this.disconnect();
  }

  private async fetchInitialSnapshot(symbol: string): Promise<Orderbook> {
    const response = await fetch(
      `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=10`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch orderbook: ${response.statusText}`);
    }

    const data = await response.json();

    return new Orderbook(
      data.bids.map(([price, qty]: [string, string]) =>
        OrderbookLevel.create(price, qty)
      ),
      data.asks.map(([price, qty]: [string, string]) =>
        OrderbookLevel.create(price, qty)
      ),
      data.lastUpdateId
    );
  }

  private setupWebSocket(symbol: string): void {
    const wsSymbol = symbol.toLowerCase();
    const wsUrl = `wss://stream.binance.com:9443/ws/${wsSymbol}@depth10@1000ms`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log(`[WebSocket] Connected to ${wsSymbol}`);
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error("[WebSocket] Connection error:", {
          message: error instanceof Error ? error.message : "Unknown error",
          type: error.type || "error",
          timestamp: new Date().toISOString(),
        });
        
        // Notify error callback if exists
        if (this.onError) {
          this.onError(new Error("WebSocket connection failed"));
        }
      };

      this.ws.onclose = () => {
        console.log("[WebSocket] Connection closed");
        this.handleReconnect();
      };
    } catch (error) {
      console.error("[WebSocket] Failed to connect:", error);
      throw error;
    }
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      if (message.bids && message.asks) {
        const orderbook = new Orderbook(
          message.bids
            .slice(0, 10)
            .map(([price, qty]: [string, string]) =>
              OrderbookLevel.create(price, qty)
            ),
          message.asks
            .slice(0, 10)
            .map(([price, qty]: [string, string]) =>
              OrderbookLevel.create(price, qty)
            ),
          message.lastUpdateId || Date.now()
        );

        if (this.callback) {
          this.callback(orderbook);
        }
      }
    } catch (error) {
      console.error("[WebSocket] Failed to parse message:", {
        error: error instanceof Error ? error.message : "Unknown error",
        data: data.substring(0, 100),
      });
      
      if (this.onError) {
        this.onError(error instanceof Error ? error : new Error("Failed to parse WebSocket message"));
      }
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error("[WebSocket] Max reconnection attempts reached. Falling back to polling.");
      
      if (this.onError) {
        this.onError(new Error("WebSocket: Max reconnection attempts reached"));
      }
      return;
    }

    if (!this.currentSymbol) {
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `[WebSocket] Reconnecting... (attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`
    );

    this.reconnectTimeout = setTimeout(() => {
      if (this.currentSymbol) {
        this.setupWebSocket(this.currentSymbol);
      }
    }, this.RECONNECT_DELAY);
  }

  private disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = 0;
  }
}
