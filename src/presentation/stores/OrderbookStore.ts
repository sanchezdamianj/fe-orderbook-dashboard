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
  lastUpdateTime: number | null;
  latency: number | null;
  backgroundRetryCount: number;
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

let reconnectTimeoutId: NodeJS.Timeout | null = null;
const WS_RETRY_INTERVAL = 30000;
const MAX_BACKGROUND_RETRIES = 10;

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
  lastUpdateTime: null,
  latency: null,
  backgroundRetryCount: 0,

  selectTradingPair: (pair: TradingPair) => {
    const response = selectUseCase.execute({ tradingPair: pair });
    
    if (get().connectionMode === "websocket") {
      websocketRepository.resetConnection();
    }
    
    set({
      selectedPair: response.selectedPair,
      orderbook: null,
      error: null,
      backgroundRetryCount: 0,
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
        lastUpdateTime: Date.now(),
      });

      if (connectionMode === "websocket") {
        websocketRepository.subscribe((orderbook: Orderbook) => {
          set({ orderbook, isConnected: true, lastUpdateTime: Date.now() });
        });
        
        websocketRepository.setLatencyCallback((latency: number) => {
          set({ latency });
        });
        
        websocketRepository.setErrorCallback((error: Error) => {
          console.warn("[Store] WebSocket exhausted all retries, switching to polling:", error.message);
          
          const hasShownNotice = get().hasShownFallbackNotice;
          
          set({
            connectionMode: "polling",
            isConnected: false,
            hasFallback: !hasShownNotice,
            hasShownFallbackNotice: true,
            backgroundRetryCount: 0,
          });
          
          setTimeout(() => {
            get().fetchOrderbook();
          }, 500);

          scheduleWebSocketRetry();
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

    if (reconnectTimeoutId) {
      clearTimeout(reconnectTimeoutId);
      reconnectTimeoutId = null;
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
    websocketRepository.unsubscribe();

    set({
      connectionMode: "websocket",
      isConnected: false,
      hasFallback: false,
      hasShownFallbackNotice: false,
    });

    get().fetchOrderbook();
  },

  clearError: () => set({ error: null }),
}));

function scheduleWebSocketRetry() {
  if (reconnectTimeoutId) {
    clearTimeout(reconnectTimeoutId);
  }

  reconnectTimeoutId = setTimeout(() => {
    const store = useOrderbookStore.getState();
    
    if (store.connectionMode !== "polling") {
      return;
    }

    if (store.backgroundRetryCount >= MAX_BACKGROUND_RETRIES) {
      console.log("[Store] Max background retries reached. Staying in polling mode.");
      return;
    }

    console.log(`[Store] Background WebSocket retry attempt ${store.backgroundRetryCount + 1}/${MAX_BACKGROUND_RETRIES}...`);
    
    useOrderbookStore.setState({ backgroundRetryCount: store.backgroundRetryCount + 1 });
    
    websocketRepository.resetConnection();
    
    const tempMode = store.connectionMode;
    useOrderbookStore.setState({ connectionMode: "websocket" });
    
    store.fetchOrderbook().then(() => {
      const currentState = useOrderbookStore.getState();
      if (currentState.connectionMode === "websocket" && currentState.isConnected) {
        console.log("[Store] Successfully reconnected to WebSocket!");
        useOrderbookStore.setState({ backgroundRetryCount: 0, hasFallback: false });
        if (reconnectTimeoutId) {
          clearTimeout(reconnectTimeoutId);
          reconnectTimeoutId = null;
        }
      } else if (currentState.connectionMode === "polling") {
        scheduleWebSocketRetry();
      }
    }).catch(() => {
      useOrderbookStore.setState({ connectionMode: tempMode });
      scheduleWebSocketRetry();
    });
  }, WS_RETRY_INTERVAL);
}
