# StockSense AI — Backend Build Prompt (Node.js + Express)

## Overview
Build a production-grade REST API backend for **StockSense AI**. The backend acts as the sole data layer between the React frontend and all external APIs (market data, news, AI) and Supabase (PostgreSQL). Every API request is authenticated via JWT. No frontend component calls any external API directly.

---

## Tech Stack
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Database Client:** `@supabase/supabase-js` (Postgres via Supabase)
- **Cache:** Redis (via `ioredis`)
- **Auth:** JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- **Validation:** Joi
- **Email:** SendGrid (`@sendgrid/mail`)
- **OTP:** Twilio (free trial) or `fast-otp` fallback via email
- **Rate Limiting:** `express-rate-limit`
- **Google OAuth:** `google-auth-library`
- **UUID:** `uuid` (v4) — only via `BaseService.generateUUID()`
- **HTTP Client (external APIs):** `axios`
- **Queue:** `bull` with Redis (for async news aggregation jobs)
- **Logging:** `winston` + `morgan`
- **Security:** `helmet`, `cors`, `express-mongo-sanitize` equivalent for SQL injection

---

## Folder Structure

```
backend/
├── server.js                         ← Entry point
├── .env
├── config/
│   ├── db.js                         ← Supabase client init
│   ├── redis.js                      ← ioredis client init
│   └── constants.js                  ← App-wide constants
│
├── middleware/
│   ├── authMiddleware.js             ← Verify JWT, attach user to req
│   ├── rateLimitMiddleware.js        ← express-rate-limit configs
│   ├── validationMiddleware.js       ← Joi schema runner
│   ├── errorMiddleware.js            ← Central error handler
│   └── requestLoggerMiddleware.js    ← Morgan + winston
│
├── utils/
│   ├── AppError.js                   ← Custom error class
│   ├── responseHelper.js             ← Standardised success/error response
│   ├── queryHelper.js                ← Query builder helpers for Supabase
│   ├── tokenHelper.js                ← JWT sign/verify/refresh
│   ├── hashHelper.js                 ← bcrypt hash/compare
│   ├── cacheHelper.js                ← Redis get/set/del/invalidate
│   └── tables.js                     ← All table name constants
│
├── jobs/
│   ├── newsAggregatorJob.js          ← Bull job: fetch & store news every 5 min
│   └── marketDataJob.js              ← Bull job: refresh live quotes cache
│
├── features/
│   ├── auth/
│   │   ├── authApis.js
│   │   ├── authController.js
│   │   ├── authService.js
│   │   └── authRepository.js
│   │
│   ├── stock/
│   │   ├── stockApis.js
│   │   ├── stockController.js
│   │   ├── stockService.js
│   │   └── stockRepository.js
│   │
│   ├── screener/
│   │   ├── screenerApis.js
│   │   ├── screenerController.js
│   │   ├── screenerService.js
│   │   └── screenerRepository.js
│   │
│   ├── portfolio/
│   │   ├── portfolioApis.js
│   │   ├── portfolioController.js
│   │   ├── portfolioService.js
│   │   └── portfolioRepository.js
│   │
│   ├── mutualFund/
│   │   ├── mutualFundApis.js
│   │   ├── mutualFundController.js
│   │   ├── mutualFundService.js
│   │   └── mutualFundRepository.js
│   │
│   ├── news/
│   │   ├── newsApis.js
│   │   ├── newsController.js
│   │   ├── newsService.js
│   │   └── newsRepository.js
│   │
│   ├── watchlist/
│   │   ├── watchlistApis.js
│   │   ├── watchlistController.js
│   │   ├── watchlistService.js
│   │   └── watchlistRepository.js
│   │
│   ├── alert/
│   │   ├── alertApis.js
│   │   ├── alertController.js
│   │   ├── alertService.js
│   │   └── alertRepository.js
│   │
│   └── aiAnalysis/
│       ├── aiAnalysisApis.js
│       ├── aiAnalysisController.js
│       ├── aiAnalysisService.js
│       └── aiAnalysisRepository.js
│
└── externalApis/
    ├── yahooFinanceClient.js         ← yahoo-finance2 wrapper
    ├── newsApiClient.js              ← NewsAPI.org wrapper
    ├── alphaVantageClient.js         ← Alpha Vantage free tier
    ├── mfApiClient.js                ← mfapi.in (free Indian MF data)
    ├── nseClient.js                  ← NSE India unofficial endpoints
    └── geminiClient.js               ← Google Gemini (free tier) for AI analysis
```

