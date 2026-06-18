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
|   ├── Alerts/
|   |   └── index.jsx
|   ├── EconomicCalendar/
|   |   └── index.jsx
|   ├── DividendCalendar/
|   |   └── index.jsx
|   ├── IPOs/
|   |   └── index.jsx
|   ├── Admin/
|   |   └── index.jsx
|   ├── Earnings/
|   |   └── index.jsx
|   ├── SavedScreeners/
|   |   └── index.jsx
|   ├── CompareStocks/
|   |   └── index.jsx
|   ├── Goals/
|   |   └── index.jsx
|   ├── TaxReports/
|   |   └── index.jsx
|   ├── Roles/
│   |   └── index.jsx
|   ├── Permissions/
│   |   └── index.jsx
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
│   │   |   └── index.jsx
│   |   ├── SDataFreshness/
│   |   │   └── index.jsx
|   |   ├── SPermissionTree/
│   |       └── index.jsx
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
│   |   ├── NewsCard.jsx
│   |   └── NewsFilter.jsx
│   │   ├── EconomicCalendar/
|   |   ├── DividendCalendar/
|   |   ├── Earnings/
|   |   ├── Admin/
|   |   ├── CompareStocks/
|   |   ├── Alerts/
|   |   ├── Goals/
|   |   ├── TaxReports/
│
├── store/
│   ├── authStore.js
│   ├── stockStore.js
│   ├── portfolioStore.js
│   ├── mutualFundStore.js
│   ├── watchlistStore.js
│   └── newsStore.js
│   ├── notificationStore.js
│   ├── calendarStore.js
│   ├── goalStore.js
│   ├── adminStore.js
│   ├── screenerStore.js
|   ├── roleStore.js
|   ├── permissionStore.js
│
├── services/
│   ├── apiClient.js            ← Axios instance, base URL, interceptors
│   ├── authService.js
│   ├── stockService.js         ← includes getMarketStatus, getFiiDii, getRecentlyViewed, markViewed
│   ├── portfolioService.js     ← includes getDividendIncome
│   ├── mutualFundService.js
│   ├── newsService.js
│   ├── watchlistService.js
│   ├── screenerService.js      ← includes getSaved, saveScreener, deleteScreener
│   ├── alertService.js
│   ├── adminService.js         ← includes getSystemHealth, getSyncStatus
│   ├── calendarService.js
│   ├── ipoService.js
│   ├── goalService.js
│   ├── taxService.js
│   ├── earningsService.js
│   ├── dividendService.js
│   ├── comparisonService.js
│   ├── calculatorService.js    ← SIP planner, DRIP planner (pure computation calls)
│   ├── notificationService.js  ← includes getPreferences, updatePreferences
│   ├── roleService.js
│   └── permissionService.js
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
- Protected routes (require valid JWT in authStore):
  `/dashboard`, `/stocks/:symbol`, `/screener`, `/screener/saved`, `/portfolio`, `/mutual-funds`, `/news`, `/watchlist`, `/settings`,
  `/alerts`, `/economic-calendar`, `/dividend-calendar`, `/ipo`, `/earnings`, `/compare`, `/goals`, `/tax-reports`
- Admin-only protected routes (require valid JWT + role `admin`):
  `/admin`, `/roles`, `/permissions`
- Auth guard: if no token in store → redirect to `/login`
- Admin guard: if no admin role → redirect to `/dashboard`
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

### `SDataFreshness` — reusable freshness/status component; 
props:
- `source`
- `lastUpdated`
- `status` (`live`, `delayed`, `stale`)
- `showIcon`

Displays:
- Source name (NSE / Yahoo / NewsAPI / Tender Portal)
- Last synced timestamp
- freshness indicator

Used in:
- StockDetail
- News cards
- Tender info
- Economic Calendar
- AI Summary

### `SPermissionTree` — permission tree selector component
Props:
- `permissions` — array of `{ id, key, description, group, children[] }` (hierarchical)
- `selected` — array of currently selected permission keys
- `onChange` — `(selectedKeys: string[]) => void`
- `readOnly` — boolean; if true, render as display only with no checkboxes

