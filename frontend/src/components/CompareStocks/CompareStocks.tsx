import React, { useState, useEffect } from 'react';
import { Scale, Activity, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import stockService from '../../services/stockService';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface StockData {
  symbol: string;
  name?: string;
  price?: number;
  peRatio?: number;
  pbRatio?: number;
  debtToEquity?: number;
  roe?: number;
  eps?: number;
}

export function CompareStocks() {
  const [symbolA, setSymbolA] = useState('RELIANCE');
  const [symbolB, setSymbolB] = useState('TCS');
  
  const [dataA, setDataA] = useState<StockData | null>(null);
  const [dataB, setDataB] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { enqueueSnackbar } = useSnackbar();

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const [quoteA, finA, quoteB, finB] = await Promise.allSettled([
        stockService.getQuote(symbolA),
        stockService.getFinancials(symbolA),
        stockService.getQuote(symbolB),
        stockService.getFinancials(symbolB),
      ]);

      const stockA: StockData = { symbol: symbolA.toUpperCase() };
      const stockB: StockData = { symbol: symbolB.toUpperCase() };

      if (quoteA.status === 'fulfilled' && quoteA.value?.data) {
        stockA.name = quoteA.value.data.name;
        stockA.price = quoteA.value.data.price;
      }
      if (finA.status === 'fulfilled' && finA.value?.data) {
        stockA.peRatio = finA.value.data.peRatio;
        stockA.pbRatio = finA.value.data.pbRatio;
        stockA.debtToEquity = finA.value.data.debtToEquity;
        stockA.roe = finA.value.data.roe;
        stockA.eps = finA.value.data.eps;
      }

      if (quoteB.status === 'fulfilled' && quoteB.value?.data) {
        stockB.name = quoteB.value.data.name;
        stockB.price = quoteB.value.data.price;
      }
      if (finB.status === 'fulfilled' && finB.value?.data) {
        stockB.peRatio = finB.value.data.peRatio;
        stockB.pbRatio = finB.value.data.pbRatio;
        stockB.debtToEquity = finB.value.data.debtToEquity;
        stockB.roe = finB.value.data.roe;
        stockB.eps = finB.value.data.eps;
      }

      setDataA(stockA);
      setDataB(stockB);
    } catch (err) {
      console.error('Error fetching comparison details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [symbolA, symbolB]);

  const handleTriggerCompare = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComparison();
    enqueueSnackbar(`Refreshed comparison: ${symbolA.toUpperCase()} versus ${symbolB.toUpperCase()}`, { variant: 'success' });
  };

  const getWinner = (valA?: number, valB?: number, mode: 'LOWER' | 'HIGHER' = 'HIGHER') => {
    if (valA === undefined || valB === undefined) return 'NEUTRAL';
    if (valA === valB) return 'NEUTRAL';
    if (mode === 'LOWER') {
      return valA < valB ? 'A' : 'B';
    }
    return valA > valB ? 'A' : 'B';
  };

  const winPrice = getWinner(dataA?.price, dataB?.price, 'HIGHER');
  const winPe = getWinner(dataA?.peRatio, dataB?.peRatio, 'LOWER');
  const winDebt = getWinner(dataA?.debtToEquity, dataB?.debtToEquity, 'LOWER');
  const winRoe = getWinner(dataA?.roe, dataB?.roe, 'HIGHER');
  const winEps = getWinner(dataA?.eps, dataB?.eps, 'HIGHER');

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Securities side-by-side matrices</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
          Compare Securities
        </h2>
        <p className="text-xs text-white/50 font-mono">Evaluate two equities side-by-side across crucial margins criteria, yields, and balance sheets quality</p>
      </div>

      {/* Symbol selection Form */}
      <form onSubmit={handleTriggerCompare} className="flex flex-col sm:flex-row gap-4 bg-black/40 p-4 rounded border border-white/5 font-mono text-xs items-end">
        <div className="flex-1 space-y-1">
          <span className="text-[9px] text-white/40 uppercase">PRIMARY TICKER SYMBOL (A)</span>
          <input
            type="text"
            value={symbolA}
            onChange={(e) => setSymbolA(e.target.value.toUpperCase())}
            placeholder="e.g. RELIANCE, INFY"
            className="w-full p-2 bg-white/5 border border-white/10 rounded text-cyan-400 font-extrabold uppercase focus:outline-none focus:border-cyan-400"
            style={{ color: 'var(--brand-cyan)' }}
          />
        </div>
        
        <div className="flex items-center justify-center text-white/20 px-2 pb-2 h-10">
          <Scale className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 space-y-1">
          <span className="text-[9px] text-white/40 uppercase">SECONDARY TICKER SYMBOL (B)</span>
          <input
            type="text"
            value={symbolB}
            onChange={(e) => setSymbolB(e.target.value.toUpperCase())}
            placeholder="e.g. TCS, ITC"
            className="w-full p-2 bg-white/5 border border-white/10 rounded text-cyan-400 font-extrabold uppercase focus:outline-none focus:border-cyan-400"
            style={{ color: 'var(--brand-cyan)' }}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-widest rounded transition-all cursor-pointer h-9 flex items-center gap-1.5"
          style={{ backgroundColor: 'var(--brand-cyan)' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Compare
        </button>
      </form>

      {/* Comparison Grid table */}
      <div className="glass-panel rounded border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-black/45 border-b border-b-white/10 text-white/40 uppercase text-[9px] tracking-widest font-black">
              <th className="p-4">ANALYSIS PARAMETER</th>
              <th className="p-4 uppercase text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>{symbolA || 'A'} VALUE</th>
              <th className="p-4 uppercase text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>{symbolB || 'B'} VALUE</th>
              <th className="p-4 text-right">OUTPERFORMING STOCK</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-white/30 animate-pulse">
                  Running automated database comparison index comparisons...
                </td>
              </tr>
            ) : (
              <>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                  <td className="p-4 text-white/50">LAST TRADED PRICE (₹)</td>
                  <td className={`p-4 font-bold ${winPrice === 'A' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataA?.price ? `₹${dataA.price.toFixed(2)}` : '—'}
                  </td>
                  <td className={`p-4 font-bold ${winPrice === 'B' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataB?.price ? `₹${dataB.price.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-4 text-right font-black uppercase text-[10px]">
                    {winPrice === 'A' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_A</span>
                    ) : winPrice === 'B' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_B</span>
                    ) : (
                      <span className="text-white/30 px-2 py-0.5 rounded bg-white/5 border border-white/5">BALANCED</span>
                    )}
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                  <td className="p-4 text-white/50">PRICE TO EARNINGS (P/E) (Lower is better)</td>
                  <td className={`p-4 font-bold ${winPe === 'A' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataA?.peRatio ? `${dataA.peRatio.toFixed(1)}x` : '—'}
                  </td>
                  <td className={`p-4 font-bold ${winPe === 'B' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataB?.peRatio ? `${dataB.peRatio.toFixed(1)}x` : '—'}
                  </td>
                  <td className="p-4 text-right font-black uppercase text-[10px]">
                    {winPe === 'A' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_A</span>
                    ) : winPe === 'B' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_B</span>
                    ) : (
                      <span className="text-white/30 px-2 py-0.5 rounded bg-white/5 border border-white/5">BALANCED</span>
                    )}
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                  <td className="p-4 text-white/50">DEBT-TO-EQUITY LEVERAGE (Lower is better)</td>
                  <td className={`p-4 font-bold ${winDebt === 'A' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataA?.debtToEquity !== undefined ? dataA.debtToEquity.toFixed(2) : '—'}
                  </td>
                  <td className={`p-4 font-bold ${winDebt === 'B' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataB?.debtToEquity !== undefined ? dataB.debtToEquity.toFixed(2) : '—'}
                  </td>
                  <td className="p-4 text-right font-black uppercase text-[10px]">
                    {winDebt === 'A' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_A</span>
                    ) : winDebt === 'B' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_B</span>
                    ) : (
                      <span className="text-white/30 px-2 py-0.5 rounded bg-white/5 border border-white/5">BALANCED</span>
                    )}
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                  <td className="p-4 text-white/50">RETURN ON EQUITY % (Higher is better)</td>
                  <td className={`p-4 font-bold ${winRoe === 'A' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataA?.roe !== undefined ? `${dataA.roe.toFixed(2)}%` : '—'}
                  </td>
                  <td className={`p-4 font-bold ${winRoe === 'B' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataB?.roe !== undefined ? `${dataB.roe.toFixed(2)}%` : '—'}
                  </td>
                  <td className="p-4 text-right font-black uppercase text-[10px]">
                    {winRoe === 'A' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_A</span>
                    ) : winRoe === 'B' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_B</span>
                    ) : (
                      <span className="text-white/30 px-2 py-0.5 rounded bg-white/5 border border-white/5">BALANCED</span>
                    )}
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                  <td className="p-4 text-white/50">EARNINGS PER SHARE (EPS) (Higher is better)</td>
                  <td className={`p-4 font-bold ${winEps === 'A' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataA?.eps !== undefined ? `₹${dataA.eps.toFixed(2)}` : '—'}
                  </td>
                  <td className={`p-4 font-bold ${winEps === 'B' ? 'text-emerald-400' : 'text-white'}`}>
                    {dataB?.eps !== undefined ? `₹${dataB.eps.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-4 text-right font-black uppercase text-[10px]">
                    {winEps === 'A' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_A</span>
                    ) : winEps === 'B' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">▲ STOCK_B</span>
                    ) : (
                      <span className="text-white/30 px-2 py-0.5 rounded bg-white/5 border border-white/5">BALANCED</span>
                    )}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompareStocks;
