import React, { useEffect, useState } from 'react';
import newsService from '../../services/newsService';
import { Mail, Search, Award, Shield, AlertCircle, Bookmark, Compass } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number;
  publishedAt: string;
  symbolRelated?: string;
}

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterSentiment, setFilterSentiment] = useState<'ALL' | 'BULLISH' | 'BEARISH' | 'NEUTRAL'>('ALL');
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await newsService.getNews({}, { page: 1, limit: 10 });
      const raw = res?.data?.items || res?.data || res;
      if (Array.isArray(raw)) {
        setNews(raw);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error(err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter(n => {
    const query = search.toLowerCase();
    const sentimentMatch = filterSentiment === 'ALL' || n.sentiment === filterSentiment;
    const searchMatch = n.title.toLowerCase().includes(query) || n.summary.toLowerCase().includes(query) || (n.symbolRelated?.toLowerCase() || '').includes(query);
    return sentimentMatch && searchMatch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">NLP NLP Natural Language Intelligence</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
          Sentiment News Feed
        </h2>
        <p className="text-xs text-white/50 font-mono">Direct news intelligence, corporate filings, micro announcements, and machine learning sentiment tags</p>
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/40 p-4 rounded border border-white/5">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/33" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news or ticker symbol..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
          />
        </div>
        
        {/* Toggle sentiment caps */}
        <div className="flex gap-2 w-full md:w-auto">
          {(['ALL', 'BULLISH', 'BEARISH', 'NEUTRAL'] as const).map(sent => (
            <button
              key={sent}
              onClick={() => setFilterSentiment(sent)}
              className={`px-3 py-1.5 text-[10px] font-mono rounded cursor-pointer uppercase tracking-wider transition-all ${
                filterSentiment === sent
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {sent}
            </button>
          ))}
        </div>
      </div>

      {/* Corporate filings articles feed */}
      {loading ? (
        <div className="text-center py-16 text-white/30 animate-pulse font-mono text-xs">Parsing real-time news telemetry feeds...</div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <div key={article.id} className="glass-panel p-5 rounded border border-white/5 flex flex-col justify-between space-y-4 hover:border-cyan-500/20 transition-all bg-black/40 font-mono">
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-white/40 uppercase font-black">{article.source} // {article.publishedAt}</span>
                  {article.symbolRelated && (
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 px-1.5 py-0.2 rounded font-black uppercase">
                      {article.symbolRelated}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-sm tracking-wide leading-snug">{article.title}</h3>
                  <p className="text-[11px] leading-relaxed text-white/60 font-mono">{article.summary}</p>
                </div>
              </div>

              {/* Lower sentiment details */}
              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-white/40 uppercase">NLP Rating:</span>
                  <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                    article.sentiment === 'BULLISH' 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                      : article.sentiment === 'BEARISH' 
                        ? 'bg-red-500/15 text-red-400 border border-red-500/20' 
                        : 'bg-white/5 text-white/60 border border-white/5'
                  }`}>
                    {article.sentiment}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-white/40 font-mono">SCORE: </span>
                  <span className={`font-bold ${article.score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {(article.score >= 0 ? '+' : '') + article.score.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-white/30 font-mono text-xs border border-white/5 rounded bg-black/20">
          No announcements matching selected query registered in telemetry feeds.
        </div>
      )}
    </div>
  );
}

export default News;
