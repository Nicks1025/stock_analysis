# StockSense AI — Frontend Build Prompt (React + Vite)

## Overview
Build a comprehensive AI-powered Stock Analysis Platform called **StockSense AI**. This is a production-grade React application. All data is fetched from the backend — no mock data anywhere. The app targets Indian retail investors and displays live market data, news-driven insights, mutual fund analysis, and portfolio management.

---

## Tech Stack
- **Framework:** React 18 + Vite
- **Language:** JavaScript (JSX)
- **State Management:** Zustand
- **Routing:** React Router v6 (file/page-based structure)
- **UI Library:** Material UI (MUI) v5
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Validation:** Yup (integrated via React Hook Form)
- **Charts:** Recharts
- **Date Handling:** Day.js
- **Notifications:** notistack (MUI Snackbar wrapper)

---

## File & Folder Structure

```
src/
├── pages/
│   ├── Home/
│   │   └── index.jsx
│   ├── Login/
│   │   └── index.jsx
│   ├── Register/
│   │   └── index.jsx
│   ├── Dashboard/
│   │   └── index.jsx
│   ├── StockDetail/
│   │   └── index.jsx
│   ├── StockScreener/
│   │   └── index.jsx
│   ├── Portfolio/
│   │   └── index.jsx
│   ├── MutualFunds/
│   │   └── index.jsx
│   ├── News/
│   │   └── index.jsx
│   ├── Watchlist/
│   │   └── index.jsx
│   └── Settings/
│       └── index.jsx
│
├── components/
│   ├── common/
│   │   ├── STextField/
│   │   │   └── index.jsx
│   │   ├── SDataTable/
│   │   │   └── index.jsx
│   │   ├── SDropdown/
│   │   │   └── index.jsx
│   │   ├── SDatePicker/
│   │   │   └── index.jsx
│   │   ├── SPhoneNumber/
│   │   │   └── index.jsx
│   │   ├── SButton/
│   │   │   └── index.jsx
│   │   ├── SModal/
│   │   │   └── index.jsx
│   │   ├── SCard/
│   │   │   └── index.jsx
│   │   ├── SBadge/
│   │   │   └── index.jsx
│   │   ├── SChip/
│   │   │   └── index.jsx
│   │   ├── SLoader/
│   │   │   └── index.jsx
│   │   ├── STooltip/
│   │   │   └── index.jsx
│   │   ├── SAlert/
│   │   │   └── index.jsx
│   │   └── SPageHeader/
│   │       └── index.jsx
│   │
│   ├── Home/
│   │   ├── MarketIndexTicker.jsx
│   │   ├── IndexCard.jsx
│   │   ├── TopGainersLosers.jsx
│   │   └── MarketSentimentBar.jsx
│   │
│   ├── StockDetail/
│   │   ├── StockHeader.jsx
│   │   ├── PriceChart.jsx
│   │   ├── ValuationMetrics.jsx
│   │   ├── FinancialRatios.jsx
│   │   ├── QualitativeAnalysis.jsx
│   │   ├── NewsFeed.jsx
│   │   ├── TenderInfo.jsx
│   │   └── PeerComparison.jsx
│   │
│   ├── StockScreener/
│   │   ├── ScreenerFilters.jsx
│   │   └── ScreenerResults.jsx
│   │
│   ├── Portfolio/
│   │   ├── PortfolioSummary.jsx
│   │   ├── HoldingsTable.jsx
│   │   ├── RebalanceSuggestion.jsx
│   │   └── SectorAllocation.jsx
│   │
│   ├── MutualFunds/
│   │   ├── MFSummary.jsx
│   │   ├── MFHoldings.jsx
│   │   └── MFRebalanceSuggestion.jsx
│   │
│   └── News/
│       ├── NewsCard.jsx
│       └── NewsFilter.jsx
│
├── store/
│   ├── authStore.js
│   ├── stockStore.js
│   ├── portfolioStore.js
│   ├── mutualFundStore.js
│   ├── watchlistStore.js
│   └── newsStore.js
│
├── services/
│   ├── apiClient.js          ← Axios instance, base URL, interceptors
│   ├── authService.js
│   ├── stockService.js
│   ├── portfolioService.js
│   ├── mutualFundService.js
│   ├── newsService.js
│   ├── watchlistService.js
│   └── screenerService.js
│
├── utils/
│   ├── rules.js              ← All reusable validation rules
│   ├── formatters.js         ← Currency, percentage, number formatters
│   ├── constants.js          ← App-wide constants
│   └── debounce.js
│
├── routes/
│   └── AppRouter.jsx         ← All route definitions with auth guards
│
├── layouts/
│   ├── MainLayout.jsx        ← Sidebar + Topbar for authenticated pages
│   └── AuthLayout.jsx        ← Centered card layout for login/register
│
├── theme/
│   └── index.js              ← MUI theme customization
│
└── main.jsx
```

