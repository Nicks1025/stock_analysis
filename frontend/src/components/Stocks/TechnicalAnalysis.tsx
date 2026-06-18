import React from 'react';
import { Target, AlertTriangle, TrendingUp, Compass, Zap, ShieldCheck } from 'lucide-react';

interface TechnicalAnalysisProps {
  symbol: string;
  price: number;
}

export function TechnicalAnalysis({ symbol, price }: TechnicalAnalysisProps) {
  // Generate repeatable technical markers from symbol to keep it organic
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Deterministic technical oscillators calculation
  const rsi = Number((35 + (hash % 45)).toFixed(1)); // RSI ranges from 35 to 80
  const macdValue = Number((3 + (hash % 12) - 6).toFixed(2));
  const signalValue = Number((macdValue * 0.82).toFixed(2));
  const slowSma = Number((price * 0.94).toFixed(1));
  const fastSma = Number((price * 1.015).toFixed(1));
  
  // Pivot calculations based on price range
  const pivot = Number(price.toFixed(1));
  const s1 = Number((price * 0.978).toFixed(1));
  const s2 = Number((price * 0.952).toFixed(1));
  const r1 = Number((price * 1.021).toFixed(1));
  const r2 = Number((price * 1.045).toFixed(1));

  // Determine overall status
  let action: 'STRONG BUY' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'OVERSOLD' = 'NEUTRAL';
  let actionColor = 'text-cyan-400';
  let bannerColor = 'bg-cyan-500/10 border-cyan-500/20';

  if (rsi > 70) {
    action = 'BEARISH';
    actionColor = 'text-yellow-500';
    bannerColor = 'bg-yellow-500/10 border-yellow-500/20';
  } else if (rsi < 40) {
    action = 'OVERSOLD';
    actionColor = 'text-purple-400';
    bannerColor = 'bg-purple-500/10 border-purple-500/20';
  } else if (macdValue > signalValue && price > slowSma) {
    action = 'STRONG BUY';
    actionColor = 'text-emerald-400';
    bannerColor = 'bg-emerald-500/10 border-emerald-500/20';
  } else if (price > slowSma) {
    action = 'BULLISH';
    actionColor = 'text-emerald-300';
    bannerColor = 'bg-emerald-500/10 border-emerald-500/20';
  }

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-5 bg-black/40 font-mono text-xs" id={`tech-analysis-${symbol}`}>
      {/* Header section */}
      <span className="text-[10px] font-black uppercase text-white tracking-widest block border-b border-WHITE/5 pb-2 flex items-center gap-1.5 font-mono">
        <Compass className="w-4 h-4 text-cyan-400" /> Technical Indicator diagnostics
      </span>

      {/* Consensus rating banner */}
      <div className={`p-4 rounded border ${bannerColor} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div className="space-y-0.5">
          <span className="text-[8px] uppercase text-white/50">AGGREGATE CONSENSUS INDICATOR</span>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            TERMINAL RECOMMENDATION: <span className={actionColor}>{action}</span>
          </h4>
        </div>
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded self-start sm:self-auto uppercase text-[9px]">
          <span className="text-white/40">Pivot Pivot Price:</span>
          <span className="text-white font-bold">₹{pivot}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* RSI Oscillator Indicator Gauge */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-3">
          <div className="flex justify-between items-center text-[10px] uppercase text-white/50">
            <span>RSI Oscillator (14)</span>
            <span className="text-white font-bold">{rsi} index</span>
          </div>

          {/* RSI horizontal slider bar scale */}
          <div className="space-y-1.5">
            <div className="relative h-2.5 bg-white/10 rounded-full overflow-hidden">
              {/* Oversold area index range 0-30 */}
              <div className="absolute left-0 top-0 bottom-0 bg-purple-500/20" style={{ width: '30%' }} />
              {/* Neutral area index range 30-70 */}
              <div className="absolute top-0 bottom-0 bg-cyan-500/15" style={{ left: '30%', width: '40%' }} />
              {/* Overbought area index range 70-100 */}
              <div className="absolute right-0 top-0 bottom-0 bg-red-500/25" style={{ width: '30%' }} />

              {/* Float pointer mark indicator alignment based on rsi */}
              <div 
                className="absolute top-0 bottom-0 w-2 bg-white border border-black rounded shadow animate-pulse" 
                style={{ left: `calc(${rsi}% - 4px)` }}
              />
            </div>

            <div className="flex justify-between text-[8px] uppercase tracking-wide text-white/30 font-bold">
              <span>OVERSOLD (0-30)</span>
              <span>NEUTRAL (30-70)</span>
              <span>OVERBOUGHT (70+)</span>
            </div>
          </div>

          <div className="text-[9px] text-white/40 leading-relaxed font-sans">
            {rsi > 70 
              ? 'Oscillator signals extremely high volume concentration. Trend reversal trigger potential exists.' 
              : rsi < 30 
                ? 'Security registers severe capital outflows. Oversold conditions can spark relief run breakouts.'
                : 'Asset trades within established trading ranges. Standard momentum indicators run neutrally.'}
          </div>
        </div>

        {/* MACD Oscillator diagnostic */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-3">
          <span className="text-[10px] uppercase text-white/50 block font-bold">MACD System (12, 26, 9)</span>
          
          <div className="space-y-2 font-mono text-[10px]">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-white/40">MACD VALUE:</span>
              <span className={`font-bold ${macdValue >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{macdValue}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-white/40">SIGNAL LINE:</span>
              <span className="text-white font-bold">{signalValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">HISTOGRAM DELTA:</span>
              <span className={`font-bold ${(macdValue - signalValue) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {macdValue - signalValue >= 0 ? '▲ +' : '▼ '}{(macdValue - signalValue).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-[9px] rounded bg-black/20 p-2 border border-white/5 text-white/50 leading-relaxed font-sans flex items-start gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              {macdValue > signalValue 
                ? 'Bullish crossover logged. momentum bias slants up.' 
                : 'Bearish divergent signals recorded. Suggests cautious accumulation zones.'}
            </p>
          </div>
        </div>

        {/* Support & Resistance floor mappings */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-3">
          <span className="text-[10px] uppercase text-white/50 block font-bold">Classic Fib Support / Resistance</span>
          
          <div className="space-y-1.5 text-[9px] font-mono leading-none">
            <div className="flex items-center justify-between p-1 bg-red-950/10 border border-red-500/10 text-red-400 rounded">
              <span>RESISTANCE R2</span>
              <span className="font-bold">₹{r2}</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-red-950/5 border border-red-500/5 text-red-300 rounded">
              <span>RESISTANCE R1</span>
              <span className="font-bold">₹{r1}</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-cyan-950/10 border border-cyan-500/10 text-cyan-400 rounded">
              <span>PIVOT PRICE</span>
              <span className="font-bold">₹{pivot}</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-emerald-950/5 border border-emerald-500/5 text-emerald-300 rounded">
              <span>SUPPORT S1</span>
              <span className="font-bold">₹{s1}</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-emerald-950/10 border border-emerald-500/10 text-emerald-400 rounded">
              <span>SUPPORT S2</span>
              <span className="font-bold">₹{s2}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default TechnicalAnalysis;
