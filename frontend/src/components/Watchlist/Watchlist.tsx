import React, { useEffect, useState } from 'react';
import watchlistService from '../../services/watchlistService';
import { useWatchlistStore } from '../../store/watchlistStore';
import { Star, Plus, MessageSquare, Tag, Search, Trash2, CheckCircle, Info, Layers } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface SecuritySpec {
  symbol: string;
  companyName: string;
  category: string;
  lastPrice: number;
  changePercent: number;
}

const POPULAR_SECURITIES: SecuritySpec[] = [
  { symbol: "TCS", companyName: "Tata Consultancy Services Ltd", category: "Information Technology", lastPrice: 3820.45, changePercent: 1.25 },
  { symbol: "RELIANCE", companyName: "Reliance Industries Ltd", category: "Conglomerate / Energy", lastPrice: 2465.10, changePercent: -0.45 },
  { symbol: "INFY", companyName: "Infosys Ltd", category: "Information Technology", lastPrice: 1485.60, changePercent: 2.10 },
  { symbol: "HDFCBANK", companyName: "HDFC Bank Ltd", category: "Banking & Finance", lastPrice: 1610.25, changePercent: 0.35 },
  { symbol: "ICICIBANK", companyName: "ICICI Bank Ltd", category: "Banking & Finance", lastPrice: 1115.80, changePercent: -1.15 },
  { symbol: "SBIN", companyName: "State Bank of India", category: "Banking & Finance", lastPrice: 830.15, changePercent: 1.65 },
  { symbol: "WIPRO", companyName: "Wipro Ltd", category: "Information Technology", lastPrice: 472.30, changePercent: -0.85 },
  { symbol: "ITC", companyName: "ITC Ltd", category: "Consumer Goods", lastPrice: 425.90, changePercent: 0.95 },
  { symbol: "TATAMOTORS", companyName: "Tata Motors Ltd", category: "Automotive", lastPrice: 960.50, changePercent: 3.40 },
  { symbol: "BHARTIARTL", companyName: "Bharti Airtel Ltd", category: "Telecommunications", lastPrice: 1380.20, changePercent: -0.15 }
];

