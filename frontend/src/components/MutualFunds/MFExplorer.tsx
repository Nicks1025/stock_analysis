/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMutualFundStore, Scheme } from '../../store/mutualFundStore';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { Info, Plus, Calendar, ArrowLeftRight, CreditCard, Sparkles, User } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

export function MFExplorer() {
  const { funds, compareFundIds, toggleCompareFund, addInvestment, addSip } = useMutualFundStore();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'EQUITY' | 'DEBT' | 'HYBRID'>('ALL');
  
  // Buying / allocating states
  const [purchasingFund, setPurchasingFund] = useState<Scheme | null>(null);
  const [tradeType, setTradeType] = useState<'LUMPSUM' | 'SIP'>('LUMPSUM');
  const [amount, setAmount] = useState(10000);
  const [sipDay, setSipDay] = useState('10');

  const filteredFunds = selectedCategory === 'ALL' 
    ? funds 
    : funds.filter(f => f.category === selectedCategory);

  const handleToggleCompare = (fund: Scheme) => {
    toggleCompareFund(fund.id);
    const inCompare = compareFundIds.includes(fund.id);
    enqueueSnackbar(
      inCompare 
        ? `Removed ${fund.name} from fund comparison` 
        : `Added ${fund.name} to fund comparison (Max 3)`, 
      { variant: 'info' }
    );
  };

  const handleOpenPurchase = (fund: Scheme, type: 'LUMPSUM' | 'SIP') => {
    setPurchasingFund(fund);
    setTradeType(type);
    setAmount(type === 'SIP' ? fund.minSipAmount : 10000);
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchasingFund) return;

    if (tradeType === 'LUMPSUM') {
      if (amount <= 0) {
        enqueueSnackbar('Please enter a valid amount', { variant: 'error' });
        return;
      }
      const units = parseFloat((amount / purchasingFund.nav).toFixed(4));
      addInvestment({
        fundId: purchasingFund.id,
        fundName: purchasingFund.name,
        category: purchasingFund.category,
        investedAmount: amount,
        units,
        purchaseNAV: purchasingFund.nav,
        purchaseDate: new Date().toISOString().split('T')[0],
        mappedGoalId: null
      });
      enqueueSnackbar(`Successfully allocated ₹${amount.toLocaleString()} in ${purchasingFund.name}!`, { variant: 'success' });
    } else {
      if (amount < purchasingFund.minSipAmount) {
        enqueueSnackbar(`Minimum SIP premium is ₹${purchasingFund.minSipAmount}`, { variant: 'error' });
        return;
      }

      // calculate next payment date
      const today = new Date();
      const nextPayment = new Date();
      nextPayment.setDate(parseInt(sipDay));
      if (nextPayment <= today) {
        nextPayment.setMonth(nextPayment.getMonth() + 1);
      }

      addSip({
        fundId: purchasingFund.id,
        fundName: purchasingFund.name,
        category: purchasingFund.category,
        monthlyAmount: amount,
        startDate: today.toISOString().split('T')[0],
        nextPaymentDate: nextPayment.toISOString().split('T')[0],
        frequency: 'Monthly',
        mappedGoalId: null
      });
      enqueueSnackbar(`Systematic premium registered for ${purchasingFund.name} at ₹${amount.toLocaleString()}/month!`, { variant: 'success' });
    }

    setPurchasingFund(null);
  };

  return (
    <div className="space-y-6 font-mono text-xs" id="mf-explorer">
      {/* Category selection bar */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'EQUITY', 'DEBT', 'HYBRID'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-[9.5px] font-mono rounded cursor-pointer uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/10 border border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-white/40 uppercase hidden sm:inline">Index count: {filteredFunds.length}</span>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFunds.map((fund) => {
          const inCompare = compareFundIds.includes(fund.id);
          return (
            <div 
              key={fund.id} 
              className="bg-black/45 p-5 rounded border border-white/5 hover:border-cyan-500/20 transition-all flex flex-col justify-between space-y-4 font-mono hover:scale-[1.005]"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-black uppercase">
                  <span className="text-cyan-400">{fund.category} // {fund.subCategory}</span>
                  <span className={fund.riskRating === 'Very High' || fund.riskRating === 'High' ? 'text-[#ffaa00]' : 'text-emerald-400'}>
                    {fund.riskRating.toUpperCase()} RISK
                  </span>
                </div>
                
                <h3 className="font-extrabold text-white text-sm tracking-wide leading-snug line-clamp-1">{fund.name}</h3>
                
                {/* Manager Name */}
                <div className="flex items-center gap-1 text-[9px] text-white/40 pt-0.5">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>Lead Manager: <span className="text-white/60 font-semibold">{fund.manager}</span></span>
                </div>
              </div>

              {/* Core metrics bar */}
              <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 p-2.5 bg-white/[0.01] border border-white/5 rounded text-[8.5px] text-white/45">
                <div>
                  <span className="block uppercase text-[7.5px] tracking-wider text-white/30">NAV VALUE</span>
                  <span className="block text-white font-bold mt-0.5">₹{fund.nav.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block uppercase text-[7.5px] tracking-wider text-white/30">AUM MASS</span>
                  <span className="block text-white font-bold mt-0.5">₹{fund.aum.toLocaleString()} Cr</span>
                </div>
                <div>
                  <span className="block uppercase text-[7.5px] tracking-wider text-white/30">3Y CAGR</span>
                  <span className="block text-emerald-400 font-extrabold mt-0.5">+{fund.return3Y}%</span>
                </div>
                <div>
                  <span className="block uppercase text-[7.5px] tracking-wider text-white/30">EXPENSE RATIO</span>
                  <span className="block text-rose-300 font-medium mt-0.5">{fund.expenseRatio}%</span>
                </div>
              </div>

              {/* Sector breakdown preview */}
              <div className="space-y-1">
                <div className="text-[8px] uppercase tracking-wider text-white/35 font-extrabold">Primary Corporate Exposures</div>
                <div className="flex flex-wrap gap-1">
                  {fund.topHoldings.slice(0, 3).map((hold, idx) => (
                    <span key={idx} className="bg-white/5 border border-white/5 text-[8.5px] px-2 py-0.5 rounded text-white/50">
                      {hold.company} ({hold.weight.toFixed(1)}%)
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive buying/compare tray */}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleToggleCompare(fund)}
                  className={`flex-1 py-2 font-black uppercase text-[10px] tracking-wider rounded border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    inCompare
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-black/30 border-white/10 text-white/55 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  {inCompare ? 'Compared √' : 'Compare'}
                </button>

                <button
                  onClick={() => handleOpenPurchase(fund, 'LUMPSUM')}
                  className="flex-1 py-2 bg-white/5 hover:bg-cyan-400 hover:text-black border border-white/5 font-black text-[10px] uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Lump Sum
                </button>

                <button
                  onClick={() => handleOpenPurchase(fund, 'SIP')}
                  className="flex-1 py-2 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: 'var(--brand-cyan)' }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Start SIP
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trade Purchase Modal overlay */}
      {purchasingFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono text-[11px]">
          <form onSubmit={handleExecuteTrade} className="bg-neutral-900 border border-white/10 p-5 rounded w-full max-w-sm space-y-4">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-extrabold block">CAPITAL PLACEMENT DESK</span>
              <h4 className="text-white font-extrabold text-sm uppercase">Order Confirmation</h4>
              <p className="text-white/40 text-[9.5px] mt-1 line-clamp-1">
                {purchasingFund.name}
              </p>
            </div>

            {/* Selector slider */}
            <div className="flex p-0.5 bg-black border border-white/10 rounded">
              <button
                type="button"
                onClick={() => {
                  setTradeType('LUMPSUM');
                  setAmount(10000);
                }}
                className={`flex-1 py-1.5 uppercase font-bold text-[9px] rounded transition-colors cursor-pointer ${
                  tradeType === 'LUMPSUM' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/30' : 'text-white/40'
                }`}
              >
                Lump Sum Buy
              </button>
              <button
                type="button"
                onClick={() => {
                  setTradeType('SIP');
                  setAmount(purchasingFund.minSipAmount);
                }}
                className={`flex-1 py-1.5 uppercase font-bold text-[9px] rounded transition-colors cursor-pointer ${
                  tradeType === 'SIP' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/30' : 'text-white/40'
                }`}
              >
                SIP Premium Plan
              </button>
            </div>

            {/* Standard inputs */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[9px] uppercase text-white/50 block font-black">Trade Capital Amount (₹)</label>
                <input
                  required
                  type="number"
                  min={tradeType === 'SIP' ? purchasingFund.minSipAmount : 500}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-white/10 p-2 text-xs font-mono text-white rounded outline-none h-9 focus:border-cyan-400"
                />
                {tradeType === 'SIP' && (
                  <span className="text-[9px] text-[#ffaa00] font-medium block">
                    * Minimum periodic premium limit check: ₹{purchasingFund.minSipAmount}
                  </span>
                )}
              </div>

              {tradeType === 'SIP' && (
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-white/50 block font-black">Monthly Debit Day</label>
                  <select
                    value={sipDay}
                    onChange={(e) => setSipDay(e.target.value)}
                    className="w-full bg-black border border-white/10 p-2 text-xs font-mono text-white rounded outline-none h-9 focus:border-cyan-400"
                  >
                    {['1', '5', '10', '15', '20', '25'].map(d => (
                      <option key={d} value={d}>Every {d}th of Month</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2 text-[10px]">
              <button
                type="button"
                onClick={() => setPurchasingFund(null)}
                className="px-3.5 py-1.5 border border-white/10 text-white/50 hover:text-white rounded cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-cyan-500 text-black font-black uppercase rounded hover:bg-cyan-400 cursor-pointer transition-colors"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                Confirm Placement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
