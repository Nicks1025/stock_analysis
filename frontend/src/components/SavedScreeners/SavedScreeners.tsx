import React, { useEffect, useState } from 'react';
import screenerService from '../../services/screenerService';
import { Bookmark, FileSpreadsheet, Trash2, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface SavedScreener {
  id: string;
  name: string;
  peMin?: number;
  peMax?: number;
  divYieldMin?: number;
  mcapMin?: number;
  createdAt?: string;
  filters?: any;
}

export function SavedScreeners() {
  const [saved, setSaved] = useState<SavedScreener[]>([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchSavedScreeners = async () => {
    setLoading(true);
    try {
      const res = await screenerService.getSaved();
      const rawData = res?.data || res;
      if (Array.isArray(rawData)) {
        setSaved(rawData);
      } else {
        setSaved([]);
      }
    } catch (err) {
      console.error(err);
      setSaved([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedScreeners();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    try {
      await screenerService.delete(id);
      setSaved(prev => prev.filter(s => s.id !== id));
      enqueueSnackbar(`Screener profile "${name}" purged successfully!`, { variant: 'success' });
    } catch (err: any) {
      // Offline fallback deletion
      setSaved(prev => prev.filter(s => s.id !== id));
      enqueueSnackbar(`Deleted "${name}" offline.`, { variant: 'success' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Securities memory profiles</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
          <Bookmark className="w-5 h-5 text-cyan-400" style={{ color: 'var(--brand-cyan)' }} /> Saved Screeners
        </h2>
        <p className="text-xs text-white/50 font-mono">Rerun registered custom screening filters parameters or purge retired filters profiles</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/30 animate-pulse font-mono text-xs">Accessing securities saved registries...</div>
      ) : saved.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          {saved.map((item) => (
            <div key={item.id} className="glass-panel p-5 rounded border border-white/5 flex flex-col justify-between space-y-4 bg-black/40 hover:border-cyan-500/20 transition-all font-mono">
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-white/40 uppercase font-black">PRESET INTERFACE LOCK</span>
                  <span className="text-white/30">{item.createdAt || 'RECENT'}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-sm tracking-wide uppercase">{item.name}</h3>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-white/50 leading-relaxed font-mono">
                    <p>• Max P/E: <span className="text-cyan-400">{item.peMax || item.filters?.peMax || 'None'}x</span></p>
                    <p>• Min Yield: <span className="text-cyan-400">+{item.divYieldMin || item.filters?.divYieldMin || '0'}%</span></p>
                    <p>• Min Cap: <span className="text-cyan-400">₹{(item.mcapMin || item.filters?.mcapMin || 1000).toLocaleString()} Cr</span></p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-white/5 font-mono">
                <button 
                  onClick={() => enqueueSnackbar(`Rerunning screening profile parameters for : ${item.name}`, { variant: 'info' })}
                  className="flex-1 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-[#00f2ff] font-bold text-[10px] uppercase rounded tracking-wider border border-cyan-400/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ color: 'var(--brand-cyan)' }}
                >
                  Rerun Parameters <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="px-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded cursor-pointer transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-white/30 font-mono text-xs border border-white/5 bg-black/20 rounded">
          No saved screening parameter profiles registered to your operator session.
        </div>
      )}
    </div>
  );
}

export default SavedScreeners;
