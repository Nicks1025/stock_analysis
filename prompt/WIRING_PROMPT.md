# StockSense AI — Frontend ↔ Backend Wiring Prompt

## Purpose
This document defines every contract point between the React frontend and the Node.js backend. Follow this when wiring them together. No frontend component should hardcode URLs or call external APIs directly.

---

## API Base URL Configuration

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000
```

### `services/apiClient.js` (Frontend)
```js
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// Attach token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 → refresh
let isRefreshing = false
let failedQueue = []

apiClient.interceptors.response.use(
  (res) => res.data,    // ← unwrap so services get data directly
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        ).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return apiClient(original)
        })
      }
      isRefreshing = true
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, { refreshToken })
        const { accessToken, refreshToken: newRefreshToken } = res.data.data

        useAuthStore.getState().updateTokens(
          accessToken,
          newRefreshToken || refreshToken
        ) 
        const newToken = accessToken
        failedQueue.forEach(p => p.resolve(newToken))
        failedQueue = []
        original.headers.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      } catch {
        failedQueue.forEach(p => p.reject())
        useAuthStore.getState().logout()
        window.location.href = '/login'
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error.response?.data || error)
  }
)

export default apiClient
```
---

## Services Pattern
```
All frontend API communication must go through service files.

Rules:

- No component/page should call axios directly
- No component/page should hardcode API URLs
- All service files export async functions only
- Services use apiClient only

Example:

```js
import apiClient from './apiClient'

export const getQuote = (symbol) =>
  apiClient.get(`/stocks/${symbol}/quote`)

export const getHistory = (symbol, params) =>
  apiClient.get(`/stocks/${symbol}/history`, { params })

export const getValuation = (symbol) =>
  apiClient.get(`/stocks/${symbol}/valuation`)
```
---

---

## Backend Route Mapping

Every service file must map to a backend route module.

Structure:

backend/
├── routes/
│   ├── auth.routes.js
│   ├── stock.routes.js
│   ├── screener.routes.js
│   ├── portfolio.routes.js
│   ├── watchlist.routes.js
│   ├── alert.routes.js
│   ├── news.routes.js
│   ├── mutualFund.routes.js
│   ├── goal.routes.js
│   ├── tax.routes.js
│   ├── notification.routes.js
│   ├── admin.routes.js
│   ├── calendar.routes.js

Frontend Service → Backend Feature Mapping

dividendService.js     → features/dividend
goalService.js         → features/goals
comparisonService.js   → features/comparison
notificationService.js → features/notification
roleService.js         → features/role
permissionService.js   → features/permission

Mapping:

authService.js → /auth
stockService.js → /stocks
screenerService.js → /screener
portfolioService.js → /portfolio
watchlistService.js → /watchlists
alertService.js → /alerts
newsService.js → /news
mutualFundService.js → /mutual-funds
goalService.js → /goals
taxService.js → /portfolio/tax-report
notificationService.js → /notifications
adminService.js → /admin
calendarService.js → /calendar


### Additional service files:

- stockService.js
```
stockService.getDividends(symbol)
stockService.getShareholding(symbol)
stockService.getEarnings(symbol)
```
- calendarService.js
- ipoService.js
- comparisonService.js
- goalService.js
- taxService.js
- notificationService.js
- adminService.js
- alertService.js

## Auth Flow Wiring

### Register
- **Frontend:** `pages/Register/index.jsx` → form submit → `authService.register(payload)`
- **Service:** `POST /auth/register` with `{ name, email, password, phone, country_code }`
- **Response:** `{ success: true, data: { accessToken, refreshToken, user } }`
- **On success:** store tokens in `authStore`, redirect to `/dashboard`
- **OTP step:** after register response → show OTP modal → `authService.verifyOtp({ userId, otp, type: 'email_verify' })`

### Login
- **Frontend:** `pages/Login/index.jsx` → `authService.login({ email, password })`
- **Endpoint:** `POST /auth/login`
- **Response:** `{ data: { accessToken, refreshToken, user: { id, name, email, avatar } } }`
- **On 429:** show "Too many attempts" with retry-after from header

### Google Login
- **Frontend:** On Google button click → `window.google.accounts.id.initialize(...)` → get `credential` (idToken)
- **Service:** `authService.googleLogin({ idToken: credential })`
- **Endpoint:** `POST /auth/google`
- **Backend:** verify with `google-auth-library` → find/create user → return same tokens

