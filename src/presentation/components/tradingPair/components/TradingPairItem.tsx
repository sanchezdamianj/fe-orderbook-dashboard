import type { TradingPair } from "@/domain/valueObjects/TradingPair";
import { cn } from "@/presentation/utils/cn";

interface TradingPairItemProps {
  pair: TradingPair;
  isSelected: boolean;
  onSelect: () => void;
}

export function TradingPairItem({ pair, isSelected, onSelect }: TradingPairItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 px-4 py-3 text-left transition-all",
        "hover:bg-primary-muted hover:border-l-2 hover:border-primary",
        "group",
        isSelected && "bg-primary-muted border-l-2 border-primary"
      )}
    >
      <span className={cn(
        "font-medium transition-all",
        "group-hover:font-bold group-hover:text-primary",
        isSelected ? "text-primary font-bold" : "text-text-primary"
      )}>
        {pair.baseAsset}
      </span>
      <span className={cn(
        "text-sm text-text-muted transition-all",
        "group-hover:text-gray-400"
      )}>/</span>
      <span className={cn(
        "text-sm text-text-secondary font-medium transition-all",
        "group-hover:text-white"
      )}>{pair.quoteAsset}</span>
      {isSelected && (
        <svg className="ml-auto h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
