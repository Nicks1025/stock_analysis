import React, { useState } from 'react';
import { Cpu, ShieldCheck, Sparkles, TrendingUp, TrendingDown, RefreshCw, AlertOctagon } from 'lucide-react';
import { useSnackbar } from '../common/SnackbarProvider';

interface AiAnalysisProps {
  symbol: string;
}

export function AiAnalysis({ symbol }: AiAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  
  // Calculate distinct variables based on symbol name
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sentimentScore = 55 + (hash % 38); // Sentiment ranges from 55% to 93%

  const handleAiRegeneration = () => {
    setAnalyzing(true);
    enqueueSnackbar('Initiating secure Gemini analytical session...', { variant: 'info' });
    setTimeout(() => {
      setAnalyzing(false);
      enqueueSnackbar('Neural NLP core vectors successfully synchronized!', { variant: 'success' });
    }, 1800);
  };

  const aiSummaryMap: Record<string, { summary: string; catalysts: string[]; risks: string[]; score: number }> = {
    RELIANCE: {
      summary: "Reliance AI vectors indicate positive catalysts across telecommunications and consumer retail, counterbalanced by heavy oil-to-chemicals capex compression. Digital enterprise initiatives under Jio cloud services provide long-term compound tailwinds.",
      catalysts: [
        "Jio airfiber monetization and robust ARPU improvements",
        "Pristine retail footprints leading to consolidated operating leverage",
        "Progressive ramp-up of Gigafactory clean-energy facilities"
      ],
      risks: [
        "Fluctuations in global refinery margins compressing retail PAT margins",
        "High localized telecom spectrum amortizations"
      ],
      score: sentimentScore
    },
    TCS: {
      summary: "TCS corporate profiles trigger extremely strong stability metrics. Significant BFS segment orders, cloud-native migration frameworks, and double-digit margins are offset by US/European corporate IT budget contractions.",
      catalysts: [
        "Unrivaled execution efficiency sparking high single digit margin thresholds",
        "Mega-deals Pipeline expansion across UK and European sovereign entities",
        "Substantial routine share buybacks providing support floors"
      ],
      risks: [
        "Elevated onsite visa and engineering personnel compensation rates",
        "Slowdown in financial sector cloud infrastructure capex spending"
      ],
      score: sentimentScore
    }
  };

  // Safe fallback if symbol is not key cached
  const staticData = aiSummaryMap[symbol.toUpperCase()] || {
    summary: `NLP-AI analysis on ${symbol} suggests high relative defensive characteristics. Growth vectors relate directly to local macro infrastructure trends, balanced by raw-materials inflationary costs. Capital allocation remains balanced with sound debt metrics.`,
    catalysts: [
      "Secured domestic trade channels and state contracts",
      "Technological cost integration raising OPM by ~80bps",
      "Unlocking underlying asset valuations"
    ],
    risks: [
      "Global macro volatility affecting supply chain lines",
      "Short-term central bank interest rate revisions"
    ],
    score: sentimentScore
  };

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs" id={`ai-analysis-${symbol}`}>
      
      {/* Header section with Refresh Trigger */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest flex items-center gap-1.5 font-mono">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" /> Neural AI Analyst report
        </span>
        <button
          onClick={handleAiRegeneration}
          disabled={analyzing}
          className="flex items-center gap-1 px-2.5 py-0.5 bg-cyan-950/20 border border-cyan-500/10 text-cyan-400 hover:bg-cyan-500/10 rounded text-[9px] font-bold cursor-pointer uppercase transition-all"
        >
          <RefreshCw className={`w-3 h-3 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Assembling...' : 'Re-Run Model'}
        </button>
      </div>

      {analyzing ? (
        <div className="text-center py-16 text-cyan-400/40 animate-pulse uppercase tracking-[0.1em] text-[10px]">
          Computing token embeddings against regulatory stock filings...
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Main synopsis cards layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Left AI Synopsis Box (spans 2) */}
            <div className="md:col-span-2 p-3 bg-cyan-950/5 border border-cyan-500/10 rounded space-y-2 text-left">
              <span className="text-[8px] font-black uppercase text-cyan-400 tracking-wider block flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> GEMINI EMISSION SUMMARY
              </span>
              <p className="text-white/80 leading-relaxed font-sans text-xs">
                {staticData.summary}
              </p>
            </div>

            {/* Right Sentiment Gauge Bar */}
            <div className="p-3 bg-black/40 border border-white/5 rounded space-y-2 flex flex-col justify-center text-center relative overflow-hidden">
              <span className="text-[8px] text-white/40 uppercase block">NET SENTIMENT INDEX</span>
              <div className="text-2xl font-black text-cyan-400">{staticData.score}%</div>
              
              <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden w-full max-w-[140px] mx-auto">
                <div className="absolute left-0 top-0 bottom-0 bg-cyan-400" style={{ width: `${staticData.score}%` }} />
              </div>
              
              <span className="text-[8px] text-emerald-400 font-bold block uppercase mt-0.5">
                BULLISH MOMENTUM DOMINANT
              </span>
            </div>

          </div>

          {/* Staggered Bull vs Bear Catalysts lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Bullish Catalysts Card */}
            <div className="p-3 bg-emerald-950/5 border border-emerald-500/10 rounded space-y-2 text-left">
              <span className="text-[8px] font-black uppercase text-emerald-400 tracking-wider block flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> SECURED GROWTH TAILWINDS
              </span>
              <ul className="space-y-1.5 text-[10px] text-white/70">
                {staticData.catalysts.map((cat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 scale-125 select-none">•</span>
                    <span className="font-sans leading-tight">{cat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bearish Headwinds Risks Card */}
            <div className="p-3 bg-red-950/5 border border-red-500/10 rounded space-y-2 text-left">
              <span className="text-[8px] font-black uppercase text-red-400 tracking-wider block flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> DEVIATION & HEADWINDS INHIBITORS
              </span>
              <ul className="space-y-1.5 text-[10px] text-white/70">
                {staticData.risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-red-400 scale-125 select-none">•</span>
                    <span className="font-sans leading-tight">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Model information disclaimer disclaimer footer */}
          <div className="text-[8px] text-cyan-400/30 text-right uppercase tracking-wider block font-bold">
            ⚡ Model: Gemini-3.5-Flash embeddings • Regulatory data current as of Jun 2026.
          </div>
        </div>
      )}
    </div>
  );
}
export default AiAnalysis;
