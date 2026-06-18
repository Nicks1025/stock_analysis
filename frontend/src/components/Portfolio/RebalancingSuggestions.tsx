import React from 'react';
import { Target, ArrowUpRight, ArrowDownRight, RefreshCw, HelpCircle, ShieldCheck, Zap } from 'lucide-react';
import { Holding } from '../../store/portfolioStore';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface RebalancingSuggestionsProps {
  holdings: Holding[];
}

export function RebalancingSuggestions({ holdings }: RebalancingSuggestionsProps) {
  const { enqueueSnackbar } = useSnackbar();

  // Calculate current weights
  const totalValue = holdings.reduce((acc, h) => acc + (h.currentPrice * h.quantity), 0);
  
  // Symmetrical target weight mapping: e.g. balanced equally or customized by sector limits
  // Let's assume an equal target weight model as fallback, say: 100% / holdings.length
  const targetWeight = holdings.length > 0 ? 100 / holdings.length : 100;

  const rebalanceData = holdings.map((h) => {
    const curVal = h.currentPrice * h.quantity;
    const curWeight = totalValue > 0 ? (curVal / totalValue) * 100 : 0;
    const deltaWeight = curWeight - targetWeight;
    
    // Difference in value required to meet target weight
    const rawValDiff = ((targetWeight / 100) * totalValue) - curVal;
    
    // Difference in shares count to add/reduce
    const sharesDiff = Math.round(rawValDiff / h.currentPrice);

    return {
      ...h,
      weight: curWeight,
      targetWeight,
      deltaWeight,
      valDiff: rawValDiff,
      sharesDiff
    };
  }).sort((a, b) => b.deltaWeight - a.deltaWeight); // Overweighted first

  const handleApplyRebalance = (ticker: string, side: 'BUY' | 'SELL', count: number) => {
    const targetLabel = side === 'BUY' ? `Buy secondary allocation of ${count} shares` : `Liquidate excess count of ${count} shares`;
    enqueueSnackbar(`Initializing trade order blueprint for ${ticker}: ${targetLabel}`, { variant: 'info' });
  };

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs text-left" id="rebalancing-suggestions-panel">
      {/* Title */}
      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block font-mono">portfolio re-alignment logs</span>
      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 google-font pb-2 border-b border-white/5">
        <RefreshCw className="w-5 h-5 text-cyan-400" /> Capital Rebalancing Suggestions
      </h3>

      {holdings.length === 0 ? (
        <div className="p-8 text-center text-white/20 uppercase font-black tracking-widest font-mono">
          No holdings logged to provide rebalancing guidelines. Add stocks.
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Main allocation rules card */}
          <div className="p-3.5 bg-cyan-950/5 border border-cyan-500/10 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[8px] uppercase text-white/40 font-black">Allotment model</span>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                EQUAL-BALANCE PORTFOLIO TARGET RULE: <span className="text-cyan-400">{targetWeight.toFixed(1)}% PER SECURITY</span>
              </h4>
              <p className="text-[9px] text-white/50 leading-relaxed font-sans">
                Aligning asset volumes matching these levels offsets structural cluster decay and lowers sector bias risk.
              </p>
            </div>
            <div className="bg-black/30 border border-white/10 px-2.5 py-1.5 rounded text-[8.5px] uppercase font-bold text-white shrink-0">
              Composite Assets: {holdings.length}
            </div>
          </div>

          {/* Rebalancing suggested ledger */}
          <div className="border border-white/5 rounded overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10.5px]">
              <thead>
                <tr className="bg-black/55 border-b border-white/10 text-white/40 uppercase text-[8px] tracking-widest font-black">
                  <th className="p-2.5">SEURIY</th>
                  <th className="p-2.5 text-right">CURRENT WEIGHT</th>
                  <th className="p-2.5 text-right">TARGET INDX</th>
                  <th className="p-2.5 text-right font-mono">WEIGHT DEVIATION</th>
                  <th className="p-2.5 text-right">VALUATION SHIFT Required</th>
                  <th className="p-2.5 text-right">ACTION COMMAND</th>
                </tr>
              </thead>
              <tbody>
                {rebalanceData.map((item, idx) => {
                  const isOver = item.deltaWeight > 1.2;
                  const isUnder = item.deltaWeight < -1.2;
                  
                  let statusText = 'BALANCED';
                  let statusColor = 'text-white/40 bg-zinc-900/50 border-white/5';
                  let side: 'BUY' | 'SELL' = 'BUY';
                  
                  if (isOver) {
                    statusText = 'REDUCE WEIGHT';
                    statusColor = 'text-red-400 bg-red-950/20 border-red-500/10';
                    side = 'SELL';
                  } else if (isUnder) {
                    statusText = 'ADD WEIGHT';
                    statusColor = 'text-emerald-400 bg-emerald-950/20 border-emerald-500/10';
                    side = 'BUY';
                  }

                  return (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-2.5 font-bold text-white">{item.symbol}</td>
                      <td className="p-2.5 text-right text-white font-mono">{item.weight.toFixed(1)}%</td>
                      <td className="p-2.5 text-right text-white/50">{item.targetWeight.toFixed(1)}%</td>
                      <td className={`p-2.5 text-right font-bold ${isOver ? 'text-red-400' : isUnder ? 'text-emerald-400' : 'text-white/45'}`}>
                        {(item.deltaWeight >= 0 ? '+' : '') + item.deltaWeight.toFixed(1)}%
                      </td>
                      <td className="p-2.5 text-right text-white/70 font-mono">
                        {item.valDiff === 0 ? (
                          '₹0'
                        ) : item.valDiff > 0 ? (
                          <span className="text-emerald-400 font-bold">+₹{Math.ceil(item.valDiff).toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-red-400 font-bold">-₹{Math.ceil(Math.abs(item.valDiff)).toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right">
                        {item.sharesDiff === 0 ? (
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-transparent font-bold text-[8.5px] uppercase text-white/40 font-mono">
                            OPTIMIZED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApplyRebalance(item.symbol, side, Math.abs(item.sharesDiff))}
                            className={`px-2 py-0.5 rounded border font-bold text-[8.5px] cursor-pointer uppercase transition-all whitespace-nowrap block ml-auto ${statusColor}`}
                          >
                            {statusText}: {Math.abs(item.sharesDiff)} Shares
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-[9.5px] rounded bg-white/[0.01] border border-white/5 p-3 text-white/50 font-sans flex items-start gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              Rebalancing indicators compute allocations symmetrically. For higher yields, buy target count offsets to narrow variance scores down to +/- 1.0%. Running updates quarterly preserves tactical compound metrics.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}

export default RebalancingSuggestions;