Behaviour:
- Renders permissions grouped by module (e.g. `stock.*`, `admin.*`, `portfolio.*`)
- Expandable/collapsible groups
- Checkboxes at leaf level; selecting a group checks all children
- Used exclusively on `pages/Roles/index.jsx` to assign permissions to a role
- On change: calls `onChange` with updated array of permission keys

## Store (Zustand)

### `authStore.js`
```js
// State: accessToken, refreshToken, user (id, name, email, avatar, roles), isAuthenticated
// Actions: login(tokens, user), logout(), updateTokens(accessToken, refreshToken)
// Persist: accessToken and refreshToken in localStorage via zustand/middleware/persist
```

### `stockStore.js`
```js
// State: quotes{}, selectedStock{}, news[], searchResults[], liveIndices[], marketStatus{}
// Actions: setQuote(symbol, data), setSelectedStock(data), setNews(data), setIndices(data), setMarketStatus(data)
```

### `portfolioStore.js`
```js
// State: holdings[], summary{}, rebalanceSuggestions[], dividendIncome{}
// Actions: setHoldings, setSummary, setRebalanceSuggestions, setDividendIncome
```

### `screenerStore.js`
```js
// State: filters{}, pagination{ page:1, limit:10 }, sort{ key:'', order:'DESC' }, search:'', results[], savedScreeners[]
// Actions: setFilters(filters), resetFilters(), setPagination, setSort, setSearch, setResults, setSavedScreeners
```

### `watchlistStore.js`
```js
// State: watchlists[], selectedWatchlist{}, notes[], tags[]
// Actions: setWatchlists, setSelected, setNotes, setTags, addNote, addTag
```

### `notificationStore.js`
```js
// State: notifications[], unreadCount: 0, preferences{ email_enabled, push_enabled, price_alerts, earnings_alerts, dividend_alerts, news_alerts }
// Actions: setNotifications(data), setUnreadCount(n), markRead(id), markAllRead(), setPreferences(prefs)
```

### `calendarStore.js`
```js
// State: economicEvents[], dividendEvents[], earningsEvents[], filters{ impact:'', country:'India', dateFrom:'', dateTo:'' }
// Actions: setEconomicEvents, setDividendEvents, setEarningsEvents, setFilters, resetFilters
```

### `goalStore.js`
```js
// State: goals[], selectedGoal: null
// Actions: setGoals(data), addGoal(goal), updateGoal(id, data), removeGoal(id), setSelectedGoal(goal)
```

### `adminStore.js`
```js
// State: users[], systemStats{}, auditLogs[], failedJobs[], syncStatus{}, systemHealth{}
// Actions: setUsers, setSystemStats, setAuditLogs, setFailedJobs, setSyncStatus, setSystemHealth
```

### `roleStore.js`
```js
// State: roles[], permissions[], permissionTree[]
// Actions: setRoles(data), setPermissions(data), setPermissionTree(data)
```

### `mutualFundStore.js`, `newsStore.js` — follow same pattern

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
- Renders: portfolio summary card, watchlist quick view, top news, market movers, sector heatmap, FII/DII Activity Widget, Market Status Widget, Economic Calendar Preview, Notification Preview

### `pages/StockDetail/index.jsx`
- Auth required
- Route param: `:symbol`
- Renders: StockHeader, PriceChart (with timeframe buttons 1D/1W/1M/3M/6M/1Y/5Y), ValuationMetrics, FinancialRatios, QualitativeAnalysis (AI-generated summary from backend), AI Recommendation Card, Shareholding Pattern, Insider Trading Feed, Dividend Timeline, Stock Split Timeline, Catalyst Tracker, NewsFeed (backend news for this symbol), TenderInfo, PeerComparison, Data Freshness Badge

