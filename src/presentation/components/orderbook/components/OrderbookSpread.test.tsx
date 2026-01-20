/**
 * Component Tests: OrderbookSpread
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderbookSpread } from "./OrderbookSpread";
import { Orderbook } from "@/domain/entities/Orderbook";
import { OrderbookLevel } from "@/domain/valueObjects/OrderbookLevel";

describe("OrderbookSpread", () => {
  const createMockOrderbook = () => {
    return new Orderbook(
      [OrderbookLevel.create("100.00", "1.0")],
      [OrderbookLevel.create("100.10", "1.5")],
      123456
    );
  };

  it("should render spread value", () => {
    const orderbook = createMockOrderbook();
    render(<OrderbookSpread orderbook={orderbook} />);

    // Spread should be visible
    expect(screen.getByText("Spread")).toBeInTheDocument();
  });

  it("should display spread percentage", () => {
    const orderbook = createMockOrderbook();
    render(<OrderbookSpread orderbook={orderbook} />);

    // Check percentage is displayed (spread% should be ~0.1%)
    const percentText = screen.getByText(/\d+\.\d+%/);
    expect(percentText).toBeInTheDocument();
  });

  it("should have correct styling", () => {
    const orderbook = createMockOrderbook();
    const { container } = render(<OrderbookSpread orderbook={orderbook} />);

    // Check container has border
    const spreadContainer = container.firstChild;
    expect(spreadContainer).toHaveClass("border-y");
  });
});
