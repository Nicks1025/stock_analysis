import React from 'react';
import { Target, ShieldCheck, AlertTriangle, Activity, Scale, Compass, CompassIcon } from 'lucide-react';
import { Holding } from '../../store/portfolioStore';

interface RiskAnalysisProps {
  holdings: Holding[];
}

export function RiskAnalysis({ holdings }: RiskAnalysisProps) {
  // Compute portfolio characteristics
  const totalValue = holdings.reduce((acc, h) => acc + (h.currentPrice * h.quantity), 0);
  
  // Calculate deterministic Beta, Volatility and Sharpe ratio based on holding sectors & symbol hash
  let weightedBeta = 0;
  let hhiConcentration = 0; // Herfindahl–Hirschman Index for concentration
  
  holdings.forEach((h) => {
    const weight = totalValue > 0 ? (h.currentPrice * h.quantity) / totalValue : 0;
    
    // Deterministic stock beta based on symbol string
    const seed = h.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const stockBeta = 0.7 + ((seed % 15) / 15) * 0.9; // 0.7 to 1.6 Beta
    weightedBeta += weight * stockBeta;
    
    hhiConcentration += Math.pow(weight * 100, 2);
  });

  // Safe defaults if empty
  if (weightedBeta === 0) weightedBeta = 1.0;
  if (hhiConcentration === 0) hhiConcentration = 1500;

  // Determine risk category
  let riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' = 'MEDIUM RISK';
  let riskColor = 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5';
  
  if (weightedBeta < 0.9) {
    riskLevel = 'LOW RISK';
    riskColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  } else if (weightedBeta > 1.25 || hhiConcentration > 3000) {
    riskLevel = 'HIGH RISK';
    riskColor = 'text-red-400 border-red-500/20 bg-red-500/5';
  }

  // Sharpe ratio approximation
  const sharpeRatio = Number((1.2 + ((weightedBeta - 0.7) * 0.3) + ((3000 - hhiConcentration)/4000)).toFixed(2));

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs text-left" id="risk-analysis-panel">
      {/* Title */}
      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block">PORTFOLIO SHOCK ABSORPTION</span>
      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 google-font pb-2 border-b border-b-white/5">
        <Scale className="w-5 h-5 text-cyan-400" /> Technical Systematic Risk Profile
      </h3>

      {/* Consensus Rating Banner */}
      <div className={`p-4 rounded border ${riskColor} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="space-y-0.5">
          <span className="text-[8px] uppercase text-white/50">AGGREGATE CONCENTRATION COEFFICIENT</span>
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            Risk Profile Rating: <span className="underline">{riskLevel}</span>
          </h4>
        </div>
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded uppercase text-[9px] font-bold text-white shrink-0">
          Portfolio Beta: {weightedBeta.toFixed(2)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1: Weighted Beta (Volatility multiplier relative to Nifty index) */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative overflow-hidden group">
          <span className="text-[8px] text-white/40 uppercase block">Beta volatility</span>
          <span className="text-lg font-black text-white block">{weightedBeta.toFixed(2)}</span>
          <div className="space-y-1 px-0.5">
            <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden w-full mt-2">
              <div className="absolute left-0 top-0 bottom-0 bg-cyan-400" style={{ width: `${Math.min((weightedBeta / 2) * 100, 100)}%` }} />
            </div>
            <div className="flex justify-between text-[7px] text-white/20 font-bold uppercase pt-1">
              <span>Defensive (&lt;1)</span>
              <span>INDEX BASE (1)</span>
              <span>VOLATILE (&gt;1.2)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Sharpe Ratio */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative overflow-hidden group">
          <span className="text-[8px] text-white/40 uppercase block">SHARPE COEFFICIENT</span>
          <span className="text-lg font-black text-emerald-400 block font-mono">+{sharpeRatio}</span>
          <span className="text-[7.5px] text-white/33 block mt-2 font-sans uppercase">
            Risk-adjusted premium efficiency rating
          </span>
        </div>

        {/* Metric 3: HHI Index (Capital Concentration score) */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-1 text-left relative overflow-hidden group">
          <span className="text-[8px] text-white/40 uppercase block">CONCENTRATION RATIO (HHI)</span>
          <span className="text-lg font-black text-white block">{Math.floor(hhiConcentration)}</span>
          <div className="space-y-1 px-0.5">
            <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden w-full mt-2">
              <div 
                className={`absolute left-0 top-0 bottom-0 ${hhiConcentration > 3000 ? 'bg-red-500' : hhiConcentration > 1800 ? 'bg-yellow-400' : 'bg-emerald-400'}`} 
                style={{ width: `${Math.min((hhiConcentration / 10000) * 100, 100)}%` }} 
              />
            </div>
            <div className="flex justify-between text-[7px] text-white/20 font-bold uppercase pt-1">
              <span>Optimized (&lt;1500)</span>
              <span>CONCENTRATED (&gt;2500)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Systematic warnings & guidance matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Diversification checklist */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded space-y-2.5">
          <span className="text-[8.5px] font-black uppercase text-white/50 tracking-wider block">Risk Management Status Grid</span>
          <div className="space-y-2 text-[10px] leading-tight font-mono">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-1">
              <span className="text-white/40">SINGLE WEIGHT LIMITS (&lt;25%):</span>
              {holdings.some(h => (h.currentPrice * h.quantity)/totalValue > 0.25) ? (
                <span className="text-yellow-400 font-bold flex items-center gap-1 uppercase">▲ CONCENTRATED DETECTED</span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1 uppercase">✓ COMPLIANT PASS</span>
              )}
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-1">
              <span className="text-white/40">PORTFOLIO VOLATILITY DELTA:</span>
              <span className="text-white font-extrabold">{weightedBeta > 1.15 ? 'ELEVATED VS MARKET' : 'BALANCED VOLATILITY'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/40">DIVERSIFICATION SCORE:</span>
              <span className="text-cyan-400 font-bold">
                {holdings.length >= 7 ? 'EXQUISITE (7+ ENTI)' : holdings.length >= 4 ? 'HEALTHY (4+ ENTI)' : 'FRAGILE COUNTERS'}
              </span>
            </div>

          </div>
        </div>

        {/* Actionable Risk analysis */}
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded text-[9.5px] text-white/40 leading-relaxed font-sans relative">
          <span className="text-[8px] font-black uppercase text-[#ffaa00] mb-1.5 block font-mono">NEURAL RISK SUMMARY</span>
          {weightedBeta > 1.15 || hhiConcentration > 2500 ? (
            <p className="text-white/80">
              The portfolio shows a high systematic risk profile with a composite Beta of <span className="font-bold text-yellow-400 font-mono">{weightedBeta.toFixed(2)}</span>. This implies that during broad index drawdowns, your capital value could decline faster. We recommend reducing exposure in highly volatile securities and routing it into defensive sectors such as FMCG or sovereign utility funds.
            </p>
          ) : (
            <p className="text-white/80 font-sans">
              Systematic diagnostics confirm defensive/balanced postures. The risk-adjusted premium ratio (Sharpe: {sharpeRatio}) indicates efficient capital utilization. Your holdings align perfectly with strategic long-term compound growth maps. Maintain routine accumulation.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default RiskAnalysis;