### Token Refresh
- **Triggered:** automatically by `apiClient` interceptor on 401
- **Service:** `POST /auth/refresh-token` with `{ refreshToken }`
- **Response:** `{ data: { accessToken } }`
- **Store update:** `authStore.updateTokens(newAccessToken)`

### Logout
- **Frontend:** user clicks logout → `authService.logout()` → `POST /auth/logout`
- **Backend:** delete refresh token from DB
- **Frontend:** clear authStore + localStorage → redirect to `/login`

---

---

## State Management Contracts

Frontend state ownership:

authStore
- accessToken
- refreshToken
- user
- login()
- logout()
- updateTokens()

screenerStore
- filters
- pagination
- sorting
- search
- resetFilters()

portfolioStore
- holdings
- transactions
- performanceSummary

watchlistStore
- watchlists
- selectedWatchlist
- notes
- tags

notificationStore
- unreadCount
- notifications

Rule:
Pages should consume store actions.
Stores call services.
Services call apiClient.

## Stock Data Wiring

### Global Search (Topbar)
- `STextField` with `debounce={400}` and `onSearch`
- `onSearch` calls `stockService.searchStocks(query)` → `GET /stocks/search?q=`
- Result: dropdown list of `{ symbol, company_name, logo_url }`
- On select: navigate to `/stocks/${symbol}`

### Live Indices (Home page)
- `useEffect` on mount → `stockService.getLiveIndices()` → `GET /stocks/indices/live`
- `setInterval(fetch, 30000)` — poll every 30s
- `clearInterval` on unmount
- Response: `[{ name, symbol, value, change, changePercent }]`

### Stock Detail Page (`/stocks/:symbol`)
- On mount, call all in parallel via `Promise.all([])`:
  - `stockService.getQuote(symbol)` → `GET /stocks/:symbol/quote`
  - `stockService.getValuation(symbol)` → `GET /stocks/:symbol/valuation`
  - `stockService.getFinancials(symbol)` → `GET /stocks/:symbol/financials`
  - `stockService.getStockNews(symbol, { page:1, limit:10 })` → `GET /stocks/:symbol/news`
  - `stockService.getPeers(symbol)` → `GET /stocks/:symbol/peers`
  - `stockService.getAiAnalysis(symbol)` → `GET /stocks/:symbol/analysis`
  - `stockService.getShareholding(symbol)`
  - `stockService.getDividends(symbol)`
  - `stockService.getSplits(symbol)`
  - `stockService.getCatalysts(symbol)`
  - `stockService.getFreshness(symbol)`
  - `stockService.getBulkDeals(symbol)`
  - `stockService.getEarnings(symbol)`
  - `stockService.get52WeekRange(symbol)`
  - `stockService.getInsiderActivity(symbol)`

### Price Chart
- On timeframe button click → `stockService.getHistory(symbol, { period, interval })`
- `GET /stocks/:symbol/history?period=1mo&interval=1d`
- Response: `[{ date, open, high, low, close, volume }]`
- Render with Recharts `<ComposedChart>` (line + volume bar)

---

## Screener Wiring

### `pages/StockScreener/index.jsx`
- Filter state managed in `screenerStore` (Zustand)
- On filter change OR sort change OR search → call `screenerService.screen(filters, pagination, sort, search)`
- `POST /screener` with body:
  ```json
  {
    "filters": { "pe_max": 30, "roe_min": 15, "sector": "IT", "stock_type": ["dividend"] },
    "pagination": { "page": 1, "limit": 10 },
    "sort": { "key": "market_cap_cr", "order": "DESC" },
    "search": "reliance"
  }
  ```
- `SDataTable` `onSort` → update sort state → trigger new fetch
- `SDataTable` `onSearch` → debounced 400ms → update search state → trigger new fetch
- `SDataTable` `onPaginationChange` → update page/limit → trigger new fetch

---

## Portfolio Wiring

### Holdings Table
- `portfolioService.getHoldings({ page, limit, sort, search })` → `GET /portfolio/holdings`
- Response includes live P&L (backend fetches current price from Redis cache)
- `SDataTable` with columns: Symbol | Company | Qty | Avg Price | Current Price | P&L | P&L%

### Add Transaction (Buy/Sell)
- Modal with `STextField`, `SDatePicker`, `SDropdown` (type: BUY/SELL)
- Submit → `portfolioService.addTransaction(data)` → `POST /portfolio/transactions`
- Backend recomputes `portfolio_holdings` (avg price, qty) after each transaction

