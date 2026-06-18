# StockSense AI — Backend Build Prompt (Node.js + Express)

## Overview
Data Freshness Rules

- Quotes maximum age: 60 seconds
- News maximum age: 5 minutes
- Tender maximum age: 15 minutes
- Fundamentals maximum age: 24 hours
- Mutual Fund maximum age: 24 hours

Any data exceeding freshness threshold must be marked stale.
Frontend must display freshness status.

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
|   └── permissionMiddleware.js    example authenticate, authorize('stock.view')
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
|   ├── marketHealthMonitorJob.js
│   └── earningsSyncJob.js              ← Bull job: sync earnings calendar + earnings results
│   └── dividendSyncJob.js              ← Bull job: sync dividend calendar +  stock split events
│   └── insiderTradeSyncJob.js          ← Bull job: sync insider trades + bulk/block deals
│   └── economicCalendarSyncJob.js      ← Bull job: sync macroeconomic events
│   └── institutionalFlowSyncJob.js     ← Bull job: sync FII/DII daily activity
│   └── notificationDispatchJob.js      ← Bull job: process and send user notifications
│   └── alertCheckerJob.js              ← Bull job: evaluate price alerts and trigger notifications
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
|   |
│   └── aiAnalysis/
│   |   ├── aiAnalysisApis.js
│   |   ├── aiAnalysisController.js
│   |   ├── aiAnalysisService.js
│   |   └── aiAnalysisRepository.js
|   |
|   ├── earnings/
│   |   ├── earningsApis.js
│   |   ├── earningsController.js
│   |   ├── earningsService.js
│   |   └── earningsRepository.js
│   |
|   ├── calendar/
│   |   ├── calendarApis.js
│   |   ├── calendarController.js
│   |   ├── calendarService.js
│   |   └── calendarRepository.js
|   ├── role/
│   |   ├── roleApis.js
│   |   ├── roleController.js
│   |   ├── roleService.js
│   |   └── roleRepository.js
│   |
|   ├── permission/
│   |   ├── permissionApis.js
│   |   ├── permissionController.js
│   |   ├── permissionService.js
│   |   └── permissionRepository.js
│   |
|   ├── dividend/
│   |   ├── dividendApis.js
│   |   ├── dividendController.js
│   |   ├── dividendService.js
│   |   └── dividendRepository.js
│   |
|   ├── goals/
│   |   ├── goalsApis.js
│   |   ├── goalsController.js
│   |   ├── goalsService.js
│   |   └── goalsRepository.js
│   |
|   ├── notification/
│   |   ├── notificationApis.js
│   |   ├── notificationController.js
│   |   ├── notificationService.js
│   |   └── notificationRepository.js
│   |
|   ├── admin/
│   |   ├── adminApis.js
│   |   ├── adminController.js
│   |   ├── adminService.js
│   |   └── adminRepository.js
│   |
|   ├── tax/
|   │   ├── taxApis.js
|   │   ├── taxController.js
|   │   ├── taxService.js
|   │   └── taxRepository.js
│   |
|   ├── comparison/
|   │   ├── comparisonApis.js
|   │   ├── comparisonController.js
|   │   ├── comparisonService.js
|   │   └── comparisonRepository.js
│   |
|   ├── shareholding/
|   │   ├── shareholdingApis.js
|   │   ├── shareholdingController.js
|   │   ├── shareholdingService.js
|   │   └── shareholdingRepository.js
│   |
|   ├── screenerPreset/
|   │   ├── screenerPresetApis.js
|   │   ├── screenerPresetController.js
|   │   ├── screenerPresetService.js
|   │   └── screenerPresetRepository.js
│   |
└── externalApis/
    ├── yahooFinanceClient.js         ← yahoo-finance2 wrapper
    ├── newsApiClient.js              ← NewsAPI.org wrapper
    ├── alphaVantageClient.js         ← Alpha Vantage free tier
    ├── mfApiClient.js                ← mfapi.in (free Indian MF data)
    ├── nseClient.js                  ← NSE India unofficial endpoints
    ├── dataProviderManager.js
    ├── finnhubClient.js
    ├── twelveDataClient.js
    ├── googleNewsClient.js
    ├── economicCalendarClient.js
    ├── dividendClient.js
    ├── shareholdingClient.js
    └── geminiClient.js               ← Google Gemini (free tier) for AI        analysis
