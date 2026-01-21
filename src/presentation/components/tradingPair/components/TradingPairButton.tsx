import type { TradingPair } from "@/domain/valueObjects/TradingPair";
import { cn } from "@/presentation/utils/cn";

interface TradingPairButtonProps {
  pair: TradingPair;
  isOpen: boolean;
  onClick: () => void;
}

export function TradingPairButton({ pair, isOpen, onClick }: TradingPairButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg bg-[#0f0f0f] px-4 py-2 border border-border/50 text-text-primary transition-all hover:bg-surface-hover hover:border-primary/30"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-label={`Select trading pair. Currently selected: ${pair.displayName}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-primary">{pair.baseAsset}</span>
        <span className="text-text-muted text-sm">/</span>
        <span className="text-text-secondary font-medium text-sm">{pair.quoteAsset}</span>
      </div>
      <svg
        className={cn(
          "h-4 w-4 text-primary/60 transition-transform",
          isOpen && "rotate-180"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
}