---

## Routing (AppRouter.jsx)

- Public routes: `/`, `/login`, `/register`
- Protected routes (require valid JWT in authStore): `/dashboard`, `/stocks/:symbol`, `/screener`, `/portfolio`, `/mutual-funds`, `/news`, `/watchlist`, `/settings`
- Auth guard: if no token in store → redirect to `/login`
- After login → redirect to `/dashboard`
- 404 → redirect to `/`

---

## API Client (`services/apiClient.js`)

```js
// Axios instance — single place for base URL and interceptors
// Base URL comes from environment variable: import.meta.env.VITE_API_BASE_URL
// Request interceptor: attach Authorization: Bearer <accessToken> from authStore
// Response interceptor: 
//   - on 401 → attempt token refresh via POST /auth/refresh-token
//   - if refresh fails → clear store, redirect to /login
//   - on other errors → forward to calling service
// No service file should ever import axios directly — always use apiClient
```

---

## Services Pattern

Every service file exports plain async functions. No JSX. Example pattern:

```js
// services/stockService.js
import apiClient from './apiClient'

export const getStockQuote = (symbol) => apiClient.get(`/stocks/${symbol}/quote`)
export const getStockNews = (symbol, params) => apiClient.get(`/stocks/${symbol}/news`, { params })
export const searchStocks = (query) => apiClient.get(`/stocks/search`, { params: { q: query } })
export const getValuationMetrics = (symbol) => apiClient.get(`/stocks/${symbol}/valuation`)
export const getFinancials = (symbol) => apiClient.get(`/stocks/${symbol}/financials`)
export const getScreenerResults = (filters, pagination) => apiClient.post(`/screener`, { filters, pagination })
```

No component or page file should call apiClient or axios directly.

---

## Validation Rules (`utils/rules.js`)

Export an object with all reusable rules. Every rule is a function returning either `true` or an error string:

```js
export const rules = {
  required: (label = 'Field') => (v) => !!v || `${label} is required`,
  email: () => (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email',
  minLength: (n) => (v) => (v && v.length >= n) || `Minimum ${n} characters required`,
  maxLength: (n) => (v) => (v && v.length <= n) || `Maximum ${n} characters allowed`,
  numeric: () => (v) => /^\d+$/.test(v) || 'Only numbers allowed',
  positiveNumber: () => (v) => (parseFloat(v) > 0) || 'Must be a positive number',
  phone: () => (v) => /^\+?[\d\s\-()]{7,15}$/.test(v) || 'Enter a valid phone number',
  password: () => (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v) || 'Password must be 8+ chars with upper, lower, number & special char',
  confirmPassword: (pwd) => (v) => v === pwd || 'Passwords do not match',
  url: () => (v) => /^https?:\/\/.+/.test(v) || 'Enter a valid URL',
  panCard: () => (v) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v) || 'Enter a valid PAN',
  pinCode: () => (v) => /^\d{6}$/.test(v) || 'Enter a valid 6-digit PIN code',
}
```

---

## Reusable Components (Common)

### `STextField` (`components/common/STextField/index.jsx`)
Props:
- `label` (string)
- `size` — `'small' | 'x-small' | 'large' | 'x-large'` (maps to MUI sizes)
- `rules` — array of rule functions from `rules.js`
- `required` — boolean; if true, show red asterisk and apply required validation
- `debounce` — number (ms); if provided, onChange fires with debounce via `utils/debounce.js`
- `onSearch` — callback for debounced API search
- `color` — MUI color attribute
- `...rest` — all standard MUI TextField props forwarded

Behaviour:
- Integrates with React Hook Form via `Controller`
- Shows validation error below the field
- Red asterisk on label if `required`
- Debounced `onSearch` fires `debounce` ms after last keystroke

---

### `SDataTable` (`components/common/SDataTable/index.jsx`)
Props:
- `headers` — array of `{ key, label, sort: bool, width? }`
- `data` — array of row objects
- `loading` — boolean
- `totalCount` — number (from backend)
- `pagination` — `{ page, limit }` (controlled)
- `onPaginationChange` — `(page, limit) => void`
- `onSort` — `(sortKey, sortOrder) => void` — fires API call in parent
- `onSearch` — `(searchText) => void` — backend search, debounced internally
- `searchPlaceholder` — string
- `rowActions` — array of `{ label, icon, onClick(row) }` (shown in last column)