```

---

## Entry Point (`server.js`)

```js
// 1. Load dotenv
// 2. Import express, helmet, cors, morgan
// 3. Apply middleware: helmet(), cors(corsOptions), express.json(), morgan
// 4. Apply requestLoggerMiddleware
// 5. Mount all feature routers under /api/v1/
app.use('/api/v1/auth', authApis)
app.use('/api/v1/stocks', stockApis)
app.use('/api/v1/screener', screenerApis)
app.use('/api/v1/portfolio', portfolioApis)
app.use('/api/v1/mutual-funds', mutualFundApis)
app.use('/api/v1/news', newsApis)
app.use('/api/v1/watchlists', watchlistApis)
app.use('/api/v1/alerts', alertApis)
app.use('/api/v1/ai-analysis', aiAnalysisApis)
app.use('/api/v1/earnings', earningsApis)
app.use('/api/v1/calendar', calendarApis)
app.use('/api/v1/dividends', dividendApis)
app.use('/api/v1/goals', goalsApis)
app.use('/api/v1/notifications', notificationApis)
app.use('/api/v1/admin', adminApis)
app.use('/api/v1/tax', taxApis)
app.use('/api/v1/compare', comparisonApis)
app.use('/api/v1/shareholding', shareholdingApis)
app.use('/api/v1/screener-presets', screenerPresetApis)
app.use('/api/v1/roles', roleApis)
app.use('/api/v1/permissions', permissionApis)
app.use('/api/v1/market', marketApis)           ← NEW
app.use('/api/v1/calculator', calculatorApis)   ← NEW
// 6. Mount 404 handler after all routes
// 7. Mount errorMiddleware as last middleware (4 args)
// 8. Connect Redis, verify DB connection
// 9. Start Bull jobs:
// newsAggregatorJob
// marketDataJob
// earningsSyncJob
// dividendSyncJob
// insiderTradeSyncJob
// economicCalendarSyncJob
// notificationDispatchJob
// alertCheckerJob
// marketHealthMonitorJob
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
FINNHUB_API_KEY=            # free at finnhub.io (60 req/min)
TWELVE_DATA_API_KEY=        # free at twelvedata.com (800 req/day)

FRONTEND_URL=http://localhost:5173
```

---

## Middleware

### `authMiddleware.js`
```js
// Extract Bearer token from Authorization header
// Verify with jwt.verify(token, JWT_SECRET)
// On success: attach decoded payload as req.user = {userId,email,roles,permissions}
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

