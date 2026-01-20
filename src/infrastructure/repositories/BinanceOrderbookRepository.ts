import type { IOrderbookRepository } from "@/domain/repositories/IOrderbookRepository";
import { Orderbook } from "@/domain/entities/Orderbook";
import { OrderbookLevel } from "@/domain/valueObjects/OrderbookLevel";
import { BinanceApiClient } from "../api/BinanceApiClient";
import { ApiConfig } from "../config/ApiConfig";

export class BinanceOrderbookRepository implements IOrderbookRepository {
  private readonly apiClient: BinanceApiClient;

  constructor() {
    this.apiClient = new BinanceApiClient();
  }

  async fetchOrderbook(symbol: string, limit: number): Promise<Orderbook> {
    const response = await this.apiClient.fetchOrderbook(symbol, limit);
    return this.mapToOrderbook(response);
  }

  private mapToOrderbook(response: {
    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
  }): Orderbook {
    const visibleLevels = ApiConfig.getVisibleLevels();

    const bids = response.bids
      .slice(0, visibleLevels)
      .map(([price, quantity]) => OrderbookLevel.create(price, quantity));

    const asks = response.asks
      .slice(0, visibleLevels)
      .map(([price, quantity]) => OrderbookLevel.create(price, quantity));

    return new Orderbook(bids, asks, response.lastUpdateId);
  }
}
