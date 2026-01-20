"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useOrderbookStore } from "@/presentation/stores/OrderbookStore";
import { OrderbookHeader } from "./OrderbookHeader";
import { OrderbookAsks } from "./OrderbookAsks";
import { OrderbookSpread } from "./OrderbookSpread";
import { OrderbookBids } from "./OrderbookBids";
import { OrderbookError } from "./OrderbookError";
import { OrderbookLoading } from "./OrderbookLoading";
import { ApiConfig } from "@/infrastructure/config/ApiConfig";

export function OrderbookDisplay() {
  const { orderbook, isLoading, error, fetchOrderbook, connectionMode } = useOrderbookStore(
    useShallow((state) => ({
      orderbook: state.orderbook,
      isLoading: state.isLoading,
      error: state.error,
      fetchOrderbook: state.fetchOrderbook,
      connectionMode: state.connectionMode,
    }))
  );

  useEffect(() => {
    fetchOrderbook();

    if (connectionMode === "polling") {
      const intervalId = setInterval(() => {
        fetchOrderbook();
      }, ApiConfig.getPollInterval());

      return () => clearInterval(intervalId);
    }
  }, [fetchOrderbook, connectionMode]);

  if (error && !orderbook) {
    return <OrderbookError error={error} />;
  }

  if (isLoading && !orderbook) {
    return <OrderbookLoading />;
  }

  if (!orderbook) {
    return null;
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-surface overflow-hidden">
      <OrderbookHeader />
      <OrderbookAsks orderbook={orderbook} />
      <OrderbookSpread orderbook={orderbook} />
      <OrderbookBids orderbook={orderbook} />
    </div>
  );
}