### `permissionMiddleware.js`
```js
// authorize(permissionKey) — returns Express middleware
// 1. Requires authenticate to run first (req.user must exist)
// 2. Check Redis cache: key `user:permissions:${req.user.userId}` TTL 5min
// 3. Cache miss: query user_roles JOIN role_permissions JOIN permissions WHERE user_id = userId
// 4. Store flat array of permission_keys in Redis
// 5. If permissionKey is in array → call next()
// 6. If not → throw AppError(403, 'FORBIDDEN', 'Insufficient permissions')
// Usage in route: router.get('/admin/users', authenticate, authorize('admin.users.view'), controller)
// Invalidate cache on role change: cacheHelper.del(`user:permissions:${userId}`)
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
// Single source of truth for ALL table names — NEVER write table name strings anywhere else
export const TABLES = {
  // Auth
  USERS: 'users',
  REFRESH_TOKENS: 'refresh_tokens',
  OTP_CODES: 'otp_codes',

  // Stocks
  STOCKS: 'stocks',
  SECTORS: 'sectors',
  STOCK_PRICES: 'stock_prices',
  STOCK_FUNDAMENTALS: 'stock_fundamentals',
  SHAREHOLDING_PATTERNS: 'shareholding_patterns',
  BULK_BLOCK_DEALS: 'bulk_block_deals',
  INSIDER_TRADES: 'insider_trades',
  STOCK_SPLITS: 'stock_splits',
  CATALYSTS: 'catalysts',
  RECENTLY_VIEWED_STOCKS: 'recently_viewed_stocks',

  // News & Events
  NEWS: 'news',
  NEWS_STOCK_MAP: 'news_stock_map',
  TENDERS: 'tenders',
  TENDER_COMPANIES: 'tender_companies',
  EARNINGS_CALENDAR: 'earnings_calendar',
  DIVIDEND_CALENDAR: 'dividend_calendar',
  ECONOMIC_EVENTS: 'economic_events',
  INSTITUTIONAL_FLOWS: 'institutional_flows',

  // IPO
  IPO_LISTINGS: 'ipo_listings',

  // Mutual Funds
  MUTUAL_FUNDS: 'mutual_funds',
  MF_INVESTMENTS: 'mf_investments',

  // Portfolio
  PORTFOLIOS: 'portfolios',
  PORTFOLIO_HOLDINGS: 'portfolio_holdings',
  PORTFOLIO_TRANSACTIONS: 'portfolio_transactions',

  // Watchlist
  WATCHLISTS: 'watchlists',
  WATCHLIST_ITEMS: 'watchlist_items',
  WATCHLIST_NOTES: 'watchlist_notes',
  WATCHLIST_TAGS: 'watchlist_tags',

  // Alerts & Notifications
  PRICE_ALERTS: 'price_alerts',
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_PREFERENCES: 'notification_preferences',

  // Goals & Tax
  INVESTMENT_GOALS: 'investment_goals',
  TAX_REPORTS: 'tax_reports',

  // AI
  AI_ANALYSIS_CACHE: 'ai_analysis_cache',

  // Screener
  SAVED_SCREENERS: 'saved_screeners',

  // RBAC
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  ROLE_PERMISSIONS: 'role_permissions',
  USER_ROLES: 'user_roles',

  // Market Data Infrastructure
  MARKET_DATA_SOURCES: 'market_data_sources',
  MARKET_DATA_SYNC_LOGS: 'market_data_sync_logs',

  // Audit
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
GET  /api/v1/stocks/:symbol/shareholding    → authenticate → stockController.getShareholdingPattern
GET  /api/v1/stocks/:symbol/dividends       → authenticate → stockController.getDividendHistory
GET  /api/v1/stocks/:symbol/splits          → authenticate → stockController.getStockSplits
GET  /api/v1/stocks/:symbol/catalysts       → authenticate → stockController.getCatalysts
GET  /api/v1/stocks/:symbol/freshness       → authenticate → stockController.getDataFreshness
GET  /api/v1/stocks/:symbol/bulk-deals      → authenticate → stockController.getBulkAndBlockDeals
GET  /api/v1/stocks/:symbol/earnings        → authenticate → stockController.getEarningsHistory
GET  /api/v1/stocks/:symbol/52-week-range   → authenticate → stockController.get52WeekRange
POST /api/v1/stocks/:symbol/viewed          → authenticate → stockController.markViewed
GET  /api/v1/stocks/recently-viewed         → authenticate → stockController.getRecentlyViewed
```

### `stockService.js` Logic:
- `getQuote(symbol)`:
- check Redis cache
- call dataProviderManager.getQuote(symbol)

dataProviderManager:
1. nseClient
2. yahooFinanceClient
3. finnhubClient
4. twelveDataClient

Return first successful response with latest timestamp.
Store source name and sync timestamp.
- `getHistory(symbol, period, interval)`: cache 5 min → call Yahoo Finance
- `getValuation(symbol)`: cache 1 hour → Yahoo Finance + compute PE, PEG, PB, dividend yield, EV/EBITDA, price-to-FCF
- `getFinancials(symbol)`: cache 6 hours → income statement, balance sheet, cash flow from Yahoo Finance
- `getStockNews(symbol, { page, limit })`: call newsService to get news tagged with symbol
- `getPeers(symbol)`: find same sector stocks from DB → fetch quotes for each
- `getAiAnalysis(symbol)`: check `ai_analysis_cache` table (updated < 24h) → if stale, call Gemini AI with company fundamentals context → store → return
- `getLiveIndices()`: cache 30s → fetch NIFTY50, SENSEX, NIFTY BANK, NIFTY IT, NIFTY MIDCAP from Yahoo Finance
- `search(q)`: search stocks table by name/symbol ILIKE pattern
- `getShareholdingPattern(symbol)`: fetch latest promoter/FII/DII/public holding pattern from DB or external API, cache 24 hours
- `getDividendHistory(symbol)`: fetch dividend history from DB, sort descending by ex-date
- `getStockSplits(symbol)`: fetch stock split timeline from DB
- `getCatalysts(symbol)`: combine upcoming earnings, tenders, government projects, sector events, and important company announcements into a single catalyst timeline
- `getDataFreshness(symbol)`: returns source metadata (NSE, Yahoo, NewsAPI, Tender API) and latest sync timestamps for frontend freshness badge
- `getBulkAndBlockDeals(symbol)`: fetch bulk and block deals related to symbol from DB
- `getEarningsHistory(symbol)`: fetch quarterly earnings, EPS, revenue, surprise %, and next earnings date
- `get52WeekRange(symbol)`: calculate 52-week high, 52-week low, and current price position in that range

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
GET    /api/v1/portfolio/dividend-income    → authenticate → portfolioController.getDividendIncome
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
POST   /api/v1/watchlists/:id/notes         → authenticate, validate → watchlistController.addNote
GET    /api/v1/watchlists/:id/notes         → authenticate → watchlistController.getNotes
POST   /api/v1/watchlists/:id/tags          → authenticate, validate → watchlistController.addTag
GET    /api/v1/watchlists/:id/tags          → authenticate → watchlistController.getTags
```

---

### `watchlistService.js` Logic:

- `addNote(userId, watchlistId, stockSymbol, note)`: save custom note for stock inside watchlist
- `getNotes(userId, watchlistId)`: fetch all watchlist notes
- `addTag(userId, watchlistId, tag)`: attach custom tag like "Dividend", "High Risk", "Momentum"
- `getTags(userId, watchlistId)`: fetch all tags for watchlist

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

## Feature: Permissions (`features/permission/`)
### permissionApi.js Endpoints:
```
GET    /api/v1/permissions
GET    /api/v1/permissions/tree
GET    /api/v1/permissions/:id

