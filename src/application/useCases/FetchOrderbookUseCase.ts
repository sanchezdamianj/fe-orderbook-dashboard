import type { Orderbook } from "@/domain/entities/Orderbook";
import type { OrderbookService } from "@/domain/services/OrderbookService";

export interface FetchOrderbookRequest {
  symbol: string;
  limit: number;
}

export interface FetchOrderbookResponse {
  orderbook: Orderbook | null;
  error: Error | null;
}

export class FetchOrderbookUseCase {
  constructor(private readonly orderbookService: OrderbookService) {}

  async execute(request: FetchOrderbookRequest): Promise<FetchOrderbookResponse> {
    try {
      const orderbook = await this.orderbookService.getOrderbook(
        request.symbol,
        request.limit
      );

      return {
        orderbook,
        error: null,
      };
    } catch (error) {
      return {
        orderbook: null,
        error: error instanceof Error ? error : new Error("Unknown error occurred"),
      };
    }
  }
}
