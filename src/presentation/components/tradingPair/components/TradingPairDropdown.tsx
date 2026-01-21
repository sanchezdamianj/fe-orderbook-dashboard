import type { TradingPair } from "@/domain/valueObjects/TradingPair";
import { TradingPairItem } from "./TradingPairItem";

interface TradingPairDropdownProps {
  pairs: TradingPair[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}

export function TradingPairDropdown({
  pairs,
  selectedSymbol,
  onSelect,
}: TradingPairDropdownProps) {
  return (
    <div 
      className="absolute right-0 top-full z-20 mt-2 w-full sm:w-48 overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
      role="listbox"
      aria-label="Trading pair options"
      id="trading-pair-dropdown"
    >
      <div className="max-h-80 overflow-y-auto">
        {pairs.map((pair) => (
          <TradingPairItem
            key={pair.symbol}
            pair={pair}
            isSelected={pair.symbol === selectedSymbol}
            onSelect={() => onSelect(pair.symbol)}
          />
        ))}
      </div>
    </div>
  );
}