POST   /api/v1/permissions
PUT    /api/v1/permissions/:id
DELETE /api/v1/permissions/:id
```
---

## Feature: Permissions (`features/roles/`)
### rolesApi.js Endpoints:
```
GET    /api/v1/roles
GET    /api/v1/roles/:id

POST   /api/v1/roles
PUT    /api/v1/roles/:id
DELETE /api/v1/roles/:id

POST   /api/v1/roles/:id/permissions
DELETE /api/v1/roles/:id/permissions/:permissionId
```
---

## Feature: role assignment

```
POST   /api/v1/users/:id/roles
DELETE /api/v1/users/:id/roles/:roleId
```
---


## Feature: Market (`features/market/`)  ← NEW FEATURE MODULE

### `marketApis.js` Endpoints:
```
GET /api/v1/market/status        → public → marketController.getStatus
GET /api/v1/market/fii-dii       → authenticate → marketController.getFiiDii
GET /api/v1/market/fii-dii/history → authenticate → marketController.getFiiDiiHistory
```

### `marketService.js` Logic:
- `getStatus()`: call nseClient.getMarketStatus() → cache 60s → return `{ isOpen, session, nextOpen, nextClose, holidays[] }`
- `getFiiDii()`: fetch latest row from `institutional_flows` table → cache 5min → return daily buy/sell/net for FII + DII
- `getFiiDiiHistory(days)`: fetch last N days from `institutional_flows` for trend chart

### `marketController.js`, `marketRepository.js` — follow standard 4-layer pattern

---

## Feature: Calculator (`features/calculator/`)  ← NEW FEATURE MODULE

### `calculatorApis.js` Endpoints:
```
POST /api/v1/calculator/sip   → authenticate, validate → calculatorController.computeSip
POST /api/v1/calculator/drip  → authenticate, validate → calculatorController.computeDrip
```

### `calculatorService.js` Logic:
- `computeSip({ target_corpus, years, expected_cagr, inflation_rate })`:
  - Compute monthly SIP = target / (((1 + r/12)^n - 1) / (r/12) * (1 + r/12))
  - Return `{ monthly_sip, total_invested, total_corpus, inflation_adjusted_corpus, year_by_year: [] }`
  - Pure computation — no DB read/write
- `computeDrip({ symbol, shares, years })`:
  - Fetch dividend history for symbol
  - Simulate reinvestment compounding
  - Return `{ initial_investment, final_corpus, projected_passive_income, year_by_year: [] }`

### No repository layer needed for calculator — pure computation service

---


## Feature: Admin (`features/admin/`)

### adminApis.js Endpoints:
```
GET  /api/v1/admin/users            → authenticate, authorize('admin.users.view') → adminController.getUsers
GET  /api/v1/admin/stats            → authenticate, authorize('admin.view') → adminController.getSystemStats
GET  /api/v1/admin/audit-logs       → authenticate, authorize('admin.view') → adminController.getAuditLogs
GET  /api/v1/admin/failed-jobs      → authenticate, authorize('admin.view') → adminController.getFailedJobs
POST /api/v1/admin/retry-job/:id    → authenticate, authorize('admin.view') → adminController.retryJob
GET  /api/v1/admin/system-health    → authenticate, authorize('admin.view') → adminController.getSystemHealth
GET  /api/v1/admin/sync-status      → authenticate, authorize('admin.view') → adminController.getSyncStatus
```
---

### adminService.js Logic:
```
- `getUsers(pagination, sort, search)`: fetch all users with pagination, filtering, and search
- `getSystemStats()`: returns active users, API usage, alerts count, watchlist count, and system health metrics
- `getAuditLogs(pagination, filters)`: fetch write operation logs with filters
- `getFailedJobs()`: fetch failed Bull jobs from all queues via Bull API
- `retryJob(jobId)`: retry failed async jobs
- `getSystemHealth()`: ping Redis, Supabase, and all external providers (NSE, Yahoo, Finnhub, TwelveData); return latency and status per provider; check market_data_sources table for last healthy status
- `getSyncStatus()`: fetch all Bull job queues — last run time, next scheduled run, success/fail counts per job, from market_data_sync_logs
```
---

### marketHealthMonitorJob.js Logic: 
- Runs every 1 minute
- Checks all configured data providers
- Updates market_data_sources table
- Disables failing providers
- Enables recovered providers
- Maintains provider priority order

## Feature: Watchlist (`features/watchlist/`)

### notificationApis.js Endpoints:
```
GET    /api/v1/notifications                    → authenticate → notificationController.getAll
PATCH  /api/v1/notifications/:id/read           → authenticate → notificationController.markRead
PATCH  /api/v1/notifications/read-all           → authenticate → notificationController.markAllRead
DELETE /api/v1/notifications/:id                → authenticate → notificationController.deleteNotification
GET    /api/v1/notifications/preferences        → authenticate → notificationController.getPreferences
PATCH  /api/v1/notifications/preferences        → authenticate, validate → notificationController.updatePreferences
```
---

### notificationService.js Logic:
```
- `getAll(userId, pagination)`: fetch user notifications sorted by latest
- `markRead(userId, notificationId)`: mark single notification as read
- `markAllRead(userId)`: mark all notifications as read
- `deleteNotification(userId, notificationId)`: delete a notification
- `getPreferences(userId)`: fetch user notification preferences from notification_preferences table
- `updatePreferences(userId, prefs)`: upsert notification preferences (email_enabled, push_enabled, price_alerts, earnings_alerts, dividend_alerts, news_alerts, insider_alerts)
```

### portfolioService.js additions:
```
- `getDividendIncome(userId, year)`:
  - Join portfolio_holdings → stocks → dividend_calendar WHERE ex_date in financial year
  - Sum dividend_amount * quantity for each holding
  - Return total income, paid vs pending, monthly breakdown chart data, projected annual income
