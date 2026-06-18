/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SCard } from '../common/SCard';
import { SBadge } from '../common/SBadge';
import { Terminal, Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  source: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score?: number;
  createdAt: string;
  url?: string;
}

interface NewsFeedProps {
  news?: NewsItem[];
  loading?: boolean;
}

export function NewsFeed({ news = [], loading = false }: NewsFeedProps) {
  // Awesome polished fallbacks for dynamic retail news stream
  const fallbackNews: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Reliance Announces Green Energy Expansion Plant in Gujarat',
      summary: 'Reliance Industries unveils massive ₹75,000 Cr renewable investments to scale photovoltaic solar cell and green hydrogen deployments over 3 years.',
      source: 'TechPulse India',
      sentiment: 'BULLISH',
      score: 0.85,
      createdAt: '15 mins ago',
    },
    {
      id: 'news-2',
      title: 'TCS Q1 Net Profit Climbs 8.7% YoY, Exceeds Expectations',
      summary: 'Tata Consultancy Services reports consolidated net earnings exceeding ₹12,042 Cr, powered by robust cloud transformation contracts and European operations.',
      source: 'Financial Express',
      sentiment: 'BULLISH',
      score: 0.72,
      createdAt: '1 hr ago',
    },
    {
      id: 'news-3',
      title: 'Crude Oil Contract Spikes Imposes Pressure on Inflation Estimates',
      summary: 'Brent Crude indicators hover near $84.20 per barrel following Middle East shipping route updates, posing temporary fiscal challenges.',
      source: 'NDTV Profit',
      sentiment: 'BEARISH',
      score: 0.61,
      createdAt: '3 hrs ago',
    },
    {
      id: 'news-4',
      title: 'RBI Keeps Key Repo Rate Unchanged at 6.50% in Policy Review',
      summary: 'The Monetary Policy Committee votes to preserve present benchmark borrowing yields to firmly align CPI trends within 4.00% ranges.',
      source: 'Economic Times',
      sentiment: 'NEUTRAL',
      score: 0.05,
      createdAt: '5 hrs ago',
    },
  ];

  const displayNews = news.length ? news : fallbackNews;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH':
        return 'emerald';
      case 'BEARISH':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <SCard 
      title="Signal & News Intelligence" 
      subtitle="Synthesized corporate filings and geopolitical news sentiment"
    >
      <div className="space-y-4 font-mono">
        {displayNews.map((item, idx) => (
          <div 
            key={item.id || idx}
            className="p-3 bg-black/30 border border-white/5 hover:border-white/10 rounded transition-all flex flex-col md:flex-row justify-between gap-4 text-left"
          >
            {/* Left Content Column */}
            <div className="space-y-1.5 flex-1 select-text">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] text-cyan-400 font-bold bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-400/10 uppercase">
                  {item.source}
                </span>
                <span className="text-[9px] text-white/35">
                  {item.createdAt}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white leading-snug hover:text-cyan-300 transition-colors">
                {item.title}
              </h4>
              {item.summary && (
                <p className="text-[10px] text-white/50 leading-relaxed max-w-2xl">
                  {item.summary}
                </p>
              )}
            </div>

            {/* Right Sentiment Badge Column */}
            <div className="md:text-right flex items-center md:flex-col justify-between md:justify-center gap-2 md:pl-2 md:border-l md:border-white/5 shrink-0">
              <span className="text-[8px] text-white/30 uppercase tracking-widest hidden md:inline">SENTIMENT</span>
              <SBadge 
                color={getSentimentColor(item.sentiment)} 
                content={item.sentiment} 
              />
              {item.score !== undefined && item.score !== 0 && (
                <span className="text-[10px] font-bold text-white/60">
                  REF: {item.score.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </SCard>
  );
}