Behaviour:
- Search bar at top right, debounced 400ms, triggers `onSearch`
- Sort icon in headers where `sort: true`; clicking cycles ASC → DESC → none
- Pagination at bottom right: rows per page selector (10, 20, 50, 100), prev/next
- Empty state with icon when no data
- Skeleton rows when `loading: true`

---

### `SDropdown` (`components/common/SDropdown/index.jsx`)
Props:
- `label`, `options` — `[{ value, label }]`, `multiple`, `rules`, `required`, `size`, `...rest`
- Wraps MUI Select with same validation integration as STextField

---

### `SDatePicker` (`components/common/SDatePicker/index.jsx`)
Props:
- `label`, `rules`, `required`, `minDate`, `maxDate`, `format` (default `DD/MM/YYYY`), `...rest`
- Uses MUI DatePicker from `@mui/x-date-pickers` with Day.js adapter
- Custom styled calendar popup — clean, card-style, no default MUI paper look
- Mobile-friendly touch support

---

### `SPhoneNumber` (`components/common/SPhoneNumber/index.jsx`)
Props:
- `label`, `countries` — array of `{ code, dial_code, flag, name }`, `rules`, `required`, `...rest`
- Left: flag + dial code dropdown; Right: number input
- Auto-validates number length based on selected country
- Default countries list includes IN, US, GB, AE, SG, CA — full list passable via prop

---

### `SButton` — wraps MUI Button; props: `label`, `variant`, `color`, `loading` (shows spinner), `size`, `...rest`

### `SModal` — wraps MUI Dialog; props: `open`, `onClose`, `title`, `maxWidth`, `children`, `actions`

### `SCard` — wraps MUI Card; props: `title`, `subtitle`, `action`, `children`, `elevation`, `noPadding`

### `SBadge` — wraps MUI Badge; props: `color`, `content`, `children`

### `SChip` — wraps MUI Chip; props: `label`, `color`, `variant`, `onDelete`, `icon`

### `SLoader` — fullscreen or inline spinner; props: `fullscreen`, `size`

### `STooltip` — wraps MUI Tooltip; props: `title`, `placement`, `children`

### `SAlert` — wraps MUI Alert; props: `severity`, `message`, `onClose`

### `SPageHeader` — page title bar; props: `title`, `subtitle`, `breadcrumbs: [{label, path}]`, `actions` (right-side buttons)

---

## Store (Zustand)

### `authStore.js`
```js
// State: accessToken, refreshToken, user (id, name, email, avatar), isAuthenticated
// Actions: login(tokens, user), logout(), updateTokens(accessToken)
// Persist: accessToken and refreshToken in localStorage via zustand/middleware/persist
```

### `stockStore.js`
```js
// State: quotes{}, selectedStock{}, news[], searchResults[], liveIndices[]
// Actions: setQuote(symbol, data), setSelectedStock(data), setNews(data), setIndices(data)
```

### `portfolioStore.js`
```js
// State: holdings[], summary{}, rebalanceSuggestions[]
// Actions: setHoldings, setSummary, setRebalanceSuggestions
```

### `mutualFundStore.js`, `watchlistStore.js`, `newsStore.js` — follow same pattern

---

## Pages

### `pages/Home/index.jsx`
- Title: "Market Overview"
- No auth required
- Registers: stockStore
- Renders: `<MarketIndexTicker />` (live scrolling ticker), `<IndexCard />` (NIFTY 50, SENSEX, NIFTY BANK, NIFTY IT), `<TopGainersLosers />`, `<MarketSentimentBar />`
- Data polling: indices refresh every 15 seconds via `setInterval` cleared on unmount

### `pages/Login/index.jsx`
- Title: "Login — StockSense AI"
- AuthLayout
- Fields: Email (STextField + email rule), Password (STextField + password rule)
- Google OAuth button (calls `/auth/google`)
- On success: store tokens, redirect to `/dashboard`
- Rate limiting feedback: show "Too many attempts. Try again in X seconds" on 429

### `pages/Register/index.jsx`
- Title: "Create Account"
- Fields: Full Name, Email, Password, Confirm Password, Phone (SPhoneNumber), PAN (optional, STextField + panCard rule)
- OTP step after submit: STextField for 6-digit OTP + resend timer

### `pages/Dashboard/index.jsx`
- Auth required
- Registers: stockStore, portfolioStore, watchlistStore
- Renders: portfolio summary card, watchlist quick view, top news, market movers, sector heatmap