### `pages/StockScreener/index.jsx`
- Auth required
- Left panel: ScreenerFilters (industry, sector, dividend yield range, PE range, debt-to-equity range, ROE min, market cap range, stock type: commodity/growth/dividend/value)
- Right: SDataTable with screener results, sortable, backend search
- Includes Save Screener button
- Includes Saved Screeners dropdown

### `pages/Portfolio/index.jsx`
- Auth required
- Tabs: Holdings | Performance | Rebalance | Goals | Tax Reports | Risk Analysis | Dividend Income
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

### `pages/Alerts/index.jsx`
- Auth required
- Registers: alertStore (use notificationStore for unread count)
- Title: "Price Alerts"
- Renders: SDataTable of all price alerts (symbol, condition, target value, status, triggered_at)
- Top-right: Create Alert button → SModal with symbol search (STextField debounced), condition SDropdown (above/below/percent_change), target value STextField
- Active / Triggered tabs to filter
- Delete action per row

### `pages/EconomicCalendar/index.jsx`
- Auth required
- Registers: calendarStore
- Title: "Economic Calendar"
- Filters: SDatePicker (date range), SDropdown (impact: high/medium/low), SDropdown (country: India/US/Global)
- Renders: SDataTable with columns: Event | Country | Impact (SChip colored) | Date/Time | Actual | Forecast | Previous | Affected Sectors
- High-impact events highlighted with red left border
- `SDataFreshness` badge showing last sync from RBI/FRED

### `pages/DividendCalendar/index.jsx`
- Auth required
- Registers: calendarStore
- Title: "Dividend Calendar"
- Filters: SDropdown (month, year), STextField search (stock name/symbol)
- Sort by: Ex-Date (default) | Dividend Yield (highest first)
- Renders: SDataTable with columns: Company | Symbol | Ex-Date | Record Date | Payment Date | Dividend Amount | Yield % | Type (interim/final)
- `SDataFreshness` badge showing last NSE sync

### `pages/IPOs/index.jsx`
- Auth required
- Title: "IPO Center"
- Tabs: Upcoming | Open | Recent Listings
- Renders: SDataTable with columns: Company | Price Band | Lot Size | Open Date | Close Date | GMP | Subscription | Status
- `SDataFreshness` badge

### `pages/Admin/index.jsx`
- Auth required + admin role check (redirect to /dashboard if not admin)
- Registers: adminStore
- Title: "Admin Panel"
- Tabs: Users | System Health | Sync Status | Audit Logs | Failed Jobs
- Users tab: SDataTable with search, role badges, activate/deactivate toggle
- System Health tab: provider status cards (NSE, Yahoo, Finnhub, TwelveData, Redis, DB) with latency badges
- Sync Status tab: table of all Bull jobs with last_run, next_run, status
- Audit Logs tab: SDataTable with action, user, entity, timestamp; filterable
- Failed Jobs tab: SDataTable with retry button per row

### `pages/Earnings/index.jsx`
- Auth required
- Registers: calendarStore
- Title: "Earnings Calendar"
- View toggle: Calendar | Table
- Filters: SDropdown (sector), SDatePicker (month/quarter)
- Table columns: Company | Symbol | Quarter | Earnings Date | Expected EPS | Actual EPS | Previous EPS | Surprise %
- Upcoming earnings highlighted; results with surprise % shown in green/red chip
- `SDataFreshness` badge

### `pages/SavedScreeners/index.jsx`
- Auth required
- Registers: screenerStore
- Title: "Saved Screeners"
- List of saved screener presets as SCards: name, filters summary, created date, Run button, Delete button
- Run button navigates to `/screener` with pre-filled filters from the saved preset (passed via router state)

### `pages/CompareStocks/index.jsx`
- Auth required
- Title: "Compare Stocks"
- Top: multi-symbol selector — up to 5 stocks — using debounced STextField autocomplete
- Once symbols selected → `comparisonService.compare(symbols)` → side-by-side table
- Sections: Valuation (PE, PB, PEG, EV/EBITDA) | Profitability (ROE, ROCE, ROA) | Growth (Revenue, Profit, EPS YoY) | Debt (D/E, Current Ratio, Interest Coverage) | Dividends (Yield, Payout Ratio)
- Best value in each row highlighted in green

