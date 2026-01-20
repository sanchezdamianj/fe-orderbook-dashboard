/**
 * Unit Tests: Orderbook Entity
 */

import { describe, it, expect } from "vitest";
import { Orderbook } from "./Orderbook";
import { OrderbookLevel } from "../valueObjects/OrderbookLevel";

describe("Orderbook", () => {
  const createMockBids = (): OrderbookLevel[] => [
    OrderbookLevel.create("100.00", "1.0"),
    OrderbookLevel.create("99.90", "2.0"),
    OrderbookLevel.create("99.80", "3.0"),
  ];

  const createMockAsks = (): OrderbookLevel[] => [
    OrderbookLevel.create("100.10", "1.5"),
    OrderbookLevel.create("100.20", "2.5"),
    OrderbookLevel.create("100.30", "3.5"),
  ];

  describe("constructor", () => {
    it("should create a valid orderbook", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      expect(orderbook.bids).toEqual(bids);
      expect(orderbook.asks).toEqual(asks);
      expect(orderbook.lastUpdateId).toBe(123456);
    });

    it("should throw error if bids is empty", () => {
      const asks = createMockAsks();
      expect(() => new Orderbook([], asks, 123456)).toThrow(
        "Orderbook must have at least one bid and one ask"
      );
    });

    it("should throw error if asks is empty", () => {
      const bids = createMockBids();
      expect(() => new Orderbook(bids, [], 123456)).toThrow(
        "Orderbook must have at least one bid and one ask"
      );
    });
  });

  describe("bestBid", () => {
    it("should return the first bid", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      expect(orderbook.bestBid).toEqual(bids[0]);
      expect(orderbook.bestBid.priceAsNumber).toBe(100.0);
    });
  });

  describe("bestAsk", () => {
    it("should return the first ask", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      expect(orderbook.bestAsk).toEqual(asks[0]);
      expect(orderbook.bestAsk.priceAsNumber).toBe(100.1);
    });
  });

  describe("spread", () => {
    it("should calculate the spread correctly", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      // bestAsk (100.10) - bestBid (100.00) ≈ 0.10
      expect(orderbook.spread).toBeCloseTo(0.1, 1); // Allow floating point precision
    });
  });

  describe("spreadPercentage", () => {
    it("should calculate the spread percentage correctly", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      // (0.10 / 100.00) * 100 = 0.1%
      const expectedPercentage = (0.10000000000000853 / 100.0) * 100;
      expect(orderbook.spreadPercentage).toBeCloseTo(expectedPercentage, 5);
    });
  });

  describe("getTotalQuantityAtLevel", () => {
    it("should calculate cumulative bid quantity at level 0", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      const total = orderbook.getTotalQuantityAtLevel("bid", 0);
      expect(total).toBe(1.0);
    });

    it("should calculate cumulative bid quantity at level 2", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      const total = orderbook.getTotalQuantityAtLevel("bid", 2);
      // 1.0 + 2.0 + 3.0 = 6.0
      expect(total).toBe(6.0);
    });

    it("should calculate cumulative ask quantity at level 0", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      const total = orderbook.getTotalQuantityAtLevel("ask", 0);
      expect(total).toBe(1.5);
    });

    it("should calculate cumulative ask quantity at level 2", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      const total = orderbook.getTotalQuantityAtLevel("ask", 2);
      // 1.5 + 2.5 + 3.5 = 7.5
      expect(total).toBe(7.5);
    });
  });

  describe("getMaxTotalQuantity", () => {
    it("should return the maximum cumulative quantity across all levels", () => {
      const bids = createMockBids();
      const asks = createMockAsks();
      const orderbook = new Orderbook(bids, asks, 123456);

      const max = orderbook.getMaxTotalQuantity();
      // Max is at level 2 of asks: 7.5
      expect(max).toBe(7.5);
    });

    it("should return bid max when bids have larger cumulative quantity", () => {
      const bids = [
        OrderbookLevel.create("100.00", "5.0"),
        OrderbookLevel.create("99.90", "5.0"),
      ];
      const asks = [OrderbookLevel.create("100.10", "1.0")];
      const orderbook = new Orderbook(bids, asks, 123456);

      const max = orderbook.getMaxTotalQuantity();
      // Max is at level 1 of bids: 10.0
      expect(max).toBe(10.0);
    });
  });
});
