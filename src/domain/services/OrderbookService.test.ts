/**
 * Service Tests: OrderbookService
 */

import { describe, it, expect, vi } from "vitest";
import { OrderbookService } from "./OrderbookService";
import type { IOrderbookRepository } from "@/domain/repositories/IOrderbookRepository";
import { Orderbook } from "@/domain/entities/Orderbook";
import { OrderbookLevel } from "@/domain/valueObjects/OrderbookLevel";

describe("OrderbookService", () => {
  const mockOrderbook = new Orderbook(
    [OrderbookLevel.create("100.00", "1.0")],
    [OrderbookLevel.create("100.10", "1.5")],
    123456
  );

  it("should fetch orderbook from repository", async () => {
    const mockRepository: IOrderbookRepository = {
      fetchOrderbook: vi.fn().mockResolvedValue(mockOrderbook),
    };

    const service = new OrderbookService(mockRepository);
    const result = await service.getOrderbook("BTCUSDT", 10);

    expect(result).toEqual(mockOrderbook);
    expect(mockRepository.fetchOrderbook).toHaveBeenCalledWith("BTCUSDT", 10);
  });

  it("should throw error if repository fails", async () => {
    const mockRepository: IOrderbookRepository = {
      fetchOrderbook: vi.fn().mockRejectedValue(new Error("API Error")),
    };

    const service = new OrderbookService(mockRepository);

    await expect(service.getOrderbook("BTCUSDT", 10)).rejects.toThrow(
      "API Error"
    );
  });

  it("should calculate bar width correctly", () => {
    const mockRepository: IOrderbookRepository = {
      fetchOrderbook: vi.fn(),
    };

    const service = new OrderbookService(mockRepository);
    const barWidth = service.calculateBarWidth(mockOrderbook, "bid", 0);

    expect(barWidth).toBeGreaterThan(0);
    expect(barWidth).toBeLessThanOrEqual(100);
  });
});
