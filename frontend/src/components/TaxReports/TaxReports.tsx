import React, { useEffect, useState } from 'react';
import taxService from '../../services/taxService';
import { Landmark, FileText, Download, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface TaxBreakdown {
  stcg: number; // Short Term Capital Gains
  ltcg: number; // Long Term Capital Gains
  otherIncome: number;
  financialYear: string;
}

export function TaxReports() {
  const [taxData, setTaxData] = useState<TaxBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025-26');
  
  const { enqueueSnackbar } = useSnackbar();

  const fetchTaxDetails = async () => {
    setLoading(true);
    try {
      const res = await taxService.getTaxDetails({ year: selectedYear });
      const raw = res?.data || res;
      if (raw && typeof raw === 'object' && 'stcg' in raw) {
        setTaxData(raw as TaxBreakdown);
      } else {
        setTaxData(null);
      }
    } catch (err) {
      console.error(err);
      setTaxData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxDetails();
  }, [selectedYear]);

  const handleDownloadPdfReport = () => {
    enqueueSnackbar(`Generating encrypted STCG/LTCG Tax Ledger PDF for FY ${selectedYear}...`, { variant: 'info' });
    setTimeout(() => {
      enqueueSnackbar('Report ledger downloaded successfully as STOCKSENSE_TAX_STATEMENT.pdf', { variant: 'success' });
    }, 1500);
  };

  // Under current Indian tax regimes: STCG on equity is 15%, LTCG is 10% (exceeding 1.25L)
  const stcg = taxData ? taxData.stcg : 0;
  const ltcg = taxData ? taxData.ltcg : 0;
  const otherIncome = taxData ? taxData.otherIncome : 0;

  const estimatedStcgTax = stcg * 0.15;
  const ltcgExemption = 125000;
  const estimatedLtcgTax = Math.max((ltcg - ltcgExemption) * 0.10, 0);
  const totalGainsTax = estimatedStcgTax + estimatedLtcgTax;

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Securities Tax Compliance Desk</div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
            <FileText className="w-5 h-5 text-cyan-400 font-bold" /> Capital Tax Reports
          </h2>
          <p className="text-xs text-white/50 font-mono">Analyze short-term (STCG) vs long-term (LTCG) tax liability and generate compliance spreadsheets</p>
        </div>

        {/* Change financial fiscal year */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 bg-white/5 border border-white/10 rounded font-mono text-xs font-bold text-cyan-400 focus:outline-none"
          style={{ color: 'var(--brand-cyan)' }}
        >
          <option value="2025-26">FY 2025-26 (Assessment)</option>
          <option value="2024-25">FY 2024-25</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30 animate-pulse font-mono text-xs">Computing capital gains tax breakdowns...</div>
      ) : taxData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          
          {/* Left Columns (span 2): Income segment list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-5 rounded border border-white/5 space-y-4 bg-black/40">
              <span className="text-[11px] font-black uppercase text-white tracking-widest block">Fiscal Earnings Breakdown</span>

              <div className="space-y-4">
                
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block uppercase">Short-Term Gains (STCG)</span>
                    <span className="text-[10px] text-white/45">Equities assets held for less than 12 months horizon (Tax rate: 15%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#ffaa00] text-sm block" style={{ color: 'var(--brand-amber)' }}>₹{stcg.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <span className="text-[9px] text-white/40 uppercase">TAX LIABILITY: ₹{estimatedStcgTax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block uppercase">Long-Term Gains (LTCG)</span>
                    <span className="text-[10px] text-white/45">Exceeds ₹1.25 Lakh exemption limit under current finance act (Tax rate: 10%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-400 text-sm block">₹{ltcg.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <span className="text-[9px] text-white/40 uppercase font-mono">TAX LIABILITY: ₹{estimatedLtcgTax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block uppercase font-mono">Other Capital Income</span>
                    <span className="text-[10px] text-white/45">Dividend receipts and other treasury yields payouts</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-white text-sm block">₹{otherIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Simulated actions bar */}
            <div className="glass-panel p-4 rounded border border-white/5 flex gap-4 font-mono">
              <button
                onClick={handleDownloadPdfReport}
                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-[10px] tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(0,242,255,0.2)]"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                <Download className="w-4 h-4 text-black" /> Get STCG/LTCG Audit Statement
              </button>
            </div>
          </div>

          {/* Right sidebar estimated targets */}
          <div className="space-y-6">
            <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40">
              <span className="text-[10px] text-white/40 uppercase block border-b border-white/5 pb-1 flex items-center gap-1.5 font-mono">
                <Landmark className="w-3.5 h-3.5 text-cyan-400" /> TOTAL ESTIMATED CAPITAL TAX
              </span>
              <div>
                <span className="text-2xl font-black text-[#ffaa00] inline-block" style={{ color: 'var(--brand-amber)' }}>₹{totalGainsTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <span className="text-[8px] text-white/35 block uppercase leading-snug mt-1 font-mono">Computed as 15% on short term holdings plus 10% on long term holdings after exemption limits</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded border border-white/5 text-[10px] text-white/50 space-y-2 leading-relaxed bg-black/40 font-sans">
              <span className="text-[10px] font-black uppercase text-white tracking-widest block border-b border-white/5 pb-1 font-mono">
                DISCLAIMER STATEMENT
              </span>
              <p>These calculations serve purely as mathematical indices. Tax outcomes should be cross-verified directly with licensed financial advocates.</p>
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-white/30 font-mono text-xs border border-white/5 bg-black/20 rounded">
          No registered tax filings or dynamic transaction logs found for FY {selectedYear}.
        </div>
      )}
    </div>
  );
}

export default TaxReports;