### `pages/Goals/index.jsx`
- Auth required
- Registers: goalStore
- Title: "Investment Goals"
- Top: Create Goal button → SModal with: goal_type SDropdown (retirement/house/education/emergency/custom), title STextField, target_amount STextField, target_date SDatePicker, expected_cagr STextField
- Goals rendered as SCards showing: title, progress bar (current/target), projected CAGR, time remaining, SIP needed
- SIP needed computed via `calculatorService.computeSip()`

### `pages/TaxReports/index.jsx`
- Auth required
- Registers: portfolioStore
- Title: "Tax Reports"
- Financial year SDropdown (2023-24, 2024-25, 2025-26)
- Summary cards: STCG Tax, LTCG Tax, Dividend Income, Total Tax Liability
- Holdings breakdown table: stock, buy date, sell date, holding period, buy price, sell price, gain/loss, STCG/LTCG classification
- Download Report button → `taxService.downloadReport(year)` → triggers file download

### `pages/Roles/index.jsx`
- Auth required, admin only
- Registers: roleStore
- Title: "Roles Management"
- SDataTable of roles (name, description, permission count, user count, actions)
- Create/Edit role → SModal with: name STextField, description STextField, `SPermissionTree` for permission assignment
- Delete role with confirmation

### `pages/Permissions/index.jsx`
- Auth required, admin only
- Registers: roleStore
- Title: "Permissions"
- Grouped by module, rendered via `SPermissionTree` in read-only mode
- Create permission → SModal with: key STextField (e.g. `stock.view`), description STextField, group STextField
- No delete on system permissions

### `pages/Settings/index.jsx`
- Tabs: Profile | Security | Notifications | API Keys (user can connect broker)
- Notifications tab: toggle switches for email/push/SMS per event type (price alerts, earnings, dividends, news, insider trades) — calls `notificationService.updatePreferences()`

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
5. **AI Summary Panel** on StockDetail — a card showing AI-written 3-paragraph qualitative analysis with explainability support, showing why the AI generated the summary, key positives, key risks, and confidence score.
6. **Broker Integration (future)** — settings tab to connect Zerodha/Groww via API key; import actual holdings
7. **IPO Section** — upcoming IPOs table with open/close date, GMP, subscription status
8. **52-week High/Low Indicator** — visual gauge on StockDetail
9. **Insider Trading Feed** — table of recent insider trades, promoter buying/selling, director trades, bulk deals, and block deals pulled from NSE and exchange filings. Should show person name, designation, trade type, quantity, price, trade date, and transaction value.
10. **FII/DII Activity Widget** — daily buy/sell data on dashboard
11. **Economic Calendar** — dedicated page showing major macroeconomic events like RBI meetings, repo rate changes, inflation data, GDP releases, Fed decisions, unemployment reports, etc. Each event should have impact level (high/medium/low), event date/time, actual vs forecast vs previous values, and affected sectors/stocks.

12. **Dividend Calendar** — page showing upcoming and historical dividends of all stocks with ex-date, record date, payment date, dividend amount, yield %, and filtering by month/year. Should allow sorting by highest yield and upcoming nearest ex-date.

13. **Stock Split Timeline** — timeline component on StockDetail showing all historical stock splits with ratio (e.g., 1:2), ex-date, and adjusted price impact. Useful for understanding stock price history.

14. **Bulk/Block Deals Tracker** — dedicated section showing large institutional trades. Separate tabs for bulk deals and block deals, showing buyer, seller, quantity, average price, trade value, and trade date. Should support filtering by stock and date range.

15. **AI Explainability Engine** — every AI score (risk, value, growth, moat, management) should have explanation. Example: “Risk Score 7/10 because debt increased 25%, promoter pledge rose 8%, and cash flow is declining.” This improves trust in AI recommendations.

16. **Event Impact Engine** — AI reads macro/government/company news and maps impact to sectors and stocks. Example: “Government announces highway project” → positive for cement, steel, EPC, logistics stocks. Show impact confidence score.

