/**
 * Unit Tests: SelectTradingPairUseCase
 */

import { describe, it, expect } from "vitest";
import { SelectTradingPairUseCase } from "./SelectTradingPairUseCase";
import { TradingPair } from "@/domain/valueObjects/TradingPair";

describe("SelectTradingPairUseCase", () => {
  let useCase: SelectTradingPairUseCase;

  beforeEach(() => {
    useCase = new SelectTradingPairUseCase();
  });

  describe("execute", () => {
    it("should select a trading pair successfully", () => {
      // Arrange
      const pair = TradingPair.create({
        baseAsset: "BTC",
        quoteAsset: "USDT",
        symbol: "BTCUSDT",
      });

      // Act
      const response = useCase.execute({ tradingPair: pair });

      // Assert
      expect(response.selectedPair).toEqual(pair);
      expect(response.selectedPair.symbol).toBe("BTCUSDT");
      expect(response.selectedPair.baseAsset).toBe("BTC");
      expect(response.selectedPair.quoteAsset).toBe("USDT");
    });

    it("should handle different trading pairs", () => {
      // Arrange
      const ethPair = TradingPair.create({
        baseAsset: "ETH",
        quoteAsset: "USDT",
        symbol: "ETHUSDT",
      });

      // Act
      const response = useCase.execute({ tradingPair: ethPair });

      // Assert
      expect(response.selectedPair.symbol).toBe("ETHUSDT");
      expect(response.selectedPair.baseAsset).toBe("ETH");
    });

    it("should maintain trading pair integrity", () => {
      // Arrange
      const pair = TradingPair.create({
        baseAsset: "SOL",
        quoteAsset: "USDT",
        symbol: "SOLUSDT",
      });

      // Act
      const response = useCase.execute({ tradingPair: pair });

      // Assert
      expect(response.selectedPair).toBe(pair);
      expect(response.selectedPair.getDisplayName()).toBe("SOL/USDT");
    });

    it("should handle pairs with different quote assets", () => {
      // Arrange
      const btcBusdPair = TradingPair.create({
        baseAsset: "BTC",
        quoteAsset: "BUSD",
        symbol: "BTCBUSD",
      });

      // Act
      const response = useCase.execute({ tradingPair: btcBusdPair });

      // Assert
      expect(response.selectedPair.quoteAsset).toBe("BUSD");
      expect(response.selectedPair.getDisplayName()).toBe("BTC/BUSD");
    });
  });
});
