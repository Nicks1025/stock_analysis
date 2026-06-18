/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMutualFundStore, Investment, Scheme } from '../../store/mutualFundStore';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';
import { calculateXIRR } from '../../utils/xirr';
import { TrendingUp, ArrowDownRight, ArrowUpRight, Percent, Award, Landmark, RefreshCw, Layers } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

export function MFPortfolioAnalysis() {
  const { investments, funds, addInvestment, redeemInvestment } = useMutualFundStore();
  const { enqueueSnackbar } = useSnackbar();

  const [showBuyForm, setShowBuyForm] = useState(false);
  const [selectedFundId, setSelectedFundId] = useState('');
  const [buyAmount, setBuyAmount] = useState(10000);

  const [redeemingTarget, setRedeemingTarget] = useState<Investment | null>(null);
  const [unitsToRedeem, setUnitsToRedeem] = useState(0);

  // 1. Calculate holding ledger totals
  let totalInvested = 0;
  let totalCurrentValue = 0;

  investments.forEach((inv) => {
    totalInvested += inv.investedAmount;
    totalCurrentValue += inv.currentValue;
  });

  const aggregateProfit = totalCurrentValue - totalInvested;
  const aggregateProfitPct = totalInvested > 0 ? (aggregateProfit / totalInvested) * 100 : 0;

  // 2. Compute live Extended Internal Rate of Return (XIRR)
  const computeXIRR = (): number => {
    if (investments.length === 0) return 0;
    
    // Model transactions cash flows
    const cashFlows: { date: Date; amount: number }[] = [];
    
    // Cash flows of outflows: negative investment cash on purchase date
    investments.forEach(inv => {
      cashFlows.push({
        date: new Date(inv.purchaseDate),
        amount: -inv.investedAmount
      });
    });

    // Cash flow of inflow: single positive current value of entire holdings today
    cashFlows.push({
      date: new Date(), // Today
      amount: totalCurrentValue
    });

    return calculateXIRR(cashFlows);
  };

  const xirr = computeXIRR();

  const handleBuyInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    const fund = funds.find(f => f.id === selectedFundId);
    if (!fund) {
      enqueueSnackbar('Please choose a valid scheme', { variant: 'error' });
      return;
    }

    if (buyAmount <= 0) {
      enqueueSnackbar('Please enter a valid investment amount', { variant: 'error' });
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const unitPrice = fund.nav;
    const unitsAllocated = parseFloat((buyAmount / unitPrice).toFixed(4));

    addInvestment({
      fundId: fund.id,
      fundName: fund.name,
      category: fund.category,
      investedAmount: buyAmount,
      units: unitsAllocated,
      purchaseNAV: unitPrice,
      purchaseDate: todayDate,
      mappedGoalId: null
    });

    enqueueSnackbar(`Successfully processed lump premium allocate for ${fund.name}. Allocated ${unitsAllocated} units!`, { variant: 'success' });
    setShowBuyForm(false);
    setSelectedFundId('');
    setBuyAmount(10000);
  };

  const handleOpenRedeem = (inv: Investment) => {
    setRedeemingTarget(inv);
    setUnitsToRedeem(inv.units);
  };

  const handleRedeemConfirm = () => {
    if (!redeemingTarget) return;
    if (unitsToRedeem <= 0 || unitsToRedeem > redeemingTarget.units) {
      enqueueSnackbar(`Invalid units to redeem. Max available is ${redeemingTarget.units}`, { variant: 'error' });
      return;
    }

    redeemInvestment(redeemingTarget.id, unitsToRedeem);
    enqueueSnackbar(`Secured redemption of ${unitsToRedeem} units from ${redeemingTarget.fundName}. Sales proceeds credited.`, { variant: 'success' });
    setRedeemingTarget(null);
  };

  return (
    <div className="space-y-6 font-mono text-xs" id="mf-portfolio-analysis">
      {/* Dynamic Summary Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Invested */}
        <div className="bg-black/45 p-4 rounded border border-white/5 space-y-1 hover:border-cyan-500/15 transition-all">
          <span className="text-[10px] text-white/40 font-black uppercase tracking-wider block">TOTAL INVESTMENT</span>
          <div className="text-lg font-black text-white">{formatCurrency(totalInvested)}</div>
          <span className="text-[9px] text-white/30 block">Raw Cost Pool Basis</span>
        </div>

        {/* Current Valuation holdings */}
        <div className="bg-black/45 p-4 rounded border border-white/5 space-y-1">
          <span className="text-[10px] text-white/40 font-black uppercase tracking-wider block">CURRENT VALUATION</span>
          <div className="text-lg font-black text-cyan-300" style={{ color: 'var(--brand-cyan)' }}>{formatCurrency(totalCurrentValue)}</div>
          <span className="text-[9px] text-white/30 block">Live NAV Multiplier</span>
        </div>

        {/* Unrealized Profit and Loss */}
        <div className="bg-black/45 p-4 rounded border border-white/5 space-y-1">
          <span className="text-[10px] text-white/40 font-black uppercase tracking-wider block">UNREALIZED RETURNS (P&L)</span>
          <div className={`text-lg font-black flex items-center gap-1 ${aggregateProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {aggregateProfit >= 0 ? <ArrowUpRight className="w-5 h-5 shrink-0" /> : <ArrowDownRight className="w-5 h-5 shrink-0" />}
            {formatCurrency(aggregateProfit)}
          </div>
          <span className={`text-[9px] font-bold ${aggregateProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatPercent(aggregateProfitPct)} Total
          </span>
        </div>

        {/* Compound Annualized XIRR Return */}
        <div className="bg-black/45 p-4 rounded border border-white/5 space-y-1">
          <span className="text-[10px] text-white/40 font-black uppercase tracking-wider block">PORTFOLIO XIRR</span>
          <div className="text-lg font-black text-cyan-300 flex items-center gap-1" style={{ color: 'var(--brand-cyan)' }}>
            <Percent className="w-4 h-4 text-cyan-400 shrink-0" />
            {xirr.toFixed(2)}%
          </div>
          <span className="text-[9px] text-white/30 block">True Annualized CAGR Return</span>
        </div>
      </div>

      {/* Primary Holdings Breakout Table */}
      <div className="glass-panel p-5 rounded border border-white/5 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/5 pb-2">
          <h3 className="text-xs font-black uppercase tracking-wider font-mono text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            Active Mutual Fund Holdings Breakout
          </h3>
          <button
            onClick={() => setShowBuyForm(!showBuyForm)}
            className="text-[9px] uppercase tracking-wider font-mono font-black text-black bg-cyan-400 hover:bg-cyan-300 px-3 py-1 rounded cursor-pointer transition-all"
            style={{ backgroundColor: 'var(--brand-cyan)' }}
          >
            Deploy Lump Capital
          </button>
        </div>

        {/* Conditional Buy Order Form */}
        {showBuyForm && (
          <form onSubmit={handleBuyInvestment} className="bg-black/45 p-4 rounded border border-cyan-500/20 space-y-4 font-mono text-[10px]">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="font-extrabold text-cyan-400 text-xs uppercase text-white">Lump Capital Allocation Order Desk</span>
              <button 
                type="button" 
                onClick={() => setShowBuyForm(false)}
                className="text-white/40 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-white/50 block font-bold">Select Active Fund</label>
                <select
                  required
                  value={selectedFundId}
                  onChange={(e) => setSelectedFundId(e.target.value)}
                  className="w-full bg-black border border-white/10 p-2 text-xs font-mono text-white rounded outline-none h-9 focus:border-cyan-400"
                >
                  <option value="">-- Choose Fund --</option>
                  {funds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (NAV: ₹{f.nav.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-white/50 block font-bold">Deployment Amount (INR)</label>
                <input
                  required
                  type="number"
                  min="500"
                  step="500"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-white/10 p-2 text-xs font-mono text-white rounded outline-none h-9 focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-400 text-black font-extrabold uppercase rounded hover:opacity-90 transition-all cursor-pointer text-xs"
              style={{ backgroundColor: 'var(--brand-cyan)' }}
            >
              EXECUTE LUMP DEPLOYMENT ORDER
            </button>
          </form>
        )}

        {investments.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            No active portfolio allocation found. Choose "Explore Funds" below to allocate capital.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10.5px]">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase font-black">
                  <th className="py-2.5 pr-2">Mutual Fund Scheme</th>
                  <th className="py-2.5 px-2 text-right">Cost Price</th>
                  <th className="py-2.5 px-2 text-right">Units</th>
                  <th className="py-2.5 px-2 text-right">Buy/Current NAV</th>
                  <th className="py-2.5 px-2 text-right">Valuation</th>
                  <th className="py-2.5 px-2 text-right">CAGR Return</th>
                  <th className="py-2.5 pl-2 text-center">Trade Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {investments.map((inv) => {
                  const gain = inv.currentValue - inv.investedAmount;
                  const gainPct = inv.investedAmount > 0 ? (gain / inv.investedAmount) * 100 : 0;
                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 pr-2 font-bold text-white max-w-[220px]">
                        <span className="text-[8px] uppercase font-black text-cyan-400 block mb-0.5">{inv.category}</span>
                        <div className="truncate" title={inv.fundName}>{inv.fundName}</div>
                        <span className="text-[8px] text-white/30 block font-normal">Purchased: {formatDate(inv.purchaseDate)}</span>
                      </td>
                      <td className="py-3 px-2 text-right text-white/85 font-medium">{formatCurrency(inv.investedAmount)}</td>
                      <td className="py-3 px-2 text-right text-white/70">{inv.units.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right text-white/50">
                        ₹{inv.purchaseNAV.toFixed(2)} / <strong className="text-white">₹{inv.currentNAV.toFixed(2)}</strong>
                      </td>
                      <td className="py-3 px-2 text-right text-cyan-300 font-extrabold" style={{ color: 'var(--brand-cyan)' }}>
                        {formatCurrency(inv.currentValue)}
                      </td>
                      <td className={`py-3 px-2 text-right font-black ${gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatPercent(gainPct)}
                      </td>
                      <td className="py-3 pl-2 text-center">
                        <button
                          onClick={() => handleOpenRedeem(inv)}
                          className="px-2 py-0.5 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-[8px] font-bold uppercase rounded cursor-pointer transition-all"
                        >
                          Redeem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Redemption popup modifier */}
      {redeemingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono text-[11px]">
          <div className="bg-neutral-900 border border-white/10 p-5 rounded w-full max-w-sm space-y-4">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-rose-400 font-extrabold block">REDEMPTION CENTER</span>
              <h4 className="text-white font-extrabold text-sm uppercase">Redeem Units</h4>
              <p className="text-white/40 text-[9.5px] mt-1 leading-relaxed">
                Confirm how many shares/units to sell from your holding in {redeemingTarget.fundName}.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[9px] uppercase text-white/50 block font-black">
                <span>Enter Units</span>
                <span>(Max: {redeemingTarget.units.toFixed(4)} units)</span>
              </div>
              <input
                required
                type="number"
                step="0.0001"
                min="0.0001"
                max={redeemingTarget.units}
                value={unitsToRedeem}
                onChange={(e) => setUnitsToRedeem(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-white/10 p-2 text-xs font-mono text-white rounded outline-none h-9 focus:border-cyan-400"
              />
              <span className="text-[9px] text-[#ffaa00] font-medium block">
                Estimated sales proceeds: ₹{(unitsToRedeem * redeemingTarget.currentNAV).toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2 justify-end pt-2 text-[10px]">
              <button
                onClick={() => setRedeemingTarget(null)}
                className="px-3.5 py-1.5 border border-white/10 text-white/50 hover:text-white rounded cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeemConfirm}
                className="px-4 py-1.5 bg-rose-500 text-white font-black uppercase rounded hover:bg-rose-400 cursor-pointer transition-colors"
              >
                Confirm Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