```
---

## Feature: Goals (features/goals/)

### goalsApis.js Endpoints:
```
POST   /api/v1/goals              → authenticate, validate → goalsController.createGoal
GET    /api/v1/goals              → authenticate → goalsController.getGoals
PUT    /api/v1/goals/:id          → authenticate, validate → goalsController.updateGoal
DELETE /api/v1/goals/:id          → authenticate → goalsController.deleteGoal
GET    /api/v1/goals/:id/progress → authenticate → goalsController.getGoalProgress
```
---

### goalsService.js Logic:
```
- `createGoal(userId, data)`: create investment goals (retirement, house, emergency fund)
- `getGoals(userId)`: fetch all goals
- `updateGoal(userId, goalId, data)`: update target amount, date, etc.
- `deleteGoal(userId, goalId)`
- `getGoalProgress(userId, goalId)`: calculate current progress based on portfolio and MF investments
```
---

## Feature: Tax (features/tax/)

### taxApis.js Endpoints:
```
GET /api/v1/tax/capital-gains    → authenticate → taxController.getCapitalGains
GET /api/v1/tax/dividends        → authenticate → taxController.getDividendTax
GET /api/v1/tax/export           → authenticate → taxController.exportTaxReport
```
---

### taxService.js Logic:
```
- `getCapitalGains(userId)`: calculate short-term and long-term capital gains
- `getDividendTax(userId)`: calculate dividend income and taxable amount
- `exportTaxReport(userId)`: generate downloadable tax report (CSV/PDF)
```
---

## Feature: AI Analysis (`features/aiAnalysis/`)

### aiAnalysisApis.js Endpoints:
```
GET /api/v1/ai-analysis/:symbol/explain          → authenticate → aiAnalysisController.explainStock
GET /api/v1/ai-analysis/:symbol/recommendation   → authenticate → aiAnalysisController.getRecommendation
GET /api/v1/ai-analysis/portfolio/rebalance      → authenticate → aiAnalysisController.getPortfolioRebalance
```
---

### aiAnalysisService.js Logic:
```
- `explainStock(symbol)`: explains why stock is bullish, bearish, overvalued, or undervalued using valuation + qualitative factors
- `getRecommendation(symbol)`: returns Buy/Hold/Sell recommendation with reasoning
- `getPortfolioRebalance(userId)`: AI-based portfolio rebalancing suggestions based on concentration, risk, and sector exposure
```
---

## External API Clients (`externalApis/`)

### `yahooFinanceClient.js`
- Uses `yahoo-finance2` npm package (free, no API key needed)
- Functions: `getQuote(symbol)`, `getHistory(symbol, { period1, period2, interval })`, `getFundamentals(symbol)`, `getBalanceSheet(symbol)`, `getIncomeStatement(symbol)`, `search(query)`
- All Indian stocks: append `.NS` for NSE or `.BO` for BSE to symbol

### `nseClient.js`
- Uses unofficial NSE endpoints — free, no key, real-time data
- **Cookie Management (critical):** On init and every 4 minutes, GET `https://www.nseindia.com` → extract `Set-Cookie` headers → store cookies string in Redis key `nse:cookies` with TTL 5min. Every subsequent NSE request must attach these cookies.
- On any 403 response from NSE: refresh cookies immediately, retry once
- Required headers on every request: `{ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Language': 'en-US,en;q=0.9', 'Accept-Encoding': 'gzip, deflate, br', 'Referer': 'https://www.nseindia.com', 'Connection': 'keep-alive' }`
- Functions:
  - `getQuote(symbol)` → `GET /api/quote-equity?symbol=SYMBOL`
  - `getAllIndices()` → `GET /api/allIndices` — returns NIFTY50, SENSEX, all indices in one call
  - `getMarketStatus()` → `GET /api/market-status`
  - `getBulkDeals()` → `GET /api/bulk-deals`
  - `getBlockDeals()` → `GET /api/block-deals`
  - `getInsiderTrading(symbol)` → `GET /api/insider-trading?symbol=SYMBOL`
  - `getCorporateActions()` → `GET /api/corporates-corporateActions?index=equities` — dividends, splits, bonuses
  - `getShareholdingPattern(symbol)` → `GET /api/corporate-shareholding-patterns?symbol=SYMBOL&series=EQ`
  - `getFiiDiiData()` → `GET /api/fiidiiTradeReact`
  - `getUpcomingIPOs()` → `GET /api/allIpo`
  - `getTopGainersLosers()` → `GET /api/live-analysis-data-gainers-loosers?index=gainers` / `losers`