### Rebalance Suggestion
- `portfolioService.getRebalanceSuggestion()` → `GET /portfolio/rebalance`
- Backend calls Gemini with holdings + fundamentals context
- Response: `{ suggestions: [{ type: 'sell'|'buy'|'hold', symbol, reason, target_allocation_pct }] }`

---

## News Wiring

### News Page
- `newsService.getNews(filters, pagination)` → `GET /news`
- Query params: `?sector=IT&sentiment=positive&from=2024-01-01&search=highway&page=1&limit=20`
- `SDataTable` with: Headline | Source | Sentiment (chip) | Impact | Date | Related Stocks

### Stock-level News
- On StockDetail page, news section calls `GET /stocks/:symbol/news?page=1&limit=5`
- Shows latest 5 news with "View All" link to `/news?symbol=RELIANCE`

---

## Mutual Fund Wiring

### Explore Funds
- `mutualFundService.explore(filters, pagination)` → `GET /mutual-funds`
- Filters: category, risk_level, amc, min_returns_1y
- `SDataTable` columns: Fund Name | Category | Risk | Nav | Returns 1Y/3Y/5Y | AUM | Expense Ratio

### My Investments
- `mutualFundService.getMyInvestments()` → `GET /mutual-funds/investments`
- Response: invested amount, current value, XIRR, units, current NAV

---

## Shared Components Contract

Reusable UI components:

components/
├── SDataTable
├── STextField
├── SModal
├── SCard
├── SChart
├── SChip
├── SButton
├── SLoader
├── SEmptyState

Rules:

SDataTable
- handles pagination
- handles sorting
- handles debounced search

STextField
- supports debounce
- supports validation

SChart
- accepts API-ready formatted data only

SEmptyState
- used for empty API responses

SLoader
- used for all pending API states

---

## Pages Wiring Contracts

### Dashboard

- `stockService.getTopGainers()` → `GET /stocks/movers/gainers`
- `stockService.getTopLosers()` → `GET /stocks/movers/losers`
- `stockService.getLiveIndices()` → `GET /stocks/indices/live`
- `stockService.getFiiDiiActivity()` → `GET /market/fii-dii`
- `calendarService.getEconomicPreview()` → `GET /calendar/economic?limit=5`
- `notificationService.getPreview()` → `GET /notifications?limit=5`

---

### Economic Calendar

- `calendarService.getEconomicEvents(filters)` → `GET /calendar/economic`
- Filters:
  - date
  - impact
  - country
- Response:
  `{ event_name, impact, actual, forecast, previous, event_time, affected_sectors }`

---

### Dividend Calendar

- `dividendService.getCalendar(filters)` → `GET /stocks/dividends/calendar`
- Filters:
  - month
  - year
  - symbol
- Sort:
  - ex-date
  - yield

---

### Earnings Calendar

- `earningsService.getCalendar(filters)` → `GET /stocks/earnings/calendar`
- Filters:
  - sector
  - date
- Response:
  `{ symbol, expected_eps, previous_eps, earnings_date, surprise_pct }`

---

### IPOs

- `ipoService.getUpcoming()` → `GET /stocks/ipo/upcoming`

---

### Compare Stocks

- `comparisonService.compare(symbols)` → `POST /stocks/compare`
- Body:
  `{ symbols: ['RELIANCE', 'TCS', 'INFY'] }`

---

### Goals

- `goalService.getGoals()` → `GET /goals`
- `goalService.createGoal(payload)` → `POST /goals`
- `goalService.updateGoal(id, payload)` → `PATCH /goals/:id`

---

### Tax Reports

- `taxService.getSummary(year)` → `GET /portfolio/tax-report?year=2026`
- `taxService.downloadReport(year)` → `GET /portfolio/tax-report/download?year=2026`

---

### Alerts

- `alertService.getAlerts()` → `GET /alerts`
- `alertService.createAlert(payload)` → `POST /alerts`
- `alertService.deleteAlert(id)` → `DELETE /alerts/:id`

---

### Saved Screeners

- `screenerService.getSaved()` → `GET /screener/saved`
- `screenerService.save(payload)` → `POST /screener/saved`
- `screenerService.delete(id)` → `DELETE /screener/saved/:id`

---

### Admin

- `adminService.getUsers()` → `GET /admin/users`
- `adminService.getSystemHealth()` → `GET /admin/system-health`
- `adminService.getLogs()` → `GET /admin/logs`
- `adminService.getSyncStatus()` → `GET /admin/sync-status`
---

## Watchlist Wiring

- On load: `watchlistService.getAll()` → `GET /watchlists` → returns all watchlists with items + live prices
- Add stock to watchlist: `POST /watchlists/:id/stocks` with `{ stock_id }`

