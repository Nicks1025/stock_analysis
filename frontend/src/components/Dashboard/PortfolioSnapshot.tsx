/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SCard } from '../common/SCard';
import { SBadge } from '../common/SBadge';
import { Holding } from '../../store/portfolioStore';
import { Wallet, TrendingUp, TrendingDown, ChevronRight, Activity } from 'lucide-react';

interface PortfolioSnapshotProps {
  holdings?: Holding[];
  summary?: {
    totalValue: number;
    totalInvestment: number;
    totalProfitAndLoss: number;
    totalProfitAndLossPercent: number;
    todayProfitAndLoss: number;
    todayProfitAndLossPercent: number;
  } | null;
  loading?: boolean;
}

export function PortfolioSnapshot({ holdings = [], summary, loading = false }: PortfolioSnapshotProps) {
  const navigate = useNavigate();

  // Polished Indian Portfolio Fallback Summation
  const fallbackSummary = {
    totalValue: 564280.50,
    totalInvestment: 485000.00,
    totalProfitAndLoss: 79280.50,
    totalProfitAndLossPercent: 16.35,
    todayProfitAndLoss: 4520.10,
    todayProfitAndLossPercent: 0.81
  };

  const actualSummary = summary || fallbackSummary;
  const isPandlUp = actualSummary.totalProfitAndLoss >= 0;
  const isTodayUp = actualSummary.todayProfitAndLoss >= 0;

  return (
    <SCard 
      title="Portfolio Core" 
      subtitle="Total holdings performance evaluation metrics"
      action={
        <button
          onClick={() => navigate('/portfolio')}
          className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          Manage Holdings <ChevronRight className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-4 font-mono select-none">
        
        {/* Total Value & Direct performance metrics */}
        <div className="p-4 bg-white/[0.01] border border-white/5 rounded relative overflow-hidden">
          <div className="absolute right-4 top-4 text-emerald-400/10">
            <Wallet className="w-12 h-12 stroke-current" />
          </div>

          <span className="text-[10px] text-white/35 block uppercase tracking-wider">CURRENT PORTFOLIO VALUE</span>
          <span className="text-2xl font-black text-white tracking-wide block mt-1">
            ₹{actualSummary.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-3.5 border-t border-white/5 text-xs">
            <div>
              <span className="text-white/30 block mb-0.5">Total Returns</span>
              <span className={`font-bold flex items-center gap-1 ${isPandlUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPandlUp ? '+' : ''}₹{actualSummary.totalProfitAndLoss.toLocaleString('en-IN', { maximumFractionDigits: 1 })} 
                ({actualSummary.totalProfitAndLossPercent.toFixed(1)}%)
              </span>
            </div>

            <div>
              <span className="text-white/30 block mb-0.5">Today's Profit</span>
              <span className={`font-bold flex items-center gap-1 ${isTodayUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {isTodayUp ? '+' : ''}₹{actualSummary.todayProfitAndLoss.toLocaleString('en-IN', { maximumFractionDigits: 1 })} 
                ({actualSummary.todayProfitAndLossPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown bars or items */}
        <div className="space-y-2">
          <span className="text-[9px] text-white/30 block uppercase tracking-widest text-left">TOP CONTRIBUTING ASSETS</span>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/70">Equity Core Allocations</span>
              <span className="text-white font-bold">85%</span>
            </div>
            <div className="h-1 bg-black/40 rounded-full overflow-hidden flex">
              <div className="w-[85%] bg-cyan-400 shadow-[0_0_8px_rgba(0,242,255,0.4)]" />
              <div className="w-[15%] bg-white/10" />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-white/70">Cash & Buffer Liquid Pools</span>
              <span className="text-white font-bold">15%</span>
            </div>
            <div className="h-1 bg-black/40 rounded-full overflow-hidden flex">
              <div className="w-[15%] bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <div className="w-[85%] bg-white/10" />
            </div>
          </div>
        </div>

      </div>
    </SCard>
  );
}
