import type { Orderbook } from "../entities/Orderbook";

export interface IOrderbookRepository {
  fetchOrderbook(symbol: string, limit: number): Promise<Orderbook>;
}
