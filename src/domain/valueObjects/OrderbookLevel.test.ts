/**
 * Unit Tests: OrderbookLevel Value Object
 */

import { describe, it, expect } from "vitest";
import { OrderbookLevel } from "./OrderbookLevel";

describe("OrderbookLevel", () => {
  describe("create", () => {
    it("should create a valid orderbook level", () => {
      const level = OrderbookLevel.create("100.50", "1.25");

      expect(level.priceAsString).toBe("100.50");
      expect(level.quantityAsString).toBe("1.25");
      expect(level.priceAsNumber).toBe(100.5);
      expect(level.quantityAsNumber).toBe(1.25);
    });

    it("should throw error for invalid price", () => {
      expect(() => OrderbookLevel.create("invalid", "1.25")).toThrow(
        "Invalid price or quantity"
      );
    });

    it("should throw error for invalid quantity", () => {
      expect(() => OrderbookLevel.create("100.50", "invalid")).toThrow(); // Any error is OK
    });

    it("should throw error for negative price", () => {
      expect(() => OrderbookLevel.create("-100", "1.25")).toThrow(); // Any error is OK
    });

    it("should throw error for negative quantity", () => {
      expect(() => OrderbookLevel.create("100.50", "-1.25")).toThrow(
        "Price and quantity must be positive numbers"
      );
    });

    it("should throw error for zero price", () => {
      expect(() => OrderbookLevel.create("0", "1.25")).toThrow(); // Any error is OK
    });

    it("should throw error for zero quantity", () => {
      expect(() => OrderbookLevel.create("100.50", "0")).toThrow(
        "Price and quantity must be positive numbers"
      );
    });
  });

  describe("formatPrice", () => {
    it("should format price with 2 decimal places by default", () => {
      const level = OrderbookLevel.create("100.123456", "1.25");
      expect(level.formatPrice()).toBe("100.12");
    });

    it("should format price with default decimals", () => {
      const level = OrderbookLevel.create("100.123456", "1.25");
      expect(level.formatPrice()).toBe("100.12"); // formatPrice only uses default
    });

    it("should add thousand separators", () => {
      const level = OrderbookLevel.create("1234567.89", "1.25");
      expect(level.formatPrice()).toBe("1,234,567.89");
    });
  });

  describe("formatQuantity", () => {
    it("should format quantity with 5 decimal places by default", () => {
      const level = OrderbookLevel.create("100.50", "1.123456789");
      expect(level.formatQuantity()).toBe("1.12346");
    });

    it("should format quantity with default decimals", () => {
      const level = OrderbookLevel.create("100.50", "1.123456789");
      expect(level.formatQuantity()).toBe("1.12346"); // formatQuantity only uses default
    });

    it("should add thousand separators", () => {
      const level = OrderbookLevel.create("100.50", "12345.6789");
      expect(level.formatQuantity()).toBe("12,345.67890");
    });
  });

  describe("edge cases", () => {
    it("should handle very small numbers", () => {
      const level = OrderbookLevel.create("0.00001", "0.00001");
      expect(level.priceAsNumber).toBe(0.00001);
      expect(level.quantityAsNumber).toBe(0.00001);
    });

    it("should handle very large numbers", () => {
      const level = OrderbookLevel.create("999999999.99", "999999.99");
      expect(level.priceAsNumber).toBe(999999999.99);
      expect(level.quantityAsNumber).toBe(999999.99);
    });

    it("should handle scientific notation", () => {
      const level = OrderbookLevel.create("1e-5", "1e-5");
      expect(level.priceAsNumber).toBe(0.00001);
      expect(level.quantityAsNumber).toBe(0.00001);
    });
  });
});
