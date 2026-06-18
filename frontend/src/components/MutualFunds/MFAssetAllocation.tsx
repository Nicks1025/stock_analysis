/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMutualFundStore } from '../../store/mutualFundStore';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { PieChart, Landmark, TrendingUp, Sparkles } from 'lucide-react';

export function MFAssetAllocation() {
  const { investments, funds } = useMutualFundStore();

  // 1. Calculate active exposure
  let totalPortfolioValue = 0;
  let totalEquity = 0;
  let totalDebt = 0;
  let totalGold = 0;
  let totalCash = 0;

  investments.forEach((inv) => {
    const fund = funds.find((f) => f.id === inv.fundId);
    if (!fund) return;
    
    const val = inv.currentValue;
    totalPortfolioValue += val;
    
    totalEquity += (val * fund.equityPercent) / 100;
    totalDebt += (val * fund.debtPercent) / 100;
    totalGold += (val * fund.goldPercent) / 100;
    totalCash += (val * fund.cashPercent) / 100;
  });

  // Handle empty state gracefully
  if (totalPortfolioValue === 0) {
    return (
      <div className="glass-panel p-5 rounded border border-white/5 font-mono text-center text-white/40 text-xs py-10">
        <PieChart className="w-8 h-8 text-white/20 mx-auto mb-2" />
        No active investments found to compute asset split. Allocate capital in the explorer tab.
      </div>
    );
  }

  const equityPct = (totalEquity / totalPortfolioValue) * 100;
  const debtPct = (totalDebt / totalPortfolioValue) * 100;
  const goldPct = (totalGold / totalPortfolioValue) * 100;
  const cashPct = (totalCash / totalPortfolioValue) * 100;

  const classes = [
    { name: 'Equity Exposure', value: totalEquity, pct: equityPct, color: 'bg-cyan-500', barColor: '#06b6d4', text: 'High CAGR long-term compounding growth' },
    { name: 'Debt & Treasuries', value: totalDebt, pct: debtPct, color: 'bg-indigo-500', barColor: '#6366f1', text: 'Volatility hedge & fixed income stability' },
    { name: 'Gold (Hedge)', value: totalGold, pct: goldPct, color: 'bg-[#ffaa00]', barColor: '#ffaa00', text: 'Prudential buffer against systemic inflation' },
    { name: 'Cash Reserves', value: totalCash, pct: cashPct, color: 'bg-emerald-500', barColor: '#10b981', text: 'Dry powder for tactical buying dips' }
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="glass-panel p-5 rounded border border-white/5 space-y-5" id="mf-asset-allocation">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <h3 className="text-xs font-black uppercase tracking-wider font-mono text-white flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-cyan-400" />
          Real Asset Allocation
        </h3>
        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/50 font-mono">
          AGGREGATE: {formatCurrency(totalPortfolioValue)}
        </span>
      </div>

      {/* Stacked Percentage Bar */}
      <div className="space-y-1 font-mono">
        <div className="w-full h-4 bg-white/5 rounded overflow-hidden flex">
          {equityPct > 0 && (
            <div 
              style={{ width: `${equityPct}%`, backgroundColor: '#00e5ff' }} 
              className="h-full relative group cursor-help transition-all duration-300"
              title={`Equity: ${equityPct.toFixed(1)}%`}
            />
          )}
          {debtPct > 0 && (
            <div 
              style={{ width: `${debtPct}%`, backgroundColor: '#6366f1' }} 
              className="h-full relative group cursor-help transition-all duration-300"
              title={`Debt: ${debtPct.toFixed(1)}%`}
            />
          )}
          {goldPct > 0 && (
            <div 
              style={{ width: `${goldPct}%`, backgroundColor: '#ffaa00' }} 
              className="h-full relative group cursor-help transition-all duration-300"
              title={`Gold: ${goldPct.toFixed(1)}%`}
            />
          )}
          {cashPct > 0 && (
            <div 
              style={{ width: `${cashPct}%`, backgroundColor: '#10b981' }} 
              className="h-full relative group cursor-help transition-all duration-300"
              title={`Cash: ${cashPct.toFixed(1)}%`}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-between text-[8px] text-white/40 uppercase font-black pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Equity ({equityPct.toFixed(1)}%)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" /> Debt ({debtPct.toFixed(1)}%)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ffaa00]" /> Gold ({goldPct.toFixed(1)}%)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Cash ({cashPct.toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Row breakdown */}
      <div className="space-y-3 font-mono">
        {classes.map((cls) => {
          if (cls.value === 0) return null;
          return (
            <div key={cls.name} className="p-3 bg-black/40 rounded border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-all">
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${cls.color}`} />
                  <span className="text-[11px] font-bold text-white uppercase">{cls.name}</span>
                </div>
                <div className="text-[9px] text-white/40 truncate">{cls.text}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] font-extrabold text-white">{formatCurrency(cls.value)}</div>
                <div className="text-[10px] font-bold text-cyan-400" style={{ color: cls.pct > 50 ? 'var(--brand-cyan)' : 'inherit' }}>
                  {cls.pct.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Insight */}
      <div className="bg-cyan-950/20 border border-cyan-500/10 text-cyan-400/80 p-3.5 rounded text-[10px] font-mono leading-relaxed flex gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
        <div>
          <span className="font-bold text-white uppercase block mb-1">Portfolio Concentration Insights</span>
          {equityPct > 70 ? (
            <span>Your asset allocation is skewed heavily towards high-octane equities. Make sure your investment horizon is at least 5-7 years to ride out intermittent volatility waves comfortably.</span>
          ) : equityPct < 40 ? (
            <span>Your allocation has heavy defensive backing (Debt & Cash). This preserves capital against drawdown but poses a slight drag on long-term wealth compounding. Consider expanding equity cap exposure.</span>
          ) : (
            <span>You maintain an incredibly balanced, resilient multi-asset allocation. This blend is optimized for superior risk-adjusted CAGR returns across diverse economic business cycles.</span>
          )}
        </div>
      </div>
    </div>
  );
}
