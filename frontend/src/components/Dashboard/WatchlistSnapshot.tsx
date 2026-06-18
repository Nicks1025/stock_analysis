/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SCard } from '../common/SCard';
import { SBadge } from '../common/SBadge';
import { Quote } from '../../store/stockStore';
import { Eye, TrendingUp, TrendingDown, Star, ChevronRight } from 'lucide-react';

interface WatchlistSnapshotProps {
  stocks?: any[];
  quotes?: Record<string, Quote>;
  loading?: boolean;
}

export function WatchlistSnapshot({ stocks = [], quotes = {}, loading = false }: WatchlistSnapshotProps) {
  const navigate = useNavigate();

  // Watchlist fallback items
  const fallbackWatchlist = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2942.50, changePercent: 2.29, isUp: true },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3825.40, changePercent: 3.03, isUp: true },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1595.60, changePercent: -2.75, isUp: false },
    { symbol: 'INFY', name: 'Infosys Limited', price: 1515.20, changePercent: 2.72, isUp: true },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', price: 2452.10, changePercent: -0.45, isUp: false }
  ];

  const displayList = stocks.length ? stocks.map(stock => {
    const symbol = stock.symbol || stock.stock_id;
    const priceData = quotes[symbol] || { price: stock.price || 100, changePercent: stock.changePercent || 0 };
    return {
      symbol,
      name: stock.name || stock.companyName || symbol,
      price: priceData.price,
      changePercent: priceData.changePercent,
      isUp: priceData.changePercent >= 0
    };
  }) : fallbackWatchlist;

  return (
    <SCard 
      title="Watchlist Snapshot" 
      subtitle="Currently observed securities and active trade triggers"
      action={
        <button
          onClick={() => navigate('/watchlist')}
          className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-3 font-mono">
        {displayList.map((stock, idx) => (
          <div 
            key={stock.symbol || idx}
            onClick={() => navigate(`/stocks/${stock.symbol}`)}
            className="flex items-center justify-between p-2 rounded hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
              <div className="text-left">
                <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase">
                  {stock.symbol}
                </span>
                <p className="text-[9px] text-white/35 max-w-[120px] truncate">{stock.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-black text-white">
                  ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`text-[10px] font-bold block ${stock.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stock.isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/stocks/${stock.symbol}`);
                }}
                className="p-1.5 rounded bg-white/5 hover:bg-cyan-500/10 text-white/40 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/20 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </SCard>
  );
}
