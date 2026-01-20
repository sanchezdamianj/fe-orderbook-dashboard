export function OrderbookHeader() {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-border/50 px-3 py-1.5 pb-1 shrink-0">
      <div className="text-xs font-semibold text-text-muted tracking-wide">
        Price
      </div>
      <div className="text-right text-xs font-semibold text-text-muted tracking-wide">
        Quantity
      </div>
    </div>
  );
}