### `pages/StockDetail/index.jsx`
- Auth required
- Route param: `:symbol`
- Renders: StockHeader, PriceChart (with timeframe buttons 1D/1W/1M/3M/6M/1Y/5Y), ValuationMetrics, FinancialRatios, QualitativeAnalysis (AI-generated summary from backend), NewsFeed (backend news for this symbol), TenderInfo, PeerComparison

### `pages/StockScreener/index.jsx`
- Auth required
- Left panel: ScreenerFilters (industry, sector, dividend yield range, PE range, debt-to-equity range, ROE min, market cap range, stock type: commodity/growth/dividend/value)
- Right: SDataTable with screener results, sortable, backend search

### `pages/Portfolio/index.jsx`
- Auth required
- Tabs: Holdings | Performance | Rebalance
- Holdings tab: SDataTable of all holdings (symbol, qty, avg price, current price, P&L, P&L%)
- Performance tab: Recharts line chart of portfolio value over time
- Rebalance tab: AI-generated rebalance suggestions from backend

### `pages/MutualFunds/index.jsx`
- Auth required
- Tabs: My Investments | Explore | Rebalance
- My Investments: table of current MF holdings, XIRR, current value
- Explore: SDataTable with filters (category, risk, fund house, returns 1Y/3Y/5Y)
- Rebalance: AI suggestions to shift allocation

### `pages/News/index.jsx`
- Auth required
- NewsFilter (by sector, company, date range, sentiment: positive/negative/neutral)
- NewsCard grid (headline, source, sentiment badge, impact-score, related stocks)

### `pages/Watchlist/index.jsx`
- Auth required
- Manage watchlists, add/remove stocks, live price updates, alerts configuration

### `pages/Settings/index.jsx`
- Tabs: Profile | Security | Notifications | API Keys (user can connect broker)

---

## Layouts

### `MainLayout.jsx`
- Left sidebar (collapsible): navigation items with icons
- Top bar: search (global stock search via STextField debounced), notification bell, user avatar menu
- Right: main content area

### `AuthLayout.jsx`
- Centered card, logo top, no sidebar

---

## Theme (`theme/index.js`)
- Dark mode default, toggle available
- Primary: `#1565C0` (deep blue)
- Secondary: `#00C853` (market green)
- Error: `#D32F2F`
- Background: `#0A0E17` (dark), `#F5F7FA` (light)
- Font: `Inter` (import from Google Fonts in index.html)
- Custom MUI component overrides for SDataTable row hover, card borders, chip colours

---

## Additional Features to Include

1. **Global Stock Search** in topbar — debounced STextField calling `/stocks/search?q=`, shows dropdown autocomplete with symbol + name
2. **Alert System** — user can set price alerts on stocks; bell icon shows count; alerts page under watchlist
3. **Sentiment Badge** on news cards — colour-coded (green/red/grey) based on backend NLP sentiment score
4. **Sector Heatmap** on dashboard — grid of sectors coloured by day's performance (Recharts treemap)
5. **AI Summary Panel** on StockDetail — a card showing AI-written 3-paragraph qualitative analysis (fetched from backend which calls AI API)
6. **Broker Integration (future)** — settings tab to connect Zerodha/Groww via API key; import actual holdings
7. **IPO Section** — upcoming IPOs table with open/close date, GMP, subscription status
8. **52-week High/Low Indicator** — visual gauge on StockDetail
9. **Insider Trading Feed** — table of recent bulk/block deals pulled from NSE data
10. **FII/DII Activity Widget** — daily buy/sell data on dashboard

---

## Formatting Utilities (`utils/formatters.js`)
```js
export const formatCurrency = (val, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(val)
export const formatPercent = (val) => `${val >= 0 ? '+' : ''}${val?.toFixed(2)}%`
export const formatLargeNumber = (val) => { /* show Cr, Lakh, K suffixes */ }
export const formatDate = (val, fmt = 'DD MMM YYYY') => dayjs(val).format(fmt)
export const getChangeColor = (val) => val >= 0 ? 'success.main' : 'error.main'
```

---

## Environment Variables (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

---

## Key Rules

1. Zero mock data — every component fetches from the backend via service files
2. Every input field uses rules from `utils/rules.js`
3. No hardcoded strings for API paths — all endpoints are in service files using `apiClient`
4. All tables use `SDataTable` with backend pagination + search + sort
5. Auth guard on every protected page — check `authStore.isAuthenticated`
6. Token refresh handled silently in `apiClient.js` interceptor
7. All errors show via `notistack` snackbar (useSnackbar hook)
8. Components never import from `pages/`; pages import from `components/`
9. Stores are registered/used only at the page (index.jsx) level; child components receive data via props or context
10. Every page `index.jsx` sets document title via `useEffect(() => { document.title = '...' }, [])`
