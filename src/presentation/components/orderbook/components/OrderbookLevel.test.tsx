/**
 * Component Tests: OrderbookLevel
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderbookLevel as OrderbookLevelComponent } from "./OrderbookLevel";
import { OrderbookLevel } from "@/domain/valueObjects/OrderbookLevel";

describe("OrderbookLevel Component", () => {
  const mockLevel = OrderbookLevel.create("100.50", "1.25");

  describe("render", () => {
    it("should render bid level correctly", () => {
      // Act
      render(
        <OrderbookLevelComponent
          level={mockLevel}
          barWidth={75}
          side="bid"
        />
      );

      // Assert
      expect(screen.getByText("100.50")).toBeInTheDocument();
      expect(screen.getByText("1.25000")).toBeInTheDocument();
    });

    it("should render ask level correctly", () => {
      // Act
      render(
        <OrderbookLevelComponent
          level={mockLevel}
          barWidth={50}
          side="ask"
        />
      );

      // Assert
      expect(screen.getByText("100.50")).toBeInTheDocument();
      expect(screen.getByText("1.25000")).toBeInTheDocument();
    });

    it("should apply bid color classes", () => {
      // Act
      const { container } = render(
        <OrderbookLevelComponent
          level={mockLevel}
          barWidth={75}
          side="bid"
        />
      );

      // Assert
      const priceElement = screen.getByText("100.50");
      expect(priceElement).toHaveClass("text-bid");

      const barElement = container.querySelector(".bg-bid-bg");
      expect(barElement).toBeInTheDocument();
    });

    it("should apply ask color classes", () => {
      // Act
      const { container } = render(
        <OrderbookLevelComponent
          level={mockLevel}
          barWidth={75}
          side="ask"
        />
      );

      // Assert
      const priceElement = screen.getByText("100.50");
      expect(priceElement).toHaveClass("text-ask");

      const barElement = container.querySelector(".bg-ask-bg");
      expect(barElement).toBeInTheDocument();
    });

    it("should render depth bar with correct width", () => {
      // Act
      const { container } = render(
        <OrderbookLevelComponent
          level={mockLevel}
          barWidth={60}
          side="bid"
        />
      );

      // Assert
      const barElement = container.querySelector(".absolute.right-0");
      expect(barElement).toHaveStyle({ width: "60%" });
    });

    it("should render with zero bar width", () => {
      // Act
      const { container } = render(
        <OrderbookLevelComponent
          level={mockLevel}
          barWidth={0}
          side="bid"
        />
      );

      // Assert
      const barElement = container.querySelector(".absolute.right-0");
      expect(barElement).toHaveStyle({ width: "0%" });
    });

    it("should render with full bar width", () => {
      // Act
      const { container } = render(
        <OrderbookLevelComponent
          level={mockLevel}
          barWidth={100}
          side="bid"
        />
      );

      // Assert
      const barElement = container.querySelector(".absolute.right-0");
      expect(barElement).toHaveStyle({ width: "100%" });
    });

    it("should format large numbers correctly", () => {
      // Arrange
      const largeLevel = OrderbookLevel.create("12345.67", "9876.54321");

      // Act
      render(
        <OrderbookLevelComponent
          level={largeLevel}
          barWidth={80}
          side="bid"
        />
      );

      // Assert
      expect(screen.getByText("12,345.67")).toBeInTheDocument();
      expect(screen.getByText("9,876.54321")).toBeInTheDocument();
    });

    it("should format small numbers correctly", () => {
      // Arrange
      const smallLevel = OrderbookLevel.create("0.0001", "0.00001");

      // Act
      render(
        <OrderbookLevelComponent
          level={smallLevel}
          barWidth={10}
          side="ask"
        />
      );

      // Assert
      expect(screen.getByText("0.00")).toBeInTheDocument();
      expect(screen.getByText("0.00001")).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("should use grid layout with 2 columns", () => {
      // Act
      const { container } = render(
        <OrderbookLevelComponent
          level={mockLevel}
          barWidth={75}
          side="bid"
        />
      );

      // Assert
      const gridElement = container.firstChild;
      expect(gridElement).toHaveClass("grid", "grid-cols-2");
    });

    it("should position depth bar absolutely", () => {
      // Act
      const { container } = render(
        <OrderbookLevelComponent
          level={mockLevel}
          barWidth={75}
          side="bid"
        />
      );

      // Assert
      const barElement = container.querySelector(".absolute");
      expect(barElement).toHaveClass("absolute", "right-0", "top-0", "h-full");
    });
  });
});
