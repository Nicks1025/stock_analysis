/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SCard } from '../common/SCard';
import { TrendingUp, TrendingDown, ArrowRight, ExternalLink } from 'lucide-react';

interface MoverData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  companyName: string;
}

interface MarketMoversProps {
  gainers?: MoverData[];
  losers?: MoverData[];
  loading?: boolean;
}

export function MarketMovers({ gainers = [], losers = [], loading = false }: MarketMoversProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTabState] = useState<'gainers' | 'losers'>(
    (searchParams.get('tab') as any) || 'gainers'
  );

  const setActiveTab = (tab: 'gainers' | 'losers') => {
    setActiveTabState(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (!tab) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', activeTab);
      setSearchParams(newParams, { replace: true });
    } else if ((tab === 'gainers' || tab === 'losers') && tab !== activeTab) {
      setActiveTabState(tab);
    }
  }, [searchParams, activeTab, setSearchParams]);
  const navigate = useNavigate();

  // Polished Indian Stock Fallbacks
  const fallbackGainers: MoverData[] = [
    { symbol: 'TCS', price: 3825.40, change: 112.50, changePercent: 3.03, companyName: 'Tata Consultancy Services' },
    { symbol: 'INFY', price: 1515.20, change: 40.10, changePercent: 2.72, companyName: 'Infosys Limited' },
    { symbol: 'RELIANCE', price: 2942.50, change: 65.80, changePercent: 2.29, companyName: 'Reliance Industries Ltd' },
    { symbol: 'BHARTIARTL', price: 1410.15, change: 25.40, changePercent: 1.83, companyName: 'Bharti Airtel Limited' },
    { symbol: 'WIPRO', price: 492.10, change: 8.50, changePercent: 1.76, companyName: 'Wipro Limited' },
  ];

  const fallbackLosers: MoverData[] = [
    { symbol: 'HDFCBANK', price: 1595.60, change: -45.10, changePercent: -2.75, companyName: 'HDFC Bank Limited' },
    { symbol: 'ICICIBANK', price: 1112.40, change: -24.80, changePercent: -2.18, companyName: 'ICICI Bank Limited' },
    { symbol: 'M&M', price: 2840.10, change: -55.20, changePercent: -1.91, companyName: 'Mahindra & Mahindra Ltd' },
    { symbol: 'SBIN', price: 835.40, change: -12.40, changePercent: -1.46, companyName: 'State Bank of India' },
    { symbol: 'LT', price: 3512.95, change: -48.20, changePercent: -1.35, companyName: 'Larsen & Toubro Ltd' },
  ];

  const displayGainers = gainers.length ? gainers : fallbackGainers;
  const displayLosers = losers.length ? losers : fallbackLosers;

  const currentMovers = activeTab === 'gainers' ? displayGainers : displayLosers;

  return (
    <SCard 
      title="Index Movers" 
      subtitle="Most active stock session volatility leaders"
      action={
        <div className="flex bg-black/60 p-1 rounded-md border border-white/5">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'gainers'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'losers'
                ? 'bg-red-500/15 border border-red-500/30 text-red-300'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Losers
          </button>
        </div>
      }
    >
      <div className="space-y-2.5 font-mono">
        {currentMovers.map((item, idx) => {
          const isGainer = activeTab === 'gainers';
          return (
            <div 
              key={item.symbol || idx}
              onClick={() => navigate(`/stocks/${item.symbol}`)}
              className="flex items-center justify-between p-2.5 rounded hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {/* Visual Arrow sign */}
                <div className={`w-7 h-7 rounded-sm flex items-center justify-center border font-bold ${
                  isGainer 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {isGainer ? '+' : '–'}
                </div>

                <div className="text-left">
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase">
                    {item.symbol}
                  </span>
                  <p className="text-[9px] text-white/35 scale-95 origin-left truncate max-w-[150px] sm:max-w-[180px]">
                    {item.companyName}
                  </p>
                </div>
              </div>

              {/* Price and percent block */}
              <div className="text-right flex items-center gap-4">
                <div className="text-left hidden sm:block">
                  <span className="text-[10px] text-white/30 uppercase block">PRICE</span>
                  <span className="text-[11px] font-bold text-white/90">
                    ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <span className={`text-[11px] font-black flex items-center justify-end gap-1 ${
                    isGainer ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isGainer ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                  
                  <span className="text-[9px] text-white/30 block text-right">
                    {isGainer ? '+' : ''}{item.change.toFixed(2)}
                  </span>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-white/10 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </SCard>
  );
}
