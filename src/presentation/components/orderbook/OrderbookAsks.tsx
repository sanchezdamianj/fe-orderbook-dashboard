import type { Orderbook } from "@/domain/entities/Orderbook";
import { OrderbookLevel } from "./OrderbookLevel";

interface OrderbookAsksProps {
  orderbook: Orderbook;
}

export function OrderbookAsks({ orderbook }: OrderbookAsksProps) {
  const visibleAsks = orderbook.asks.slice(0, 10);
  
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="flex flex-col-reverse">
        {visibleAsks.map((level, index) => {
          const totalQty = orderbook.getTotalQuantityAtLevel("ask", index);
          const barWidth = (totalQty / orderbook.getMaxTotalQuantity()) * 100;

          return (
            <OrderbookLevel
              key={`ask-${level.priceAsString}-${index}`}
              level={level}
              side="ask"
              barWidth={barWidth}
            />
          );
        })}
      </div>
    </div>
  );
}