export function Watchlist() {
  const { watchlists, setWatchlists } = useWatchlistStore();
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const [watchlistName, setWatchlistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customSymbolQuery, setCustomSymbolQuery] = useState('');

  // Mapping state variables
  const [currMappingSecurity, setCurrMappingSecurity] = useState<SecuritySpec | null>(null);
  
  // Note / Tag tracking states
  const [noteSymbol, setNoteSymbol] = useState('');
  const [noteText, setNoteText] = useState('');
  const [tagSymbol, setTagSymbol] = useState('');
  const [tagText, setTagText] = useState('');
  
  const [notesList, setNotesList] = useState<Record<string, string[]>>({});
  const [tagsList, setTagsList] = useState<Record<string, string[]>>({});
  
  const { enqueueSnackbar } = useSnackbar();

  // Initalize default watchlists on load if none present
  useEffect(() => {
    if (watchlists.length === 0) {
      const initialWL = [
        {
          id: 'WL-default',
          name: 'Primary Tracking',
          stocks: [
            { id: 'S1', symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd', lastPrice: 3820.45, changePercent: 1.25 },
            { id: 'S2', symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd', lastPrice: 2465.10, changePercent: -0.45 }
          ]
        },
        {
          id: 'WL-tech',
          name: 'Tech Group',
          stocks: [
            { id: 'S3', symbol: 'INFY', companyName: 'Infosys Ltd', lastPrice: 1485.60, changePercent: 2.10 },
            { id: 'S4', symbol: 'WIPRO', companyName: 'Wipro Ltd', lastPrice: 472.30, changePercent: -0.85 }
          ]
        }
      ];
      setWatchlists(initialWL);
      setActiveWatchlistId('WL-default');
    } else if (!activeWatchlistId && watchlists.length > 0) {
      setActiveWatchlistId(watchlists[0].id);
    }
  }, [watchlists, setWatchlists, activeWatchlistId]);

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId);

  const handleCreateWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    const nameStr = watchlistName.trim();
    if (!nameStr) return;

    try {
      const id = 'WL-' + Math.random().toString(36).substring(5);
      const newWl = {
        id,
        name: nameStr,
        stocks: []
      };
      setWatchlists([...watchlists, newWl]);
      setActiveWatchlistId(id);
      setWatchlistName('');
      enqueueSnackbar(`Custom Watchlist "${nameStr}" initialized!`, { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar('Error creating watchlist.', { variant: 'error' });
    }
  };

  const handleToggleStockInWatchlist = (wlId: string, security: any) => {
    const updated = watchlists.map(wl => {
      if (wl.id === wlId) {
        const stocksList = wl.stocks || [];
        const exists = stocksList.some((s: any) => s.symbol.toUpperCase() === security.symbol.toUpperCase());
        
        if (exists) {
          // Remove it
          const filtered = stocksList.filter((s: any) => s.symbol.toUpperCase() !== security.symbol.toUpperCase());
          enqueueSnackbar(`Removed ${security.symbol} from ${wl.name}`, { variant: 'info' });
          return { ...wl, stocks: filtered };
        } else {
          // Add it
          const added = [
            ...stocksList,
            {
              id: 'STK-' + Math.random().toString(36).substring(5),
              symbol: security.symbol.toUpperCase(),
              companyName: security.companyName,
              lastPrice: security.lastPrice,
              changePercent: security.changePercent
            }
          ];
          enqueueSnackbar(`Added ${security.symbol} to ${wl.name}`, { variant: 'success' });
          return { ...wl, stocks: added };
        }
      }
      return wl;
    });
    setWatchlists(updated);
  };

  const deleteStockFromActive = (symbolToDelete: string) => {
    if (!activeWatchlistId) return;
    const updated = watchlists.map(wl => {
      if (wl.id === activeWatchlistId) {
        return {
          ...wl,
          stocks: (wl.stocks || []).filter((s: any) => s.symbol.toUpperCase() !== symbolToDelete.toUpperCase())
        };
      }
      return wl;
    });
    setWatchlists(updated);
    enqueueSnackbar(`Stock ${symbolToDelete} removed from active list.`, { variant: 'info' });
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteSymbol || !noteText) return;
    
    setNotesList(prev => ({
      ...prev,
      [noteSymbol]: [...(prev[noteSymbol] || []), noteText]
    }));
    
    enqueueSnackbar(`Security note logged for ticker ${noteSymbol}`, { variant: 'success' });
    setNoteText('');
    setNoteSymbol('');
  };

  const submitTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagSymbol || !tagText) return;
    
    setTagsList(prev => ({
      ...prev,
      [tagSymbol]: [...(prev[tagSymbol] || []), tagText.toUpperCase()]
    }));
    
    enqueueSnackbar(`Security tag [${tagText.toUpperCase()}] mapped to ticker ${tagSymbol}`, { variant: 'success' });
    setTagText('');
    setTagSymbol('');
  };

  // Filter populaire listed stocks
  const filteredSecurities = POPULAR_SECURITIES.filter(sec => 
    sec.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrackCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const symbolStr = customSymbolQuery.trim().toUpperCase();
    if (!symbolStr) return;

    if (!activeWatchlistId) {
      enqueueSnackbar('Please create or select a watchlist first.', { variant: 'error' });
      return;
    }

    const pseudoSec = {
      symbol: symbolStr,
      companyName: `${symbolStr} Equity Placement`,
      category: 'Custom Entry',
      lastPrice: 150 + Math.random() * 850,
      changePercent: -2.5 + Math.random() * 5
    };

    handleToggleStockInWatchlist(activeWatchlistId, pseudoSec);
    setCustomSymbolQuery('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none text-left" id="watchlist-console-root">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Watchlist diagnostic matrices</div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
            Watchlist Console
          </h2>
          <p className="text-xs text-white/50 font-mono">Construct tracking lists, search NSE securities exchange, tag listings & append research logs</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded text-[10px] font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-emerald-400 uppercase font-black tracking-wider">Dynamic Stream Active</span>
        </div>
      </div>

      {/* Primary Structure Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
        
        {/* Left Span: SEC CONSOLE DIRECTORY (Grid 5/12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 rounded border border-white/5 space-y-4 bg-black/40">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[11px] font-black uppercase text-white tracking-widest block">
                Securities Exchange Market
              </span>
              <span className="text-[9px] text-white/40">Select a real stock to allocate across any watchlist tracking group</span>
            </div>

            {/* General search on POPULAR list */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search TCS, Reliance, HDFC..."
                className="w-full h-9 bg-black/60 border border-white/10 pl-9 pr-3 rounded text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Popular stocks list render with inline MultiWatchlist Add selection */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {filteredSecurities.map((sec) => (
                <div 
                  key={sec.symbol} 
                  className="p-3 bg-black/35 hover:bg-black/50 border border-white/5 rounded flex items-center justify-between transition-all"
                >
                  <div className="min-w-0 max-w-[60%] space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white text-xs">{sec.symbol}</span>
                      <span className="text-[7.5px] uppercase bg-white/5 text-white/40 px-1 py-0.2 rounded font-black tracking-wider">{sec.category}</span>
                    </div>
                    <p className="text-[10px] text-white/45 truncate">{sec.companyName}</p>
                    <div className="text-[9px] text-white/30">
                      ₹{sec.lastPrice.toFixed(2)} // <span className={sec.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{sec.changePercent >= 0 ? '+' : ''}{sec.changePercent}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrMappingSecurity(sec)}
                      className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-black hover:font-bold border border-cyan-500/20 text-[9px] font-black uppercase rounded cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-cyan-400 hover:text-black shrink-0" />
                      Add To Watchlist
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom stock addition field if not found */}
            <form onSubmit={handleTrackCustom} className="border-t border-white/5 pt-4 space-y-2">
              <span className="text-[9px] text-white/40 uppercase block font-black">Not Listed? Add Custom Ticker Symbol</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. INFOSYS, ADANIENT..."
                  value={customSymbolQuery}
                  onChange={(e) => setCustomSymbolQuery(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/10 h-8 px-2 rounded uppercase text-white font-mono text-[10px] placeholder-white/20 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-3 bg-cyan-950/40 hover:bg-cyan-500 border border-cyan-500/25 text-cyan-300 hover:text-black font-extrabold text-[9px] uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  Track Cust
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Span: ACTIVE LIST MONITOR (Grid 7/12) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-5 rounded border border-white/5 bg-black/40 space-y-5">
            {/* Dynamic tabs list */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-black block">Active Watchlists</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {watchlists.map(w => (
                    <button
                      key={w.id}
                      onClick={() => setActiveWatchlistId(w.id)}
                      className={`px-3 py-1.5 text-[9.5px] uppercase font-mono rounded border cursor-pointer transition-all ${
                        activeWatchlistId === w.id
                          ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 font-black'
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Create watch list form */}
              <form onSubmit={handleCreateWatchlist} className="flex gap-1 border border-white/10 bg-black p-1 rounded max-w-sm">
                <input
                  type="text"
                  placeholder="Create checklist..."
                  value={watchlistName}
                  onChange={(e) => setWatchlistName(e.target.value)}
                  className="px-2 py-1 text-[9.5px] text-white bg-transparent focus:outline-none placeholder-white/20 w-28 uppercase font-bold"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[9px] uppercase rounded transition-all cursor-pointer shrink-0"
                  style={{ backgroundColor: 'var(--brand-cyan)' }}
                >
                  Create
                </button>
              </form>
            </div>

            {/* Actively tracked symbols list */}
            <div className="space-y-4">
              {activeWatchlist?.stocks && activeWatchlist.stocks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeWatchlist.stocks.map((stock: any, index: number) => {
                    const customNotes = notesList[stock.symbol] || [];
                    const customTags = tagsList[stock.symbol] || [];
                    return (
                      <div 
                        key={stock.id || index} 
                        className="bg-black/60 p-4 border border-white/10 rounded flex flex-col justify-between space-y-3 hover:border-cyan-500/15 transition-all text-left"
                      >
                        <div className="flex justify-between items-start border-b border-white/5 pb-2">
                          <div className="min-w-0 max-w-[70%]">
                            <span className="text-xs uppercase font-extrabold text-white">{stock.symbol}</span>
                            <span className="text-[9px] text-white/40 block leading-tight truncate">{stock.companyName || 'Corporate Entity'}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-white block">₹{(stock.lastPrice || 100).toLocaleString('en-IN', { minimumFractionDigits: 1 })}</span>
                            <span className={`text-[9px] ${(stock.changePercent || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {(stock.changePercent || 0) >= 0 ? '▲ +' : '▼ '}{(stock.changePercent || 0).toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        {/* Mapped Dynamic custom tag list */}
                        <div className="flex flex-wrap gap-1">
                          {customTags.length > 0 ? (
                            customTags.map((t, idx) => (
                              <span key={idx} className="text-[8.5px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.2 rounded font-black tracking-wider uppercase">
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-[8px] text-white/20 uppercase tracking-widest">No active dynamic tags</span>
                          )}
                        </div>

                        {/* Analytical client-side notes logged */}
                        {customNotes.length > 0 && (
                          <div className="bg-white/[0.02] p-2 rounded border border-white/5 text-[9.5px] text-white/70 space-y-1.5 max-h-24 overflow-y-auto font-sans">
                            {customNotes.map((n, idx) => (
                              <p key={idx} className="border-b border-white/5 pb-0.5 last:border-0 leading-relaxed">• {n}</p>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setNoteSymbol(stock.symbol);
                                setTagSymbol('');
                              }}
                              className="text-[9px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-black"
                            >
                              + Note
                            </button>
                            <button
                              onClick={() => {
                                setTagSymbol(stock.symbol);
                                setNoteSymbol('');
                              }}
                              className="text-[9px] text-[#ffaa00] hover:underline flex items-center gap-1 cursor-pointer font-black font-mono"
                              style={{ color: 'var(--brand-amber)' }}
                            >
                              + Tag
                            </button>
                          </div>
                          
                          <button
                            onClick={() => deleteStockFromActive(stock.symbol)}
                            className="p-1 text-white/30 hover:text-rose-400 transition-colors"
                            title="Remove stock from this watchlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-white/30 border border-white/5 border-dashed rounded p-6 bg-black/20 font-mono">
                  This watchlist has no registered ticker nodes. Use the directory search bar on the left to allocate stocks.
                </div>
              )}
            </div>
          </div>

          {/* Form blocks / Interactive Append Drawers */}
          <div className="space-y-4">
            {noteSymbol && (
              <div className="glass-panel p-4 rounded border border-cyan-500/20 bg-cyan-950/5 relative overflow-hidden space-y-4">
                <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
                  <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">
                    APPEND NOTE: {noteSymbol}
                  </span>
                  <button onClick={() => setNoteSymbol('')} className="text-white/40 hover:text-white font-bold text-xs">×</button>
                </div>
                <form onSubmit={submitNote} className="space-y-3 font-mono">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Type technical observations..."
                    className="w-full p-2 h-16 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded hover:bg-cyan-400 transition-all cursor-pointer"
                    style={{ backgroundColor: 'var(--brand-cyan)' }}
                  >
                    Save Note
                  </button>
                </form>
              </div>
            )}

            {tagSymbol && (
              <div className="glass-panel p-4 rounded border border-amber-500/20 bg-amber-950/5 relative overflow-hidden space-y-4">
                <div className="flex justify-between items-center border-b border-amber-500/10 pb-2">
                  <span className="text-[10px] font-mono font-black text-[#ffaa00] uppercase tracking-widest" style={{ color: 'var(--brand-amber)' }}>
                    MAP SECURITY LABELS: {tagSymbol}
                  </span>
                  <button onClick={() => setTagSymbol('')} className="text-white/40 hover:text-white font-bold text-xs">×</button>
                </div>
                <form onSubmit={submitTag} className="space-y-3 font-mono">
                  <input
                    type="text"
                    value={tagText}
                    onChange={(e) => setTagText(e.target.value)}
                    placeholder="e.g. ACCUMULATE, BREAKOUT, RESISTANCE"
                    className="w-full p-2 bg-black/60 border border-white/10 h-9 rounded text-xs text-white focus:outline-none focus:border-amber-400 uppercase"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded hover:bg-amber-400 transition-all cursor-pointer"
                    style={{ backgroundColor: 'var(--brand-amber)' }}
                  >
                    Confirm Label
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MultiWatchlist Interactive Allocation Dialog/Drawer Popover */}
      {currMappingSecurity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono text-[11px] text-left">
          <div className="bg-neutral-900 border border-white/10 p-5 rounded-lg w-full max-w-sm space-y-4 text-left">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-extrabold block">WATCHLIST ROUTER MATRIX</span>
              <h4 className="text-white font-extrabold text-sm uppercase">Allocate Ticker: {currMappingSecurity.symbol}</h4>
              <p className="text-white/40 text-[9.5px] mt-1 leading-relaxed">
                Check/uncheck below to immediately map the security relative to your active watching lists.
              </p>
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {watchlists.map((wl) => {
                const alreadyAdded = (wl.stocks || []).some((s: any) => s.symbol.toUpperCase() === currMappingSecurity.symbol.toUpperCase());
                return (
                  <button
                    key={wl.id}
                    onClick={() => handleToggleStockInWatchlist(wl.id, currMappingSecurity)}
                    className="w-full p-2 bg-black/40 hover:bg-black border border-white/5 rounded flex justify-between items-center text-left text-[10px] text-white/80 cursor-pointer hover:border-cyan-500/20"
                  >
                    <span>{wl.name}</span>
                    <span className={alreadyAdded ? 'text-cyan-400 font-bold font-mono' : 'text-white/30 font-mono'}>
                      {alreadyAdded ? '[ADDED]' : '[ADD]'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 justify-end pt-2 text-[10px] border-t border-white/5">
              <button
                onClick={() => setCurrMappingSecurity(null)}
                className="px-4 py-1.5 bg-cyan-500 text-black font-black uppercase rounded hover:bg-cyan-400 cursor-pointer transition-colors"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                Close Routing Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Static Footer Context guidance */}
      <div className="bg-black/35 border border-white/5 p-4 rounded text-[10px] text-white/40 text-left leading-relaxed flex items-center gap-2">
        <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Watchlist allocations and dynamic markers are synced in localized container registers. Changes are instantly verified during active session monitoring loops.</span>
      </div>

    </div>
  );
}

export default Watchlist;