---

## Entry Point (`server.js`)

```js
// 1. Load dotenv
// 2. Import express, helmet, cors, morgan
// 3. Apply middleware: helmet(), cors(corsOptions), express.json(), morgan
// 4. Apply requestLoggerMiddleware
// 5. Mount all feature routers under /api/v1/
// 6. Mount 404 handler after all routes
// 7. Mount errorMiddleware as last middleware (4 args)
// 8. Connect Redis, verify DB connection
// 9. Start Bull jobs: newsAggregatorJob, marketDataJob
// 10. app.listen(PORT)
```

---

## Environment Variables (`.env`)

```
PORT=5000
NODE_ENV=development

SUPABASE_URL=
SUPABASE_SERVICE_KEY=

REDIS_URL=redis://localhost:6379

JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12

SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@stocksense.ai

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Free external APIs
YAHOO_FINANCE_KEY=          # not needed for yahoo-finance2
ALPHA_VANTAGE_KEY=          # free at alphavantage.co
NEWS_API_KEY=               # free at newsapi.org
GEMINI_API_KEY=             # free tier at ai.google.dev

FRONTEND_URL=http://localhost:5173
```

---

## Middleware

### `authMiddleware.js`
```js
// Extract Bearer token from Authorization header
// Verify with jwt.verify(token, JWT_SECRET)
// On success: attach decoded payload as req.user = { userId, email, role }
// On failure: throw AppError(401, 'UNAUTHORIZED', 'Invalid or expired token')
// Export: authenticate (used on all protected routes)
```

### `rateLimitMiddleware.js`
```js
// loginLimiter: max 5 requests per 15 minutes per IP — used on POST /auth/login
// otpLimiter: max 3 requests per 10 minutes per IP
// generalLimiter: max 100 requests per minute per user
// Export all three individually
```

### `validationMiddleware.js`
```js
// validate(schema, target = 'body')
// Returns express middleware that runs Joi schema.validate() on req[target]
// On failure: throw AppError(400, 'VALIDATION_ERROR', formatted Joi messages)
```

### `errorMiddleware.js`
```js
// 4-argument Express error handler
// Handles: AppError (custom), Joi validation, JWT errors, Supabase errors
// Logs all 5xx errors via winston
// Response format:
// { success: false, error: { code, message, details? } }
```

---

## Utils

### `AppError.js`
```js
class AppError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code         // e.g. 'VALIDATION_ERROR', 'NOT_FOUND'
    this.details = details
    this.isOperational = true
  }
}
```

### `responseHelper.js`
```js
// success(res, data, message, statusCode = 200)
//   → res.json({ success: true, message, data })
// paginated(res, data, pagination)
//   → res.json({ success: true, data, pagination: { page, limit, total, totalPages } })
```

### `tables.js`
```js
// Single source of truth for ALL table names
// NEVER write table name strings anywhere else
export const TABLES = {
  USERS: 'users',
  REFRESH_TOKENS: 'refresh_tokens',
  OTP_CODES: 'otp_codes',
  STOCKS: 'stocks',
  STOCK_PRICES: 'stock_prices',
  STOCK_FUNDAMENTALS: 'stock_fundamentals',
  NEWS: 'news',
  NEWS_STOCK_MAP: 'news_stock_map',
  PORTFOLIOS: 'portfolios',
  PORTFOLIO_HOLDINGS: 'portfolio_holdings',
  PORTFOLIO_TRANSACTIONS: 'portfolio_transactions',
  WATCHLISTS: 'watchlists',
  WATCHLIST_ITEMS: 'watchlist_items',
  MUTUAL_FUNDS: 'mutual_funds',
  MF_INVESTMENTS: 'mf_investments',
  PRICE_ALERTS: 'price_alerts',
  AI_ANALYSIS: 'ai_analysis_cache',
  TENDERS: 'tenders',
  TENDER_COMPANIES: 'tender_companies',
  SECTORS: 'sectors',
  AUDIT_LOGS: 'audit_logs',
}
```

