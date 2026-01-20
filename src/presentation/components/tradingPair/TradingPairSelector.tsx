"use client";

import { useState } from "react";
import { useOrderbookStore } from "@/presentation/stores/OrderbookStore";
import { TradingPairsConfig } from "@/infrastructure/config/TradingPairsConfig";
import { TradingPairButton } from "./TradingPairButton";
import { TradingPairDropdown } from "./TradingPairDropdown";

export function TradingPairSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPair = useOrderbookStore((state) => state.selectedPair);
  const selectTradingPair = useOrderbookStore((state) => state.selectTradingPair);

  const tradingPairs = TradingPairsConfig.getInstance().getAllPairs();

  const handleSelect = (symbol: string) => {
    const pair = tradingPairs.find((p) => p.symbol === symbol);
    if (pair) {
      selectTradingPair(pair);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <TradingPairButton
        pair={selectedPair}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <TradingPairDropdown
            pairs={tradingPairs}
            selectedSymbol={selectedPair.symbol}
            onSelect={handleSelect}
          />
        </>
      )}
    </div>
  );
}
