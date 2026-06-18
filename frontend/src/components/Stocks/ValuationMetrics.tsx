import React, { useState } from 'react';
import { BarChart, Percent, Coins, LayoutGrid, FileText, Database } from 'lucide-react';

interface ValuationMetricsProps {
  symbol: string;
  price: number;
}

export function ValuationMetrics({ symbol, price }: ValuationMetricsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'MULTIPLE' | 'INCOME' | 'BALANCE'>('MULTIPLE');
  
  // Calculate distinct multipliers based on symbol name to make simulated data feel organic
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const peRatio = Number((15 + (hash % 38)).toFixed(1));
  const pbRatio = Number((2.5 + (hash % 12) / 3).toFixed(1));
  const debtToEquity = Number(((hash % 15) / 11).toFixed(2));
  const dividendYield = Number((0.2 + (hash % 8) / 2).toFixed(2));
  const roe = Number((12 + (hash % 24)).toFixed(1));
  const revenueGrowth = Number((5 + (hash % 32)).toFixed(1));
  const epsVal = Number((price / peRatio).toFixed(2));
  const evEbitda = Number((8 + (hash % 14)).toFixed(1));
  const pegRatio = Number((0.8 + (hash % 10) / 10).toFixed(2));

  // Sector avg multipliers for reference
  const sectorAvgPe = Number((22 + (hash % 15)).toFixed(1));

  // Financial Ledger Data points
  const currentFiscalYearData = [
    { metric: 'Gross Operating Revenue', fy24: '₹148,252 Cr', fy25: '₹172,901 Cr', fy26: '₹198,340 Cr', status: 'Optimal' },
    { metric: 'Consolidated EBITDA Corp', fy24: '₹34,105 Cr', fy25: '₹41,200 Cr', fy26: '₹49,150 Cr', status: 'Rising' },
    { metric: 'Operating Profit Margin (OPM)', fy24: '23.0%', fy25: '23.8%', fy26: '24.7%', status: 'Stable' },
    { metric: 'Interest Capex Outgoings', fy24: '₹2,104 Cr', fy25: '₹1,950 Cr', fy26: '₹1,420 Cr', status: 'Reducing' },
    { metric: 'Net Consolidated Income (PAT)', fy24: '₹24,810 Cr', fy25: '₹29,155 Cr', fy26: '₹35,840 Cr', status: 'Optimal' }
  ];

  const balanceSheetMock = [
    { asset: 'Shareholders Reserves & Equity', reserves24: '₹95,200 Cr', reserves25: '₹118,500 Cr', change: '+24.4%' },
    { asset: 'Long-term Secure Liabilities', reserves24: '₹14,200 Cr', reserves25: '₹12,100 Cr', change: '-14.7%' },
    { asset: 'Consolidated Liquid Balances', reserves24: '₹18,500 Cr', reserves25: '₹24,100 Cr', change: '+30.2%' },
    { asset: 'Plant, IP & Tangible Equipment', reserves24: '₹62,400 Cr', reserves25: '₹75,800 Cr', change: '+21.4%' }
  ];

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs" id={`valuation-metrics-${symbol}`}>
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <span className="text-[10px] font-black uppercase text-white tracking-widest block flex items-center gap-1.5 google-font">
          <BarChart className="w-4 h-4 text-cyan-400" /> Valuation & Ledger profile
        </span>

        {/* Tab triggers */}
        <div className="flex bg-white/5 p-0.5 rounded border border-white/5 self-start sm:self-auto font-mono text-[9px]">
          <button
            onClick={() => setActiveSubTab('MULTIPLE')}
            className={`px-3 py-1 rounded cursor-pointer transition-all ${
              activeSubTab === 'MULTIPLE' ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-white/40 hover:text-white'
            }`}
          >
            VALUATION MULTIPLES
          </button>
          <button
            onClick={() => setActiveSubTab('INCOME')}
            className={`px-3 py-1 rounded cursor-pointer transition-all ${
              activeSubTab === 'INCOME' ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-white/40 hover:text-white'
            }`}
          >
            INCOME STATEMENT
          </button>
          <button
            onClick={() => setActiveSubTab('BALANCE')}
            className={`px-3 py-1 rounded cursor-pointer transition-all ${
              activeSubTab === 'BALANCE' ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-white/40 hover:text-white'
            }`}
          >
            BALANCE SHEET
          </button>
        </div>
      </div>

      {/* Dynamic Tab Body rendering */}
      {activeSubTab === 'MULTIPLE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5" id="valuation-grid-multiples">
            {/* Box 1: P/E */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative overflow-hidden group">
              <span className="text-[8px] text-white/40 uppercase block">PRICE TO EARNINGS (P/E)</span>
              <span className="text-sm font-extrabold text-white block">{peRatio}x</span>
              <span className="text-[7.5px] text-cyan-400 font-bold block mt-1 font-sans">SECTOR AVERAGE: {sectorAvgPe}x</span>
            </div>

            {/* Box 2: PEG */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative overflow-hidden group">
              <span className="text-[8px] text-white/40 uppercase block">PEG ratio</span>
              <span className="text-sm font-extrabold text-[#00f2ff] block" style={{ color: 'var(--brand-cyan)' }}>{pegRatio}</span>
              <span className="text-[7.5px] text-emerald-400 font-bold block mt-1 font-sans">
                {pegRatio < 1 ? '• UNDERVALUED GROW' : '• STANDARD RANGE'}
              </span>
            </div>

            {/* Box 3: P/B */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative">
              <span className="text-[8px] text-white/40 uppercase block">PRICE TO BOOK (P/B)</span>
              <span className="text-sm font-extrabold text-white block">{pbRatio}x</span>
              <span className="text-[7.5px] text-white/30 block mt-1 font-sans">ASSET LIQUEFACTION VALUE</span>
            </div>

            {/* Box 4: Debt-To-Equity leverage */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative">
              <span className="text-[8px] text-white/40 uppercase block">DEBT TO EQUITY RATIO</span>
              <span className={`text-sm font-extrabold block ${debtToEquity > 1 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {debtToEquity}
              </span>
              <span className="text-[7.5px] text-white/35 block mt-1 font-sans">
                {debtToEquity < 0.5 ? 'LOW BANKING RISK' : 'HEALTHY CAP STRUCTURE'}
              </span>
            </div>

            {/* Box 5: Dividend Yield */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative">
              <span className="text-[8px] text-white/40 uppercase block">DIVIDEND YIELD</span>
              <span className="text-sm font-extrabold text-emerald-400 block font-mono">+{dividendYield}%</span>
              <span className="text-[7.5px] text-white/30 block mt-1 font-sans">ANNUAL INCOME REBATE</span>
            </div>

            {/* Box 6: EV/EBITDA */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative">
              <span className="text-[8px] text-white/40 uppercase block">EV / EBITDA MULTIPLE</span>
              <span className="text-sm font-extrabold text-white block">{evEbitda}x</span>
              <span className="text-[7.5px] text-white/30 block mt-1 font-sans">TAKEOVER ENTERPRISE DELTA</span>
            </div>

            {/* Box 7: Return on Equity */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative">
              <span className="text-[8px] text-white/40 uppercase block">RETURN ON EQUITY (ROE)</span>
              <span className="text-sm font-bold text-emerald-400 block">+{roe}%</span>
              <span className="text-[7.5px] text-white/30 block mt-1 font-sans">COMPUTE SHAREHOLDER ROI</span>
            </div>

            {/* Box 8: Corporate EPS */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative">
              <span className="text-[8px] text-white/40 uppercase block">COREG PAT EPS</span>
              <span className="text-sm font-bold text-white block">₹{epsVal}</span>
              <span className="text-[7.5px] text-white/30 block mt-1 font-sans">EARNINGS RATIO POINT</span>
            </div>
          </div>

          {/* Quick analysis notice */}
          <div className="bg-white/[0.01] border border-white/5 p-3 rounded text-[10px] text-white/50 leading-relaxed font-sans flex items-start gap-2">
            <Percent className="w-4 h-4 text-[#ffaa00] shrink-0 mt-0.5" style={{ color: 'var(--brand-amber)' }} />
            <p>
              Security trades at a <span className="font-bold text-white">Trailing P/E of {peRatio}x</span>, in contrast to the sector baseline of {sectorAvgPe}x. 
              {peRatio < sectorAvgPe 
                ? ' Under-leveraged valuation multiples suggest potentially defensive buy channels.' 
                : ' Premium pricing highlights strong investor growth expectations for the fiscal year.'}
            </p>
          </div>
        </div>
      )}

      {activeSubTab === 'INCOME' && (
        <div className="border border-white/5 rounded overflow-hidden">
          <table className="w-full text-left border-collapse font-mono text-[10px]">
            <thead>
              <tr className="bg-black/55 border-b border-b-white/10 text-white/40 uppercase text-[8px] tracking-widest font-black">
                <th className="p-2.5">FINANCIAL HEADINGS</th>
                <th className="p-2.5 text-right">FY 2023-24</th>
                <th className="p-2.5 text-right">FY 2024-25</th>
                <th className="p-2.5 text-right">FY 2025-26 EST</th>
                <th className="p-2.5 text-right">AUDIT STATS</th>
              </tr>
            </thead>
            <tbody>
              {currentFiscalYearData.map((row, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="p-2.5 text-white/80 font-bold">{row.metric}</td>
                  <td className="p-2.5 text-right text-white/60">{row.fy24}</td>
                  <td className="p-2.5 text-right text-white/80 font-semibold">{row.fy25}</td>
                  <td className="p-2.5 text-right text-cyan-400 font-bold">{row.fy26}</td>
                  <td className="p-2.5 text-right">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950/25 border border-cyan-500/10 text-cyan-400 font-bold text-[8px] uppercase">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'BALANCE' && (
        <div className="border border-white/5 rounded overflow-hidden">
          <table className="w-full text-left border-collapse font-mono text-[10px]">
            <thead>
              <tr className="bg-black/55 border-b border-b-white/10 text-white/40 uppercase text-[8px] tracking-widest font-black">
                <th className="p-2.5">CONSOLIDATED ASSETS & LIABILITIES</th>
                <th className="p-2.5 text-right">FY 2023-24</th>
                <th className="p-2.5 text-right">FY 2024-25</th>
                <th className="p-2.5 text-right">YOY DELTA %</th>
              </tr>
            </thead>
            <tbody>
              {balanceSheetMock.map((row, index) => {
                const isGrowth = row.change.startsWith('+');
                return (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.01]">
                    <td className="p-2.5 text-white/80 font-semibold">{row.asset}</td>
                    <td className="p-2.5 text-right text-white/60">{row.reserves24}</td>
                    <td className="p-2.5 text-right text-white font-bold">{row.reserves25}</td>
                    <td className={`p-2.5 text-right font-black ${isGrowth ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {row.change}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default ValuationMetrics;