### `queryHelper.js`
```js
// buildPaginationQuery(query, page, limit) → applies .range()
// buildSortQuery(query, sortKey, sortOrder) → applies .order()
// buildSearchQuery(query, fields, searchText) → applies .or() on multiple fields
// buildFilterQuery(query, filters) → iterates filter object and applies .eq()/.gte()/.lte()
```

### `cacheHelper.js`
```js
// get(key) → JSON.parse from Redis
// set(key, data, ttlSeconds) → JSON.stringify to Redis with EX
// del(key)
// invalidatePattern(pattern) → scan + del matching keys
```

### `tokenHelper.js`
```js
// generateAccessToken(payload) → jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
// generateRefreshToken(payload) → jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn })
// verifyAccessToken(token) → jwt.verify(token, JWT_SECRET)
// verifyRefreshToken(token) → jwt.verify(token, JWT_REFRESH_SECRET)
```

---

## Four-Layer Architecture Pattern

### Layer Rules (STRICT)
1. **API Layer (`*Apis.js`):** Router only. Defines URL, HTTP method, middleware chain (validate, authenticate), calls controller function. No logic.
2. **Controller Layer (`*Controller.js`):** Receives destructured args from `req`. Checks if required data exists (400 if not). Calls service. Returns response via `responseHelper`. No computation.
3. **Service Layer (`*Service.js`):** All business logic, data transformation, AI calls, external API calls. Calls repository for DB operations. Extends `BaseService`.
4. **Repository Layer (`*Repository.js`):** All DB queries via Supabase client. Uses `queryHelper`. Uses `TABLES` constants. No business logic.

### `BaseService.js` (`features/shared/BaseService.js`)
```js
import { v4 as uuidv4 } from 'uuid'
export class BaseService {
  generateUUID() { return uuidv4() }
}
// All service classes extend BaseService
// No service file imports uuidv4 directly
```

---

## Feature: Auth (`features/auth/`)

### `authApis.js` Endpoints:
```
POST   /api/v1/auth/register           → validate(registerSchema) → authController.register
POST   /api/v1/auth/login              → loginLimiter, validate(loginSchema) → authController.login
POST   /api/v1/auth/google             → validate(googleSchema) → authController.googleLogin
POST   /api/v1/auth/refresh-token      → validate(refreshSchema) → authController.refreshToken
POST   /api/v1/auth/logout             → authenticate → authController.logout
POST   /api/v1/auth/send-otp           → otpLimiter, validate → authController.sendOtp
POST   /api/v1/auth/verify-otp         → validate → authController.verifyOtp
POST   /api/v1/auth/forgot-password    → otpLimiter → authController.forgotPassword
POST   /api/v1/auth/reset-password     → validate → authController.resetPassword
GET    /api/v1/auth/me                 → authenticate → authController.getMe
```

### `authController.js`
- `register({ name, email, password, phone, pan })` — calls authService.register
- `login({ email, password })` — calls authService.login
- `googleLogin({ idToken })` — calls authService.googleLogin
- `refreshToken({ refreshToken })` — calls authService.refreshToken
- `logout(userId, refreshToken)` — calls authService.logout
- Each controller checks if incoming required fields exist, then delegates entirely to service

### `authService.js`
- `register`: check duplicate email → hash password (bcrypt, SALT_ROUNDS from env) → generateUUID → save user → send welcome email via SendGrid → return tokens
- `login`: find user by email → compare password → generate access + refresh tokens → store refresh token hash in DB → return tokens + user
- `googleLogin`: verify Google idToken via `google-auth-library` → find or create user → return tokens
- `refreshToken`: verify refresh token → check against DB hash → generate new access token → return
- `logout`: delete refresh token from DB
- `sendOtp`: generate 6-digit OTP → hash it → store in `otp_codes` table with 10-min expiry → send via SendGrid (or SMS if Twilio configured)
- `verifyOtp`: find OTP record → compare hash → mark verified → delete record

### `authRepository.js`
- `createUser(data)`, `findUserByEmail(email)`, `findUserById(id)`, `updateUser(id, data)`
- `saveRefreshToken(userId, tokenHash, expiresAt)`, `findRefreshToken(userId, tokenHash)`, `deleteRefreshToken(userId, tokenHash)`
- `saveOtp(userId, otpHash, type, expiresAt)`, `findOtp(userId, type)`, `deleteOtp(id)`

