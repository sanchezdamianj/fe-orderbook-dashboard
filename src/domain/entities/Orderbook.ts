import type { OrderbookLevel } from "../valueObjects/OrderbookLevel";

export class Orderbook {
  constructor(
    public readonly bids: OrderbookLevel[],
    public readonly asks: OrderbookLevel[],
    public readonly lastUpdateId: number
  ) {
    this.validateOrderbook();
  }

  private validateOrderbook(): void {
    if (this.bids.length === 0 || this.asks.length === 0) {
      throw new Error("Orderbook must have at least one bid and one ask");
    }
  }

  get bestBid(): OrderbookLevel {
    return this.bids[0];
  }

  get bestAsk(): OrderbookLevel {
    return this.asks[0];
  }

  get spread(): number {
    return this.bestAsk.priceAsNumber - this.bestBid.priceAsNumber;
  }

  get spreadPercentage(): number {
    return (this.spread / this.bestBid.priceAsNumber) * 100;
  }

  getTotalQuantityAtLevel(side: "bid" | "ask", index: number): number {
    const levels = side === "bid" ? this.bids : this.asks;
    return levels
      .slice(0, index + 1)
      .reduce((sum, level) => sum + level.quantityAsNumber, 0);
  }

  getMaxTotalQuantity(): number {
    const maxBidTotal = this.bids.reduce(
      (max, _, index) => Math.max(max, this.getTotalQuantityAtLevel("bid", index)),
      0
    );
    const maxAskTotal = this.asks.reduce(
      (max, _, index) => Math.max(max, this.getTotalQuantityAtLevel("ask", index)),
      0
    );
    return Math.max(maxBidTotal, maxAskTotal);
  }
}
