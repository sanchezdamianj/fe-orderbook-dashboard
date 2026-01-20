# Iteration 4: Live Updates & WebSocket Implementation

**Goal:** Implement real-time data updates with polling fallback.

## Update Strategy

### Phase 1: Polling (MVP)
```typescript
// Simple polling implementation
useEffect(() => {
  fetchOrderbook(); // Initial fetch
  
  const intervalId = setInterval(() => {
    fetchOrderbook(); // Poll every 1.5s
  }, 1500);
  
  return () => clearInterval(intervalId);
}, [fetchOrderbook]);
```

**Pros:**
- Simple to implement
- Reliable (no connection drops)
- Works everywhere

**Cons:**
- Less efficient (HTTP overhead)
- Higher latency
- More server load

### Phase 2: WebSocket (Bonus Feature)
```typescript
// src/infrastructure/repositories/BinanceWebSocketRepository.ts
export class BinanceWebSocketRepository implements IOrderbookRepository {
  private ws: WebSocket | null = null;
  
  subscribe(symbol: string): void {
    const url = `wss://stream.binance.com:9443/ws/${symbol}@depth`;
    this.ws = new WebSocket(url);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleUpdate(data);
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.handleError(error);
    };
  }
  
  unsubscribe(): void {
    this.ws?.close();
    this.ws = null;
  }
}
```

## Automatic Fallback Strategy

### Connection Mode Management
```typescript
interface OrderbookStoreState {
  connectionMode: "polling" | "websocket";
  isConnected: boolean;
  hasFallback: boolean;
  retryAttempt: number;
}
```

### Error Handling with Auto-Retry
```typescript
websocketRepository.setErrorCallback((error: Error) => {
  console.warn("[Store] WebSocket error, falling back to polling");
  
  const currentRetry = get().retryAttempt;
  
  set({
    connectionMode: "polling",
    isConnected: false,
    hasFallback: true,
    retryAttempt: currentRetry + 1,
  });
  
  // Switch to polling immediately
  setTimeout(() => {
    get().fetchOrderbook();
  }, 500);
  
  // Retry WebSocket after delay
  if (currentRetry < MAX_RETRY_ATTEMPTS) {
    setTimeout(() => {
      console.log(`Attempting WebSocket reconnect (${currentRetry + 1}/3)`);
      get().retryWebSocket();
    }, 10000); // 10 seconds
  }
});
```

**Retry Logic:**
- Max 3 attempts
- 10 second delay between attempts
- Automatic fallback to polling
- User sees notification

### User Notification
```typescript
// src/presentation/components/connection/ConnectionFallbackNotice.tsx
export function ConnectionFallbackNotice() {
  const { hasFallback } = useOrderbookStore();
  
  if (!hasFallback) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="rounded-lg border border-yellow-500/50 bg-yellow-900/30 p-4">
        <h3 className="font-semibold">Switched to Polling Mode</h3>
        <p className="text-sm">
          WebSocket connection failed. Using polling for reliable updates.
        </p>
      </div>
    </div>
  );
}
```

## Performance Optimizations

### 1. Prevent Layout Shift
```typescript
// Keep previous data while loading
if (isLoading && !orderbook) {
  return <OrderbookLoading />;
}

// Show old data during update
if (orderbook) {
  return <OrderbookDisplay orderbook={orderbook} />;
}
```

### 2. Smooth Transitions
```css
/* globals.css */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### 3. Memory Management
```typescript
useEffect(() => {
  // ... setup
  
  return () => {
    // Cleanup on unmount
    clearInterval(intervalId);
    websocketRepository.unsubscribe();
  };
}, []);
```

## Connection Modes Comparison

| Feature | Polling | WebSocket |
|---------|---------|-----------|
| **Latency** | ~1.5s | Real-time |
| **Reliability** | ✅ High | ⚠️ Can drop |
| **Server Load** | ❌ Higher | ✅ Lower |
| **Implementation** | ✅ Simple | ⚠️ Complex |
| **Fallback** | N/A | ✅ Auto |

## Deliverables

✅ Polling implementation (1.5s interval)
✅ WebSocket real-time updates
✅ Automatic fallback mechanism
✅ Retry logic (3 attempts, 10s delay)
✅ User notification system
✅ Smooth transitions (no flicker)
✅ Memory cleanup

## Time Estimate
**~2-3 hours**

## Next Steps
→ **Iteration 5:** Testing & quality assurance