---

## Feature: Stock (`features/stock/`)

### `stockApis.js` Endpoints:
```
GET  /api/v1/stocks/search              → authenticate → stockController.search
GET  /api/v1/stocks/:symbol/quote       → authenticate → stockController.getQuote
GET  /api/v1/stocks/:symbol/history     → authenticate → stockController.getHistory
GET  /api/v1/stocks/:symbol/valuation   → authenticate → stockController.getValuation
GET  /api/v1/stocks/:symbol/financials  → authenticate → stockController.getFinancials
GET  /api/v1/stocks/:symbol/news        → authenticate → stockController.getStockNews
GET  /api/v1/stocks/:symbol/peers       → authenticate → stockController.getPeers
GET  /api/v1/stocks/:symbol/analysis    → authenticate → stockController.getAiAnalysis
GET  /api/v1/stocks/movers/gainers      → authenticate → stockController.getTopGainers
GET  /api/v1/stocks/movers/losers       → authenticate → stockController.getTopLosers
GET  /api/v1/stocks/indices/live        → stockController.getLiveIndices  ← public
GET  /api/v1/stocks/:symbol/insiders    → authenticate → stockController.getInsiderActivity
GET  /api/v1/stocks/ipo/upcoming        → authenticate → stockController.getUpcomingIPOs
```

### `stockService.js` Logic:
- `getQuote(symbol)`: check Redis cache (key: `quote:${symbol}`, TTL 60s) → if miss, call `yahooFinanceClient.getQuote(symbol)` → cache → return
- `getHistory(symbol, period, interval)`: cache 5 min → call Yahoo Finance
- `getValuation(symbol)`: cache 1 hour → Yahoo Finance + compute PE, PEG, PB, dividend yield, EV/EBITDA, price-to-FCF
- `getFinancials(symbol)`: cache 6 hours → income statement, balance sheet, cash flow from Yahoo Finance
- `getStockNews(symbol, { page, limit })`: call newsService to get news tagged with symbol
- `getPeers(symbol)`: find same sector stocks from DB → fetch quotes for each
- `getAiAnalysis(symbol)`: check `ai_analysis_cache` table (updated < 24h) → if stale, call Gemini AI with company fundamentals context → store → return
- `getLiveIndices()`: cache 30s → fetch NIFTY50, SENSEX, NIFTY BANK, NIFTY IT, NIFTY MIDCAP from Yahoo Finance
- `search(q)`: search stocks table by name/symbol ILIKE pattern

---

## Feature: Screener (`features/screener/`)

### Endpoints:
```
POST /api/v1/screener          → authenticate, validate(screenerSchema) → screenerController.screen
GET  /api/v1/screener/filters  → authenticate → screenerController.getFilterOptions
```

### `screenerService.js` Logic:
- `screen(filters, pagination, sort, search)`:
  - Build dynamic query on `stock_fundamentals` JOIN `stocks` JOIN `sectors`
  - Apply filters: PE range, PB range, ROE min, debt-to-equity max, market cap range, dividend yield min, sector, stock type
  - Apply search across symbol + company name
  - Apply sort
  - Apply pagination
  - Return paginated results with all key metrics

---

## Feature: Portfolio (`features/portfolio/`)

### Endpoints:
```
GET    /api/v1/portfolio                    → authenticate → portfolioController.getSummary
GET    /api/v1/portfolio/holdings           → authenticate → portfolioController.getHoldings
POST   /api/v1/portfolio/holdings           → authenticate, validate → portfolioController.addHolding
PUT    /api/v1/portfolio/holdings/:id       → authenticate, validate → portfolioController.updateHolding
DELETE /api/v1/portfolio/holdings/:id       → authenticate → portfolioController.deleteHolding
POST   /api/v1/portfolio/transactions       → authenticate, validate → portfolioController.addTransaction
GET    /api/v1/portfolio/transactions       → authenticate → portfolioController.getTransactions
GET    /api/v1/portfolio/performance        → authenticate → portfolioController.getPerformance
GET    /api/v1/portfolio/rebalance          → authenticate → portfolioController.getRebalanceSuggestion
GET    /api/v1/portfolio/sector-allocation  → authenticate → portfolioController.getSectorAllocation
```

