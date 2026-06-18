import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Clock, Hash, Zap } from 'lucide-react';

interface StockSelectorProps {
  selectedSymbol: string;
  onSymbolSelect: (symbol: string) => void;
}

export const POPULAR_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2945.50, change: 48.20, changePercent: 1.66, sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3820.10, change: -15.40, changePercent: -0.40, sector: 'IT' },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1485.40, change: 22.80, changePercent: 1.56, sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', price: 1594.20, change: 11.55, changePercent: 0.73, sector: 'Financials' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', price: 1118.90, change: 4.80, changePercent: 0.43, sector: 'Financials' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 832.40, change: -6.15, changePercent: -0.73, sector: 'Financials' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', price: 954.80, change: 35.10, changePercent: 3.82, sector: 'Automotive' },
  { symbol: 'WIT', name: 'Wipro Limited', price: 462.50, change: 3.20, changePercent: 0.70, sector: 'IT' }
];

export function StockSelector({ selectedSymbol, onSymbolSelect }: StockSelectorProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'IT' | 'Financials' | 'Energy' | 'Automotive'>('ALL');

  const filteredStocks = POPULAR_STOCKS.filter((s) => {
    const matchesSearch = s.symbol.toLowerCase().includes(search.toLowerCase()) || 
                          s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || s.sector === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs flex flex-col h-full" id="stock-selector-container">
      {/* Selector Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5 font-mono">
          <Zap className="w-3.5 h-3.5" /> Securities Index
        </span>
        <span className="text-[9px] text-white/30 font-mono">8 BLUE CHIPS</span>
      </div>

      {/* Ticker Search Box */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-white/33" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Ticker or Name..."
          className="w-full pl-8 pr-3 py-1.5 bg-black/55 border border-white/10 rounded text-[11px] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
          id="stock-selector-search"
        />
      </div>

      {/* Sector Category Filters */}
      <div className="flex flex-wrap gap-1 border-b border-white/5 pb-2.5">
        {(['ALL', 'IT', 'Financials', 'Energy', 'Automotive'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 py-0.5 text-[8px] tracking-wide rounded cursor-pointer uppercase ${
              activeCategory === cat
                ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-bold'
                : 'bg-white/5 border border-transparent text-white/40 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'ALL' : cat}
          </button>
        ))}
      </div>

      {/* Active Stocks Scrollable list */}
      <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 max-h-[360px] custom-scrollbar">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => {
            const isSelected = stock.symbol === selectedSymbol.toUpperCase();
            const isBullish = stock.change >= 0;

            return (
              <button
                key={stock.symbol}
                onClick={() => onSymbolSelect(stock.symbol)}
                className={`w-full text-left p-2.5 rounded border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 text-white font-bold'
                    : 'bg-black/25 border-white/5 text-white/70 hover:bg-white/[0.02] hover:border-white/10'
                }`}
                id={`stock-selector-item-${stock.symbol}`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[#00f2ff] text-[11px]" style={{ color: isSelected ? 'var(--brand-cyan)' : undefined }}>
                      {stock.symbol}
                    </span>
                    <span className="text-[7px] uppercase tracking-wide bg-white/5 px-1 py-0.2 rounded text-white/40">
                      {stock.sector}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 block truncate max-w-[120px] font-sans">
                    {stock.name}
                  </span>
                </div>

                <div className="text-right space-y-0.5 shrink-0">
                  <span className="font-bold text-[11px] block">
                    ₹{stock.price.toFixed(1)}
                  </span>
                  <div className={`flex items-center justify-end gap-0.5 text-[9px] font-bold ${isBullish ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isBullish ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    <span>{isBullish ? '+' : ''}{stock.changePercent.toFixed(1)}%</span>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-8 text-white/20 font-mono text-[10px] uppercase tracking-wider">
            No matching symbols
          </div>
        )}
      </div>

      {/* Recency indicators footer */}
      <div className="pt-2 border-t border-white/5 flex items-center gap-1 text-[9px] text-white/30 font-sans">
        <Clock className="w-3 h-3" />
        <span>Sync Interval: Continuous 5s ticks</span>
      </div>
    </div>
  );
}
