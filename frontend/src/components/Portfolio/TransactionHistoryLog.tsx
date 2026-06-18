import React, { useState } from 'react';
import { Search, Trash2, ArrowDownCircle, ArrowUpCircle, Filter, DownloadCloud, RotateCcw, ShieldAlert } from 'lucide-react';
import { Transaction } from '../../store/portfolioStore';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface TransactionHistoryLogProps {
  transactions: Transaction[];
  onRemoveTransaction: (id: string) => void;
}

export function TransactionHistoryLog({ transactions, onRemoveTransaction }: TransactionHistoryLogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSide, setSelectedSide] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const { enqueueSnackbar } = useSnackbar();

  const handleRevert = (id: string, symbol: string, qty: number, side: string) => {
    onRemoveTransaction(id);
    enqueueSnackbar(`Successfully reverted transaction: ${side} order of ${qty} ${symbol} stock removed from trade ledger`, { variant: 'success' });
  };

  const handleExport = () => {
    // Generate CSV contents
    const headers = ['Transaction ID', 'Stock Ticker', 'Company Name', 'Trade Date', 'Trade Side', 'Trade Price (₹)', 'Trade Volume (Qty)', 'Sector Type'];
    const rows = transactions.map(t => [
      t.id,
      t.symbol,
      `"${t.companyName}"`,
      t.date,
      t.type,
      t.price,
      t.quantity,
      `"${t.sector}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'portfolio_transactions_export_jun2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    enqueueSnackbar('Exported CSV trade ledger frame directly into downloads!', { variant: 'success' });
  };

  const filteredTxs = transactions.filter(t => {
    const symbolMatch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const sideMatch = selectedSide === 'ALL' || t.type === selectedSide;
    return symbolMatch && sideMatch;
  });

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs text-left" id="transaction-history-panel">
      {/* Upper header action row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div>
          <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block font-mono">AUDIT FRAME DATABASE</span>
          <span className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 google-font">
            <RotateCcw className="w-4.5 h-4.5 text-cyan-400" /> Transaction Audit Archives
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Search ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 w-full sm:w-36 bg-black/60 border border-white/10 rounded font-mono text-[10px] text-white focus:outline-none focus:border-cyan-400 placeholder:text-white/20"
            />
          </div>

          <select
            value={selectedSide}
            onChange={(e) => setSelectedSide(e.target.value as any)}
            className="p-1.5 bg-black/60 border border-white/10 rounded font-mono text-[10px] text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">ALL TRADES</option>
            <option value="BUY">BUY SIDE</option>
            <option value="SELL">SELL SIDE</option>
          </select>

          <button
            onClick={handleExport}
            className="p-1.5 bg-cyan-950/20 border border-cyan-500/15 hover:bg-cyan-500/10 rounded font-mono text-[10px] text-cyan-400 font-extrabold flex items-center gap-1.5 cursor-pointer uppercase transition-all"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" /> CSV Export
          </button>

        </div>
      </div>

      {/* Transaction tabular history container */}
      <div className="border border-white/5 rounded overflow-x-auto">
        <table className="w-full text-left border-collapse text-[10.5px]">
          <thead>
            <tr className="bg-black/55 border-b border-white/10 text-white/40 uppercase text-[8px] tracking-widest font-black">
              <th className="p-3">TRADE SIDE</th>
              <th className="p-3">DATE_STAMP</th>
              <th className="p-3">TICKER SYMC</th>
              <th className="p-3 text-right">VOLUME SIZE</th>
              <th className="p-3 text-right">PRICE RATIO (₹)</th>
              <th className="p-3 text-right">COMBINED PAYLOAD (₹)</th>
              <th className="p-3 text-right">AUDIT ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxs.length > 0 ? (
              filteredTxs.map((tx, idx) => {
                const combinedCost = tx.price * tx.quantity;
                return (
                  <tr key={tx.id || idx} className="border-b border-white/5 hover:bg-white/[0.01] transition-all font-mono">
                    
                    {/* Trade side indicator column */}
                    <td className="p-3">
                      {tx.type === 'BUY' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold uppercase">
                          <ArrowDownCircle className="w-3 h-3 text-emerald-400" /> BUY ORDER
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-red-400/10 border border-red-500/20 text-red-400 font-extrabold uppercase">
                          <ArrowUpCircle className="w-3 h-3 text-red-400" /> SELL ORDER
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-white/50">{tx.date}</td>
                    
                    {/* Symbol with company subtitle */}
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-white font-extrabold">{tx.symbol}</span>
                        <span className="text-[8.5px] text-white/30 truncate max-w-[125px] font-sans">{tx.companyName}</span>
                      </div>
                    </td>

                    <td className="p-3 text-right text-white font-bold font-mono">{tx.quantity}</td>
                    <td className="p-3 text-right text-white/70">₹{tx.price.toLocaleString('en-IN', { minimumFractionDigits: 1 })}</td>
                    
                    {/* Aggregate total */}
                    <td className="p-3 text-right font-black text-white">
                      ₹{combinedCost.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                    </td>

                    {/* Operational Revert action */}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRevert(tx.id, tx.symbol, tx.quantity, tx.type)}
                        className="p-1 px-1.5 rounded text-white/33 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer font-bold inline-flex items-center gap-1 text-[9.5px]"
                        title="Revert & Delete Trade"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Revert
                      </button>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-10 text-center text-white/20 uppercase font-black tracking-widest leading-relaxed">
                  No trade logs found matching your request.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Safety guideline warnings */}
      <div className="p-3 bg-red-950/5 border border-red-500/10 text-[9.5px] leading-relaxed text-red-300/80 rounded flex items-start gap-1.5">
        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <p>
          CRITICAL SECURITY DIRECTIVE: Deleting or reverting a historical transaction recalculates weighted average acquisition prices and unrealized absolute gains in real-time. This operation is non-reversible. Use extreme caution.
        </p>
      </div>
    </div>
  );
}

export default TransactionHistoryLog;
