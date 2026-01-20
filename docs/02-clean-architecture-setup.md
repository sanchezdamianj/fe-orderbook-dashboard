# Iteration 2: Clean Architecture Foundation

**Goal:** Establish Clean Architecture layers with SOLID principles.

## Architecture Design

### Layer Structure
```
src/
├── domain/           # Business logic (pure)
├── application/      # Use cases
├── infrastructure/   # External adapters
└── presentation/     # UI components
```

### Dependency Rule
**Inner layers NEVER depend on outer layers**

```
Presentation → Application → Domain
Infrastructure → Domain
```

## Domain Layer Implementation

### 1. Value Objects
```typescript
// src/domain/valueObjects/OrderbookLevel.ts
export class OrderbookLevel {
  private constructor(
    private readonly price: string,
    private readonly quantity: string
  ) {}
  
  static create(price: string, quantity: string): OrderbookLevel {
    // Factory method pattern
    return new OrderbookLevel(price, quantity);
  }
  
  // Validation + formatting logic
}
```

**Why Value Objects?**
- Immutable by design
- Self-validating
- Domain logic encapsulation

### 2. Entities
```typescript
// src/domain/entities/Orderbook.ts
export class Orderbook {
  constructor(
    public readonly bids: OrderbookLevel[],
    public readonly asks: OrderbookLevel[],
    public readonly lastUpdateId: number
  ) {}
  
  get spread(): number {
    // Business logic here
  }
}
```

### 3. Repository Interface (Port)
```typescript
// src/domain/repositories/IOrderbookRepository.ts
export interface IOrderbookRepository {
  fetchOrderbook(symbol: string, limit: number): Promise<Orderbook>;
}
```

**Dependency Inversion Principle:**
- Domain defines interface
- Infrastructure implements it

## Application Layer

### Use Cases
```typescript
// src/application/useCases/FetchOrderbookUseCase.ts
export class FetchOrderbookUseCase {
  constructor(private readonly service: OrderbookService) {}
  
  async execute(request: FetchOrderbookRequest): Promise<FetchOrderbookResponse> {
    // Orchestrate domain logic
  }
}
```

**Single Responsibility:**
- Each use case = One user action
- Clear input/output contracts

## Infrastructure Layer

### Repository Implementation (Adapter)
```typescript
// src/infrastructure/repositories/BinanceOrderbookRepository.ts
export class BinanceOrderbookRepository implements IOrderbookRepository {
  async fetchOrderbook(symbol: string, limit: number): Promise<Orderbook> {
    // API call + mapping
  }
}
```

### API Client
```typescript
// src/infrastructure/api/BinanceApiClient.ts
export class BinanceApiClient {
  async fetchOrderbook(symbol: string, limit: number) {
    // HTTP fetch logic
  }
}
```

## Deliverables

✅ Domain layer (entities, value objects, interfaces)
✅ Application layer (use cases)
✅ Infrastructure layer (repositories, API client)
✅ Dependency injection setup
✅ SOLID principles applied

## SOLID Principles Applied

1. **Single Responsibility**: Each class has one reason to change
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Repositories are interchangeable
4. **Interface Segregation**: Focused interfaces (IOrderbookRepository)
5. **Dependency Inversion**: Depend on abstractions, not concretions


## Next Steps
→ **Iteration 3:** Build presentation layer (React components + state management)
