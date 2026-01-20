import type { OrderbookLevel as OrderbookLevelEntity } from "@/domain/valueObjects/OrderbookLevel";
import { cn } from "@/presentation/utils/cn";

interface OrderbookLevelProps {
  level: OrderbookLevelEntity;
  side: "bid" | "ask";
  barWidth: number;
}

export function OrderbookLevel({
  level,
  side,
  barWidth,
}: OrderbookLevelProps) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-2 gap-2 px-3 py-1 font-mono text-sm transition-all flex-shrink-0",
        side === "bid" ? "hover:bg-bid-bg" : "hover:bg-ask-bg"
      )}
    >
      <div
        className={cn(
          "absolute right-0 top-0 h-full",
          side === "bid" ? "bg-bid-bg" : "bg-ask-bg"
        )}
        style={{ width: `${barWidth}%` }}
      />
      <div className={cn(
        "relative z-10 font-bold tabular-nums",
        side === "bid" ? "text-bid" : "text-ask"
      )}>
        {level.formatPrice()}
      </div>
      <div className="relative z-10 text-right text-text-primary font-medium tabular-nums">
        {level.formatQuantity()}
      </div>
    </div>
  );
}
