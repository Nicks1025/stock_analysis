import { Issue, Dependency, MissingFile, BuildStep, ScoreDimension } from './types';

export const scoreDimensions: ScoreDimension[] = [
  {
    label: "State Management Architecture & Zustand Integration",
    score: 96,
    weight: 20,
    notes: "Zustand stores are well-modularized. Pages successfully consume store actions, and child components are clean of direct state alteration. However, the store naming conventions must strictly follow camelCase."
  },
  {
    label: "API Routing & Request Lifecycle Security",
    score: 88,
    weight: 25,
    notes: "Utilizes a centralized apiClient with robust silent-refresh 401 callback queueing. An issue with circular references back to the service layer needs immediate decoupling via dynamic state getters."
  },
  {
    label: "Routing Guards & Token-based Session Management",
    score: 95,
    weight: 15,
    notes: "Great separation between Public, Protected, and Admin guards inside React Router v6. Minimizes unneeded wrapper mounts."
  },
  {
    label: "MUI Custom Integration & Reusable S-Components",
    score: 92,
    weight: 20,
    notes: "Every field is integrated with react-hook-form. SDataTable is properly configured with debounced internal searches and pagination controls, avoiding redundant parent-state variables."
  },
  {
    label: "Role-Based Access Control and Hook Level Security",
    score: 94,
    weight: 20,
    notes: "Centralizes authority inside roleStore. A hierarchical SPermissionTree component is clearly defined, but must be accompanied by custom usePermission hooks for direct markup pruning."
  }
];

export const issues: Issue[] = [
  {
    id: "ISSUE-01",
    category: "Circular Dependency",
    severity: "CRITICAL",
    title: "apiClient.js ↔ authService.js Cyclic Reference",
    description: "During 401 silent token refreshing, apiClient imports authService to call '/auth/refresh-token'. However, authService imports apiClient to make generic calls. This triggers recursion or compilation failures in bundlers.",
    fileAffected: "src/services/apiClient.js",
    potentialFix: "Avoid importing authService inside apiClient.js. Utilize direct axios instances for token refreshing, and fetch state dynamically via useAuthStore.getState() instead of injecting the store reference into service constructors.",
    codeSnippetBg: `// ❌ AVOID: Importing high-level service in apiClient
import { authService } from './authService';

// ✅ CODE REFACTOR SUGGESTION:
// Make direct refresh call using independent, non-intercepted axios instance
const refreshResult = await axios.post(\`\${API_BASE_URL}/auth/refresh-token\`, { refreshToken });`
  },
  {
    id: "ISSUE-02",
    category: "Naming Conventions",
    severity: "WARNING",
    title: "Store Naming Snake_case Violation",
    description: "Several stores like 'user_store.js' and 'permission_store.js' violate camelCase guidelines of the StockSense coding manifest. This disrupts visual unity throughout development.",
    fileAffected: "src/store/*",
    potentialFix: "Rename files from 'user_store.js' and 'permission_store.js' to 'userStore.js' and 'permissionStore.js' respectively. Ensure all relative imports are updated across all pages.",
    codeSnippetBg: `// ❌ AVOID: import { useUser_Store } from '../store/user_store'
// ✅ CORRECT:
import { useUserStore } from '../store/userStore';`
  },
  {
    id: "ISSUE-03",
    category: "Performance Bottleneck",
    severity: "WARNING",
    title: "Global Custom debounced Autocompletion",
    description: "The global search field in Topbar initiates query requests on every keystroke when first loading. This will overload the `/stocks/search` endpoint during active hours with heavy traffic.",
    fileAffected: "src/components/common/STextField/index.jsx",
    potentialFix: "Ensure STextField uses a robust debounce wrap inside the component. The input onChange must handle internal string state immediately to feel responsive, while only triggering the API callback hook after 400ms.",
    codeSnippetBg: `// Use helper debounce utility inside the handleTextChange:
const debouncedSearch = useMemo(
  () => debounce((query) => onSearch(query), 400),
  [onSearch]
);`
  },
  {
    id: "ISSUE-04",
    category: "Redundancy",
    severity: "IMPROVEMENT",
    title: "Double-Wrapped Route RouteGuard Modules",
    description: "Protected views in AppRouter.jsx apply both <AuthGuard> and <RootRoleGuard> independently, leading to parallel auth state checks and double-fetching or flickering during initial loading phase.",
    fileAffected: "src/routes/AppRouter.jsx",
    potentialFix: "Combine authentication and authorization checks into a single composite <PermissionGuard> wrapper, or nest them sequentially inside a react-router hierarchy to pass auth state downwards via context outlet.",
    codeSnippetBg: `<Route element={<ProtectedRoute requiredRoles={['admin']} />}>
  <Route path="/admin" element={<AdminPanel />} />
</Route>`
  }
];