17. **Catalyst Tracker** — tracks growth catalysts like capex expansion, new plant launches, exports, order book growth, acquisitions, new product launches, approvals. Shows expected timeline and estimated business impact.

18. **Goal-based Investing** — users can create investment goals like retirement, buying a house, emergency fund, education, etc. Tracks target amount, current progress, expected CAGR, and suggests how much more to invest.

19. **Tax Reporting** — portfolio tax analysis page showing STCG, LTCG, realized gains, unrealized gains, tax liability estimates, and downloadable yearly tax reports.

20. **Dividend Income Tracker** — tracks total dividend income earned, pending dividend payments, dividend CAGR, monthly/yearly charts, and projected passive income.

21. **Watchlist Notes** — users can add custom notes on stocks like “Buy below 500”, “Strong quarterly results”, “Waiting for breakout”. Notes should be visible directly in watchlist.

22. **Watchlist Tags** — allow tagging stocks with custom or predefined tags like breakout, undervalued, cyclical, long-term, high-risk, dividend. Enable filtering by tags.

23. **Notification Center** — centralized notifications for price alerts, earnings alerts, dividends, tenders, insider trades, bulk deals, news events, and AI recommendation changes. Should support email, push, and SMS preferences.

24. **Admin Panel** — internal dashboard for managing system health. Includes user management, stock sync status, news ingestion status, tender sync status, failed background jobs, API health monitoring, alert logs, and system logs.

25. **Earnings Calendar** — upcoming quarterly results, expected EPS, previous EPS, earnings surprise %, and result history. Calendar-based UI with filters by sector/date. Show upcoming and recently announced results.

26. **Shareholding Pattern Tracker** — display promoter, FII, DII, public holdings, pledged shares, and quarterly trend comparison. Include charts for historical holding changes.

27. **Competitor Comparison Engine** — compare multiple stocks side-by-side across valuation (PE, PB, PEG), growth (sales/profit growth), profitability (ROE, ROCE), debt, margins, and technical indicators.

28. **AI Recommendation Engine** — generate Buy / Hold / Sell / Watch recommendations with confidence score, target range, risk level, and reasons based on valuation, momentum, sentiment, and catalysts.

29. **AI Portfolio Risk Analyzer** — analyze portfolio concentration, sector exposure, volatility, correlation risk, and drawdown risk. Show risk score and diversification suggestions.

30. **SIP Planner** — goal-based SIP calculator allowing users to input target corpus, time horizon, expected CAGR, and inflation assumptions. Show required monthly SIP.

31. **Dividend Reinvestment Planner** — simulate dividend reinvestment growth, projected corpus, projected passive income, and compounding effect over time.

32. **Data Freshness Badge** — every stock data block, AI analysis, tender info, insider trades, and news cards must show source name, last synced timestamp, and freshness status.

33. **Market Status Widget** — top dashboard widget showing market open/closed, pre-market, post-market, holiday schedule, and live session timing.

34. **Saved Screeners** — users can save custom screener filters (e.g. high ROE, low debt, dividend stocks) and quickly rerun them.

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
VITE_API_BASE_URL=http://localhost:5000/api/v1
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
11. Admin pages must check user role from `authStore.user.roles` and redirect non-admins to `/dashboard`
12. All polling intervals must be stored in a ref and cleared in the `useEffect` cleanup function

---

## Unit Testing (Vitest + React Testing Library)

