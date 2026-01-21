"use client";

import { useState } from "react";

export function MobileInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lg:hidden border-t border-border bg-surface">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-text-secondary hover:text-text-primary transition-colors"
        aria-expanded={isExpanded}
        aria-controls="mobile-info-content"
      >
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-medium">Real-time updates • 10 levels depth</span>
        </div>
        <svg
          className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div
          id="mobile-info-content"
          className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200"
        >
          <div>
            <h3 className="text-xs font-semibold text-text-primary mb-1.5">About</h3>
            <p className="text-xs text-text-secondary mb-2">
              Real-time orderbook data from Binance with WebSocket connection.
            </p>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-sm bg-bid" />
                <span className="text-text-secondary">Bids (Buy)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-sm bg-ask" />
                <span className="text-text-secondary">Asks (Sell)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-text-primary mb-1.5">Features</h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="text-primary">✓</span>
                <span>Live updates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-primary">✓</span>
                <span>10 levels depth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-primary">✓</span>
                <span>Spread calc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-primary">✓</span>
                <span>Depth bars</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-text-primary mb-1.5">Stack</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-surface-hover text-text-secondary">
                React 19
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-hover text-text-secondary">
                Next.js 15
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-hover text-text-secondary">
                TypeScript
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-hover text-text-secondary">
                Tailwind
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