### `finnhubClient.js`
- Free tier: 60 req/min — fallback when NSE is down
- Key: `FINNHUB_API_KEY` from env
- `getQuote(symbol)` → `GET https://finnhub.io/api/v1/quote?symbol=SYMBOL.NS&token=KEY`
- Normalize response to standard quote shape

### `twelveDataClient.js`
- Free tier: 800 req/day — last resort for price history
- Key: `TWELVE_DATA_API_KEY` from env
- `getHistory(symbol, interval, outputsize)` → `GET https://api.twelvedata.com/time_series?symbol=SYMBOL&interval=1day&outputsize=N&apikey=KEY`

### `dataProviderManager.js`
- **Priority order for live quotes:** NSE (real-time) → Yahoo Finance (~15min delay) → Finnhub (fallback) → Twelve Data (last resort)
- **Failover logic:** try provider 1; on error/timeout (>5s) → try provider 2; etc.
- **Normalized quote response shape** — all providers must return this shape:
```js
{
  symbol: 'RELIANCE',
  price: 2400.50,
  open: 2380.00,
  high: 2420.00,
  low: 2375.00,
  previousClose: 2388.00,
  change: 12.50,
  changePercent: 0.52,
  volume: 12500000,
  marketCap: 1623000,        // in Crores
  source: 'NSE',             // which provider responded
  isFresh: true,             // true if data < 60s old
  timestamp: '2025-01-15T09:30:00.000Z'
}
```
- Each provider's client maps its own response to this schema before returning
- Store `source` + `timestamp` in Redis alongside the quote data for `SDataFreshness` badge

