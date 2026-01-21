/**
 * Component Tests: OrderbookDisplay
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderbookDisplay } from "./OrderbookDisplay";
import { useOrderbookStore } from "@/presentation/stores/OrderbookStore";
import { Orderbook } from "@/domain/entities/Orderbook";
import { OrderbookLevel } from "@/domain/valueObjects/OrderbookLevel";

// Mock the store
vi.mock("@/presentation/stores/OrderbookStore");

// Mock child components
vi.mock("./OrderbookHeader", () => ({
  OrderbookHeader: () => <div data-testid="orderbook-header">Header</div>,
}));

vi.mock("./OrderbookAsks", () => ({
  OrderbookAsks: () => <div data-testid="orderbook-asks">Asks</div>,
}));

vi.mock("./OrderbookSpread", () => ({
  OrderbookSpread: () => <div data-testid="orderbook-spread">Spread</div>,
}));

vi.mock("./OrderbookBids", () => ({
  OrderbookBids: () => <div data-testid="orderbook-bids">Bids</div>,
}));

vi.mock("./OrderbookError", () => ({
  OrderbookError: ({ error }: { error: Error }) => (
    <div data-testid="orderbook-error">{error.message}</div>
  ),
}));

vi.mock("./OrderbookLoading", () => ({
  OrderbookLoading: () => <div data-testid="orderbook-loading">Loading...</div>,
}));

describe("OrderbookDisplay", () => {
  const mockOrderbook = new Orderbook(
    [OrderbookLevel.create("100.00", "1.0")],
    [OrderbookLevel.create("100.10", "1.5")],
    123456
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("render states", () => {
    it("should render loading state when loading and no orderbook", () => {
      // Arrange
      vi.mocked(useOrderbookStore).mockReturnValue({
        orderbook: null,
        isLoading: true,
        error: null,
        fetchOrderbook: vi.fn(),
        connectionMode: "polling",
      });

      // Act
      render(<OrderbookDisplay />);

      // Assert
      expect(screen.getByTestId("orderbook-loading")).toBeInTheDocument();
    });

    it("should render error state when error exists", () => {
      // Arrange
      const mockError = new Error("Failed to fetch orderbook");
      vi.mocked(useOrderbookStore).mockReturnValue({
        orderbook: null,
        isLoading: false,
        error: mockError,
        fetchOrderbook: vi.fn(),
        connectionMode: "polling",
      });

      // Act
      render(<OrderbookDisplay />);

      // Assert
      expect(screen.getByTestId("orderbook-error")).toBeInTheDocument();
      expect(screen.getByText("Failed to fetch orderbook")).toBeInTheDocument();
    });

    it("should render orderbook when data is available", () => {
      // Arrange
      vi.mocked(useOrderbookStore).mockReturnValue({
        orderbook: mockOrderbook,
        isLoading: false,
        error: null,
        fetchOrderbook: vi.fn(),
        connectionMode: "polling",
      });

      // Act
      render(<OrderbookDisplay />);

      // Assert
      expect(screen.getByTestId("orderbook-header")).toBeInTheDocument();
      expect(screen.getByTestId("orderbook-asks")).toBeInTheDocument();
      expect(screen.getByTestId("orderbook-spread")).toBeInTheDocument();
      expect(screen.getByTestId("orderbook-bids")).toBeInTheDocument();
    });

    it("should not render loading spinner when orderbook exists and loading", () => {
      // Arrange
      vi.mocked(useOrderbookStore).mockReturnValue({
        orderbook: mockOrderbook,
        isLoading: true,
        error: null,
        fetchOrderbook: vi.fn(),
        connectionMode: "polling",
      });

      // Act
      render(<OrderbookDisplay />);

      // Assert
      expect(screen.queryByTestId("orderbook-loading")).not.toBeInTheDocument();
      expect(screen.getByTestId("orderbook-header")).toBeInTheDocument();
    });

    it("should return null when no orderbook and not loading", () => {
      // Arrange
      vi.mocked(useOrderbookStore).mockReturnValue({
        orderbook: null,
        isLoading: false,
        error: null,
        fetchOrderbook: vi.fn(),
        connectionMode: "polling",
      });

      // Act
      const { container } = render(<OrderbookDisplay />);

      // Assert
      expect(container.firstChild).toBeNull();
    });
  });

  describe("data fetching", () => {
    it("should call fetchOrderbook on mount", () => {
      // Arrange
      const mockFetchOrderbook = vi.fn();
      vi.mocked(useOrderbookStore).mockReturnValue({
        orderbook: mockOrderbook,
        isLoading: false,
        error: null,
        fetchOrderbook: mockFetchOrderbook,
        connectionMode: "polling",
      });

      // Act
      render(<OrderbookDisplay />);

      // Assert
      expect(mockFetchOrderbook).toHaveBeenCalledTimes(1);
    });
  });

  describe("layout structure", () => {
    it("should render components in correct order", () => {
      // Arrange
      vi.mocked(useOrderbookStore).mockReturnValue({
        orderbook: mockOrderbook,
        isLoading: false,
        error: null,
        fetchOrderbook: vi.fn(),
        connectionMode: "polling",
      });

      // Act
      const { container } = render(<OrderbookDisplay />);
      const elements = container.querySelectorAll("[data-testid]");

      // Assert
      expect(elements[0]).toHaveAttribute("data-testid", "orderbook-header");
      expect(elements[1]).toHaveAttribute("data-testid", "orderbook-asks");
      expect(elements[2]).toHaveAttribute("data-testid", "orderbook-spread");
      expect(elements[3]).toHaveAttribute("data-testid", "orderbook-bids");
    });

    it("should have proper container classes", () => {
      // Arrange
      vi.mocked(useOrderbookStore).mockReturnValue({
        orderbook: mockOrderbook,
        isLoading: false,
        error: null,
        fetchOrderbook: vi.fn(),
        connectionMode: "polling",
      });

      // Act
      const { container } = render(<OrderbookDisplay />);
      const mainContainer = container.firstChild;

      // Assert
      expect(mainContainer).toHaveClass("flex", "h-full", "flex-col");
    });
  });
});
