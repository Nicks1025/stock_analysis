/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMutualFundStore, Scheme } from '../../store/mutualFundStore';
import { formatCurrency, formatPercent, formatLargeNumber } from '../../utils/formatters';
import { Check, X, ArrowLeftRight, TrendingUp, Sparkles, MinusCircle } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

export function MFFundComparison() {
  const { funds, compareFundIds, toggleCompareFund, clearCompare } = useMutualFundStore();
  const { enqueueSnackbar } = useSnackbar();

  const comparedFunds = funds.filter((f) => compareFundIds.includes(f.id));

  const handleRemove = (id: string, name: string) => {
    toggleCompareFund(id);
    enqueueSnackbar(`Removed ${name} from comparison tray`, { variant: 'info' });
  };

  return (
    <div className="glass-panel p-5 rounded border border-white/5 space-y-6" id="mf-fund-comparison">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <h3 className="text-xs font-black uppercase tracking-wider font-mono text-white flex items-center gap-1.5">
          <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
          Side-By-Side Fund Comparison
        </h3>
        {comparedFunds.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-[9px] uppercase tracking-wider font-mono text-rose-400 font-black bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded cursor-pointer hover:bg-rose-500/20 transition-all"
          >
            Clear Tray
          </button>
        )}
      </div>

      {comparedFunds.length === 0 ? (
        <div className="text-center font-mono text-xs py-12 text-white/40 bg-black/25 rounded border border-dashed border-white/5 space-y-2">
          <ArrowLeftRight className="w-8 h-8 text-white/15 mx-auto mb-1 animate-pulse" />
          <p className="font-extrabold uppercase text-white/75">Comparison Tray is Empty</p>
          <p className="text-[10px] text-white/30 max-w-sm mx-auto">Click "Toggle Compare" on fund cards in the explorer below to add schemes side-by-side.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-[10px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-2.5 text-white/40 uppercase font-black pr-4 min-w-[130px]">Metrics / Criteria</th>
                {comparedFunds.map((fund) => (
                  <th key={fund.id} className="py-2.5 font-bold text-white min-w-[160px] pl-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-[8px] uppercase tracking-wider text-cyan-400 font-extrabold">
                          {fund.category} // {fund.subCategory}
                        </div>
                        <div className="text-[11px] font-black line-clamp-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>{fund.name}</div>
                      </div>
                      <button
                        onClick={() => handleRemove(fund.id, fund.name)}
                        className="text-white/30 hover:text-rose-400 p-0.5 rounded cursor-pointer shrink-0 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {/* Returns Section */}
              <tr>
                <td className="py-2 font-bold text-white uppercase text-xs">Returns Profile</td>
                {comparedFunds.map((f) => <td key={f.id} className="py-2" />)}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">1 Year CAGR</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-emerald-400 font-black">{formatPercent(f.return1Y)}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">3 Year CAGR</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-emerald-400 font-black underline decoration-cyan-400/30">{formatPercent(f.return3Y)}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">5 Year CAGR</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-emerald-400 font-black">{formatPercent(f.return5Y)}</td>
                ))}
              </tr>

              {/* Fund Management */}
              <tr>
                <td className="py-2 font-bold text-white uppercase text-xs">Fund Details</td>
                {comparedFunds.map((f) => <td key={f.id} className="py-2" />)}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">AUM Value</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-white font-bold">₹{f.aum.toLocaleString()} Cr</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Current NAV</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-white font-bold">₹{f.nav.toFixed(2)}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Expense Ratio</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-rose-300 font-medium">{f.expenseRatio.toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Fund Lead Manager</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-white/70">{f.manager}</td>
                ))}
              </tr>

              {/* Risk Analytics */}
              <tr>
                <td className="py-2 font-bold text-white uppercase text-xs">Volatility & Risk</td>
                {comparedFunds.map((f) => <td key={f.id} className="py-2" />)}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Risk Rating</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className={`py-1.5 pl-4 font-black ${f.riskRating === 'Very High' || f.riskRating === 'High' ? 'text-[#ffaa00]' : 'text-emerald-400'}`}>
                    {f.riskRating.toUpperCase()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Beta Rating</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 font-bold text-white">{f.beta.toFixed(2)}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Standard Deviation</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-white">{f.stdDev.toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Sharpe Ratio</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-cyan-300 font-bold">{f.sharpeRatio.toFixed(2)}</td>
                ))}
              </tr>

              {/* Asset Allocation Breakdown */}
              <tr>
                <td className="py-2 font-bold text-white uppercase text-xs">Allocation breakdown</td>
                {comparedFunds.map((f) => <td key={f.id} className="py-2" />)}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Equity %</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 font-bold text-white">{f.equityPercent}%</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Debt %</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 font-bold text-white">{f.debtPercent}%</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px]">Gold & Cash %</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-white/70">{f.goldPercent + f.cashPercent}%</td>
                ))}
              </tr>

              {/* Primary Portfolio Constituents */}
              <tr>
                <td className="py-2 font-bold text-white uppercase text-xs">Top holdings Weight</td>
                {comparedFunds.map((f) => <td key={f.id} className="py-2" />)}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px] vertical-align-top">Top Corporate Holding</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-white">
                    <span className="block font-bold truncate max-w-[150px]">{f.topHoldings[0]?.company || 'None'}</span>
                    <span className="text-[8px] text-white/40">WEIGHT: {f.topHoldings[0]?.weight.toFixed(2)}%</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-white/50 text-[9px] vertical-align-top">Second Holding</td>
                {comparedFunds.map((f) => (
                  <td key={f.id} className="py-1.5 pl-4 text-white/90">
                    <span className="block font-semibold truncate max-w-[150px]">{f.topHoldings[1]?.company || 'None'}</span>
                    <span className="text-[8px] text-white/40">WEIGHT: {f.topHoldings[1]?.weight.toFixed(2)}%</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Suggestion banner */}
      {comparedFunds.length >= 2 && (
        <div className="bg-indigo-950/20 border border-indigo-500/10 text-indigo-300 p-3.5 rounded text-[10px] font-mono leading-relaxed flex gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Expert Analysis:</strong> Dynamic allocation overlays show that {
              comparedFunds[0].return3Y > comparedFunds[1].return3Y ? comparedFunds[0].name : comparedFunds[1].name
            } yields superior 3Y CAGR returns (+{
              Math.max(comparedFunds[0].return3Y, comparedFunds[1].return3Y)
            }%), whereas {
              comparedFunds[0].sharpeRatio > comparedFunds[1].sharpeRatio ? comparedFunds[0].name : comparedFunds[1].name
            } boasts optimized risk-adjusted metrics (Sharpe: {
              Math.max(comparedFunds[0].sharpeRatio, comparedFunds[1].sharpeRatio).toFixed(2)
            }). Look for high Sharpe alongside robust return tracks.
          </span>
        </div>
      )}
    </div>
  );
}