### `newsApiClient.js`
- Uses NewsAPI.org free tier (1000 req/day)
- Functions: `getHeadlines({ q, category, from, to })`, `getEverything({ q, from, to, sortBy })`
- Cache all responses for 5 minutes minimum to preserve quota

### `googleNewsClient.js`
- Parses Google News RSS — unlimited, free, no key
- npm: `rss-parser`
- `getStockNews(query)` → `https://news.google.com/rss/search?q=QUERY+NSE+India&hl=en-IN&gl=IN&ceid=IN:en`
- `getMarketNews()` → general India market RSS feed
- Run alongside newsApiClient in aggregation job, deduplicate by URL hash

### `economicCalendarClient.js`
- **India (RBI):** Parse `https://www.rbi.org.in/scripts/rss.aspx` — free, no key
- **US (FRED):** `https://api.stlouisfed.org/fred/releases/dates?api_key=none&file_type=json` — free, no key required for public data
- Fetches economic events (RBI meetings, inflation releases, GDP data, Fed decisions)
- Functions: `getEconomicEvents()` → combined + normalized list
- Used by `economicCalendarSyncJob`

### `dividendClient.js`
- Primary: NSE `getCorporateActions()` from nseClient (dividends + splits + bonuses)
- Secondary: yahoo-finance2 `dividends(symbol)` for historical data
- Functions: `getDividendHistory(symbol)`, `getStockSplits(symbol)`
- Used by `dividendSyncJob`

### `shareholdingClient.js`
- Uses NSE `getShareholdingPattern(symbol)` from nseClient
- Functions: `getShareholding(symbol)` → normalized promoter/FII/DII/public/pledged breakdown
- Used by `stockService.getShareholdingPattern()`

### `mfApiClient.js`
- Uses `mfapi.in` — completely free Indian mutual fund API, unlimited
- Functions: `getAllFunds()`, `getFundBySchemeCode(code)`, `getNAVHistory(code)`

### `geminiClient.js`
- Uses Google Gemini API free tier (`gemini-1.5-flash` model, 15 RPM free)
- Functions: `generateStockAnalysis(fundamentals, newsHeadlines)` → qualitative analysis text + recommendation + confidence + risk_factors + catalysts
- `scoreSentiment(headlines[])` → `[{headline, sentiment, impact}]`
- `getRebalanceSuggestion(portfolioData)` → natural language rebalance advice
- `explainScore(scoreType, data)` → explains why a stock scored X on risk/value/growth/moat

### `alphaVantageClient.js`
- Free tier: 25 req/day — use sparingly
- Functions: `getEarningsCalendar()`, `getCompanyOverview(symbol)`
- Cache 12 hours minimum

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

### `earningsSyncJob.js`
- Queue: earnings-sync
- Runs every 12 hours
- Calls earningsService.syncUpcomingEarnings()
- Stores earnings dates, estimates, and reported values

### `dividendSyncJob.js`
- Queue: dividend-sync
- Runs daily
- Calls dividendService.syncDividendsAndSplits()
- Updates dividend calendar and stock split timeline

### `insiderTradeSyncJob.js`
- Queue: insider-trade-sync
- Runs every market day
- Calls stockService.syncInsiderTrades()
- Stores insider trades and bulk/block deals

### `economicCalendarSyncJob.js`
- Queue: economic-calendar-sync
- Runs daily
- Calls calendarService.syncEconomicEvents()
- Stores RBI, inflation, GDP, repo rate, and other macro events

### `institutionalFlowSyncJob.js`
- Queue: institutional-flow-sync
- Runs daily after market close
- Calls stockService.syncInstitutionalFlows()
- Stores FII/DII buy/sell data

### `notificationDispatchJob.js`
- Queue: notification-dispatch
- Runs every minute
- Processes alerts, earnings reminders, dividend reminders, and watchlist events

---

## Unit Testing (Jest + Supertest)

### Install
```
npm install -D jest supertest @jest/globals
```

### `jest.config.js`
```js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html'],
  setupFiles: ['<rootDir>/tests/setup.js'],
}
```

### `tests/setup.js`
```js
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-32chars-minimum!!'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-32chars-min!!'
process.env.BCRYPT_SALT_ROUNDS = '1'   // Fast hashing in tests only
```

