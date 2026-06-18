/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMutualFundStore } from '../../store/mutualFundStore';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { RefreshCcw, AlertTriangle, CheckCircle, ChevronDown, Award } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

export function MFRebalancing() {
  const { investments, funds, riskProfile, setRiskProfile, setInvestments } = useMutualFundStore();
  const { enqueueSnackbar } = useSnackbar();
  const [rebalancingProgress, setRebalancingProgress] = useState(false);

  // Suggested allocation percentages based on risk profile
  const targetAllocations = {
    conservative: { equity: 20, debt: 70, other: 10 },
    moderate: { equity: 55, debt: 35, other: 10 },
    aggressive: { equity: 85, debt: 10, other: 5 }
  }[riskProfile];

  // Calculate current active metrics
  let totalPortfolioValue = 0;
  let actualEquity = 0;
  let actualDebt = 0;
  let actualOther = 0; // Combining Gold + Cash for standard 3-bucket simplicity

  investments.forEach((inv) => {
    const fund = funds.find((f) => f.id === inv.fundId);
    if (!fund) return;
    
    const val = inv.currentValue;
    totalPortfolioValue += val;
    actualEquity += (val * fund.equityPercent) / 100;
    actualDebt += (val * fund.debtPercent) / 100;
    actualOther += (val * (fund.goldPercent + fund.cashPercent)) / 100;
  });

  const hasFunds = totalPortfolioValue > 0;
  const currentAllocations = hasFunds ? {
    equity: (actualEquity / totalPortfolioValue) * 100,
    debt: (actualDebt / totalPortfolioValue) * 100,
    other: (actualOther / totalPortfolioValue) * 100
  } : { equity: 0, debt: 0, other: 0 };

  // Calculate deviation and monetary delta
  const eqDiff = currentAllocations.equity - targetAllocations.equity;
  const debtDiff = currentAllocations.debt - targetAllocations.debt;
  const otherDiff = currentAllocations.other - targetAllocations.other;

  const eqValDelta = (eqDiff * totalPortfolioValue) / 100;
  const debtValDelta = (debtDiff * totalPortfolioValue) / 100;
  const otherValDelta = (otherDiff * totalPortfolioValue) / 100;

  // Rebalancing recommendation engine
  const getActionSteps = () => {
    const actions: { direction: 'SELL' | 'BUY'; label: string; amount: number; desc: string }[] = [];
    if (!hasFunds) return actions;

    // Check significant deviations (e.g., > 2% deviation threshold)
    const threshold = 1.0; 
    
    if (Math.abs(eqDiff) > threshold) {
      actions.push({
        direction: eqDiff > 0 ? 'SELL' : 'BUY',
        label: 'Equity Allocation',
        amount: Math.abs(eqValDelta),
        desc: eqDiff > 0 
          ? `Redeem ₹${Math.abs(eqValDelta).toFixed(2)} from Equity Mutual Funds to cooling down risk exposure.`
          : `Deploy ₹${Math.abs(eqValDelta).toFixed(2)} in Equity Index Funds to capturing structural market CAGR.`
      });
    }

    if (Math.abs(debtDiff) > threshold) {
      actions.push({
        direction: debtDiff > 0 ? 'SELL' : 'BUY',
        label: 'Debt / Bond Allocation',
        amount: Math.abs(debtValDelta),
        desc: debtDiff > 0
          ? `Liquidate ₹${Math.abs(debtValDelta).toFixed(2)} from Debt Holdings for deployable cash liquidity.`
          : `Invest ₹${Math.abs(debtValDelta).toFixed(2)} in corporate bond or gilt funds for defensive capital indexing.`
      });
    }

    if (Math.abs(otherDiff) > threshold) {
      actions.push({
        direction: otherDiff > 0 ? 'SELL' : 'BUY',
        label: 'Gold & Cash Buffer',
        amount: Math.abs(otherValDelta),
        desc: otherDiff > 0
          ? `Utilize ₹${Math.abs(otherValDelta).toFixed(2)} of Gold or excess liquid Cash to capture and lock index dips.`
          : `Fender buffer by adding ₹${Math.abs(otherValDelta).toFixed(2)} to secure physical Gold ETFs or cash deposits.`
      });
    }

    return actions.sort((a, b) => b.amount - a.amount);
  };

  const actions = getActionSteps();

  const handleSimulateRebalance = () => {
    if (!hasFunds || actions.length === 0) return;
    setRebalancingProgress(true);
    
    setTimeout(() => {
      // Create a theoretical ideal allocation split of current capital across the relative active investments
      const totalCost = investments.reduce((sum, i) => sum + i.investedAmount, 0);
      
      // Simply align the existing investment values strictly to the target percentages to simulate transaction completes
      const updated = investments.map((inv) => {
        const fund = funds.find((f) => f.id === inv.fundId);
        if (!fund) return inv;

        // Approximate target allocation weight on fund level based on risk profile category weights
        let weight = 0.33; // safe fallback
        if (fund.category === 'EQUITY') {
          weight = targetAllocations.equity / 100 / (investments.filter(i => i.category === 'EQUITY').length || 1);
        } else if (fund.category === 'DEBT') {
          weight = targetAllocations.debt / 100 / (investments.filter(i => i.category === 'DEBT').length || 1);
        } else {
          weight = targetAllocations.other / 100 / (investments.filter(i => i.category !== 'EQUITY' && i.category !== 'DEBT').length || 1);
        }

        const simulatedTargetVal = totalPortfolioValue * weight;
        const simulatedCostVal = totalCost * weight;
        const newUnits = simulatedTargetVal / fund.nav;

        return {
          ...inv,
          units: parseFloat(newUnits.toFixed(4)),
          investedAmount: parseFloat(simulatedCostVal.toFixed(2)),
          currentValue: parseFloat(simulatedTargetVal.toFixed(2)),
          currentNAV: fund.nav
        };
      });

      setInvestments(updated);
      setRebalancingProgress(false);
      enqueueSnackbar('Tactical rebalancing trades executed successfully! Portfolio asset targets restored.', { variant: 'success' });
    }, 1200);
  };

  return (
    <div className="glass-panel p-5 rounded border border-white/5 space-y-6" id="mf-rebalancing">
      <div className="flex flex-wrap justify-between items-center border-b border-white/5 pb-3 gap-2">
        <h3 className="text-xs font-black uppercase tracking-wider font-mono text-white flex items-center gap-1.5">
          <RefreshCcw className="w-4 h-4 text-cyan-400" />
          Tactical Rebalancing Planner
        </h3>
        
        {/* Risk profile toggle */}
        <div className="flex gap-1 font-mono text-[9px] bg-white/5 p-0.5 rounded border border-white/5">
          {(['conservative', 'moderate', 'aggressive'] as const).map(p => (
            <button
              key={p}
              onClick={() => {
                setRiskProfile(p);
                enqueueSnackbar(`Switched rebalancing targets to ${p} model`, { variant: 'info' });
              }}
              className={`px-2 py-1 rounded cursor-pointer uppercase font-black tracking-wider transition-all ${
                riskProfile === p 
                  ? 'bg-cyan-500/15 border border-cyan-400 text-cyan-300 font-bold' 
                  : 'bg-transparent border-transparent text-white/40 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {!hasFunds ? (
        <div className="text-center font-mono text-xs py-12 text-white/40 bg-black/25 rounded border border-white/5 font-mono">
          No current investments. Start buying in the "Explore Funds" tab to compare allocations.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress / target deviation visualizer */}
          <div className="space-y-4 font-mono">
            <span className="text-[10px] font-bold uppercase text-white/40 block">TARGET VS ACTUAL ALLOCATION</span>
            
            {/* Equities comparative */}
            <div className="space-y-1.5 p-3 bg-black/35 rounded border border-white/5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-extrabold text-white text-[11px] uppercase">EQUITIES (CAP GROWTH)</span>
                <span className={`${Math.abs(eqDiff) > 5 ? 'text-[#ffaa00]' : 'text-emerald-400'} font-bold`}>
                  DIFF: {eqDiff > 0 ? '+' : ''}{eqDiff.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[9px] text-white/50 pt-1">
                <div>
                  <span>TARGET METRIC</span>
                  <span className="block text-white font-bold mt-0.5">{targetAllocations.equity}%</span>
                </div>
                <div>
                  <span>ACTUAL CURRENT</span>
                  <span className="block text-cyan-400 font-extrabold mt-0.5">{currentAllocations.equity.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Debt / Treasuries comparative */}
            <div className="space-y-1.5 p-3 bg-black/35 rounded border border-white/5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-extrabold text-white text-[11px] uppercase">BOND & DEBT SECURITIES</span>
                <span className={`${Math.abs(debtDiff) > 5 ? 'text-[#ffaa00]' : 'text-emerald-400'} font-bold`}>
                  DIFF: {debtDiff > 0 ? '+' : ''}{debtDiff.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[9px] text-white/50 pt-1">
                <div>
                  <span>TARGET METRIC</span>
                  <span className="block text-white font-bold mt-0.5">{targetAllocations.debt}%</span>
                </div>
                <div>
                  <span>ACTUAL CURRENT</span>
                  <span className="block text-cyan-400 font-extrabold mt-0.5">{currentAllocations.debt.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Other buffer comparative */}
            <div className="space-y-1.5 p-3 bg-black/35 rounded border border-white/5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-extrabold text-white text-[11px] uppercase">GOLD & LIQUID CASH</span>
                <span className={`${Math.abs(otherDiff) > 5 ? 'text-[#ffaa00]' : 'text-emerald-400'} font-bold`}>
                  DIFF: {otherDiff > 0 ? '+' : ''}{otherDiff.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[9px] text-white/50 pt-1">
                <div>
                  <span>TARGET METRIC</span>
                  <span className="block text-white font-bold mt-0.5">{targetAllocations.other}%</span>
                </div>
                <div>
                  <span>ACTUAL CURRENT</span>
                  <span className="block text-cyan-400 font-extrabold mt-0.5">{currentAllocations.other.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action List triggers */}
          <div className="space-y-4 font-mono flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase text-white/40 block">AUTOMATED ADJUSTMENT ADVISEMENT</span>

              {actions.length === 0 ? (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded text-emerald-400 text-xs flex gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Asset targets perfectly calibrated!</span>
                    No active trade schedules are required at this time.
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {actions.map((act, i) => (
                    <div key={i} className="p-3 bg-black/40 border border-white/5 hover:border-white/10 rounded flex gap-2 text-xs transition-all">
                      <div className="shrink-0 pt-0.5">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                          act.direction === 'SELL' ? 'bg-red-500/10 text-red-400 border border-red-500/25' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        }`}>
                          {act.direction}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-[10px]">
                        <span className="font-extrabold text-white uppercase block">{act.label}</span>
                        <p className="text-white/50 leading-relaxed">{act.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {actions.length > 0 && (
              <button
                disabled={rebalancingProgress}
                onClick={handleSimulateRebalance}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-black font-black uppercase text-xs tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--brand-cyan) 0%, #4f46e5 100%)', color: 'black' }}
              >
                <RefreshCcw className={`w-4 h-4 ${rebalancingProgress ? 'animate-spin' : ''}`} />
                {rebalancingProgress ? 'RESTREETING ASSET MATRIX...' : 'EXECUTE HYPOTHETICAL REBALANCE'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
