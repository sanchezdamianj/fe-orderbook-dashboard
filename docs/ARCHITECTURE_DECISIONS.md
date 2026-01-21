# Architecture Decisions

## Why No API Routes?

**Decision**: Direct client-side API calls to Binance instead of Next.js API Routes.

### Rationale:

1. **Public API**: Binance API is public and doesn't require authentication
2. **No Backend Logic**: No data transformation, business logic, or secrets to hide
3. **Reduced Latency**: Direct connection eliminates extra server hop
4. **Simpler Deployment**: Pure static/SSG deployment possible
5. **Cost**: No server-side compute costs

### When API Routes WOULD be needed:

- API keys/secrets management
- Rate limiting coordination across users
- Data aggregation from multiple sources
- Caching strategies
- Authentication/authorization
- CORS proxying

## Why No Middleware?

**Decision**: No Next.js middleware implementation in this project.

### Rationale:

1. **No Auth**: No authentication/authorization to check
2. **No Redirects**: Simple single-page dashboard
3. **No A/B Testing**: Not applicable for this challenge
4. **No Geo-routing**: Single global deployment
5. **Public Access**: No access control needed

### When Middleware WOULD be used:

- Protected routes requiring authentication
- Request/response header manipulation
- IP-based rate limiting
- Feature flags / A/B testing
- Locale-based redirects
- Bot detection

## Alternative: Server Components

For a production trading app, we could use **React Server Components** for:

- Server-side data fetching with caching
- Reduced client bundle size
- Better SEO (if needed)
- Secret management

However, for this challenge:
- **Real-time data** requires client-side WebSocket
- **Interactive UI** needs client state
- **Simplicity** trumps over-engineering

---

**Note**: In a production fintech app, API Routes and Middleware would likely be essential for security, rate limiting, and business logic.
