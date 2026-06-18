import React, { useEffect, useState } from 'react';
import { earningsService } from '../../services/earningsService';
import { Calendar, TrendingUp, TrendingDown, Search, Award, FileText } from 'lucide-react';
import { formatPercent } from '../../utils/formatters';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface Earnings {
  id: string;
  symbol: string;
  companyName: string;
  reportDate: string;
  period: string;
  consensusEps: number;
  actualEps?: number;
  surprisePercent?: number;
}

export function Earnings() {
  const [earnings, setEarnings] = useState<Earnings[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const res = await earningsService.getEarnings();
      const rawData = res?.data || res;
      if (Array.isArray(rawData)) {
        setEarnings(rawData);
      } else {
        setEarnings([]);
      }
    } catch (err) {
      console.error(err);
      setEarnings([]);
      enqueueSnackbar('Could not load quarterly corporate earnings feeds.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const filteredEarnings = earnings.filter(e => 
    e.symbol.toLowerCase().includes(search.toLowerCase()) || 
    e.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const surpriseGainers = filteredEarnings.filter(e => (e.surprisePercent || 0) > 0);
  const surpriseLosers = filteredEarnings.filter(e => (e.surprisePercent || 0) < 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Quarterly Earnings Telemetry</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan" style={{ color: 'var(--brand-cyan)' }}>
          Earnings Calendar
        </h2>
        <p className="text-xs text-white/50 font-mono">Track upcoming financial disclosures, consensus EPS forecasts, and actual surprise ratios</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="glass-panel p-4 rounded border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase block">Tracking Earnings Releases</span>
            <span className="text-xl font-bold text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>{filteredEarnings.length} FILINGS</span>
          </div>
          <FileText className="w-8 h-8 text-cyan-500/20" />
        </div>
        <div className="glass-panel p-4 rounded border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase block">Bullish EPS Surprises</span>
            <span className="text-xl font-bold text-emerald-400">{surpriseGainers.length} Outperformed</span>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-500/20" />
        </div>
        <div className="glass-panel p-4 rounded border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase block">Bearish Misses</span>
            <span className="text-xl font-bold text-red-500">{surpriseLosers.length} Missed</span>
          </div>
          <TrendingDown className="w-8 h-8 text-red-500/20" />
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-black/40 p-4 rounded border border-white/5 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/35" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or ticker symbol..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
          />
        </div>
      </div>

      {/* Table block */}
      <div className="glass-panel rounded border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-black/45 border-b border-b-white/10 text-white/40 uppercase text-[9px] tracking-widest font-black">
              <th className="p-4">SYMBOL</th>
              <th className="p-4">COMPANY ENTITY</th>
              <th className="p-4">FISCAL PERIOD</th>
              <th className="p-4">RELEASE DATE</th>
              <th className="p-4 text-right">CONSENSUS FORECAST</th>
              <th className="p-4 text-right">ACTUAL REGISTERED</th>
              <th className="p-4 text-right">SURPRISE %</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-white/30 animate-pulse">Polling corporate filings database...</td>
              </tr>
            ) : filteredEarnings.length > 0 ? (
              filteredEarnings.map((earn) => (
                <tr key={earn.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                  <td className="p-4 font-extrabold text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>{earn.symbol}</td>
                  <td className="p-4 text-white/80">{earn.companyName}</td>
                  <td className="p-4 font-bold text-white/60">{earn.period}</td>
                  <td className="p-4 text-white">{earn.reportDate}</td>
                  <td className="p-4 text-right text-white/50">₹{earn.consensusEps.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-white">
                    {earn.actualEps !== undefined ? `₹${earn.actualEps.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-4 text-right">
                    {earn.surprisePercent !== undefined ? (
                      <span className={earn.surprisePercent >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {earn.surprisePercent >= 0 ? '▲ +' : '▼ '} {earn.surprisePercent.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-white/30">PENDING</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-white/30">No matching quarterly release records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Earnings;
