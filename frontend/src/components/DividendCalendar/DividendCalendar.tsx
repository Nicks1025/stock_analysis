import React, { useEffect, useState } from 'react';
import dividendService from '../../services/dividendService';
import { Calendar, DollarSign, ArrowUpRight, Search, Landmark, TrendingUp } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface Dividend {
  id: string;
  symbol: string;
  companyName: string;
  amount: number;
  type: string;
  exDate: string;
  recordDate?: string;
  paymentDate?: string;
  yieldPercent?: number;
}

export function DividendCalendar() {
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const { enqueueSnackbar } = useSnackbar();

  const fetchDividends = async () => {
    setLoading(true);
    try {
      const res = await dividendService.getDividends();
      const rawData = res?.data || res;
      if (Array.isArray(rawData)) {
        setDividends(rawData);
      } else {
        setDividends([]);
      }
    } catch (err: any) {
      console.error(err);
      setDividends([]);
      enqueueSnackbar('Could not load dividend calendar feeds.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDividends();
  }, []);

  const filteredDividends = dividends.filter(d => {
    const query = search.toLowerCase();
    const dType = d.type.toUpperCase();
    
    const matchesSearch = d.symbol.toLowerCase().includes(query) || d.companyName.toLowerCase().includes(query);
    const matchesType = filterType === 'ALL' || dType === filterType.toUpperCase();
    
    return matchesSearch && matchesType;
  });

  const avgYield = filteredDividends.length > 0 ? (filteredDividends.reduce((sum, d) => sum + (d.yieldPercent || 0), 0) / filteredDividends.length) : 0;
  const totalDeclaredValue = filteredDividends.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Securities Yield diagnostics</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan" style={{ color: 'var(--brand-cyan)' }}>
          Dividend Yield Calendar
        </h2>
        <p className="text-xs text-white/50 font-mono">Ex-dividend dates, yield percentages, and payout schedules for active Indian Equities</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="glass-panel p-4 rounded border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase block">Average Yield Premium</span>
            <span className="text-xl font-bold text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>{formatPercent(avgYield)}</span>
          </div>
          <TrendingUp className="w-8 h-8 text-cyan-500/20" />
        </div>
        <div className="glass-panel p-4 rounded border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase block">Declared payouts</span>
            <span className="text-xl font-bold text-emerald-400">₹{totalDeclaredValue.toFixed(2)}</span>
          </div>
          <Landmark className="w-8 h-8 text-emerald-500/20" />
        </div>
        <div className="glass-panel p-4 rounded border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase block">Tracking issues</span>
            <span className="text-xl font-bold text-white">{filteredDividends.length} Active</span>
          </div>
          <Calendar className="w-8 h-8 text-white/10" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/40 p-4 rounded border border-white/5">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/35" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symbol or name..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'INTErim', 'FINAL'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-[10px] font-mono rounded cursor-pointer uppercase tracking-wider ${
                filterType.toUpperCase() === type.toUpperCase()
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-white/5 border border-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table block */}
      <div className="glass-panel rounded border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-black/45 border-b border-white/10 text-white/40 uppercase text-[9px] tracking-widest font-black">
              <th className="p-4">SYMBOL</th>
              <th className="p-4">COMPANY INFRASTRUCTURE</th>
              <th className="p-4 text-right">PAYOUT/NAME</th>
              <th className="p-4">PAYMENT TYPE</th>
              <th className="p-4">EX-DATE</th>
              <th className="p-4 text-right">ESTIMATED YIELD</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-white/30 animate-pulse">Running telemetry ex-date checks...</td>
              </tr>
            ) : filteredDividends.length > 0 ? (
              filteredDividends.map((div) => (
                <tr key={div.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                  <td className="p-4 font-extrabold text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>{div.symbol}</td>
                  <td className="p-4 text-white/80">{div.companyName}</td>
                  <td className="p-4 text-right text-emerald-400 font-bold">₹{div.amount.toFixed(2)}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white/60 text-[10px] uppercase">{div.type}</span></td>
                  <td className="p-4 text-white">{div.exDate}</td>
                  <td className="p-4 text-right text-[#ffaa00] font-bold" style={{ color: 'var(--brand-amber)' }}>{div.yieldPercent ? `${div.yieldPercent.toFixed(1)}%` : '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-white/30">No matching ex-dividend schedules registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DividendCalendar;