### Test Folder Structure
```
backend/
├── __tests__/
│   ├── unit/
│   │   ├── utils/
│   │   │   ├── tokenHelper.test.js
│   │   │   ├── hashHelper.test.js
│   │   │   ├── queryHelper.test.js
│   │   │   └── responseHelper.test.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.test.js
│   │   │   ├── permissionMiddleware.test.js
│   │   │   ├── validationMiddleware.test.js
│   │   │   └── errorMiddleware.test.js
│   │   └── features/
│   │       ├── auth/
│   │       │   ├── authService.test.js
│   │       │   └── authController.test.js
│   │       ├── stock/
│   │       │   ├── stockService.test.js
│   │       │   └── stockController.test.js
│   │       ├── portfolio/
│   │       │   └── portfolioService.test.js
│   │       └── screener/
│   │           └── screenerService.test.js
│   └── integration/
│       ├── auth.integration.test.js
│       ├── stock.integration.test.js
│       └── portfolio.integration.test.js
└── tests/
    └── setup.js
```

### Tests to Write

**`utils/tokenHelper.test.js`**
- `generateAccessToken(payload)` returns a non-empty JWT string
- `verifyAccessToken(token)` returns decoded payload for valid token
- `verifyAccessToken` throws for expired token
- `verifyAccessToken` throws for invalid signature (wrong secret)
- `generateRefreshToken` + `verifyRefreshToken` — same pattern

**`utils/hashHelper.test.js`**
- `hashPassword(plain)` returns a bcrypt hash (not equal to input)
- `comparePassword(plain, hash)` returns true for matching password
- `comparePassword` returns false for wrong password
- `hashPassword` on same input produces different hash each time (salt)

**`middleware/authMiddleware.test.js`**
- Calls `next()` with `req.user` attached for a valid token
- Throws `AppError(401)` when Authorization header is missing
- Throws `AppError(401)` for malformed token
- Throws `AppError(401)` for expired token

**`middleware/permissionMiddleware.test.js`**
- Mock Redis and Supabase; user with required permission → calls next()
- User without required permission → throws AppError(403)
- Cache hit path is used on second call (Redis mock verifies get called)

**`features/auth/authService.test.js`** (mock authRepository + cacheHelper)
- `register()`: creates user, hashes password, returns tokens + user
- `register()`: throws AppError(409) if email already exists
- `login()`: returns accessToken + refreshToken for valid credentials
- `login()`: throws AppError(401) for wrong password
- `login()`: throws AppError(404) for unknown email
- `sendOtp()`: generates a 6-digit OTP, hashes it, calls repository to save
- `verifyOtp()`: returns true for correct OTP within expiry
- `verifyOtp()`: throws for expired or used OTP

**`features/stock/stockService.test.js`** (mock cacheHelper + yahooFinanceClient + nseClient)
- `getQuote()`: returns from cache when cache hit (no external call)
- `getQuote()`: calls dataProviderManager on cache miss
- `getQuote()`: stores result in cache after fetch
- `getValuation()`: correctly computes PE = price/eps ratio from raw data
- `search(q)`: calls repository with correct ILIKE pattern

**`integration/auth.integration.test.js`** (Supertest against real app, test DB)
- `POST /api/v1/auth/register` → 201 with tokens on valid payload
- `POST /api/v1/auth/register` → 400 on missing required fields
- `POST /api/v1/auth/register` → 409 on duplicate email
- `POST /api/v1/auth/login` → 200 with tokens on valid credentials
- `POST /api/v1/auth/login` → 401 on wrong password
- `POST /api/v1/auth/login` → 429 after 5 rapid attempts (rate limiter)
- `GET /api/v1/auth/me` → 200 with user data when valid token provided
- `GET /api/v1/auth/me` → 401 when no token
- `POST /api/v1/auth/refresh-token` → 200 with new accessToken on valid refresh token

**`integration/stock.integration.test.js`**
- `GET /api/v1/stocks/indices/live` → 200 (public, no auth needed)
- `GET /api/v1/stocks/search?q=REL` → 401 without token
- `GET /api/v1/stocks/search?q=REL` → 200 with valid token
- `GET /api/v1/stocks/RELIANCE/quote` → 200 with valid token, correct shape

---

## Naming Convention
- Files: `camelCase` — `authService.js`, `stockRepository.js`
- Feature prefix: `<featureName>Apis.js`, `<featureName>Controller.js`, `<featureName>Service.js`, `<featureName>Repository.js`
- Routes: kebab-case — `/api/v1/mutual-funds`, `/api/v1/stock-screener`
- DB columns: snake_case
- JS variables/functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Classes: PascalCase
