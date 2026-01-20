/**
 * Component Tests: OrderbookHeader
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderbookHeader } from "./OrderbookHeader";

describe("OrderbookHeader", () => {
  it("should render column headers", () => {
    render(<OrderbookHeader />);

    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("should have grid layout", () => {
    const { container } = render(<OrderbookHeader />);
    const header = container.firstChild;

    expect(header).toHaveClass("grid", "grid-cols-3");
  });

  it("should be sticky", () => {
    const { container } = render(<OrderbookHeader />);
    const header = container.firstChild;

    expect(header).toHaveClass("sticky", "top-0");
  });
});
