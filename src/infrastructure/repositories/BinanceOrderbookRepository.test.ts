/**
 * Repository Tests: BinanceOrderbookRepository
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { BinanceOrderbookRepository } from "./BinanceOrderbookRepository";

// Mock the BinanceApiClient
vi.mock("../api/BinanceApiClient", () => ({
  BinanceApiClient: vi.fn().mockImplementation(() => ({
    fetchOrderbook: vi.fn(),
  })),
}));

describe("BinanceOrderbookRepository", () => {
  let repository: BinanceOrderbookRepository;

  beforeEach(() => {
    repository = new BinanceOrderbookRepository();
  });

  it("should create an instance", () => {
    expect(repository).toBeDefined();
  });

  it("should have fetchOrderbook method", () => {
    expect(repository.fetchOrderbook).toBeDefined();
    expect(typeof repository.fetchOrderbook).toBe("function");
  });
});
