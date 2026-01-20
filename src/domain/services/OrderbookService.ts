import type { Orderbook } from "../entities/Orderbook";
import type { IOrderbookRepository } from "../repositories/IOrderbookRepository";

export class OrderbookService {
  constructor(private readonly repository: IOrderbookRepository) {}

  async getOrderbook(symbol: string, limit: number): Promise<Orderbook> {
    return await this.repository.fetchOrderbook(symbol, limit);
  }

  calculateBarWidth(orderbook: Orderbook, side: "bid" | "ask", index: number): number {
    const maxTotal = orderbook.getMaxTotalQuantity();
    const total = orderbook.getTotalQuantityAtLevel(side, index);
    return (total / maxTotal) * 100;
  }
}
