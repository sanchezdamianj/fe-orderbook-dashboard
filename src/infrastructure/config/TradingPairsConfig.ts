import { TradingPair } from "@/domain/valueObjects/TradingPair";

export const TRADING_PAIRS_CONFIG = [
  { symbol: "BTCUSDT", baseAsset: "BTC", quoteAsset: "USDT" },
  { symbol: "ETHUSDT", baseAsset: "ETH", quoteAsset: "USDT" },
  { symbol: "SOLUSDT", baseAsset: "SOL", quoteAsset: "USDT" },
  { symbol: "BNBUSDT", baseAsset: "BNB", quoteAsset: "USDT" },
  { symbol: "ADAUSDT", baseAsset: "ADA", quoteAsset: "USDT" },
  { symbol: "XRPUSDT", baseAsset: "XRP", quoteAsset: "USDT" },
  { symbol: "DOGEUSDT", baseAsset: "DOGE", quoteAsset: "USDT" },
] as const;

export class TradingPairsConfig {
  private static instance: TradingPairsConfig;
  private readonly pairs: TradingPair[];

  private constructor() {
    this.pairs = TRADING_PAIRS_CONFIG.map(
      (config) => TradingPair.create(config)
    );
  }

  static getInstance(): TradingPairsConfig {
    if (!TradingPairsConfig.instance) {
      TradingPairsConfig.instance = new TradingPairsConfig();
    }
    return TradingPairsConfig.instance;
  }

  getAllPairs(): TradingPair[] {
    return [...this.pairs];
  }

  findBySymbol(symbol: string): TradingPair | undefined {
    return this.pairs.find((pair) => pair.symbol === symbol);
  }

  getDefaultPair(): TradingPair {
    return this.pairs[0];
  }
}
