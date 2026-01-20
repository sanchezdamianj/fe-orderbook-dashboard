# Iteration 3: Presentation Layer & State Management

**Goal:** Build React components with Zustand state management.

## State Management Architecture

### Zustand Store as Facade
```typescript
// src/presentation/stores/OrderbookStore.ts
export const useOrderbookStore = create<OrderbookStore>((set, get) => ({
  // State
  selectedPair: defaultPair,
  orderbook: null,
  isLoading: false,
  error: null,
  
  // Actions (facade to use cases)
  selectTradingPair: (pair: TradingPair) => {
    const response = selectUseCase.execute({ tradingPair: pair });
    set({ selectedPair: response.selectedPair });
  },
  
  fetchOrderbook: async () => {
    const response = await fetchUseCase.execute({ symbol, limit });
    set({ orderbook: response.orderbook, error: response.error });
  },
}));
```

**Pattern: Facade**
- Store hides use case complexity
- Single entry point for UI
- Dependency injection at store level

## Component Structure

### Feature-based Organization
```
presentation/components/
├── orderbook/          # Orderbook feature
│   ├── OrderbookDisplay.tsx      # Container
│   ├── OrderbookHeader.tsx       # Column labels
│   ├── OrderbookLevel.tsx        # Single row
│   ├── OrderbookAsks.tsx         # Red asks
│   ├── OrderbookBids.tsx         # Green bids
│   ├── OrderbookSpread.tsx       # Spread indicator
│   ├── OrderbookError.tsx        # Error state
│   └── OrderbookLoading.tsx      # Loading state
├── tradingPair/        # Trading pair selector
│   ├── TradingPairSelector.tsx
│   ├── TradingPairButton.tsx
│   ├── TradingPairDropdown.tsx
│   └── TradingPairItem.tsx
└── connection/         # Connection states
    ├── ConnectionModeToggle.tsx
    └── ConnectionFallbackNotice.tsx
```

## Component Patterns

### 1. Container/Presentational Pattern
```typescript
// Container (smart component)
export function OrderbookDisplay() {
  const { orderbook, isLoading, error } = useOrderbookStore();
  
  if (error) return <OrderbookError error={error} />;
  if (isLoading) return <OrderbookLoading />;
  if (!orderbook) return null;
  
  return (
    <>
      <OrderbookHeader />
      <OrderbookAsks orderbook={orderbook} />
      <OrderbookSpread orderbook={orderbook} />
      <OrderbookBids orderbook={orderbook} />
    </>
  );
}

// Presentational (dumb component)
export function OrderbookLevel({ level, side, barWidth }) {
  return (
    <div className="grid grid-cols-2">
      <div className={side === 'bid' ? 'text-bid' : 'text-ask'}>
        {level.formatPrice()}
      </div>
      <div>{level.formatQuantity()}</div>
    </div>
  );
}
```

### 2. Composition over Inheritance
```typescript
// Compose small, focused components
<OrderbookDisplay>
  <OrderbookHeader />
  <OrderbookAsks>
    {asks.map(level => <OrderbookLevel {...level} />)}
  </OrderbookAsks>
  <OrderbookSpread />
  <OrderbookBids>
    {bids.map(level => <OrderbookLevel {...level} />)}
  </OrderbookBids>
</OrderbookDisplay>
```

## React Best Practices

### 1. Hooks Strategy
```typescript
// useShallow for performance
const { orderbook, isLoading } = useOrderbookStore(
  useShallow((state) => ({
    orderbook: state.orderbook,
    isLoading: state.isLoading,
  }))
);

// useEffect for lifecycle
useEffect(() => {
  fetchOrderbook();
  
  const intervalId = setInterval(fetchOrderbook, 1500);
  return () => clearInterval(intervalId);
}, [fetchOrderbook]);
```

### 2. Error Boundaries
```typescript
// Graceful error handling
if (error && !orderbook) {
  return <OrderbookError error={error} />;
}
```

### 3. Loading States
```typescript
// Prevent layout shift
if (isLoading && !orderbook) {
  return <OrderbookLoading />;
}
```

## Styling Strategy

### Tailwind CSS with Design Tokens
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bid: "#00ff88",
        ask: "#ff0055",
        background: "#0a0a0a",
        surface: "#141414",
      },
    },
  },
};
```

### Utility Function for Dynamic Classes
```typescript
// src/presentation/utils/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  "text-sm font-bold",
  side === "bid" ? "text-bid" : "text-ask"
)} />
```

## Deliverables

✅ Zustand store setup
✅ Orderbook components
✅ Trading pair selector
✅ Error & loading states
✅ Responsive design
✅ Tailwind styling

## Next Steps
→ **Iteration 4:** Implement live updates (polling → WebSocket)
