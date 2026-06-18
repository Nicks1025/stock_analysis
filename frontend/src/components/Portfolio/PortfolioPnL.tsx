import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Target, HelpCircle, Activity, Sparkles } from 'lucide-react';
import { Holding } from '../../store/portfolioStore';

interface PortfolioPnLProps {
  holdings: Holding[];
  summary: any;
}

export function PortfolioPnL({ holdings, summary }: PortfolioPnLProps) {
  // Sort holdings by profit
  const sortedByProfit = [...holdings].sort((a, b) => b.pandl - a.pandl);
  
  const highPerformers = sortedByProfit.filter(h => h.pandl > 0).slice(0, 3);
  const laggards = [...sortedByProfit].reverse().filter(h => h.pandl < 0).slice(0, 3);

  // Top gainer and loser of all time
  const topGainer = sortedByProfit[0];
  const topLaggard = sortedByProfit[sortedByProfit.length - 1];

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs" id="portfolio-pnl-panel">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <div className="text-left">
          <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block">Ledger Performance Diagnostics</span>
          <span className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 google-font">
            <Activity className="w-4 h-4 text-cyan-400" /> Profits & Losses (P&L) Audit
          </span>
        </div>
        <div className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20 text-[#00f2ff] text-[9px] font-bold uppercase tracking-wider">
          MARKET TRACKER ACTIVE
        </div>
      </div>

      {/* Main core P&L highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Unrealized gains */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded text-left relative overflow-hidden">
          <span className="text-[8px] text-white/40 uppercase block">UNREALIZED ABSOLUTE RETURNS</span>
          <span className={`text-lg font-black block mt-1.5 flex items-center gap-1 ${(summary?.totalProfitLoss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {(summary?.totalProfitLoss || 0) >= 0 ? <ArrowUpRight className="w-4.5 h-4.5 text-emerald-400" /> : <ArrowDownRight className="w-4.5 h-4.5 text-red-500" />}
            ₹{Math.abs(summary?.totalProfitLoss || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className={`text-[8.5px] font-bold block mt-1 ${ (summary?.profitLossPercent || 0) >= 0 ? 'text-emerald-400/80' : 'text-red-400/80' }`}>
            { (summary?.profitLossPercent || 0) >= 0 ? '+' : '' }{(summary?.profitLossPercent || 0).toFixed(2)}% Net Return
          </span>
        </div>

        {/* Intraday market movement */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded text-left relative overflow-hidden">
          <span className="text-[8px] text-white/40 uppercase block">SIMULATED DAILY DELTA (24H)</span>
          <span className={`text-lg font-black block mt-1.5 flex items-center gap-1 ${(summary?.dailyProfitLoss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {(summary?.dailyProfitLoss || 0) >= 0 ? <TrendingUp className="w-4.5 h-4.5 text-emerald-400" /> : <TrendingDown className="w-4.5 h-4.5 text-red-500" />}
            ₹{Math.abs(summary?.dailyProfitLoss || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className={`text-[8.5px] font-bold block mt-1 ${ (summary?.dailyProfitLossPercent || 0) >= 0 ? 'text-emerald-400/80' : 'text-red-400/80' }`}>
            { (summary?.dailyProfitLossPercent || 0) >= 0 ? '+' : '' }{(summary?.dailyProfitLossPercent || 0).toFixed(2)}% Intraday
          </span>
        </div>

        {/* Top Performer capsule */}
        <div className="p-3 bg-[#0d2a23]/30 border border-emerald-500/10 rounded text-left relative overflow-hidden">
          <span className="text-[8px] text-emerald-400/60 uppercase block font-black">LEAD VALUE GENERATOR</span>
          {topGainer ? (
            <div className="mt-1">
              <span className="text-sm font-black text-white block truncate uppercase">{topGainer.symbol}</span>
              <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">
                +₹{topGainer.pandl.toLocaleString('en-IN')} (+{topGainer.pandlPercent.toFixed(1)}%)
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-white/20 block mt-2">NA • Seed holding</span>
          )}
        </div>

      </div>

      {/* Performers Breakout lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Top Gainers list */}
        <div className="p-3 bg-emerald-950/5 border border-emerald-500/10 rounded space-y-2.5 text-left">
          <span className="text-[8px] font-black uppercase text-emerald-400 tracking-wider block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> GAINS ACCUMULATION LEAGUE
          </span>
          <div className="space-y-1.5">
            {highPerformers.length > 0 ? (
              highPerformers.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded bg-black/20 border border-white/5 font-mono text-[10px]">
                  <div>
                    <span className="text-white font-black block">{h.symbol}</span>
                    <span className="text-[8px] text-white/30 block font-sans">{h.companyName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">+₹{h.pandl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    <span className="text-[8.5px] text-emerald-500/80 font-bold block">+{h.pandlPercent.toFixed(1)}%</span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-[9px] text-white/20 block p-4 text-center select-none">No positive yield channels logged.</span>
            )}
          </div>
        </div>

        {/* Top Laggards list */}
        <div className="p-3 bg-red-950/5 border border-red-500/10 rounded space-y-2.5 text-left">
          <span className="text-[8px] font-black uppercase text-red-400 tracking-wider block flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> LIQUIDITY RETRACT HEADWINDS
          </span>
          <div className="space-y-1.5">
            {laggards.length > 0 ? (
              laggards.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded bg-black/20 border border-white/5 font-mono text-[10px]">
                  <div>
                    <span className="text-white font-black block">{h.symbol}</span>
                    <span className="text-[8px] text-white/30 block font-sans">{h.companyName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 font-bold block">-₹{Math.abs(h.pandl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    <span className="text-[8.5px] text-red-500/80 font-bold block">{h.pandlPercent.toFixed(1)}%</span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-[9px] text-white/20 block p-4 text-center select-none">No capital decompression logged. Fully green!</span>
            )}
          </div>
        </div>

      </div>

      {/* Educational notice block */}
      <div className="bg-white/[0.01] border border-white/5 p-3 rounded text-[9.5px] text-white/50 leading-relaxed font-sans flex items-start gap-2 text-left">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          Your capital is currently trading at a consolidated net variance of <span className="text-white font-bold font-mono">{summary?.profitLossPercent >= 0 ? '+' : ''}{summary?.profitLossPercent}%</span> against book acquisition cost. 
          {summary?.totalProfitLoss > 0 
            ? ' Securing profit booking in highly valued IT sectors can optimize overall capital cycles.' 
            : ' Accumulating fundamentally strong bluechip counters under support levels supports healthy long-term recovery metrics.'}
        </p>
      </div>
    </div>
  );
}

export default PortfolioPnL;