### Watchlist Notes
- `watchlistService.addNote(id, payload)` → `POST /watchlists/:id/notes`
- `watchlistService.getNotes(id)` → `GET /watchlists/:id/notes`

Payload:
```json
{ "stock_id": "uuid", "note": "Buy below 500" }
```

### Watchlist Tags

- `watchlistService.addTag(id, payload)` → `POST /watchlists/:id/tags`
- `watchlistService.getTags(id)` → `GET /watchlists/:id/tags`

Payload:
```json
{ "stock_id": "uuid", "tag": "undervalued" }
```
- Live prices: poll `GET /stocks/:symbol/quote` every 60s for watchlist symbols

---

## Market Status Wiring

- `stockService.getMarketStatus()` → `GET /market/status`
- Call on `MainLayout` mount and every 60 seconds → update a shared marketStatus in stockStore
- Show status chip in topbar: green "Market Open" / red "Market Closed" / yellow "Pre-Market"
- Response: `{ isOpen: bool, session: 'pre-market'|'normal'|'post-market'|'closed', nextOpen: ISO, nextClose: ISO, holidays: [] }`

---

## FII/DII Activity Wiring

- `stockService.getFiiDiiActivity()` → `GET /market/fii-dii`
- Called once on Dashboard page mount
- Response: `{ date, fii_buy_cr, fii_sell_cr, fii_net_cr, dii_buy_cr, dii_sell_cr, dii_net_cr }`
- `stockService.getFiiDiiHistory(days=30)` → `GET /market/fii-dii/history?days=30`
- Response: array of daily rows for trend chart on Dashboard

---

## Recently Viewed Wiring

- On every `StockDetail` page mount → fire and forget: `stockService.markViewed(symbol)` → `POST /stocks/:symbol/viewed`
- Dashboard sidebar / topbar recent section → `stockService.getRecentlyViewed()` → `GET /stocks/recently-viewed`
- Response: `[{ symbol, company_name, logo_url, viewed_at }]` (last 10)

---

## Dividend Income Wiring (Portfolio Page)

- Dividend Income tab in Portfolio page → `portfolioService.getDividendIncome(year)` → `GET /portfolio/dividend-income?year=2026`
- Response: `{ total_income_cr, paid_cr, pending_cr, chart: [{ month, amount }], projected_annual_cr }`

---

## SIP & DRIP Calculator Wiring

- Goals page SIP suggestion → `calculatorService.computeSip(payload)` → `POST /calculator/sip`
- Body: `{ target_corpus, years, expected_cagr, inflation_rate }`
- Response: `{ monthly_sip, total_invested, total_corpus, inflation_adjusted_corpus, year_by_year: [{year, corpus}] }`
- DRIP planner → `calculatorService.computeDrip(payload)` → `POST /calculator/drip`
- Body: `{ symbol, shares, years }`
- Response: `{ initial_investment, final_corpus, projected_passive_income, year_by_year: [] }`

---

## Notification Preferences Wiring

- Settings page Notifications tab → on load: `notificationService.getPreferences()` → `GET /notifications/preferences`
- On save: `notificationService.updatePreferences(payload)` → `PATCH /notifications/preferences`
- Body: `{ email_enabled, push_enabled, price_alerts, earnings_alerts, dividend_alerts, news_alerts, insider_alerts }`

---

## Comparison Wiring

- CompareStocks page: multi-symbol input → user adds up to 5 symbols
- On each symbol add/remove → `comparisonService.compare(symbols)` → `POST /compare`
- Body: `{ symbols: ['RELIANCE', 'TCS', 'INFY'] }`
- Response: `{ stocks: [{ symbol, company_name, valuation{}, profitability{}, growth{}, debt{}, dividends{} }] }`
- Render side-by-side table; best value in each row highlighted green

---

## Admin Wiring

- `adminService.getUsers(pagination, search)` → `GET /admin/users`
- `adminService.getSystemHealth()` → `GET /admin/system-health`
  - Response: `{ redis: { status, latency_ms }, db: { status, latency_ms }, providers: [{ name, status, last_success, latency_ms }], jobs: [{ name, last_run, next_run, status }] }`
- `adminService.getSyncStatus()` → `GET /admin/sync-status`
  - Response: `[{ job_name, last_run_at, next_run_at, success_count, fail_count, last_error }]`
