# Frontend Take-Home Challenge: Orderbook Viewer

## Overview

Build a simple orderbook viewer using React and Next.js that consumes the Binance public API.

**Time expectation:** 3-4 hours

---

## Requirements

### Core Functionality

#### 1. AssetSelector

- Dropdown to select a trading pair (e.g., BTCUSDT, ETHUSDT, SOLUSDT)
- Minimum 5 trading pairs available
- Default selection on load

#### 2. OrderbookDisplay

- Show bids (buy orders) and asks (sell orders)
- Display price and quantity for each level
- Show at least 10 levels on each side
- Visual distinction between bids and asks (color coding)

#### 3. LiveUpdates

- Poll the Binance API at a reasonable interval (e.g., every 1-2 seconds)
- Updates should not cause layout shift or flicker
- Handle loading and error states gracefully

---

## Technical Requirements

- React 18+ with Next.js 14+ (App Router)
- TypeScript
- No UI component library required (plain CSS/Tailwind is fine)
- Clean, readable code with appropriate component structure

---

## Binance API Reference

### Orderbook Endpoint

```
GET https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=10
```

**Response format:**

```json
{
  "lastUpdateId": 1027024,
  "bids": [
    ["price", "quantity"]
  ],
  "asks": [
    ["price", "quantity"]
  ]
}
```

### Exchange Info (for available symbols)

```
GET https://api.binance.com/api/v3/exchangeInfo
```

**Note:** No authentication required for these endpoints.

---

## Evaluation Criteria

| Area | What We're Looking For |
|------|------------------------|
| **Code Quality** | Clean, readable, well-organized code |
| **React Patterns** | Appropriate use of hooks, component composition |
| **State Management** | Sensible approach to managing UI and data state |
| **Error Handling** | Graceful handling of API failures, loading states |
| **TypeScript** | Proper typing, avoiding `any` |
| **UX** | Responsive updates without jarring transitions |

---

## Bonus (Optional)

Only if you have extra time:

- Spread indicator (difference between best bid and ask)
- Depth visualization (bars showing relative volume)
- WebSocket connection instead of polling
- Unit tests for key components

---

## Submission

1. Provide a GitHub repository link
2. Must include a Dockerfile that builds and runs the application

We will evaluate by running:

```bash
docker build -t orderbook-challenge .
docker run -p 3000:3000 orderbook-challenge
```

3. Include a README with:
   - Any design decisions or trade-offs you made
   - What you would improve with more time

**Important:** If we cannot run your submission with the above commands, it will not be evaluated.

---

## Notes

- Focus on quality over features
- It's fine to keep styling minimal
- We value working software over perfection
- If you run into issues with the API, document your approach and any workarounds

**Questions?** Reply to the email that sent you this challenge.
