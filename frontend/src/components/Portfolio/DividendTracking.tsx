import React, { useState } from 'react';
import { Calendar, Percent, Coins, Layers, HelpCircle, ShieldCheck, CreditCard } from 'lucide-react';
import { DividendRecord } from '../../store/portfolioStore';

interface DividendTrackingProps {
  dividends: DividendRecord[];
  totalHoldingValue: number;
}

export function DividendTracking({ dividends, totalHoldingValue }: DividendTrackingProps) {
  const [selectedYear, setSelectedYear] = useState('25/26');

  // Compute stats
  const paidDividends = dividends.filter(d => d.status === 'PAID');
  const declaredDividends = dividends.filter(d => d.status === 'DECLARED' || d.status === 'UPCOMING');

  const totalPaidSum = paidDividends.reduce((acc, d) => acc + d.totalPayout, 0);
  const totalProjectedSum = declaredDividends.reduce((acc, d) => acc + d.totalPayout, 0);
  
  // Consolidated Dividends Yield (Sum of annual dividends / total portfolio asset value)
  const annualDividendsSum = dividends.reduce((acc, d) => acc + d.totalPayout, 0);
  const divisionWeight = totalHoldingValue > 0 ? (annualDividendsSum / totalHoldingValue) * 100 : 1.45; // 1.45% mock default yield if static

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs text-left" id="dividend-tracking-panel">
      {/* Title */}
      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block font-mono">FINANCIAL INCOME CALENDAR</span>
      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 google-font pb-2 border-b border-white/5">
        <Coins className="w-5 h-5 text-cyan-400" /> Dividend Tracking Ledger
      </h3>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Dividend Yield */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded">
          <span className="text-[8px] text-white/40 uppercase block">AGGREGATE DIVIDEND YIELD</span>
          <span className="text-lg font-black text-emerald-400 block mt-1.5 font-mono">+{divisionWeight.toFixed(2)}%</span>
          <span className="text-[8.5px] text-white/33 block mt-0.5 uppercase font-sans">
            Relative to asset market values
          </span>
        </div>

        {/* Realized credits */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded">
          <span className="text-[8px] text-white/40 uppercase block">REALIZED CASH CREDITS (YTD)</span>
          <span className="text-lg font-black text-white block mt-1.5">₹{totalPaidSum.toLocaleString('en-IN')}</span>
          <span className="text-[8.5px] text-cyan-400 font-bold block mt-0.5">
            Credit-to-account settlements
          </span>
        </div>

        {/* Projected incomes */}
        <div className="p-3 bg-[#0c2a38]/35 border border-cyan-500/10 rounded">
          <span className="text-[8px] text-cyan-400/80 uppercase block font-black">PROJECTED RESERVES (2H)</span>
          <span className="text-lg font-black text-cyan-300 block mt-1.5">₹{totalProjectedSum.toLocaleString('en-IN')}</span>
          <span className="text-[8.5px] text-emerald-400 font-bold block mt-0.5">
            Declarations ex-dividend pending
          </span>
        </div>

      </div>

      {/* Calendar listing */}
      <div className="space-y-3">
        <span className="text-[8.5px] font-black uppercase text-white/40 tracking-wider block">EX-DIVIDEND ESCROW LEDGER</span>
        
        {dividends.length === 0 ? (
          <div className="p-8 text-center text-white/20 uppercase font-bold text-[9px] tracking-widest leading-relaxed">
            No dividend payouts recorded for existing tickers yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {dividends.map((div, idx) => {
              const stateColor = div.status === 'PAID' 
                ? 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5' 
                : div.status === 'DECLARED' 
                  ? 'text-cyan-400 border-cyan-500/10 bg-cyan-500/5 shadow-[0_0_8px_rgba(0,242,255,0.02)] animate-pulse' 
                  : 'text-yellow-400 border-yellow-500/10 bg-yellow-500/5';
              return (
                <div key={idx} className="p-3 bg-black/35 border border-white/5 rounded hover:border-white/10 transition-colors flex justify-between gap-4 text-left">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-[11px] block">{div.symbol}</span>
                      <span className="text-[8.5px] text-white/33 font-sans truncate block leading-none">{div.companyName}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[8.5px] uppercase text-white/33 font-mono">
                      <span>Ex-Date: <strong className="text-white/50">{div.recordDate}</strong></span>
                      <span>•</span>
                      <span>Credit-Date: <strong className="text-white/50">{div.paymentDate}</strong></span>
                    </div>
                  </div>

                  {/* Dividend pricing payout badge */}
                  <div className="text-right flex items-center gap-3 shrink-0 self-center">
                    <div>
                      <span className="text-[8px] text-white/40 block">PAYOUT RATE</span>
                      <span className="text-white font-bold block text-[10px]">₹{div.amountPerShare} / share</span>
                    </div>
                    <div className={`p-1.5 rounded border ${stateColor} text-[8.5px] tracking-widest font-extrabold text-center min-w-[75px] `}>
                      <span>{div.status}</span>
                      <span className="text-[7.5px] block font-mono opacity-80 mt-0.5">₹{div.totalPayout}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Projections details disclaimers */}
      <div className="text-[8px] text-white/20 text-right uppercase tracking-wider block font-bold pointer-events-none select-none">
        Payout credit operations settle matching standard t+2 corporate escrow processing guidelines.
      </div>
    </div>
  );
}

export default DividendTracking;
