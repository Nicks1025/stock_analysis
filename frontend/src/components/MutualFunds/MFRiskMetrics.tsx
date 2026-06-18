/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMutualFundStore } from '../../store/mutualFundStore';
import { ShieldAlert, BarChart3, AlertCircle, TrendingUp, Info } from 'lucide-react';

export function MFRiskMetrics() {
  const { investments, funds } = useMutualFundStore();

  let totalValue = 0;
  let weightedBeta = 0;
  let weightedStdDev = 0;
  let weightedSharpe = 0;
  let weightedExpense = 0;

  investments.forEach((inv) => {
    const fund = funds.find((f) => f.id === inv.fundId);
    if (!fund) return;
    
    totalValue += inv.currentValue;
    weightedBeta += inv.currentValue * fund.beta;
    weightedStdDev += inv.currentValue * fund.stdDev;
    weightedSharpe += inv.currentValue * fund.sharpeRatio;
    weightedExpense += inv.currentValue * fund.expenseRatio;
  });

  if (totalValue === 0) {
    return (
      <div className="glass-panel p-5 rounded border border-white/5 font-mono text-center text-white/40 text-xs py-10">
        <ShieldAlert className="w-8 h-8 text-white/20 mx-auto mb-2" />
        Record active investments to calculate weighted risk parameters.
      </div>
    );
  }

  const finalBeta = weightedBeta / totalValue;
  const finalStdDev = weightedStdDev / totalValue;
  const finalSharpe = weightedSharpe / totalValue;
  const finalExpense = weightedExpense / totalValue;

  // Rating qualitative interpretation of composite risk
  const getRiskExplanation = () => {
    if (finalBeta > 1.1) return { label: 'HIGH BETA - AGGRESSIVE', color: 'text-red-400', desc: 'Highly reactive. Your portfolio moves faster than the broad index, amplifying bull runs but exposing you to sharp pullbacks.' };
    if (finalBeta < 0.6) return { label: 'LOW BETA - CONSERVATIVE', color: 'text-emerald-400', desc: 'Resilient and bulletproof. Capital is heavily guarded against broad indices drawdown, trading speed for safety.' };
    return { label: 'BALANCED / MODERATE', color: 'text-cyan-400', desc: 'Optimal index correlation. Moves in tandem with the broader benchmarks, yielding solid risk-adjusted returns.' };
  };

  const explanation = getRiskExplanation();

  return (
    <div className="glass-panel p-5 rounded border border-white/5 space-y-5" id="mf-risk-metrics">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <h3 className="text-xs font-black uppercase tracking-wider font-mono text-white flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Weighted Risk Metrics
        </h3>
        <span className="text-[9px] text-[#ffaa00] font-black uppercase tracking-wider font-mono bg-[#ffaa00]/10 px-2.5 py-0.5 rounded border border-[#ffaa00]/25">
          Live Portfolio Risk Audit
        </span>
      </div>

      {/* Grid of Gauges */}
      <div className="grid grid-cols-2 gap-4 font-mono">
        {/* Beta Gauge */}
        <div className="bg-black/30 p-3 rounded border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-white/40 font-black">
            <span>WEIGHTED BETA</span>
            <Info className="w-3.5 h-3.5 text-white/20 pointer-events-none" />
          </div>
          <div className="text-xl font-black text-white">{finalBeta.toFixed(2)}</div>
          <div className="w-full h-1 bg-white/5 rounded overflow-hidden">
            <div 
              className="h-full bg-cyan-400" 
              style={{ width: `${Math.min(100, (finalBeta / 1.5) * 100)}%`, backgroundColor: 'var(--brand-cyan)' }} 
            />
          </div>
          <div className="text-[8px] text-white/40 leading-relaxed">
            Market Sensitivity. An index baseline matches 1.00.
          </div>
        </div>

        {/* Sharpe Ratio Gauge */}
        <div className="bg-black/30 p-3 rounded border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-white/40 font-black">
            <span>SHARPE RATIO</span>
            <Info className="w-3.5 h-3.5 text-white/20 pointer-events-none" />
          </div>
          <div className="text-xl font-black text-[#ffaa00]" style={{ color: 'var(--brand-amber)' }}>{finalSharpe.toFixed(2)}</div>
          <div className="w-full h-1 bg-white/5 rounded overflow-hidden">
            <div 
              className="h-full bg-[#ffaa00]" 
              style={{ width: `${Math.min(100, (finalSharpe / 2.0) * 100)}%`, backgroundColor: 'var(--brand-amber)' }} 
            />
          </div>
          <div className="text-[8px] text-white/40 leading-relaxed">
            Risk-adjusted excess return. Values &gt; 1.0 are superior.
          </div>
        </div>

        {/* Volatility Std Dev Gauge */}
        <div className="bg-black/30 p-3 rounded border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-white/40 font-black">
            <span>STANDARD DEVIATION</span>
            <Info className="w-3.5 h-3.5 text-white/20 pointer-events-none" />
          </div>
          <div className="text-xl font-black text-white">{finalStdDev.toFixed(2)}%</div>
          <div className="w-full h-1 bg-white/5 rounded overflow-hidden">
            <div 
              className="h-full bg-violet-400" 
              style={{ width: `${Math.min(100, (finalStdDev / 20) * 100)}%` }} 
            />
          </div>
          <div className="text-[8px] text-white/40 leading-relaxed">
            Average return dispersion. High values mean higher volatility waves.
          </div>
        </div>

        {/* Expense Ratio Gauge */}
        <div className="bg-black/30 p-3 rounded border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-white/40 font-black">
            <span>WEIGHTED EXPENSE RATIO</span>
            <Info className="w-3.5 h-3.5 text-white/20 pointer-events-none" />
          </div>
          <div className="text-xl font-black text-emerald-400">{finalExpense.toFixed(2)}%</div>
          <div className="w-full h-1 bg-white/5 rounded overflow-hidden">
            <div 
              className="h-full bg-emerald-400" 
              style={{ width: `${Math.min(100, (finalExpense / 1.5) * 100)}%` }} 
            />
          </div>
          <div className="text-[8px] text-white/40 leading-relaxed">
            Asset management commission overhead fees. Low are ideal.
          </div>
        </div>
      </div>

      {/* Narrative summary profile */}
      <div className="p-4 bg-black/50 border border-white/5 rounded space-y-2 font-mono">
        <div className="flex justify-between items-center">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">PORTFOLIO CHARACTERISTIC</span>
          <span className={`text-[10px] font-black tracking-wider ${explanation.color}`}>
            {explanation.label}
          </span>
        </div>
        <p className="text-[10px] text-white/60 leading-relaxed">{explanation.desc}</p>
      </div>
    </div>
  );
}
