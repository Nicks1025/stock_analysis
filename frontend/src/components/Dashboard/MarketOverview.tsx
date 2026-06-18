/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Clock, Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { useStockStore } from '../../store/stockStore';
import { SBadge } from '../common/SBadge';

interface MarketOverviewProps {
  status?: {
    isOpen: boolean;
    session: 'pre-market' | 'normal' | 'post-market' | 'closed';
    nextOpen?: string;
    nextClose?: string;
  };
  loading?: boolean;
}

export function MarketOverview({ status, loading = false }: MarketOverviewProps) {
  // Use fallbacks if status is not loaded
  const marketStatus = status || {
    isOpen: true,
    session: 'normal',
    nextClose: '15:30 IST'
  };

  const getSessionColor = (session: string) => {
    switch (session) {
      case 'normal':
        return 'emerald';
      case 'pre-market':
      case 'post-market':
        return 'amber';
      default:
        return 'red';
    }
  };

  return (
    <div className="bg-black/40 border border-white/5 rounded-lg p-5 font-mono">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Left pane: Market Status */}
        <div className="space-y-1">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block">SYSTEM TELEMETRY</span>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-white tracking-wide uppercase">NSE/BSE Core Stream</span>
            <SBadge 
              color={marketStatus.isOpen ? 'emerald' : 'red'} 
              content={marketStatus.isOpen ? 'LIVE' : 'CLOSED'} 
            />
            <SBadge 
              color={getSessionColor(marketStatus.session)} 
              content={marketStatus.session.replace('-', ' ')} 
            />
          </div>
        </div>

        {/* Right pane: Market stats */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="px-3 py-1.5 bg-white/[0.01] border border-white/5 rounded flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white/40">NEXT EVENT:</span>
            <span className="text-white font-bold">{marketStatus.isOpen ? 'Close at ' + (marketStatus.nextClose || '15:30 IST') : 'Open at ' + (marketStatus.nextOpen || '09:15 IST')}</span>
          </div>

          <div className="px-3 py-1.5 bg-white/[0.01] border border-white/5 rounded flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white/40">SYNC:</span>
            <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Highlights strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-[11px] border-t border-white/5 pt-4 text-white/70">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>FII inflows increased by <strong className="text-emerald-400 font-bold">+₹1,420 Cr</strong> today.</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
          <span>Crude Oil contracts dropped <strong className="text-emerald-400 font-bold">-1.2%</strong> lowering logistical pressures.</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>VIX Volatility Index stable at <strong className="text-cyan-300 font-bold">12.45 (-2.1%)</strong>.</span>
        </div>
      </div>
    </div>
  );
}
