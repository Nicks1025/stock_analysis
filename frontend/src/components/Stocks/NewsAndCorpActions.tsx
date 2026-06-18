import React from 'react';
import { Newspaper, CalendarDays, ExternalLink, FileSpreadsheet, Scale, Info, Layers } from 'lucide-react';

interface NewsAndCorpActionsProps {
  symbol: string;
}

export function NewsAndCorpActions({ symbol }: NewsAndCorpActionsProps) {
  // Generate distinctive announcements & actions based on symbol
  const corporateAnnouncementMap: Record<string, {
    actions: Array<{ type: string; date: string; desc: string; amount?: string }>;
    news: Array<{ title: string; source: string; date: string; sentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH'; score: number }>;
  }> = {
    RELIANCE: {
      actions: [
        { type: 'Dividend Final', date: 'Jul 15, 2026', desc: 'Board recommended final payout of ₹10 per share.', amount: '₹10.00' },
        { type: 'Board Meeting', date: 'Aug 22, 2026', desc: 'Performance review of Reliance Retail and clean-energy divisions.' },
        { type: 'Stock Split', date: 'Mar 12, 2025', desc: 'Split ratio of 1:1 completed to boost liquidity thresholds.' }
      ],
      news: [
        { title: "Reliance Retail Q1 standalone revenues rocket by 18.2% YoY, led by fashion segment", source: "Mint", date: "2 hours ago", sentiment: 'BULLISH', score: 0.84 },
        { title: "Jio Airfiber installations reach 12 Lac endpoints across 320 cities, accelerating ARPU metrics", source: "ET Now", date: "Yesterday", sentiment: 'BULLISH', score: 0.91 },
        { title: "O2C refining margins experience micro compression amid Brent crude shifts", source: "Bloomberg Quint", date: "3 days ago", sentiment: 'BEARISH', score: -0.32 }
      ]
    },
    TCS: {
      actions: [
        { type: 'Dividend Interim', date: 'Jul 28, 2026', desc: 'Interim dividend declaration of ₹28 per share.', amount: '₹28.00' },
        { type: 'Corporate Buyback', date: 'Dec 18, 2025', desc: 'Completed ₹17,000 Cr capital buyback block at ₹4,150 ex-price.' },
        { type: 'Board Meeting', date: 'Sep 10, 2026', desc: 'Executive committee capex approval on global LLM systems integrations.' }
      ],
      news: [
        { title: "TCS secure £80M cloud-migration ledger deal from UK department of Work and Pensions", source: "Reuters", date: "4 hours ago", sentiment: 'BULLISH', score: 0.88 },
        { title: "US enterprise IT spend experiences macro budget contraction, software analysts warn", source: "TechCrunch", date: "2 days ago", sentiment: 'NEUTRAL', score: 0.05 },
        { title: "TCS partners with Nvidia to launch micro generative industrial robotics hubs", source: "Business Standard", date: "4 days ago", sentiment: 'BULLISH', score: 0.94 }
      ]
    }
  };

  const defaultDetails = corporateAnnouncementMap[symbol.toUpperCase()] || {
    actions: [
      { type: 'Dividends Declaration', date: 'Jul 30, 2026', desc: 'Calculated ex-dividend payout of ₹4.50 per share pending approval.', amount: '₹4.50' },
      { type: 'Annual General Meet', date: 'Aug 15, 2026', desc: 'Consolidated accounts audit review and next fiscal guidance presentation.' }
    ],
    news: [
      { title: `Entity ${symbol} partners with regional institutions to streamline localized hardware components`, source: "Financial Express", date: "1 day ago", sentiment: 'BULLISH', score: 0.65 },
      { title: `Brokerage firms update ${symbol} price projection targets, suggesting defensive accumulation`, source: "Business Standard", date: "3 days ago", sentiment: 'NEUTRAL', score: 0.12 }
    ]
  };

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-5 bg-black/40 font-mono text-xs" id={`news-and-corp-actions-${symbol}`}>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Corporate Actions ledger */}
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase text-white tracking-widest block border-b border-white/5 pb-2 flex items-center gap-1.5 font-mono">
            <CalendarDays className="w-4 h-4 text-cyan-400" /> Corporate Actions & Calendar events
          </span>

          <div className="space-y-3.5">
            {defaultDetails.actions.map((act, index) => (
              <div key={index} className="p-3 bg-white/[0.01] border border-white/5 rounded text-left relative flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-cyan-950/20 border border-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  {act.amount ? '₹' : 'MEET'}
                </div>
                
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-white text-[11px] block truncate">{act.type}</span>
                    <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.2 rounded shrink-0">
                      EX-DATE: {act.date}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/50 leading-relaxed font-sans mt-0.5">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: News and Sentiments */}
        <div className="space-y-4 font-mono text-xs">
          <span className="text-[10px] font-black uppercase text-white tracking-widest block border-b border-white/5 pb-2 flex items-center gap-1.5 font-mono">
            <Newspaper className="w-4 h-4 text-cyan-400" /> Sentiment analysis news alerts
          </span>

          <div className="space-y-3">
            {defaultDetails.news.map((item, index) => {
              const scoreColor = item.sentiment === 'BULLISH' ? 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5' : item.sentiment === 'BEARISH' ? 'text-red-400 border-red-500/10 bg-red-500/5' : 'text-white/40 border-white/10 bg-white/5';
              return (
                <div key={index} className="p-2.5 bg-black/35 border border-white/5 rounded hover:border-white/10 transition-colors text-left flex justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <h5 className="font-semibold text-white/90 font-sans tracking-wide leading-snug hover:text-cyan-300 cursor-pointer block text-[11px]">
                      {item.title}
                    </h5>
                    <div className="flex items-center gap-2.5 text-[8.5px] uppercase text-white/35 font-mono">
                      <span>Source: <strong className="text-white/50">{item.source}</strong></span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Sentiment micro-badge */}
                  <div className={`p-1.5 rounded border ${scoreColor} text-[8.5px] tracking-wider font-extrabold text-center shrink-0 self-start flex flex-col items-center justify-center min-w-[70px]`}>
                    <span>{item.sentiment}</span>
                    <span className="text-[7.5px] opacity-75 font-mono">{(item.score >= 0 ? '+' : '') + item.score.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
export default NewsAndCorpActions;
