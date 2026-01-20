/**
 * Unit Tests: FetchOrderbookUseCase
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { FetchOrderbookUseCase } from "./FetchOrderbookUseCase";
import { OrderbookService } from "@/domain/services/OrderbookService";
import type { IOrderbookRepository } from "@/domain/repositories/IOrderbookRepository";
import { Orderbook } from "@/domain/entities/Orderbook";
import { OrderbookLevel } from "@/domain/valueObjects/OrderbookLevel";

describe("FetchOrderbookUseCase", () => {
  let mockRepository: IOrderbookRepository;
  let service: OrderbookService;
  let useCase: FetchOrderbookUseCase;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      fetchOrderbook: vi.fn(),
    };

    service = new OrderbookService(mockRepository);
    useCase = new FetchOrderbookUseCase(service);
  });

  describe("execute", () => {
    it("should fetch orderbook successfully", async () => {
      // Arrange
      const mockOrderbook = new Orderbook(
        [OrderbookLevel.create("100.00", "1.0")],
        [OrderbookLevel.create("100.10", "1.5")],
        123456
      );

      vi.mocked(mockRepository.fetchOrderbook).mockResolvedValue(mockOrderbook);

      // Act
      const response = await useCase.execute({
        symbol: "BTCUSDT",
        limit: 10,
      });

      // Assert
      expect(response.orderbook).toEqual(mockOrderbook);
      expect(response.error).toBeNull();
      expect(mockRepository.fetchOrderbook).toHaveBeenCalledWith("BTCUSDT", 10);
      expect(mockRepository.fetchOrderbook).toHaveBeenCalledTimes(1);
    });

    it("should return error when fetch fails", async () => {
      // Arrange
      const mockError = new Error("Network error");
      vi.mocked(mockRepository.fetchOrderbook).mockRejectedValue(mockError);

      // Act
      const response = await useCase.execute({
        symbol: "BTCUSDT",
        limit: 10,
      });

      // Assert
      expect(response.orderbook).toBeNull();
      expect(response.error).toEqual(mockError);
      expect(mockRepository.fetchOrderbook).toHaveBeenCalledWith("BTCUSDT", 10);
    });

    it("should handle API errors gracefully", async () => {
      // Arrange
      const apiError = new Error("API rate limit exceeded");
      vi.mocked(mockRepository.fetchOrderbook).mockRejectedValue(apiError);

      // Act
      const response = await useCase.execute({
        symbol: "ETHUSDT",
        limit: 10,
      });

      // Assert
      expect(response.orderbook).toBeNull();
      expect(response.error).toEqual(apiError);
      expect(response.error?.message).toBe("API rate limit exceeded");
    });

    it("should call repository with correct symbol", async () => {
      // Arrange
      const mockOrderbook = new Orderbook(
        [OrderbookLevel.create("1000.00", "2.0")],
        [OrderbookLevel.create("1000.10", "2.5")],
        789012
      );

      vi.mocked(mockRepository.fetchOrderbook).mockResolvedValue(mockOrderbook);

      // Act
      await useCase.execute({
        symbol: "SOLUSDT",
        limit: 20,
      });

      // Assert
      expect(mockRepository.fetchOrderbook).toHaveBeenCalledWith("SOLUSDT", 20);
    });

    it("should maintain orderbook integrity", async () => {
      // Arrange
      const bids = [
        OrderbookLevel.create("100.00", "1.0"),
        OrderbookLevel.create("99.90", "2.0"),
      ];
      const asks = [
        OrderbookLevel.create("100.10", "1.5"),
        OrderbookLevel.create("100.20", "2.5"),
      ];
      const mockOrderbook = new Orderbook(bids, asks, 123456);

      vi.mocked(mockRepository.fetchOrderbook).mockResolvedValue(mockOrderbook);

      // Act
      const response = await useCase.execute({
        symbol: "BTCUSDT",
        limit: 10,
      });

      // Assert
      expect(response.orderbook?.bids).toHaveLength(2);
      expect(response.orderbook?.asks).toHaveLength(2);
      expect(response.orderbook?.bestBid.priceAsNumber).toBe(100.0);
      expect(response.orderbook?.bestAsk.priceAsNumber).toBe(100.1);
    });
  });
});
