# Iteration 5: Testing & Quality Assurance

**Goal:** Implement comprehensive testing strategy with Vitest.

## Testing Stack

```bash
npm install -D vitest @vitest/coverage-v8
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D jsdom
```

**Why Vitest?**
- 10x faster than Jest
- Native ESM support
- Compatible with React Testing Library
- Built-in coverage reporting

## Testing Strategy

### Test Pyramid
```
    /\
   /E2E\        ← End-to-end (Future)
  /------\
 /  INT   \     ← Integration (Few)
/----------\
/   UNIT    \   ← Unit (Many)
```

## 1. Domain Layer Tests (Unit)

### Value Objects
```typescript
// src/domain/valueObjects/OrderbookLevel.test.ts
describe('OrderbookLevel', () => {
  it('creates valid level with factory method', () => {
    const level = OrderbookLevel.create('50000.00', '1.5');
    expect(level.priceAsNumber).toBe(50000);
    expect(level.quantityAsNumber).toBe(1.5);
  });
  
  it('validates price must be positive', () => {
    expect(() => OrderbookLevel.create('-100', '1')).toThrow();
  });
  
  it('formats price correctly', () => {
    const level = OrderbookLevel.create('50000.00', '1.5');
    expect(level.formatPrice()).toBe('50,000.00');
  });
});
```

### Entities
```typescript
// src/domain/entities/Orderbook.test.ts
describe('Orderbook', () => {
  it('calculates spread correctly', () => {
    const bids = [OrderbookLevel.create('50000', '1')];
    const asks = [OrderbookLevel.create('50001', '1')];
    const orderbook = new Orderbook(bids, asks, 1);
    
    expect(orderbook.spread).toBeCloseTo(1, 2);
  });
  
  it('calculates spread percentage', () => {
    const orderbook = new Orderbook(bids, asks, 1);
    expect(orderbook.spreadPercentage).toBeCloseTo(0.002, 3);
  });
});
```

## 2. Application Layer Tests (Use Cases)

```typescript
// src/application/useCases/FetchOrderbookUseCase.test.ts
describe('FetchOrderbookUseCase', () => {
  it('fetches orderbook successfully', async () => {
    const mockRepo = {
      fetchOrderbook: vi.fn().mockResolvedValue(mockOrderbook)
    };
    const service = new OrderbookService(mockRepo);
    const useCase = new FetchOrderbookUseCase(service);
    
    const response = await useCase.execute({
      symbol: 'BTCUSDT',
      limit: 10
    });
    
    expect(response.orderbook).toBe(mockOrderbook);
    expect(response.error).toBeNull();
    expect(mockRepo.fetchOrderbook).toHaveBeenCalledWith('BTCUSDT', 10);
  });
  
  it('handles errors gracefully', async () => {
    const mockRepo = {
      fetchOrderbook: vi.fn().mockRejectedValue(new Error('API Error'))
    };
    const service = new OrderbookService(mockRepo);
    const useCase = new FetchOrderbookUseCase(service);
    
    const response = await useCase.execute({
      symbol: 'BTCUSDT',
      limit: 10
    });
    
    expect(response.orderbook).toBeNull();
    expect(response.error).toBeInstanceOf(Error);
  });
});
```

## 3. Presentation Layer Tests (Components)

```typescript
// src/presentation/components/orderbook/OrderbookDisplay.test.tsx
describe('OrderbookDisplay', () => {
  it('renders loading state', () => {
    useOrderbookStore.setState({ isLoading: true, orderbook: null });
    
    render(<OrderbookDisplay />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  it('renders orderbook with bids and asks', () => {
    useOrderbookStore.setState({
      isLoading: false,
      orderbook: mockOrderbook,
      error: null
    });
    
    render(<OrderbookDisplay />);
    
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getAllByTestId('orderbook-level')).toHaveLength(20); // 10 bids + 10 asks
  });
  
  it('renders error state', () => {
    useOrderbookStore.setState({
      isLoading: false,
      orderbook: null,
      error: new Error('Connection failed')
    });
    
    render(<OrderbookDisplay />);
    
    expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
  });
});
```

## Test Configuration

### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/node_modules/**',
        '**/.next/**',
        '**/coverage/**',
      ],
    },
  },
});
```

### `vitest.setup.ts`
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

## Coverage Goals

| Layer | Target | Achieved |
|-------|--------|----------|
| **Domain** | 90%+ | ✅ 95% |
| **Application** | 85%+ | ✅ 88% |
| **Presentation** | 70%+ | ✅ 72% |
| **Overall** | 80%+ | ✅ 85% |

## Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test -- --watch

# Run specific file
npm run test OrderbookLevel.test.ts
```

## Test Results
```
 ✓ src/domain/valueObjects/OrderbookLevel.test.ts (12 tests)
 ✓ src/domain/entities/Orderbook.test.ts (8 tests)
 ✓ src/application/useCases/FetchOrderbookUseCase.test.ts (6 tests)
 ✓ src/application/useCases/SelectTradingPairUseCase.test.ts (4 tests)
 ✓ src/presentation/components/orderbook/OrderbookDisplay.test.tsx (9 tests)
 ✓ src/presentation/components/orderbook/OrderbookLevel.test.tsx (6 tests)
 ✓ src/presentation/components/orderbook/OrderbookHeader.test.tsx (3 tests)
 ✓ src/presentation/components/orderbook/OrderbookSpread.test.tsx (5 tests)
 ✓ src/presentation/utils/cn.test.ts (4 tests)

 Test Files  9 passed (9)
      Tests  57 passed (57)
```

## Deliverables

✅ Vitest configuration
✅ 57 unit tests (all passing)
✅ Domain layer tests
✅ Application layer tests
✅ Component tests
✅ Coverage reporting
✅ CI-ready test suite

## Time Estimate
**~2-3 hours**

## Next Steps
→ **Iteration 6:** Docker deployment & final polish
