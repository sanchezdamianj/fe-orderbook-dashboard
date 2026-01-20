import { create } from "zustand";
import type { Orderbook } from "@/domain/entities/Orderbook";
import type { TradingPair } from "@/domain/valueObjects/TradingPair";
import { FetchOrderbookUseCase } from "@/application/useCases/FetchOrderbookUseCase";
import { SelectTradingPairUseCase } from "@/application/useCases/SelectTradingPairUseCase";
import { OrderbookService } from "@/domain/services/OrderbookService";
import { BinanceOrderbookRepository } from "@/infrastructure/repositories/BinanceOrderbookRepository";
import { BinanceWebSocketRepository } from "@/infrastructure/repositories/BinanceWebSocketRepository";
import { TradingPairsConfig } from "@/infrastructure/config/TradingPairsConfig";
import { ApiConfig } from "@/infrastructure/config/ApiConfig";

type ConnectionMode = "polling" | "websocket";

interface OrderbookStoreState {
  selectedPair: TradingPair;
  orderbook: Orderbook | null;
  isLoading: boolean;
  error: Error | null;
  connectionMode: ConnectionMode;
  isConnected: boolean;
  hasFallback: boolean;
  hasShownFallbackNotice: boolean;
  retryAttempt: number;
}

interface OrderbookStoreActions {
  selectTradingPair: (pair: TradingPair) => void;
  fetchOrderbook: () => Promise<void>;
  setConnectionMode: (mode: ConnectionMode) => void;
  clearError: () => void;
  retryWebSocket: () => void;
}

type OrderbookStore = OrderbookStoreState & OrderbookStoreActions;

const pollingRepository = new BinanceOrderbookRepository();
const websocketRepository = new BinanceWebSocketRepository();
const selectUseCase = new SelectTradingPairUseCase();
const tradingPairsConfig = TradingPairsConfig.getInstance();

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 10000;
let retryTimeoutId: NodeJS.Timeout | null = null;

export const useOrderbookStore = create<OrderbookStore>((set, get) => ({
  selectedPair: tradingPairsConfig.getDefaultPair(),
  orderbook: null,
  isLoading: false,
  error: null,
  connectionMode: "websocket",
  isConnected: false,
  hasFallback: false,
  hasShownFallbackNotice: false,
  retryAttempt: 0,

  selectTradingPair: (pair: TradingPair) => {
    const response = selectUseCase.execute({ tradingPair: pair });
    set({
      selectedPair: response.selectedPair,
      orderbook: null,
      error: null,
    });
    get().fetchOrderbook();
  },

  fetchOrderbook: async () => {
    const { selectedPair, connectionMode } = get();
    set({ isLoading: true, error: null });

    try {
      const repository = connectionMode === "websocket" ? websocketRepository : pollingRepository;
      const service = new OrderbookService(repository);
      const fetchUseCase = new FetchOrderbookUseCase(service);
      
      const response = await fetchUseCase.execute({
        symbol: selectedPair.symbol,
        limit: ApiConfig.getOrderbookLimit(),
      });

      set({
        orderbook: response.orderbook,
        error: response.error,
        isLoading: false,
        isConnected: true,
      });

      if (connectionMode === "websocket") {
        websocketRepository.subscribe((orderbook: Orderbook) => {
          set({ orderbook, isConnected: true });
        });
        
        websocketRepository.setErrorCallback((error: Error) => {
          console.warn("[Store] WebSocket error, falling back to polling:", error.message);
          
          const currentRetry = get().retryAttempt;
          const hasShownNotice = get().hasShownFallbackNotice;
          
          set({
            connectionMode: "polling",
            isConnected: false,
            hasFallback: !hasShownNotice,
            hasShownFallbackNotice: true,
            retryAttempt: currentRetry + 1,
          });
          
          setTimeout(() => {
            get().fetchOrderbook();
          }, 500);

          if (currentRetry < MAX_RETRY_ATTEMPTS) {
            if (retryTimeoutId) {
              clearTimeout(retryTimeoutId);
            }
            
            retryTimeoutId = setTimeout(() => {
              console.log(`[Store] Attempting to reconnect to WebSocket (attempt ${currentRetry + 1}/${MAX_RETRY_ATTEMPTS})...`);
              get().retryWebSocket();
            }, RETRY_DELAY_MS);
          } else {
            console.log("[Store] Max retry attempts reached. Staying in polling mode.");
          }
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
        isConnected: false,
      });
    }
  },

  setConnectionMode: (mode: ConnectionMode) => {
    if (get().connectionMode === "websocket") {
      websocketRepository.unsubscribe();
    }

    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId);
      retryTimeoutId = null;
    }

    set({
      connectionMode: mode,
      isConnected: false,
      orderbook: null,
      retryAttempt: 0,
      hasShownFallbackNotice: false,
    });

    get().fetchOrderbook();
  },

  retryWebSocket: () => {
    const { retryAttempt } = get();
    
    if (retryAttempt >= MAX_RETRY_ATTEMPTS) {
      console.log("[Store] Max retry attempts reached.");
      return;
    }

    websocketRepository.unsubscribe();

    set({
      connectionMode: "websocket",
      isConnected: false,
      hasFallback: false,
    });

    get().fetchOrderbook();
  },

  clearError: () => set({ error: null }),
}));
