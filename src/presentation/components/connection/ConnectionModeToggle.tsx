"use client";

import { useOrderbookStore } from "@/presentation/stores/OrderbookStore";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/presentation/utils/cn";

export function ConnectionModeToggle() {
  const { connectionMode, setConnectionMode, isConnected } = useOrderbookStore(
    useShallow((state) => ({
      connectionMode: state.connectionMode,
      setConnectionMode: state.setConnectionMode,
      isConnected: state.isConnected,
    }))
  );

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            isConnected ? "bg-primary" : "bg-text-muted"
          )}
        />
        <span className="text-xs text-text-secondary hidden sm:inline">
          {isConnected ? "Connected" : "Connecting..."}
        </span>
      </div>

      <div className="flex items-center rounded-lg bg-surface border border-border/50 p-0.5">
        <button
          onClick={() => setConnectionMode("polling")}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-md transition-all",
            connectionMode === "polling"
              ? "bg-primary/10 text-primary"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          Polling
        </button>
        <button
          onClick={() => setConnectionMode("websocket")}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-md transition-all",
            connectionMode === "websocket"
              ? "bg-primary/10 text-primary"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          WebSocket
        </button>
      </div>
    </div>
  );
}