- `adminService.getLogs(filters)` → `GET /admin/audit-logs`
- `adminService.getFailedJobs()` → `GET /admin/failed-jobs`
- `adminService.retryJob(id)` → `POST /admin/retry-job/:id`

## Error Handling (Frontend)

Every service call is wrapped in try/catch in the calling component/store action:

```js
try {
  const data = await stockService.getQuote(symbol)
  setQuote(data)
} catch (err) {
  // err is { success: false, error: { code, message } } from backend
  enqueueSnackbar(err.error?.message || 'Something went wrong', { variant: 'error' })
}
```

For 401 errors — handled silently by apiClient interceptor (refresh or logout).
For 429 errors — show specific "rate limit" message.
For 422/400 validation errors — show field-level errors if applicable.

---

## Real-Time Data Strategy

Since WebSockets are not implemented in free tier, use polling. All polling uses `setInterval` started on component mount and cleared in `useEffect` cleanup (store ref in `useRef`).

| Feature | Poll Interval | Where | Service Call |
|---------|--------------|-------|-------------|
| Live Indices | 30s | Home page | `stockService.getLiveIndices()` |
| Market Status | 60s | MainLayout (always) | `stockService.getMarketStatus()` |
| Stock Quote | 60s | StockDetail page | `stockService.getQuote(symbol)` |
| Watchlist Prices | 60s | Watchlist page | `stockService.getQuote()` per symbol (batched) |
| Portfolio P&L | 2min | Portfolio page | `portfolioService.getSummary()` |
| Notification Count | 2min | MainLayout (always) | `notificationService.getAll({ limit:1 })` → use `pagination.total` as unread count |
| FII/DII Data | Once on mount | Dashboard | `stockService.getFiiDiiActivity()` |
| Alert Check | Server-side only | — | Bull job every 60s, no frontend polling |

**SSE Upgrade Path (optional future enhancement):**
Replace polling with Server-Sent Events for real-time without WebSocket overhead:
```js
// Backend: GET /stream/quotes?symbols=RELIANCE,TCS
// Frontend:
const es = new EventSource(`${API_BASE}/stream/quotes?symbols=${symbols.join(',')}`, { withCredentials: true })
es.onmessage = (e) => stockStore.getState().setQuote(JSON.parse(e.data))
// Close on unmount: es.close()
```

---

## Environment Variables Checklist

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```

### Backend `.env`
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
REDIS_URL=redis://localhost:6379
JWT_SECRET=<32-char-random>
JWT_REFRESH_SECRET=<32-char-random>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@stocksense.ai
GOOGLE_CLIENT_ID=<same as frontend>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
ALPHA_VANTAGE_KEY=<from alphavantage.co free>
NEWS_API_KEY=<from newsapi.org free>
GEMINI_API_KEY=<from ai.google.dev free>
FINNHUB_API_KEY=<from finnhub.io free>
TWELVE_DATA_API_KEY=<from twelvedata.com free>
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

---

## CORS Configuration (Backend)

```js
// config/cors.js
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
```

---

## Free API Limits & Mitigation

| API | Free Limit | Priority | Strategy |
|-----|-----------|----------|----------|
| NSE India (unofficial) | No official limit | 1st — real-time | Manage cookies in Redis, cache 30s–60s, respect rate |
| yahoo-finance2 | Unofficial, no key | 2nd — ~15min delay | Cache aggressively, 60s quotes, 5min history |
| Finnhub.io | 60 req/min free | 3rd — fallback | Used only when NSE + Yahoo both fail |
| Twelve Data | 800 req/day free | 4th — last resort | Reserved for history gaps, cache 5min |
| NewsAPI.org | 1000 req/day free | Primary news | Cache 5min, batch by job |
| Google News RSS | Unlimited free | Secondary news | Deduplicate with NewsAPI by URL hash |
| mfapi.in | Unlimited free | MF data | Cache 1hr |
| Gemini Flash API | 15 RPM, 1M tokens/day | AI analysis | Cache 24hr per stock, batch sentiment |
| Alpha Vantage | 25 req/day free | Earnings fallback | Cache 12hr |
| FRED API | Unlimited free | US economic events | Cache 6hr |
| RBI RSS | Unlimited free | India economic events | Cache 6hr |

---

## Deployment Notes

- Frontend: Vercel or Netlify (set `VITE_API_BASE_URL` to production backend URL)
- Backend: Railway.app or Render.com free tier (set all env vars)
- Redis: Upstash Redis free tier (replace `REDIS_URL`)
- Database: Supabase free tier (500MB, plenty for initial launch)
- Bull jobs: run in same Node.js process on backend server
