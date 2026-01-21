"use client";

import { useEffect, useState } from "react";
import { useOrderbookStore } from "@/presentation/stores/OrderbookStore";
import { ApiConfig } from "@/infrastructure/config/ApiConfig";

export function StaleDataIndicator() {
  const lastUpdateTime = useOrderbookStore((state) => state.lastUpdateTime);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const checkStaleData = () => {
      if (!lastUpdateTime) {
        setIsStale(false);
        return;
      }

      const now = Date.now();
      const timeSinceUpdate = now - lastUpdateTime;
      const threshold = ApiConfig.getStaleDataThreshold();
      
      setIsStale(timeSinceUpdate > threshold);
    };

    checkStaleData();
    const interval = setInterval(checkStaleData, 1000);

    return () => clearInterval(interval);
  }, [lastUpdateTime]);

  if (!isStale) {
    return null;
  }

  const getTimeSinceUpdate = () => {
    if (!lastUpdateTime) return "N/A";
    const seconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
    return `${seconds}s ago`;
  };

  return (
    <div 
      className="rounded-full border border-ask/30 bg-ask/10 px-3 py-1 text-xs font-semibold text-ask animate-pulse"
      role="status"
      aria-live="assertive"
      aria-label={`Warning: Data is delayed by ${getTimeSinceUpdate()}`}
    >
      DELAYED · {getTimeSinceUpdate()}
    </div>
  );
}
