import React, { useState } from 'react';
import { Search, ArrowUpDown, ChevronDown, ChevronUp, Star, Filter, Eye, DollarSign, Wallet } from 'lucide-react';
import { Holding } from '../../store/portfolioStore';

interface PortfolioHoldingsProps {
  holdings: Holding[];
  onAddStockClick: () => void;
}

type SortField = 'symbol' | 'quantity' | 'avgPrice' | 'currentPrice' | 'totalCost' | 'currentValue' | 'pandl';

export function PortfolioHoldings({ holdings, onAddStockClick }: PortfolioHoldingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('pandl');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  // Multi-criteria filter
  const sectors = ['ALL', ...Array.from(new Set(holdings.map(h => h.sector)))];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredHoldings = holdings
    .filter(h => {
      const matchSearch = h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSector = selectedSector === 'ALL' || h.sector === selectedSector;
      return matchSearch && matchSector;
    })
    .sort((a, b) => {
      let aVal: any = a[sortField as keyof Holding] || 0;
      let bVal: any = b[sortField as keyof Holding] || 0;

      // Handle computed pricing checks
      if (sortField === 'totalCost') {
        aVal = a.avgPrice * a.quantity;
        bVal = b.avgPrice * b.quantity;
      } else if (sortField === 'currentValue') {
        aVal = a.currentPrice * a.quantity;
        bVal = b.currentPrice * b.quantity;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      } else {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs" id="portfolio-holdings-panel shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="text-left">
          <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block font-mono">EQUITIES INVENTORY LOG</span>
          <span className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 google-font">
            <Wallet className="w-4 h-4 text-cyan-400" /> ACTIVE REGISTERED SECURITIES
          </span>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Search ticker or entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 w-full sm:w-48 bg-black/60 border border-white/10 rounded font-mono text-[10px] text-white focus:outline-none focus:border-cyan-400 placeholder:text-white/20"
            />
          </div>

          {/* Sector Selector */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="p-1.5 bg-black/60 border border-white/10 rounded font-mono text-[10px] text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {sectors.map((sec, idx) => (
              <option key={idx} value={sec}>
                {sec === 'ALL' ? 'ALL SECTORS' : sec.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Button removed since this is strictly an analytics system */}
        </div>
      </div>

      {/* Grid structure for table scroll */}
      <div className="overflow-x-auto border border-white/5 rounded">
        <table className="w-full text-left border-collapse text-[10.5px]">
          <thead>
            <tr className="bg-black/55 border-b border-white/10 text-white/40 uppercase text-[8px] tracking-widest font-black font-mono">
              <th className="p-3 cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('symbol')}>
                <div className="flex items-center gap-1">
                  Ticker Ticker {sortField === 'symbol' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('quantity')}>
                <div className="flex items-center justify-end gap-1">
                  Shares {sortField === 'quantity' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('avgPrice')}>
                <div className="flex items-center justify-end gap-1">
                  Avg Cost {sortField === 'avgPrice' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('currentPrice')}>
                <div className="flex items-center justify-end gap-1">
                  Price {sortField === 'currentPrice' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('totalCost')}>
                <div className="flex items-center justify-end gap-1">
                  Investment {sortField === 'totalCost' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('currentValue')}>
                <div className="flex items-center justify-end gap-1">
                  Valuation {sortField === 'currentValue' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('pandl')}>
                <div className="flex items-center justify-end gap-1">
                  Returns P&L {sortField === 'pandl' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredHoldings.length > 0 ? (
              filteredHoldings.map((h, idx) => {
                const investment = h.avgPrice * h.quantity;
                const valuation = h.currentPrice * h.quantity;
                const pl = valuation - investment;
                const plPct = investment > 0 ? (pl / investment) * 100 : 0;
                return (
                  <tr key={h.symbol || idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors font-mono">
                    <td className="p-3 text-left">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-cyan-400 text-xs">{h.symbol}</span>
                        <span className="text-[8.5px] text-white/30 truncate max-w-[120px] font-sans" title={h.companyName}>{h.companyName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right text-white font-bold">{h.quantity}</td>
                    <td className="p-3 text-right text-white/50">₹{h.avgPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right text-white/70">₹{h.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right text-white/60">₹{investment.toLocaleString('en-IN', { minimumFractionDigits: 1 })}</td>
                    <td className="p-3 text-right text-white font-bold">₹{valuation.toLocaleString('en-IN', { minimumFractionDigits: 1 })}</td>
                    <td className="p-3 text-right text-xs">
                      <div className="flex flex-col items-end">
                        <span className={`font-black ${pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pl >= 0 ? '▲ +' : '▼ '}₹{Math.abs(pl).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                        </span>
                        <span className={`text-[8.5px] font-bold ${pl >= 0 ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                          {pl >= 0 ? '+' : ''}{plPct.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-10 text-center text-white/20 uppercase font-bold tracking-widest leading-relaxed">
                  No active securities found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredHoldings.length > 0 && (
        <div className="flex justify-between items-center text-[9px] text-white/30 pt-1 pointer-events-none uppercase">
          <span>Displaying {filteredHoldings.length} of {holdings.length} registered counters</span>
          <span>CURRENCY REF: INR (₹) • Audit compliant as of Jun 2026</span>
        </div>
      )}
    </div>
  );
}

export default PortfolioHoldings;