### `portfolioService.js` Logic:
- `getSummary(userId)`: compute invested value, current value (live prices from cache), total P&L, today's P&L, XIRR
- `getHoldings(userId, pagination, sort, search)`: join holdings with live stock quotes
- `getRebalanceSuggestion(userId)`: fetch holdings → analyse sector concentration, overvalued positions (high PE vs peers), underweight growing sectors → call Gemini for natural language suggestions

---

## Feature: News (`features/news/`)

### Endpoints:
```
GET  /api/v1/news                    → authenticate → newsController.getNews
GET  /api/v1/news/trending           → authenticate → newsController.getTrending
GET  /api/v1/news/tenders            → authenticate → newsController.getTenders
```

### `newsService.js` Logic:
- `getNews({ sector, symbol, sentiment, dateFrom, dateTo, page, limit, search })`: query `news` table with filters
- `aggregateNews()` (called by Bull job every 5 min):
  - Fetch from NewsAPI.org (free, up to 100 req/day — cache aggressively)
  - Fetch from Google News RSS for Indian market
  - Extract stock symbols mentioned using string matching against stocks table
  - Store in `news` table with sentiment score placeholder
  - Map news to stocks in `news_stock_map`
  - Call Gemini batch for sentiment scoring (positive/negative/neutral + impact score 1-10)
- `getTenders()`: query `tenders` JOIN `tender_companies` tables, filtered and paginated

---

## Feature: Mutual Funds (`features/mutualFund/`)

### Endpoints:
```
GET  /api/v1/mutual-funds                  → authenticate → mutualFundController.explore
GET  /api/v1/mutual-funds/:schemeCode      → authenticate → mutualFundController.getDetail
POST /api/v1/mutual-funds/investments      → authenticate, validate → mutualFundController.addInvestment
GET  /api/v1/mutual-funds/investments      → authenticate → mutualFundController.getMyInvestments
GET  /api/v1/mutual-funds/rebalance        → authenticate → mutualFundController.getRebalanceSuggestion
```

### `mutualFundService.js` Logic:
- `explore(filters)`: filter `mutual_funds` table by category, risk level, AMC, min returns
- `getDetail(schemeCode)`: call `mfApiClient` → get NAV history → cache 1 hour
- `getMyInvestments(userId)`: fetch MF investments → compute current value from latest NAV → compute XIRR
- `getRebalanceSuggestion(userId)`: analyse portfolio → identify overexposed fund categories → suggest reallocation

---

## Feature: Watchlist (`features/watchlist/`)

### Endpoints:
```
GET    /api/v1/watchlists              → authenticate → watchlistController.getAll
POST   /api/v1/watchlists              → authenticate, validate → watchlistController.create
DELETE /api/v1/watchlists/:id          → authenticate → watchlistController.delete
POST   /api/v1/watchlists/:id/stocks   → authenticate → watchlistController.addStock
DELETE /api/v1/watchlists/:id/stocks/:symbol → authenticate → watchlistController.removeStock
```

---

## Feature: Alerts (`features/alert/`)

### Endpoints:
```
GET    /api/v1/alerts         → authenticate → alertController.getAlerts
POST   /api/v1/alerts         → authenticate, validate → alertController.createAlert
DELETE /api/v1/alerts/:id     → authenticate → alertController.deleteAlert
```

### Alert Checking (Bull job, every minute):
- Fetch all active alerts from DB
- Get cached quote for each symbol
- If price crosses threshold → send email via SendGrid → mark alert as triggered

---

## External API Clients (`externalApis/`)

### `yahooFinanceClient.js`
- Uses `yahoo-finance2` npm package (free, no API key needed)
- Functions: `getQuote(symbol)`, `getHistory(symbol, { period1, period2, interval })`, `getFundamentals(symbol)`, `getBalanceSheet(symbol)`, `getIncomeStatement(symbol)`, `search(query)`
- All Indian stocks: append `.NS` for NSE or `.BO` for BSE to symbol

### `newsApiClient.js`
- Uses NewsAPI.org free tier (1000 req/day)
- Functions: `getHeadlines({ q, category, from, to })`, `getEverything({ q, from, to, sortBy })`
- Cache all responses for 5 minutes minimum to preserve quota

