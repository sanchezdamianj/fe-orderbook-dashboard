import type { Orderbook } from "@/domain/entities/Orderbook";
import { OrderbookLevel } from "./OrderbookLevel";

interface OrderbookBidsProps {
  orderbook: Orderbook;
}

export function OrderbookBids({ orderbook }: OrderbookBidsProps) {
  const visibleBids = orderbook.bids.slice(0, 10);
  
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="flex flex-col">
        {visibleBids.map((level, index) => {
          const totalQty = orderbook.getTotalQuantityAtLevel("bid", index);
          const barWidth = (totalQty / orderbook.getMaxTotalQuantity()) * 100;

          return (
            <OrderbookLevel
              key={`bid-${level.priceAsString}-${index}`}
              level={level}
              side="bid"
              barWidth={barWidth}
            />
          );
        })}
      </div>
    </div>
  );
}
