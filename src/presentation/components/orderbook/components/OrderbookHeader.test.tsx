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
    expect(screen.getByText("Quantity")).toBeInTheDocument();
  });

  it("should have grid layout with 2 columns", () => {
    const { container } = render(<OrderbookHeader />);
    const header = container.firstChild;

    expect(header).toHaveClass("grid", "grid-cols-2");
  });

  it("should have role attributes for accessibility", () => {
    const { container } = render(<OrderbookHeader />);
    const header = container.firstChild;

    expect(header).toHaveAttribute("role", "row");
    
    const headers = container.querySelectorAll('[role="columnheader"]');
    expect(headers).toHaveLength(2);
  });
});
