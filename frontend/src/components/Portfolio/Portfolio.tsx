import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import portfolioService from '../../services/portfolioService';
import { usePortfolioStore, Transaction } from '../../store/portfolioStore';
import { 
  Wallet, PieChart, Plus, ArrowUpRight, ArrowDownRight, 
  Activity, Percent, BookOpen, RefreshCw, Scale, Coins, 
  Compass, RotateCcw, HelpCircle, X, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { useSnackbar } from '../../components/common/SnackbarProvider';

// Reusable components imports
import { PortfolioHoldings } from './PortfolioHoldings';
import { PortfolioPnL } from './PortfolioPnL';
import { SectorAllocation } from './SectorAllocation';
import { RiskAnalysis } from './RiskAnalysis';
import { RebalancingSuggestions } from './RebalancingSuggestions';
import { DividendTracking } from './DividendTracking';
import { PerformanceMetrics } from './PerformanceMetrics';
import { TransactionHistoryLog } from './TransactionHistoryLog';

type PortfolioTab = 'holdings' | 'risk-rebalance' | 'growth' | 'history';

export function Portfolio() {
  const { 
    holdings, 
    transactions, 
    dividends, 
    summary, 
    setHoldings, 
    setSummary, 
    addLocalTransaction, 
    removeLocalTransaction 
  } = usePortfolioStore();

  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTabState] = useState<PortfolioTab>(
    (searchParams.get('tab') as PortfolioTab) || 'holdings'
  );

  const setActiveTab = (tab: PortfolioTab) => {
    setActiveTabState(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const tab = searchParams.get('tab') as PortfolioTab;
    if (!tab) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', activeTab);
      setSearchParams(newParams, { replace: true });
    } else if (tab !== activeTab) {
      setActiveTabState(tab);
    }
  }, [searchParams, activeTab, setSearchParams]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Dispatch form state
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  
  // SIP Calculator baseline state
  const [sipAmount, setSipAmount] = useState(15000);
  const [years, setYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(13.5);
  
  const { enqueueSnackbar } = useSnackbar();

  // Load from backend service or fallback dynamically
  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const holdingsRes = await portfolioService.getHoldings();
      const rawHoldings = holdingsRes?.data || holdingsRes;
      
      const summaryRes = await portfolioService.getSummary();
      const rawSummary = summaryRes?.data || summaryRes;

      // If backend has real active database results, sync them with the store, 
      // else let the store maintain our mock/offline fallback
      if (Array.isArray(rawHoldings) && rawHoldings.length > 0) {
        setHoldings(rawHoldings);
      }
      if (rawSummary && rawSummary.totalInvestment > 0) {
        setSummary(rawSummary);
      }
    } catch (err) {
      console.warn("Backend service disconnected / demo sandbox active. Rolling back with offline state tracker data.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !quantity || !price) return;

    try {
      setLoading(true);
      const symbolUpper = symbol.trim().toUpperCase();
      const qtyNum = parseFloat(quantity);
      const priceNum = parseFloat(price);

      // 1. Fire full-stack sync API call (if sever handles it gracefully)
      const payload = {
        symbol: symbolUpper,
        quantity: qtyNum,
        price: priceNum,
        type,
        date: new Date().toISOString().substring(0, 10)
      };
      
      try {
        await portfolioService.addTransaction(payload);
      } catch (apiErr) {
        console.warn("API route unavailable. Saving payload locally into your Sandbox profile.", apiErr);
      }

      // Determine deterministic sectors & entity names matching helper stores
      const sym = symbolUpper;
      let sector = 'Healthcare & Pharamaceuticals';
      if (['TCS', 'INFY', 'WIT', 'TECHM', 'WIPRO'].includes(sym)) sector = 'Information Technology';
      else if (['RELIANCE', 'IOC', 'BPCL', 'ONGC'].includes(sym)) sector = 'Energy & Utilities';
      else if (['HDFCBANK', 'SBIN', 'ICICIBANK', 'AXISBANK', 'KOTAKBANK'].includes(sym)) sector = 'Financial Services';
      else if (['L&T', 'LT', 'BHEL', 'SIEMENS'].includes(sym)) sector = 'Industrials & Capital Goods';
      else if (['TATAMOTORS', 'M&M', 'MARUTI'].includes(sym)) sector = 'Automotive';
      else if (['ITC', 'HUL', 'NESTLEIND'].includes(sym)) sector = 'FMCG & Consumer Goods';

      const names: Record<string, string> = {
        RELIANCE: 'Reliance Industries Ltd.',
        TCS: 'Tata Consultancy Services Ltd.',
        INFY: 'Infosys Limited',
        HDFCBANK: 'HDFC Bank Ltd.',
        SBIN: 'State Bank of India',
        ICICIBANK: 'ICICI Bank Ltd.',
        'L&T': 'Larsen & Toubro Ltd.',
        WIT: 'Wipro Limited'
      };
      const companyName = names[sym] || `${sym} Enterprises Ltd.`;

      // 2. Commit transaction to state store
      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        symbol: symbolUpper,
        companyName,
        quantity: qtyNum,
        price: priceNum,
        type,
        date: new Date().toISOString().substring(0, 10),
        sector
      };

      addLocalTransaction(newTx);
      enqueueSnackbar(`Successfully recorded ${type} order of ${qtyNum} ${symbolUpper} shares!`, { variant: 'success' });
      
      // Cleanup
      setSymbol('');
      setQuantity('');
      setPrice('');
      setShowAddForm(false);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Access error processing transaction logic.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // SIP projections
  const sipMonthlyRate = expectedReturn / 12 / 100;
  const sipMonths = years * 12;
  const totalInvestedSip = sipAmount * sipMonths;
  const futureValueSip = sipAmount * (((Math.pow(1 + sipMonthlyRate, sipMonths) - 1) / sipMonthlyRate) * (1 + sipMonthlyRate));
  const sipReturns = futureValueSip - totalInvestedSip;

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none px-2 sm:px-4" id="portfolio-terminal-root">
      
      {/* Upper Terminal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="text-left font-mono">
          <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400">Personal Capital Terminal</div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
            <Wallet className="w-5 h-5 text-cyan-400 animate-pulse" style={{ color: 'var(--brand-cyan)' }} /> Portfolio Console
          </h2>
          <p className="text-xs text-white/50">Track average purchase costs, evaluate risk thresholds, identify cluster weights, and compute compounding ratios.</p>
        </div>
        
        {/* dispatch toggle button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-widest rounded transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.25)] select-none shrink-0"
          style={{ backgroundColor: 'var(--brand-cyan)' }}
        >
          {showAddForm ? <X className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-black" />}
          {showAddForm ? 'Close console' : 'Add Position Analysis'}
        </button>
      </div>

      {/* KPI Display dashboard block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="glass-panel p-3.5 rounded border border-white/5 text-left min-w-0">
          <span className="text-[8.5px] sm:text-[9.5px] text-white/40 uppercase block leading-tight tracking-tight sm:tracking-wider whitespace-normal">INVESTED CAPITAL</span>
          <span className="text-sm sm:text-base md:text-lg font-black text-white block mt-1.5 truncate" title={`₹${(summary?.totalInvestment || 0).toLocaleString('en-IN')}`}>
            ₹{(summary?.totalInvestment || 0).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
          </span>
        </div>
        <div className="glass-panel p-3.5 rounded border border-white/5 text-left min-w-0">
          <span className="text-[8.5px] sm:text-[9.5px] text-white/40 uppercase block leading-tight tracking-tight sm:tracking-wider whitespace-normal">CURRENT VALUATION</span>
          <span className="text-sm sm:text-base md:text-lg font-black text-white block mt-1.5 font-bold truncate" title={`₹${(summary?.currentValue || 0).toLocaleString('en-IN')}`}>
            ₹{(summary?.currentValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
          </span>
        </div>
        <div className="glass-panel p-3.5 rounded border border-white/5 text-left min-w-0">
          <span className="text-[8.5px] sm:text-[9.5px] text-white/40 uppercase block leading-tight tracking-tight sm:tracking-wider whitespace-normal">UNREALIZED ABSOLUTE P&L</span>
          <span className={`text-sm sm:text-base md:text-lg font-black block mt-1.5 truncate flex items-center gap-1 ${(summary?.totalProfitLoss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`} title={`₹${(summary?.totalProfitLoss || 0).toLocaleString('en-IN')}`}>
            {(summary?.totalProfitLoss || 0) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <ArrowDownRight className="w-3.5 h-3.5 text-red-400 shrink-0" />}
            ₹{Math.abs(summary?.totalProfitLoss || 0).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
          </span>
        </div>
        <div className="glass-panel p-3.5 rounded border border-white/5 text-left min-w-0">
          <span className="text-[8.5px] sm:text-[9.5px] text-white/40 uppercase block leading-tight tracking-tight sm:tracking-wider whitespace-normal">PERCENT NET RETURN</span>
          <span className={`text-sm sm:text-base md:text-lg font-black block mt-1.5 truncate ${(summary?.profitLossPercent || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {(summary?.profitLossPercent || 0) >= 0 ? '+' : ''}{(summary?.profitLossPercent || 0).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Collapsible Position Logging Form */}
      {showAddForm && (
        <div className="glass-panel p-5 rounded border border-cyan-500/20 bg-cyan-950/5 font-mono space-y-4 shadow-[0_0_15px_rgba(0,242,255,0.02)] transition-all">
          <span className="text-[10px] font-extrabold text-[#00f2ff] tracking-widest uppercase block border-b border-white/5 pb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> REGISTER ANALYTICAL POSITION LOG
          </span>
          <form onSubmit={handleCreateTransaction} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-left">
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 uppercase font-bold">Ticker Symbol</span>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. RELIANCE, TCS, INFY"
                className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white uppercase focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 uppercase font-bold">Holding Quantity</span>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 50"
                className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                required
                min="1"
                step="any"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 uppercase font-bold">Avg Cost Price (₹)</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 2945"
                className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                required
                min="0.1"
                step="any"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 uppercase font-bold">Position Indicator</span>
              <div className="flex bg-black/60 border border-white/10 rounded h-9 items-center p-1">
                <button
                  type="button"
                  onClick={() => setType('BUY')}
                  className={`flex-1 text-[9px] h-full rounded uppercase tracking-wider font-extrabold cursor-pointer transition-colors ${type === 'BUY' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'text-white/40 hover:text-white/70'}`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setType('SELL')}
                  className={`flex-1 text-[9px] h-full rounded uppercase tracking-wider font-extrabold cursor-pointer transition-colors ${type === 'SELL' ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 'text-white/40 hover:text-white/70'}`}
                >
                  SELL
                </button>
              </div>
            </div>
            <div className="col-span-1 sm:col-span-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-cyan-400 text-black text-xs font-black uppercase tracking-widest rounded hover:bg-cyan-300 transition-all cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.15)] disabled:opacity-50"
              >
                {loading ? 'RECORDING POSITION TO TERM ANALYTICS...' : 'REGISTER POSITION DATA IN TERMINAL'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main tab select elements */}
      <div className="flex flex-wrap border-b border-white/5 font-mono text-[10px] uppercase font-black tracking-widest gap-1 select-none">
        
        <button
          onClick={() => setActiveTab('holdings')}
          className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 border-b-2 transition-all ${activeTab === 'holdings' ? 'border-cyan-400 text-white bg-white/[0.02]' : 'border-transparent text-white/40 hover:text-white/75'}`}
        >
          <Wallet className="w-3.5 h-3.5" /> Holdings Inventory
        </button>

        <button
          onClick={() => setActiveTab('risk-rebalance')}
          className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 border-b-2 transition-all ${activeTab === 'risk-rebalance' ? 'border-cyan-400 text-white bg-white/[0.02]' : 'border-transparent text-white/40 hover:text-white/75'}`}
        >
          <Scale className="w-3.5 h-3.5" /> Risk & Rebalance
        </button>

        <button
          onClick={() => setActiveTab('growth')}
          className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 border-b-2 transition-all ${activeTab === 'growth' ? 'border-cyan-400 text-white bg-white/[0.02]' : 'border-transparent text-white/40 hover:text-white/75'}`}
        >
          <Compass className="w-3.5 h-3.5" /> Growth & Dividends
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 border-b-2 transition-all ${activeTab === 'history' ? 'border-cyan-400 text-white bg-white/[0.02]' : 'border-transparent text-white/40 hover:text-white/75'}`}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Transaction Logs
        </button>

      </div>

      {/* Modules content grids representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Tab Body (Spans 2 grids) */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'holdings' && (
            <div className="space-y-6 animate-fade-in">
              {/* Holdings list */}
              <PortfolioHoldings 
                holdings={holdings} 
                onAddStockClick={() => {
                  setShowAddForm(true);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }} 
              />
              
              {/* Dynamic P&L breakdown statistics */}
              <PortfolioPnL holdings={holdings} summary={summary} />
            </div>
          )}

          {activeTab === 'risk-rebalance' && (
            <div className="space-y-6 animate-fade-in">
              {/* Volatility Beta matrix */}
              <RiskAnalysis holdings={holdings} />
              
              {/* Rebalancing suggested models */}
              <RebalancingSuggestions holdings={holdings} />
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="space-y-6 animate-fade-in">
              {/* SVG progression metrics */}
              <PerformanceMetrics holdings={holdings} summary={summary} />
              
              {/* Ex dividend records */}
              <DividendTracking dividends={dividends} totalHoldingValue={summary?.currentValue || 0} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6 animate-fade-in">
              {/* Full transaction grid list log */}
              <TransactionHistoryLog 
                transactions={transactions} 
                onRemoveTransaction={removeLocalTransaction} 
              />
            </div>
          )}

        </div>

        {/* Right Dashboard panel panel: SIP Calculator + informational context (Spans 1 grid) */}
        <div className="space-y-6">
          
          {/* Sector Allocation distribution donut blocks */}
          <SectorAllocation holdings={holdings} />
          
          {/* Compound Estimator form */}
          <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 text-left font-mono">
            <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest block border-b border-white/5 pb-2">
              SIP COMPOUNDING ESTIMATOR
            </span>
            <div className="space-y-4 font-mono text-xs">
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/50 uppercase">
                  <span>Monthly Allocation</span>
                  <span className="text-cyan-400 font-bold">₹{sipAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="150000"
                  step="2000"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-white/10 cursor-pointer h-1.5 rounded-lg appearance-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/50 uppercase">
                  <span>Time Horizon Horizon</span>
                  <span className="text-cyan-400 font-bold">{years} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-white/10 cursor-pointer h-1.5 rounded-lg appearance-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/50 uppercase">
                  <span>Target CAGR Rate</span>
                  <span className="text-cyan-400 font-bold">{expectedReturn}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="28"
                  step="0.5"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-white/10 cursor-pointer h-1.5 rounded-lg appearance-none"
                />
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2 text-[10px] uppercase">
                <div className="flex justify-between">
                  <span className="text-white/40">Total Invested:</span>
                  <span className="text-white font-bold">₹{totalInvestedSip.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Compound Wealth Gains:</span>
                  <span className="text-emerald-400 font-bold">+₹{sipReturns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 text-xs">
                  <span className="text-white/60 font-black">Estimated Compounded Asset:</span>
                  <span className="font-extrabold text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>₹{futureValueSip.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Formula reference */}
              <span className="text-[7.5px] leading-relaxed text-white/20 block font-light uppercase">
                FV = P * [ ((1 + r)^n - 1) / r ] * (1 + r) where r is monthly yield rates & n is month intervals.
              </span>

            </div>
          </div>

          {/* Quick core rebalance checklist rules */}
          <div className="glass-panel p-4 rounded border border-white/5 space-y-3 font-mono text-left bg-black/40">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block border-b border-white/5 pb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> REBALANCE RULES
            </span>
            <div className="space-y-2 text-[10px] leading-relaxed text-white/50">
              <p>• Avoid core single weight asset allocations exceeding 25% of absolute portfolio values to bypass structural concentration decay.</p>
              <p>• Routinely evaluate ex-dividend calendar timelines to collect maximum premium yield payouts.</p>
              <p>• Volatility thresholds over index baselines (Beta &gt; 1.3) dictate incremental tactical shielding hedges.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Portfolio;
