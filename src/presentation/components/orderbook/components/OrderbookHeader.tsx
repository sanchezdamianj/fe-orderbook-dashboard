export function OrderbookHeader() {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-border/50 px-3 py-1.5 pb-1 shrink-0" role="row" data-testid="orderbook-header">
      <span className="text-xs font-semibold text-text-muted tracking-wide" role="columnheader">
        Price
      </span>
      <span className="text-right text-xs font-semibold text-text-muted tracking-wide" role="columnheader">
        Quantity
      </span>
    </div>
  );
}
