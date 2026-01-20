/**
 * Store Tests: OrderbookStore
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOrderbookStore } from "./OrderbookStore";

describe("OrderbookStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useOrderbookStore());
    act(() => {
      result.current.clearError();
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useOrderbookStore());

    expect(result.current.orderbook).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.connectionMode).toBe("websocket");
  });

  it("should have a default trading pair selected", () => {
    const { result } = renderHook(() => useOrderbookStore());

    expect(result.current.selectedPair).toBeDefined();
    expect(result.current.selectedPair.symbol).toBe("BTCUSDT");
  });

  it("should clear error", () => {
    const { result } = renderHook(() => useOrderbookStore());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
