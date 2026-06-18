import React from 'react';
import { PieChart, Layers, HelpCircle, ShieldCheck, Cpu } from 'lucide-react';
import { Holding } from '../../store/portfolioStore';

interface SectorAllocationProps {
  holdings: Holding[];
}

export function SectorAllocation({ holdings }: SectorAllocationProps) {
  // Aggregate allocations by sector
  const sectorWeightMap: Record<string, { cost: number; value: number; tickers: string[] }> = {};
  
  let grandTotalValue = 0;

  holdings.forEach((h) => {
    const value = h.currentPrice * h.quantity;
    grandTotalValue += value;

    if (!sectorWeightMap[h.sector]) {
      sectorWeightMap[h.sector] = { cost: 0, value: 0, tickers: [] };
    }
    sectorWeightMap[h.sector].cost += h.avgPrice * h.quantity;
    sectorWeightMap[h.sector].value += value;
    if (!sectorWeightMap[h.sector].tickers.includes(h.symbol)) {
      sectorWeightMap[h.sector].tickers.push(h.symbol);
    }
  });

  const sectorAllocationList = Object.keys(sectorWeightMap).map((sector) => {
    const val = sectorWeightMap[sector].value;
    const pct = grandTotalValue > 0 ? (val / grandTotalValue) * 100 : 0;
    return {
      sector,
      value: val,
      percent: pct,
      tickers: sectorWeightMap[sector].tickers,
      cost: sectorWeightMap[sector].cost
    };
  }).sort((a, b) => b.value - a.value);

  // Assign deterministic, high-fidelity neon colors representing sectors
  const getSectorColor = (sector: string): string => {
    if (sector.includes('Technology')) return 'bg-cyan-500';
    if (sector.includes('Energy')) return 'bg-[#00f2ff]';
    if (sector.includes('Financial')) return 'bg-emerald-400';
    if (sector.includes('Industrials')) return 'bg-yellow-400';
    if (sector.includes('Automotive')) return 'bg-purple-400';
    if (sector.includes('FMCG')) return 'bg-pink-400';
    return 'bg-neutral-500';
  };

  const getSectorTextHexColor = (sector: string): string => {
    if (sector.includes('Technology')) return 'text-cyan-400';
    if (sector.includes('Energy')) return 'text-[#00f2ff]';
    if (sector.includes('Financial')) return 'text-emerald-400';
    if (sector.includes('Industrials')) return 'text-yellow-400';
    if (sector.includes('Automotive')) return 'text-purple-400';
    if (sector.includes('FMCG')) return 'text-pink-400';
    return 'text-neutral-400';
  };

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs" id="sector-allocation-panel">
      {/* Title */}
      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block font-mono">DENSITY CLASSIFICATIONS</span>
      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 google-font pb-2 border-b border-white/5">
        <PieChart className="w-5 h-5 text-cyan-400" /> Sector Capital Concentration
      </h3>

      {holdings.length === 0 ? (
        <div className="p-8 text-center text-white/20 uppercase font-black tracking-widest">
          No holdings available to compute allocation stats. Use the dispatch terminal!
        </div>
      ) : (
        <div className="space-y-5 text-left">
          
          {/* Dynamic Stacked horizontal bar overall map */}
          <div className="space-y-1.5">
            <span className="text-[8px] uppercase text-white/33 font-bold">Consolidated Allocation Stack Frame</span>
            <div className="relative h-6 bg-white/5 rounded overflow-hidden flex font-mono text-[9px] font-bold border border-white/5 pointer-events-none select-none">
              {sectorAllocationList.map((item, idx) => {
                const color = getSectorColor(item.sector);
                return (
                  <div
                    key={idx}
                    className={`h-full ${color} border-r border-black/15 transition-all`}
                    style={{ width: `${item.percent}%` }}
                    title={`${item.sector}: ${item.percent.toFixed(1)}%`}
                  />
                );
              })}
            </div>
          </div>

          {/* Sector metrics list display */}
          <div className="space-y-3 pt-1">
            {sectorAllocationList.map((item, idx) => {
              const bgClass = getSectorColor(item.sector);
              const textClass = getSectorTextHexColor(item.sector);
              return (
                <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-2">
                  <div className="flex justify-between items-center text-[10.5px]">
                    
                    {/* Left Tag and Tickers */}
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${bgClass}`} />
                      <span className="text-white font-black">{item.sector.toUpperCase()}</span>
                      <span className="text-[8.5px] px-1 py-0.2 bg-white/5 rounded text-white/40 font-bold font-mono">
                        {item.tickers.join(', ')}
                      </span>
                    </div>

                    {/* Right allocation value */}
                    <div className="text-right flex items-baseline gap-2 font-mono">
                      <span className="text-white font-bold">₹{item.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      <span className={`text-[10px] font-black ${textClass}`}>{item.percent.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Horizontal gauge width percentage filler */}
                  <div className="h-1.5 bg-white/5 rounded overflow-hidden relative">
                    <div className={`absolute left-0 top-0 bottom-0 ${bgClass}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk density insight card */}
          {sectorAllocationList.some(s => s.percent > 40) ? (
            <div className="p-3 rounded bg-yellow-950/20 border border-yellow-500/10 text-[9.5px] text-yellow-300/80 leading-relaxed font-sans flex items-start gap-2">
              <Layers className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p>
                CONCENTRATION WARNING: Your portfolio maintains an allocation exceeding <span className="font-bold text-white font-mono">40%</span> in a single sector ({sectorAllocationList[0]?.sector}). Diversifying across other industries is recommended to reduce systematic downcycle shock.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded bg-emerald-950/15 border border-emerald-500/10 text-[9.5px] text-emerald-300/80 leading-relaxed font-sans flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                PRISTINE ALLOCATION DETECTED: Capital is uniformly distributed across sectors with no single concentration exceeding the 40% systematic threshold. That indicates solid defensive diversification filters.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default SectorAllocation;
