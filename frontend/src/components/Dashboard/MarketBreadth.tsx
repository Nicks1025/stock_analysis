/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SCard } from '../common/SCard';
import { ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2 } from 'lucide-react';

interface MarketBreadthProps {
  advances?: number;
  declines?: number;
  unchanged?: number;
  total?: number;
  loading?: boolean;
}

export function MarketBreadth({
  advances = 32,
  declines = 16,
  unchanged = 2,
  total = 50,
  loading = false,
}: MarketBreadthProps) {
  const advancePercent = (advances / total) * 100;
  const declinePercent = (declines / total) * 100;
  const unchangedPercent = (unchanged / total) * 100;

  const ratio = (advances / (declines || 1)).toFixed(2);

  return (
    <SCard 
      title="NIFTY 50 Market Breadth" 
      subtitle="Advances/declines sentiment participation ratio"
      action={
        <div className="flex items-center gap-1.5 font-mono text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-white/55">
          <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>A/D RATIO: {ratio}</span>
        </div>
      }
    >
      <div className="space-y-4 font-mono">
        {/* Core numbers showcase */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-semibold relative rounded bg-emerald-500/5 border border-emerald-500/10">
            <span className="text-[9px] text-emerald-400/50 block font-black uppercase tracking-wider">Advances</span>
            <span className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5">
              <ArrowUpRight className="w-4 h-4 shrink-0" />
              {advances}
            </span>
          </div>

          <div className="p-3 bg-semibold relative rounded bg-red-500/5 border border-red-500/10">
            <span className="text-[9px] text-red-400/50 block font-black uppercase tracking-wider">Declines</span>
            <span className="text-lg font-black text-red-400 flex items-center justify-center gap-1.5 mt-0.5">
              <ArrowDownRight className="w-4 h-4 shrink-0" />
              {declines}
            </span>
          </div>

          <div className="p-3 bg-semibold relative rounded bg-white/5 border border-white/5">
            <span className="text-[9px] text-white/30 block font-black uppercase tracking-wider">Neutral</span>
            <span className="text-lg font-black text-white/70 flex items-center justify-center gap-1.5 mt-0.5">
              <RefreshCw className="w-3.5 h-3.5 opacity-40 shrink-0" />
              {unchanged}
            </span>
          </div>
        </div>

        {/* Dynamic visual segment bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${advancePercent}%` }} 
              className="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-500"
              title={`Advances: ${advancePercent.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${unchangedPercent}%` }} 
              className="bg-white/20 transition-all duration-500"
              title={`Unchanged: ${unchangedPercent.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${declinePercent}%` }} 
              className="bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-500"
              title={`Declines: ${declinePercent.toFixed(1)}%`}
            />
          </div>

          <div className="flex justify-between text-[9px] text-white/40 pt-1">
            <span className="text-emerald-400 font-semibold">{advancePercent.toFixed(0)}% BULLS</span>
            <span className="text-white/30">{unchangedPercent.toFixed(0)}% FLAT</span>
            <span className="text-red-400 font-semibold">{declinePercent.toFixed(0)}% BEARS</span>
          </div>
        </div>

        {/* Mini technical telemetry notice */}
        <div className="text-[10px] text-white/45 bg-black/25 p-2 rounded.5 border border-white/5 leading-relaxed text-left">
          <span className="text-cyan-400 font-bold uppercase mr-1">[INTERPRETATION]</span> 
          Strong institutional breadth support suggests continuous long side accumulation on crucial support zones inside the index.
        </div>
      </div>
    </SCard>
  );
}
