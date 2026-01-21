"use client";

import { useOrderbookStore } from "@/presentation/stores/OrderbookStore";

export function LatencyIndicator() {
  const latency = useOrderbookStore((state) => state.latency);
  const connectionMode = useOrderbookStore((state) => state.connectionMode);

  if (connectionMode !== "websocket" || latency === null) {
    return null;
  }

  const getLatencyColor = (ms: number) => {
    if (ms < 100) return "text-bid";
    if (ms < 500) return "text-yellow-500";
    return "text-ask";
  };

  const getLatencyBg = (ms: number) => {
    if (ms < 100) return "bg-bid/10";
    if (ms < 500) return "bg-yellow-500/10";
    return "bg-ask/10";
  };

  const getLatencyStatus = (ms: number) => {
    if (ms < 100) return "excellent";
    if (ms < 500) return "good";
    return "slow";
  };
  
  return (
    <div 
      className={`rounded-full px-3 py-1 text-xs font-medium ${getLatencyBg(latency)}`}
      role="status"
      aria-label={`Connection latency: ${latency} milliseconds (${getLatencyStatus(latency)})`}
    >
      <span className={`font-mono tabular-nums ${getLatencyColor(latency)}`}>
        {latency}ms
      </span>
    </div>
  );
}