### Install
```
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

### Test Folder Structure
```
src/
├── __tests__/
│   ├── components/
│   │   ├── common/
│   │   │   ├── STextField.test.jsx
│   │   │   ├── SDataTable.test.jsx
│   │   │   ├── SDropdown.test.jsx
│   │   │   ├── SDatePicker.test.jsx
│   │   │   ├── SPhoneNumber.test.jsx
│   │   │   └── SDataFreshness.test.jsx
│   │   ├── Home/
│   │   │   ├── MarketIndexTicker.test.jsx
│   │   │   └── TopGainersLosers.test.jsx
│   │   └── StockDetail/
│   │       ├── PriceChart.test.jsx
│   │       └── ValuationMetrics.test.jsx
│   ├── pages/
│   │   ├── Login.test.jsx
│   │   ├── Register.test.jsx
│   │   └── StockDetail.test.jsx
│   ├── services/
│   │   ├── authService.test.js
│   │   ├── stockService.test.js
│   │   └── portfolioService.test.js
│   ├── store/
│   │   ├── authStore.test.js
│   │   └── portfolioStore.test.js
│   └── utils/
│       ├── rules.test.js
│       └── formatters.test.js
├── mocks/
│   ├── handlers.js       ← MSW request handlers (one per API endpoint used in tests)
│   └── server.js         ← MSW server setup
└── vitest.setup.js
```

### `vitest.config.js`
```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
    coverage: { reporter: ['text', 'html'], exclude: ['node_modules/', 'src/mocks/'] },
  },
})
```

### `vitest.setup.js`
```js
import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { server } from './mocks/server'
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### `mocks/handlers.js` — MSW handlers (intercept ALL API calls, return test fixtures)
```js
import { http, HttpResponse } from 'msw'
export const handlers = [
  http.post('/api/v1/auth/login', () =>
    HttpResponse.json({ success: true, data: { accessToken: 'test-token', refreshToken: 'test-refresh', user: { id: '1', name: 'Test', email: 'test@test.com', roles: ['user'] } } })
  ),
  http.get('/api/v1/stocks/:symbol/quote', ({ params }) =>
    HttpResponse.json({ success: true, data: { symbol: params.symbol, price: 2400.50, change: 12.5, changePercent: 0.52, source: 'NSE', timestamp: new Date().toISOString() } })
  ),
  http.get('/api/v1/stocks/indices/live', () =>
    HttpResponse.json({ success: true, data: [{ name: 'NIFTY 50', value: 22400, change: 100, changePercent: 0.45 }] })
  ),
  http.get('/api/v1/market/status', () =>
    HttpResponse.json({ success: true, data: { isOpen: true, session: 'normal', nextClose: '15:30' } })
  ),
  // Add a handler for every endpoint called in tests
]
```

### Tests to Write

**`utils/rules.test.js`**
- Every rule function (required, email, minLength, maxLength, numeric, password, panCard, phone, confirmPassword) tested with valid + invalid inputs
- Assert returns `true` on valid, error string on invalid

**`components/common/STextField.test.jsx`**
- Renders with label text
- Shows red asterisk when `required` prop is true
- Displays validation error below field when rule fails
- Fires `onSearch` after debounce ms — use `vi.useFakeTimers()`
- Does NOT fire `onSearch` before debounce completes

**`components/common/SDataTable.test.jsx`**
- Renders all column headers
- Renders correct number of data rows
- Shows skeleton rows when `loading={true}`
- Shows empty state component when `data={[]}`
- Search input triggers `onSearch` after 400ms debounce
- Sort icon click calls `onSort(key, 'ASC')`, second click calls `onSort(key, 'DESC')`
- Pagination change calls `onPaginationChange(page, limit)`

**`store/authStore.test.js`**
- `login()` sets accessToken, refreshToken, user, isAuthenticated=true
- `logout()` clears all state, isAuthenticated=false
- `updateTokens()` updates only accessToken, preserves user

**`services/authService.test.js`** (MSW intercepts real fetch)
- `login()` sends POST with correct body
- `login()` returns data object on 200
- `login()` throws with error message on 401

**`pages/Login.test.jsx`**
- Renders email and password fields
- Submit with empty fields shows validation errors
- Valid submit calls authService, stores tokens, redirects to /dashboard
- Shows notistack error on failed login

**`pages/StockDetail.test.jsx`**
- Loads all data sections in parallel on mount
- Shows SLoader while loading
- Renders PriceChart, ValuationMetrics, NewsFeed after data loads
- SDataFreshness badge shows source name
