export function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-3 overflow-y-auto pr-2" role="complementary" aria-label="Information sidebar">
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
    </aside>
  );
}
