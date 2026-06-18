import React, { useState, useEffect } from 'react';
import screenerService from '../../services/screenerService';
import { Search, Sliders, Save, FileText, CheckCircle, RefreshCw, BarChart } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface StockResult {
  symbol: string;
  name: string;
  price: number;
  marketCap: number; // Cr
  peRatio: number;
  divYield: number; // %
  rsi14: number;
  debtToEquity: number;
}

export function StockScreener() {
  const [results, setResults] = useState<StockResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Screener constraints
  const [peMin, setPeMin] = useState(0);
  const [peMax, setPeMax] = useState(100);
  const [divYieldMin, setDivYieldMin] = useState(0);
  const [mcapMin, setMcapMin] = useState(1000); // 1000 Cr minimum
  
  const [screenerProfileName, setScreenerProfileName] = useState('');
  
  const { enqueueSnackbar } = useSnackbar();

  const handleRunScreen = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await screenerService.screen({
        peMin,
        peMax,
        divYieldMin,
        mcapMin
      }, { page: 1, limit: 15 }, {}, search);
      
      const raw = res?.data || res;
      if (Array.isArray(raw)) {
        setResults(raw);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    handleRunScreen();
  }, [peMin, peMax, divYieldMin, mcapMin, search]);

  const handleSaveScreenerPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenerProfileName.trim()) return;

    try {
      await screenerService.save({
        name: screenerProfileName.trim(),
        filters: { peMin, peMax, divYieldMin, mcapMin }
      });
      enqueueSnackbar(`Screener parameters registered under "${screenerProfileName}"!`, { variant: 'success' });
      setScreenerProfileName('');
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Access error saving screening profile.', { variant: 'error' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Securities valuation screening logic</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
          Equity Screener Console
        </h2>
        <p className="text-xs text-white/50 font-mono">Scan the entire Indian securities universe based on fundamental ratios, dividend yields, and leverage thresholds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Filter Sidebar Controls */}
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded border border-white/5 space-y-5 bg-black/40">
            <span className="text-[10px] font-black uppercase text-white tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Filter Criteria
            </span>

            {/* P/E Ratio Slider bounds */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase text-white/50">
                <span>Maximum P/E Ratio:</span>
                <span className="text-cyan-300 font-bold">{peMax}x</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={peMax}
                onChange={(e) => setPeMax(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10"
              />
            </div>

            {/* Dividend Yield Slider bounds */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase text-white/50">
                <span>Minimum Dividend Yield:</span>
                <span className="text-cyan-300 font-bold">{divYieldMin}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={divYieldMin}
                onChange={(e) => setDivYieldMin(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10"
              />
            </div>

            {/* Market cap bounds slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase text-white/50">
                <span>Minimum Cap value (Cr):</span>
                <span className="text-cyan-300 font-bold">₹{mcapMin.toLocaleString()} Cr</span>
              </div>
              <input
                type="range"
                min="100"
                max="50000"
                step="500"
                value={mcapMin}
                onChange={(e) => setMcapMin(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10"
              />
            </div>

          </div>

          {/* Quick save search parameters form */}
          <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-cyan-950/5">
            <span className="text-[10px] font-black uppercase text-cyan-300 tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-2">
              <Save className="w-3.5 h-3.5 text-cyan-400" /> Save Preset
            </span>
            <form onSubmit={handleSaveScreenerPreset} className="space-y-3">
              <input
                type="text"
                placeholder="Preset Name (e.g., High Yield Mid Caps)..."
                value={screenerProfileName}
                onChange={(e) => setScreenerProfileName(e.target.value)}
                className="w-full p-2 bg-black/60 border border-white/10 rounded text-[10px] text-white focus:outline-none focus:border-cyan-400"
                required
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black font-black text-[9px] uppercase tracking-widest rounded transition-all cursor-pointer"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                Save Filter parameters
              </button>
            </form>
          </div>
        </div>

        {/* Right Columns (span 3): Search results table */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/33" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by specific company entity or symbol..."
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/5 rounded text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="glass-panel rounded border border-white/5 overflow-x-auto bg-black/40">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-black/45 border-b border-b-white/10 text-white/40 uppercase text-[9px] tracking-widest font-black">
                  <th className="p-3">SYMBOL</th>
                  <th className="p-3">COMPANY NAME</th>
                  <th className="p-3 text-right">LATEST PRICE</th>
                  <th className="p-3 text-right">M.CAP (CR)</th>
                  <th className="p-3 text-right">P/E RATIO</th>
                  <th className="p-3 text-right">DIV YIELD</th>
                  <th className="p-3 text-right">RSI 14</th>
                  <th className="p-3 text-right">DEBT/EQUITY</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-white/30 animate-pulse">Running screening parameters logic against indices database...</td>
                  </tr>
                ) : results.length > 0 ? (
                  results.map((r, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                      <td className="p-3 font-extrabold text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>{r.symbol}</td>
                      <td className="p-3 text-white/70 truncate max-w-[150px]">{r.name}</td>
                      <td className="p-3 text-right text-white font-bold">₹{r.price.toFixed(2)}</td>
                      <td className="p-3 text-right text-white/80">₹{r.marketCap.toLocaleString()} Cr</td>
                      <td className="p-3 text-right text-white/90">{r.peRatio.toFixed(1)}x</td>
                      <td className="p-3 text-right text-emerald-400 font-bold font-mono">+{r.divYield.toFixed(1)}%</td>
                      <td className="p-3 text-right font-bold text-[#ffaa00]" style={{ color: 'var(--brand-amber)' }}>{r.rsi14}</td>
                      <td className="p-3 text-right text-white/55">{r.debtToEquity.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-white/30 font-mono text-xs">No matching securities found in terminal databases.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StockScreener;
