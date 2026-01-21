import type { Orderbook } from "@/domain/entities/Orderbook";

interface OrderbookSpreadProps {
  orderbook: Orderbook;
}

export function OrderbookSpread({ orderbook }: OrderbookSpreadProps) {
  const spreadLabel = `Spread: ${orderbook.spread.toFixed(2)} (${orderbook.spreadPercentage.toFixed(3)}%)`;
  
  return (
    <div 
      className="border-y border-border/50 bg-[#0f0f0f] px-3 py-2 shrink-0" 
      data-testid="orderbook-spread"
      role="status"
      aria-label={spreadLabel}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-muted tracking-wide">
          Spread
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-primary tabular-nums">
            {orderbook.spread.toFixed(2)}
          </span>
          <span className="rounded-full bg-primary-muted px-2.5 py-0.5 text-xs font-semibold text-primary tabular-nums">
            {orderbook.spreadPercentage.toFixed(3)}%
          </span>
        </div>
      </div>
    </div>
  );
}
