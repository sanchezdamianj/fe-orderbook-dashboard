"use client";

import { useEffect, useState } from "react";
import { useOrderbookStore } from "@/presentation/stores/OrderbookStore";
import { useShallow } from "zustand/react/shallow";

export function ConnectionFallbackNotice() {
  const { hasFallback } = useOrderbookStore(
    useShallow((state) => ({
      hasFallback: state.hasFallback,
    }))
  );

  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (hasFallback && !showNotice) {
      setShowNotice(true);

      const timer = setTimeout(() => {
        setShowNotice(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [hasFallback, showNotice]);

  if (!showNotice) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 animate-[slideIn_0.3s_ease-out] max-w-md">
      <div className="rounded-lg border border-primary/20 bg-surface p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-full bg-primary/10 p-1">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              Switched to Polling Mode
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              WebSocket connection failed. Using polling for reliable updates.
            </p>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