### `mfApiClient.js`
- Uses `mfapi.in` — completely free Indian mutual fund API
- Functions: `getAllFunds()`, `getFundBySchemeCode(code)`, `getNAVHistory(code)`

### `nseClient.js`
- Uses unofficial NSE endpoints (no key needed, but set custom headers)
- Functions: `getIndexData(index)`, `getBulkDeals()`, `getBlockDeals()`, `getInsiderTrading(symbol)`, `getUpcomingIPOs()`

### `geminiClient.js`
- Uses Google Gemini API free tier (`gemini-1.5-flash` model, 15 RPM free)
- Functions: `generateStockAnalysis(fundamentals, newsHeadlines)` → returns qualitative analysis text
- `scoreSentiment(headlines[])` → returns `[{headline, sentiment, impact}]`
- `getRebalanceSuggestion(portfolioData)` → returns natural language rebalance advice

### `alphaVantageClient.js`
- Free tier: 25 req/day — use sparingly for data Yahoo Finance misses
- Functions: `getEarningsCalendar()`, `getCompanyOverview(symbol)`

---

## Caching Strategy (Redis)

| Data | Cache Key Pattern | TTL |
|------|-------------------|-----|
| Live quote | `quote:{symbol}` | 60s |
| Historical prices | `history:{symbol}:{period}` | 5min |
| Valuation metrics | `valuation:{symbol}` | 1hr |
| Financials | `financials:{symbol}` | 6hr |
| Live indices | `indices:live` | 30s |
| News list | `news:{filterHash}` | 3min |
| MF NAV | `mf:nav:{schemeCode}` | 1hr |
| All MF list | `mf:all` | 6hr |
| Screener results | `screener:{filterHash}` | 10min |
| AI analysis | DB table + `ai:analysis:{symbol}` | 24hr |

---

## Security

1. **SQL Injection Prevention:** Supabase client uses parameterized queries by default. Never use string interpolation to build queries. Use `queryHelper` functions exclusively.
2. **Password Hashing:** bcrypt with 12 salt rounds
3. **Helmet:** Sets all security headers (CSP, HSTS, X-Frame-Options, etc.)
4. **CORS:** Whitelist only `FRONTEND_URL` from env
5. **Rate Limiting:** Login: 5/15min, OTP: 3/10min, General: 100/min
6. **Refresh Token Rotation:** On each refresh, old token is deleted and new one issued
7. **Token Storage:** Access token: 15min expiry; Refresh token: 7d, stored as bcrypt hash in DB
8. **Input Sanitization:** Joi validates all incoming data with strict schemas; `.unknown(false)` to reject unexpected fields
9. **Audit Logging:** All write operations logged to `audit_logs` table with user, action, timestamp, IP

---

## Error Response Format (Standardised)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [{ "field": "email", "message": "Email is required" }]
  }
}
```

Success format:
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "accessToken": "...", "user": {} }
}
```

Paginated format:
```json
{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 247, "totalPages": 25 }
}
```

---

## Bull Jobs

### `newsAggregatorJob.js`
- Queue: `news-aggregation`, Redis backed
- Runs every 5 minutes
- Calls `newsService.aggregateNews()`
- Rate limits itself to not exceed NewsAPI free quota

### `marketDataJob.js`
- Queue: `market-data`, Redis backed
- During market hours (9:15 AM – 3:30 PM IST, Mon–Fri): runs every 60s
- Fetches live quotes for all stocks in any active watchlist or portfolio
- Stores in Redis cache
- After market hours: runs every 15 min (for global markets)

### `alertCheckerJob.js`
- Runs every 60s during market hours
- Fetches all active price alerts
- Compares with cached quotes
- Triggers email if condition met

---

## Naming Convention
- Files: `camelCase` — `authService.js`, `stockRepository.js`
- Feature prefix: `<featureName>Apis.js`, `<featureName>Controller.js`, `<featureName>Service.js`, `<featureName>Repository.js`
- Routes: kebab-case — `/api/v1/mutual-funds`, `/api/v1/stock-screener`
- DB columns: snake_case
- JS variables/functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Classes: PascalCase
