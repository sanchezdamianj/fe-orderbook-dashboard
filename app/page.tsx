import { TradingPairSelector } from "@/presentation/components/tradingPair/TradingPairSelector";
import { OrderbookDisplay } from "@/presentation/components/orderbook/OrderbookDisplay";
import { ConnectionFallbackNotice } from "@/presentation/components/connection/ConnectionFallbackNotice";

export default function Home() {
  return (
    <main className="h-screen bg-background flex flex-col overflow-hidden">
      <ConnectionFallbackNotice />
      <div className="mx-auto w-full max-w-7xl flex flex-col h-full px-4 sm:px-6">
        <header className="border-b border-border/50 py-3.5 shrink-0">
          <div className="flex items-center justify-between gap-4">
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
            </div>
            <div className="flex items-center gap-3">
              <TradingPairSelector />
            </div>
          </div>
        </header>

        <div className="flex-1 grid gap-3 lg:grid-cols-3 py-3 overflow-hidden min-h-0">
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <OrderbookDisplay />
          </div>

          <div className="hidden lg:flex flex-col gap-3 overflow-y-auto pr-2">
            <div className="rounded-lg border border-border bg-surface p-4">
              <h2 className="mb-2 text-sm font-semibold text-text-primary">
                About
              </h2>
              <div className="space-y-2 text-xs text-text-secondary">
                <p>
                  Real-time orderbook data from Binance.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-bid" />
                    <span>Bids</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-ask" />
                    <span>Asks</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <h2 className="mb-2 text-sm font-semibold text-text-primary">
                Features
              </h2>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-primary text-sm">✓</span>
                  <span>Live updates (1.5s)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary text-sm">✓</span>
                  <span>10 levels depth</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary text-sm">✓</span>
                  <span>Spread calculation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary text-sm">✓</span>
                  <span>Visual depth bars</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <h2 className="mb-2 text-sm font-semibold text-text-primary">
                Stack
              </h2>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">React</span>
                  <span className="font-mono text-text-primary">19.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Next.js</span>
                  <span className="font-mono text-text-primary">15.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">TypeScript</span>
                  <span className="font-mono text-text-primary">5.7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tailwind</span>
                  <span className="font-mono text-text-primary">3.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Zustand</span>
                  <span className="font-mono text-text-primary">5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
