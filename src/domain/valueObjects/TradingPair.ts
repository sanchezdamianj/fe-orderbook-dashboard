export class TradingPair {
  private constructor(
    public readonly symbol: string,
    public readonly baseAsset: string,
    public readonly quoteAsset: string
  ) {
    this.validateSymbol(symbol);
    this.validateAsset(baseAsset, "Base");
    this.validateAsset(quoteAsset, "Quote");
  }

  static create(config: {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
  }): TradingPair {
    return new TradingPair(config.symbol, config.baseAsset, config.quoteAsset);
  }

  private validateSymbol(symbol: string): void {
    if (!symbol || symbol.length < 6) {
      throw new Error(`Invalid trading pair symbol: ${symbol}`);
    }
  }

  private validateAsset(asset: string, type: string): void {
    if (!asset || asset.length < 2) {
      throw new Error(`Invalid ${type} asset: ${asset}`);
    }
  }

  get displayName(): string {
    return `${this.baseAsset}/${this.quoteAsset}`;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  equals(other: TradingPair): boolean {
    return this.symbol === other.symbol;
  }
}
