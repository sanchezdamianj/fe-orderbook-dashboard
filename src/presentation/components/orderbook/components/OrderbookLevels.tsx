import { useMemo } from "react";
import type { Orderbook } from "@/domain/entities/Orderbook";
import { OrderbookLevel } from "./OrderbookLevel";

interface OrderbookLevelsProps {
  orderbook: Orderbook;
  side: "bid" | "ask";
}

export function OrderbookLevels({ orderbook, side }: OrderbookLevelsProps) {
  const visibleLevels = useMemo(() => {
    const levels = side === "bid" ? orderbook.bids : orderbook.asks;
    return levels.slice(0, 10);
  }, [orderbook, side]);

  const levelComponents = useMemo(() => {
    return visibleLevels.map((level, index) => {
      const totalQty = orderbook.getTotalQuantityAtLevel(side, index);
      const barWidth = (totalQty / orderbook.getMaxTotalQuantity()) * 100;

      return (
        <OrderbookLevel
          key={`${side}-${level.priceAsString}-${index}`}
          level={level}
          side={side}
          barWidth={barWidth}
        />
      );
    });
  }, [visibleLevels, orderbook, side]);

  const containerClass = side === "ask" ? "flex flex-col-reverse" : "flex flex-col";

  const sideLabel = side === "bid" ? "Buy orders (Bids)" : "Sell orders (Asks)";
  
  return (
    <div 
      className="flex-1 min-h-0 overflow-y-auto" 
      data-testid={`orderbook-${side}s`}
      role="list"
      aria-label={sideLabel}
    >
      <div className={containerClass}>
        {levelComponents}
      </div>
    </div>
  );
}
