import { ApiConfig } from "../config/ApiConfig";

export interface BinanceOrderbookResponse {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export class BinanceApiClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = ApiConfig.getBaseUrl();
    this.timeout = ApiConfig.getTimeout();
  }

  async fetchOrderbook(symbol: string, limit: number): Promise<BinanceOrderbookResponse> {
    const url = `${this.baseUrl}/depth?symbol=${symbol}&limit=${limit}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Binance API Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return this.validateResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        throw error;
      }
      throw new Error("Unknown error occurred");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private validateResponse(data: unknown): BinanceOrderbookResponse {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format");
    }

    const response = data as Partial<BinanceOrderbookResponse>;

    if (
      typeof response.lastUpdateId !== "number" ||
      !Array.isArray(response.bids) ||
      !Array.isArray(response.asks)
    ) {
      throw new Error("Invalid orderbook response structure");
    }

    return response as BinanceOrderbookResponse;
  }
}
