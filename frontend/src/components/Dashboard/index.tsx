import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStockStore } from '../../store/stockStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useWatchlistStore } from '../../store/watchlistStore';

// Page-specific services organized within component's layout as requested
import stockService from './services/stockService';
import portfolioService from './services/portfolioService';
import watchlistService from './services/watchlistService';
import newsService from './services/newsService';

// Layout & Elements
import { LayoutDashboard, Database, RefreshCw } from 'lucide-react';
import { SPageHeader } from '../common/SPageHeader';
import { SButton } from '../common/SButton';

// Modular Dashboard Components
import { MarketOverview } from './MarketOverview';
import { LiveIndices } from './LiveIndices';
import { MarketMovers } from './MarketMovers';
import { MarketBreadth } from './MarketBreadth';
import { NewsFeed } from './NewsFeed';
import { WatchlistSnapshot } from './WatchlistSnapshot';
import { useSnackbar } from '../common/SnackbarProvider';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  
  // Store updates
  const { liveIndices, marketStatus, setIndices, setMarketStatus } = useStockStore();
  const { holdings, summary, setHoldings, setSummary } = usePortfolioStore();
  const { watchlists, setWatchlists } = useWatchlistStore();

  const [localGainers, setLocalGainers] = useState<any[]>([]);
  const [localLosers, setLocalLosers] = useState<any[]>([]);
  const [localNews, setLocalNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { enqueueSnackbar } = useSnackbar();

  const fetchDashboardTelemetry = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // Execute multi-dispatch promises in parallel for rapid feed resolution
      const [
        indicesRes,
        statusRes,
        gainersRes,
        losersRes,
        portfolioRes,
        summaryRes,
        watchlistRes,
        newsRes
      ] = await Promise.allSettled([
        stockService.getLiveIndices(),
        stockService.getMarketStatus(),
        stockService.getTopGainers(),
        stockService.getTopLosers(),
        portfolioService.getHoldings(),
        portfolioService.getSummary(),
        watchlistService.getAll(),
        newsService.getNews({}, { page: 1, limit: 4 })
      ]);

      // Resolve indices
      if (indicesRes.status === 'fulfilled' && indicesRes.value?.data) {
        setIndices(indicesRes.value.data);
      } else if (indicesRes.status === 'fulfilled' && Array.isArray(indicesRes.value)) {
        setIndices(indicesRes.value);
      }

      // Resolve status
      if (statusRes.status === 'fulfilled' && statusRes.value?.data) {
        setMarketStatus(statusRes.value.data);
      } else if (statusRes.status === 'fulfilled' && statusRes.value) {
        setMarketStatus(statusRes.value as any);
      }

      // Resolve gainers
      if (gainersRes.status === 'fulfilled') {
        const raw = (gainersRes.value as any)?.data || gainersRes.value;
        if (Array.isArray(raw)) setLocalGainers(raw);
      }

      // Resolve losers
      if (losersRes.status === 'fulfilled') {
        const raw = (losersRes.value as any)?.data || losersRes.value;
        if (Array.isArray(raw)) setLocalLosers(raw);
      }

      // Resolve portfolio
      if (portfolioRes.status === 'fulfilled') {
        const raw = (portfolioRes.value as any)?.data || portfolioRes.value;
        if (Array.isArray(raw)) setHoldings(raw);
      }

      // Resolve portfolio summary
      if (summaryRes.status === 'fulfilled') {
        const raw = (summaryRes.value as any)?.data || summaryRes.value;
        if (raw) setSummary(raw);
      }

      // Resolve watchlists
      if (watchlistRes.status === 'fulfilled') {
        const raw = (watchlistRes.value as any)?.data || watchlistRes.value;
        if (Array.isArray(raw)) setWatchlists(raw);
      }

      // Resolve news
      if (newsRes.status === 'fulfilled') {
        const raw = (newsRes.value as any)?.data || newsRes.value;
        if (raw && Array.isArray(raw.items)) {
          setLocalNews(raw.items);
        } else if (Array.isArray(raw)) {
          setLocalNews(raw);
        }
      }

      // No automatic telemetry dashboard success toast on load as requested
    } catch (err: any) {
      console.error('Error fetching dashboard telemetry feeds:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDashboardTelemetry();

    // Setup an implicit telemetry update polling loop every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardTelemetry(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Upper Terminal Header with Real Session Authority Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" /> Authorized Terminal feeds
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
             StockSense Core Console
          </h2>
          <p className="text-xs text-white/50 font-mono">Premium Indian retail securities diagnostics and market indicators</p>
        </div>
        
        <div className="flex items-center gap-3">
          <SButton
            label="Refresh System"
            onClick={() => fetchDashboardTelemetry()}
            variant="outline"
            size="small"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          />
          <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-3 py-1.5 rounded border border-white/5">
            <Database className="w-4 h-4 text-cyan-400" style={{ color: 'var(--brand-cyan)' }} />
            <span className="text-white/40">NODE:</span>
            <span className="text-cyan-300 font-bold truncate max-w-[120px]" style={{ color: 'var(--brand-cyan)' }}>{user?.name || 'GUEST_OPERATOR'}</span>
          </div>
        </div>
      </div>

      {/* 1. Market Overview Alert Bar (Market Status + Core updates) */}
      <MarketOverview status={marketStatus || undefined} loading={loading} />

      {/* 2. Top row grid: Live Tickers & Indices */}
      <LiveIndices indices={liveIndices} loading={loading} />

      {/* 3. Main Bento Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column (span 2 on large layouts): Market Movers and News */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Movers: Gainers and Losers */}
          <MarketMovers gainers={localGainers} losers={localLosers} loading={loading} />
          
          {/* Signal & News Intelligence */}
          <NewsFeed news={localNews} loading={loading} />
        </div>

        {/* Right column: Breadth and Watchlist Snippets */}
        <div className="space-y-6">
          {/* Market Breadth */}
          <MarketBreadth loading={loading} />

          {/* Watchlist Snapshot summary status */}
          <WatchlistSnapshot 
            stocks={watchlists && watchlists[0]?.stocks} 
            quotes={useStockStore.getState().quotes} 
            loading={loading} 
          />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