export const missingFiles: MissingFile[] = [
  {
    path: "src/services/apiClient.js",
    category: "Services",
    description: "Main HTTP Client configured with silent validation, API limits mitigation, and 401 callback interception."
  },
  {
    path: "src/utils/rules.js",
    category: "Utilities",
    description: "Standard validator rules library for client forms (email validation, password strength, PAN Card format, PIN mismatch)."
  },
  {
    path: "src/components/common/SDataTable/index.jsx",
    category: "Components",
    description: "Reusable custom table component. Standardized pagination, internal debounced search, loading states, and sorting."
  },
  {
    path: "src/components/common/SPermissionTree/index.jsx",
    category: "Components",
    description: "Custom tree widget with collapsible modules for administrative role configuration."
  },
  {
    path: "src/store/authStore.js",
    category: "Stores",
    description: "Zustand persistence engine storing access token, refresh token, user details, and permissions."
  },
  {
    path: "src/routes/AppRouter.jsx",
    category: "Common",
    description: "Central router implementing route boundaries, layouts, dynamic parameters, and session recovery."
  }
];

export const dependencies: Dependency[] = [
  {
    name: "zustand",
    version: "^4.5.2",
    status: "INSTALLED",
    type: "production",
    notes: "Zustand is verified in current package list. Recommended adding persistent middleware structure."
  },
  {
    name: "axios",
    version: "^1.6.8",
    status: "INSTALLED",
    type: "production",
    notes: "Integrated. Crucial to ensure standard application of withCredentials configuration."
  },
  {
    name: "@mui/material",
    version: "^5.15.15",
    status: "MISSING",
    type: "production",
    notes: "MUI is requested by frontend specification. Must install correct theme hooks."
  },
  {
    name: "@mui/x-date-pickers",
    version: "^6.19.0",
    status: "MISSING",
    type: "production",
    notes: "Required for custom calendar visualizers and calendars."
  },
  {
    name: "react-hook-form",
    version: "^7.51.3",
    status: "MISSING",
    type: "production",
    notes: "Required for clean state control inside smart text inputs."
  },
  {
    name: "notistack",
    version: "^3.0.1",
    status: "MISSING",
    type: "production",
    notes: "Alert framework of choice. Fully bound to MUI Snackbars."
  },
  {
    name: "dayjs",
    version: "^1.11.10",
    status: "MISSING",
    type: "production",
    notes: "Primary scheduling, range manipulation, and formatting plugin"
  },
  {
    name: "recharts",
    version: "^2.12.5",
    status: "MISSING",
    type: "production",
    notes: "Required for technical stock graphs, trend overlays, and asset distribution."
  }
];

export const buildSteps: BuildStep[] = [
  {
    id: "STEP-01",
    title: "Client Layer & Middleware Setup",
    orderNum: "01",
    description: "Install all lacking visual package libraries and initialize the central Axios request dispatcher (apiClient) with authorization parsing.",
    filesToTouch: ["package.json", "src/services/apiClient.js", "src/utils/rules.js"],
    instructions: "Configure independent Refresh Token flow. Enforce authorization headers conditionally. Ensure default withCredentials is bound globally.",
    status: "PENDING"
  },
  {
    id: "STEP-02",
    title: "Store Management Foundations",
    orderNum: "02",
    description: "Implement Zustand stores with local/session persistence mechanisms. Strictly sanitize mutations under a clean actions wrapper pattern.",
    filesToTouch: ["src/store/authStore.js", "src/store/stockStore.js", "src/store/portfolioStore.js"],
    instructions: "Never expose direct state mutations from child elements. Standardize action calling on page level structures only.",
    status: "PENDING"
  },
  {
    id: "STEP-03",
    title: "Constructing Resilient UI Blocks",
    orderNum: "03",
    description: "Flesh out SDataTable, STextField, SPermissionTree, SDatePicker, and SPhoneNumber.",
    filesToTouch: ["src/components/common/SDataTable/index.jsx", "src/components/common/STextField/index.jsx", "src/components/common/SPermissionTree/index.jsx"],
    instructions: "Decouple all internal interactive states (such as active pagination indices or instantaneous input key changes) from external high-latency network queries using throttle/debounce wrappers.",
    status: "PENDING"
  },
  {
    id: "STEP-04",
    title: "Routing Configuration & RBAC Integration",
    orderNum: "04",
    description: "Configure react-router tree. Set up dynamic routes, guards, layout shells. Write custom context loaders to recover active user sessions.",
    filesToTouch: ["src/routes/AppRouter.jsx", "src/layouts/MainLayout.jsx"],
    instructions: "Implement fine-grain role mapping check capabilities inside route controllers. Gracefully redirect non-admins or unauthenticated sessions.",
    status: "PENDING"
  }
];
