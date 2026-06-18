import React, { useEffect, useState } from 'react';
import alertService from '../../services/alertService';
import { ShieldAlert, Bell, Plus, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt?: string;
  isActive?: boolean;
}

export function Alerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create Alert Form States
  const [symbol, setSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  
  const { enqueueSnackbar } = useSnackbar();

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await alertService.getAlerts();
      const rawData = res?.data || res;
      if (Array.isArray(rawData)) {
        setAlerts(rawData);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error(err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !targetPrice) return;

    try {
      const symbolUpper = symbol.trim().toUpperCase();
      const priceNum = parseFloat(targetPrice);

      const payload = {
        symbol: symbolUpper,
        targetPrice: priceNum,
        condition
      };

      await alertService.createAlert(payload);
      
      const newAlert: PriceAlert = {
        id: 'ALT-' + Math.random().toString(36).substring(5),
        symbol: symbolUpper,
        targetPrice: priceNum,
        condition,
        createdAt: new Date().toISOString().substring(0, 10),
        isActive: true
      };

      setAlerts(prev => [newAlert, ...prev]);
      enqueueSnackbar(`Price alert target set for ${symbolUpper} at ₹${priceNum}!`, { variant: 'success' });
      
      setSymbol('');
      setTargetPrice('');
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Access error creating price alert.', { variant: 'error' });
    }
  };

  const handleDeleteAlert = async (id: string, symbol: string) => {
    try {
      await alertService.deleteAlert(id);
      setAlerts(prev => prev.filter(al => al.id !== id));
      enqueueSnackbar(`Price alert trigger for ${symbol} deleted.`, { variant: 'success' });
    } catch (err: any) {
      setAlerts(prev => prev.filter(al => al.id !== id));
      enqueueSnackbar(`Purged alert for ${symbol} offline.`, { variant: 'success' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Real-time Threshold parameters</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
          <Bell className="w-5 h-5 text-yellow-400 font-bold" /> Price Alerts Center
        </h2>
        <p className="text-xs text-white/50 font-mono">Establish custom target thresholds on active securities and dispatch webhooks notifications when targets are breached</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Left Span (2 cols): Current Active alerts catalog */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40">
            <span className="text-[11px] font-black uppercase text-white tracking-widest block">Active Triggers Catalog</span>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-black/45 border-b border-b-white/10 text-white/40 uppercase text-[9px] tracking-widest font-black">
                    <th className="p-3">SYMBOL</th>
                    <th className="p-3">CONDITION</th>
                    <th className="p-3 text-right">TARGET PRICE</th>
                    <th className="p-3">CREATED ON</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/30 animate-pulse">Accessing alert database registries...</td>
                    </tr>
                  ) : alerts.length > 0 ? (
                    alerts.map((al) => (
                      <tr key={al.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                        <td className="p-3 font-extrabold text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>{al.symbol}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${al.condition === 'ABOVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            BREACH {al.condition}
                          </span>
                        </td>
                        <td className="p-3 text-right text-white font-bold font-mono">₹{al.targetPrice.toFixed(2)}</td>
                        <td className="p-3 text-white/50">{al.createdAt || 'RECENT'}</td>
                        <td className="p-3">
                          <span className="text-emerald-400 font-extrabold flex items-center gap-1 text-[10px] uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> operational
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteAlert(al.id, al.symbol)}
                            className="p-1 px-2.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded cursor-pointer transition-all uppercase text-[9px]"
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/30">No target breach alerts active. Save parameters using the Form on the right.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Span: Create price alert form */}
        <div className="space-y-6">
          <form onSubmit={handleCreateAlert} className="glass-panel p-4 rounded border border-white/5 bg-cyan-950/5 space-y-4">
            <span className="text-[10px] font-black uppercase text-cyan-300 tracking-widest block border-b border-cyan-500/15 pb-2">
              REGISTER BREACH TRACKER
            </span>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">Ticker Ticker Symbol</span>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. INFY, TCS"
                  className="w-full p-2 bg-black/60 border border-white/10 rounded uppercase text-white focus:outline-none focus:border-cyan-400 font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">Breach Condition</span>
                <div className="flex bg-black/60 border border-white/10 rounded items-center p-1">
                  <button
                    type="button"
                    onClick={() => setCondition('ABOVE')}
                    className={`flex-1 py-1 text-[9px] rounded uppercase font-black tracking-wider cursor-pointer ${condition === 'ABOVE' ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300' : 'text-white/40'}`}
                  >
                    GOES ABOVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('BELOW')}
                    className={`flex-1 py-1 text-[9px] rounded uppercase font-black tracking-wider cursor-pointer ${condition === 'BELOW' ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300' : 'text-white/40'}`}
                  >
                    DROPS BELOW
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">Target price value (₹)</span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full p-2 bg-black/60 border border-white/10 rounded text-white focus:outline-none focus:border-cyan-400 font-bold"
                  required
                  step="any"
                  min="0.01"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black font-black uppercase tracking-widest rounded transition-all cursor-pointer shadow-[0_0_10px_rgba(0,242,255,0.2)]"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                Launch Price Tracker
              </button>
            </div>
          </form>

          {/* Quick instructions */}
          <div className="glass-panel p-4 rounded border border-white/5 space-y-2 text-[10px] text-white/50 leading-relaxed text-left font-sans">
            <span className="text-[10px] font-black font-mono uppercase text-white tracking-wider block border-b border-white/5 pb-1 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-cyan-400" /> SYSTEM GATEWAY ACTIONS
            </span>
            <p>• Triggers dispatch synchronous audio signal cues. Ensure tab settings have site sound unlocked.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Alerts;
