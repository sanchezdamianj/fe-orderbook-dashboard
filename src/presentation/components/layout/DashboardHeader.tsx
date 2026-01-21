import { TradingPairSelector } from "../tradingPair/TradingPairSelector";
import { LatencyIndicator } from "../connection/LatencyIndicator";
import { StaleDataIndicator } from "../connection/StaleDataIndicator";

export function DashboardHeader() {
  return (
    <header className="py-3.5 shrink-0" role="banner">
      <div className="flex items-center justify-between gap-4 pb-3.5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-brand">
            orderbook
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-[ping_2s_ease-in-out_infinite] absolute inline-flex h-full w-full rounded-full bg-primary/30 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary/50"></span>
            </span>
            Live
          </span>
          <StaleDataIndicator />
        </div>
        <div className="flex items-center gap-2">
          <LatencyIndicator />
          <TradingPairSelector />
        </div>
      </div>
    </header>
  );
}
