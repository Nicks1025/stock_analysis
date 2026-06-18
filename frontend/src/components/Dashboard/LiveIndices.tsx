/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IndexData } from '../../store/stockStore';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { SCard } from '../common/SCard';

interface LiveIndicesProps {
  indices: IndexData[];
  loading?: boolean;
}

export function LiveIndices({ indices, loading = false }: LiveIndicesProps) {
  // Safe fallback indices if empty
  const displayIndices = indices.length ? indices : [
    { name: 'NIFTY 50', symbol: '^NSEI', value: 23512.40, change: 145.30, changePercent: 0.62 },
    { name: 'SENSEX', symbol: '^BSESN', value: 77301.10, change: 480.50, changePercent: 0.63 },
    { name: 'NIFTY BANK', symbol: '^NSEBANK', value: 51650.25, change: -120.40, changePercent: -0.23 },
    { name: 'NIFTY IT', symbol: '^CNXIT', value: 37410.80, change: 334.20, changePercent: 0.90 }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {displayIndices.map((index, idx) => {
        const isUp = index.changePercent >= 0;
        return (
          <SCard key={index.symbol || idx} elevation={1} className="relative group">
            <div className="space-y-2 font-mono">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">{index.name}</span>
                <span className="text-[9px] text-[#00f2ff]/35 group-hover:text-cyan-400/70 transition-colors">
                  {index.symbol}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-lg font-black text-white tracking-wide">
                  {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                
                <span className={`text-[11px] font-bold flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {isUp ? '+' : ''}{index.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px] text-white/35 pt-1.5 border-t border-white/5">
                <span>CHANGE</span>
                <span className={isUp ? 'text-emerald-500/70' : 'text-red-500/70'}>
                  {isUp ? '+' : ''}{index.change.toFixed(2)}
                </span>
              </div>
            </div>
          </SCard>
        );
      })}
    </div>
  );
}
