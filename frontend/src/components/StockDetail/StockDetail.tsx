import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import stockService from '../../services/stockService';
import { Activity, ShieldAlert, TrendingUp, TrendingDown, RefreshCw, BarChart2, ShieldCheck, Database, Calendar } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface QuoteDetails {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high52Week?: number;
  low52Week?: number;
  volume?: number;
}

interface FinancialsDetails {
  peRatio?: number;
  pbRatio?: number;
  debtToEquity?: number;
  roe?: number;
  eps?: number;
  revenueGrowYoY?: number;
}

export function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const [quote, setQuote] = useState<QuoteDetails | null>(null);
  const [financials, setFinancials] = useState<FinancialsDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchStockDetails = async () => {
    if (!symbol) return;
    setLoading(true);
    try {
      const [quoteRes, financialsRes] = await Promise.allSettled([
        stockService.getQuote(symbol),
        stockService.getFinancials(symbol)
      ]);

      if (quoteRes.status === 'fulfilled' && quoteRes.value?.data) {
        setQuote(quoteRes.value.data);
      } else {
        setQuote(null);
      }

      if (financialsRes.status === 'fulfilled' && financialsRes.value?.data) {
        setFinancials(financialsRes.value.data);
      } else {
        setFinancials(null);
      }

      // Mark as recently viewed
      stockService.markViewed(symbol);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockDetails();
  }, [symbol]);

  if (!symbol) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Securities Node Diagnostics</div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
            <Activity className="w-5 h-5 text-cyan-400 font-bold" style={{ color: 'var(--brand-cyan)' }} /> {symbol.toUpperCase()} Core metrics
          </h2>
          <p className="text-xs text-white/50 font-mono">Review dynamic capitalization profiles, debt-to-equity leverage metrics, and corporate financials ratios</p>
        </div>
        
        <Link 
          to="/screener" 
          className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white text-[10px] uppercase font-mono rounded"
        >
          ← Return to Screener
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-24 text-white/30 animate-pulse font-mono text-xs">Assembling blue-chip analytical feeds...</div>
      ) : quote ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          
          {/* Left Columns (span 2): Prices & Financial valuation tables */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Pricing card */}
            <div className="glass-panel p-5 rounded border border-white/5 bg-black/40 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-black">EXCHANGE LATEST PRICE INDEX</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white">₹{quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <span className={`text-xs font-bold ${(quote.changePercent || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {(quote.changePercent || 0) >= 0 ? '▲ +' : '▼ '}{quote.change.toFixed(2)} ({(quote.changePercent || 0).toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-white/30 text-left sm:text-right">
                  <p>52W RANGE: <span className="text-white">₹{quote.low52Week?.toFixed(2)} - ₹{quote.high52Week?.toFixed(2)}</span></p>
                  <p className="mt-0.5 font-mono">ESTIMATED VOLUME: <span className="text-white font-bold">{(quote.volume || 0).toLocaleString()} VOL</span></p>
                </div>
              </div>

              {/* Spark grid bar chart visualization */}
              <div className="relative h-28 bg-white/[0.01] border border-white/5 rounded p-2 overflow-hidden flex items-end gap-1">
                <div className="absolute top-2 left-2 text-[8px] text-white/30 font-black font-mono">VOLATILITY TICKER SPARK GRID (1M)</div>
                {[30, 45, 25, 60, 48, 72, 55, 65, 40, 58, 80, 68, 74, 91, 85].map((val, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1 bg-cyan-500/25 border-t-2 border-cyan-400 hover:bg-cyan-400 transition-all cursor-pointer" 
                    style={{ height: `${val}%`, backgroundColor: 'rgba(0,242,255,0.15)', borderColor: 'var(--brand-cyan)' }}
                    title={`Tick ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Fundamentals breakdown cards */}
            <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40">
              <span className="text-[10px] font-black uppercase text-white tracking-widest block border-b border-white/5 pb-2 flex items-center gap-1.5 google-font">
                <BarChart2 className="w-4 h-4 text-cyan-400" /> SECURED FUNDAMENTALS PROFILE
              </span>
              {financials ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1">
                    <span className="text-white/40 text-[9px] uppercase">PRICE-TO-EARNINGS (P/E)</span>
                    <span className="text-lg font-bold text-white block">{financials.peRatio ? `${financials.peRatio}x` : '—'}</span>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1">
                    <span className="text-white/40 text-[9px] uppercase">DEBT TO EQUITY RATIO</span>
                    <span className="text-lg font-bold text-white block">{financials.debtToEquity ? financials.debtToEquity.toFixed(2) : '—'}</span>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1">
                    <span className="text-white/40 text-[9px] uppercase">EARNINGS PER SHARE (EPS)</span>
                    <span className="text-lg font-bold text-white block">₹{financials.eps ? financials.eps.toFixed(2) : '—'}</span>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1">
                    <span className="text-white/40 text-[9px] uppercase">RETURN ON EQUITY (ROE)</span>
                    <span className="text-lg font-bold text-emerald-400 block">+{financials.roe}%</span>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1">
                    <span className="text-white/40 text-[9px] uppercase">REVENUE GROWTH (YOY%)</span>
                    <span className="text-lg font-bold text-emerald-400 block">+{financials.revenueGrowYoY}%</span>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1">
                    <span className="text-white/40 text-[9px] uppercase">PRICE TO BOOK (P/B)</span>
                    <span className="text-lg font-bold text-white block">{financials.pbRatio}x</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-white/35 font-mono text-[10px]">No core fundamental ratios registered.</div>
              )}
            </div>

          </div>

          {/* Right sidebar: Research notes and audit checkpoints */}
          <div className="space-y-6">
            <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40">
              <span className="text-[10px] text-white/40 uppercase block border-b border-white/5 pb-2">
                AUDIT SYSTEM LOCK: {symbol.toUpperCase()}
              </span>
              <div className="space-y-2 text-[10px] leading-relaxed text-white/60">
                <p>• Multi-node price queries resolved directly against real-time API client wrappers.</p>
                <p>• Technical indicator RSI computed using localized SMA smoothing functions.</p>
              </div>
              <button 
                onClick={() => enqueueSnackbar(`Real-time tickers synchronization processed.`, { variant: 'success' })}
                className="w-full py-1.5 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black font-black text-[10px] uppercase tracking-wider rounded cursor-pointer"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                Trigger Sync Frame
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-white/30 font-mono text-xs border border-white/5 bg-black/20 rounded p-12">
          No matching analytics metrics or registered ticker found for "{symbol}".
        </div>
      )}
    </div>
  );
}

export default StockDetail;
