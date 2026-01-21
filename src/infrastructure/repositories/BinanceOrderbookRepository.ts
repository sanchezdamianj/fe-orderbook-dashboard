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

    const bids = this.mapLevels(response.bids, visibleLevels);
    const asks = this.mapLevels(response.asks, visibleLevels);

    return new Orderbook(bids, asks, response.lastUpdateId);
  }

  private mapLevels(levels: [string, string][], limit: number) {
    return levels
      .slice(0, limit)
      .map(([price, quantity]) => OrderbookLevel.create(price, quantity));
  }
}
