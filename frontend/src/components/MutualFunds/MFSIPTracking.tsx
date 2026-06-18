/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMutualFundStore, SIP, Scheme } from '../../store/mutualFundStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Calendar, Play, Pause, Trash2, PlusCircle, CheckCircle, Clock } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

export function MFSIPTracking() {
  const { sips, funds, addSip, toggleSipActive, triggerSipInstallment, deleteSip } = useMutualFundStore();
  const { enqueueSnackbar } = useSnackbar();

  const [showAddSip, setShowAddSip] = useState(false);
  const [selectedFundId, setSelectedFundId] = useState('');
  const [sipAmount, setSipAmount] = useState(1000);
  const [sipFrequency, setSipFrequency] = useState<'Monthly' | 'Quarterly'>('Monthly');
  const [sipDate, setSipDate] = useState('10');

  const handleAddSip = (e: React.FormEvent) => {
    e.preventDefault();
    const fund = funds.find((f) => f.id === selectedFundId);
    if (!fund) {
      enqueueSnackbar('Please choose a valid mutual fund scheme', { variant: 'error' });
      return;
    }

    if (sipAmount < fund.minSipAmount) {
      enqueueSnackbar(`Minimum SIP amount for ${fund.name} is ₹${fund.minSipAmount}`, { variant: 'error' });
      return;
    }

    const today = new Date();
    const startIso = today.toISOString().split('T')[0];
    
    // Work out next date
    const nextDate = new Date();
    nextDate.setDate(parseInt(sipDate));
    if (nextDate <= today) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    const nextIso = nextDate.toISOString().split('T')[0];

    addSip({
      fundId: fund.id,
      fundName: fund.name,
      category: fund.category,
      monthlyAmount: sipAmount,
      startDate: startIso,
      nextPaymentDate: nextIso,
      frequency: sipFrequency,
      mappedGoalId: null
    });

    enqueueSnackbar(`New systematic premium contract registered for ${fund.name}`, { variant: 'success' });
    setShowAddSip(false);
    setSelectedFundId('');
    setSipAmount(1000);
  };

  const handleTriggerInstallment = (id: string, name: string) => {
    triggerSipInstallment(id);
    enqueueSnackbar(`Successful installment payment processed for ${name}! Units allocated to active holdings.`, { variant: 'success' });
  };

  const handleToggleActive = (id: string, name: string, active: boolean) => {
    toggleSipActive(id);
    enqueueSnackbar(active 
      ? `SIP payments paused for ${name}`
      : `SIP payments resumed for ${name}`, 
      { variant: 'info' }
    );
  };

  const handleDeleteSip = (id: string, name: string) => {
    deleteSip(id);
    enqueueSnackbar(`SIP contract deleted for ${name}`, { variant: 'info' });
  };

  return (
    <div className="glass-panel p-5 rounded border border-white/5 space-y-5" id="mf-sip-tracking">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <h3 className="text-xs font-black uppercase tracking-wider font-mono text-white flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-cyan-400" />
          Active SIP Tracking Ledger
        </h3>
        <button
          onClick={() => setShowAddSip(!showAddSip)}
          className="text-[9px] uppercase tracking-wider font-mono font-black text-black bg-cyan-400 hover:bg-cyan-300 px-3 py-1 rounded cursor-pointer transition-all flex items-center gap-1 shadow-sm"
          style={{ backgroundColor: 'var(--brand-cyan)' }}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add SIP Scheme
        </button>
      </div>

      {/* Conditional Add Form */}
      {showAddSip && (
        <form onSubmit={handleAddSip} className="bg-black/45 p-4 rounded border border-cyan-500/20 space-y-4 font-mono text-[10px]">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="font-extrabold text-cyan-400 text-xs uppercase">Set New SIP Premium Contract</span>
            <button 
              type="button" 
              onClick={() => setShowAddSip(false)}
              className="text-white/40 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-white/50 block font-bold">Select Mutual Fund</label>
              <select
                required
                value={selectedFundId}
                onChange={(e) => setSelectedFundId(e.target.value)}
                className="w-full bg-black border border-white/10 p-2 text-xs font-mono text-white rounded outline-none h-9 focus:border-cyan-400"
              >
                <option value="">-- Choose Fund scheme --</option>
                {funds.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} (Min: ₹{f.minSipAmount})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-white/50 block font-bold">Installment Amount (INR)</label>
              <input
                required
                type="number"
                min="100"
                value={sipAmount}
                onChange={(e) => setSipAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-black border border-white/10 p-2 text-xs font-mono text-white rounded outline-none h-9 focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-white/50 block font-bold">Billing Frequency</label>
              <select
                value={sipFrequency}
                onChange={(e) => setSipFrequency(e.target.value as any)}
                className="w-full bg-black border border-white/10 p-2 text-xs font-mono text-white rounded outline-none h-9 focus:border-cyan-400"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-white/50 block font-bold">Calendar Day Of Installment</label>
              <select
                value={sipDate}
                onChange={(e) => setSipDate(e.target.value)}
                className="w-full bg-black border border-white/10 p-2 text-xs font-mono text-white rounded outline-none h-9 focus:border-cyan-400"
              >
                {['1', '5', '10', '15', '20', '25'].map(d => (
                  <option key={d} value={d}>Every {d}th of Month</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-cyan-400 text-black font-extrabold uppercase rounded hover:opacity-90 transition-all cursor-pointer text-xs"
            style={{ backgroundColor: 'var(--brand-cyan)' }}
          >
            CONFIRM AND INITIATE DEBIT CONTRACT
          </button>
        </form>
      )}

      {/* SIP Cards grid */}
      <div className="space-y-3 font-mono">
        {sips.length === 0 ? (
          <div className="text-center text-white/30 text-xs py-8">
            No active systematic investment plans tracking. Create your first SIP contract above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sips.map((sip) => {
              const baseFund = funds.find(f => f.id === sip.fundId);
              return (
                <div 
                  key={sip.id} 
                  className={`p-4 rounded border flex flex-col justify-between space-y-3.5 transition-all text-xs bg-black/45 ${
                    sip.active 
                      ? 'border-white/5 hover:border-cyan-500/20' 
                      : 'border-white/5 opacity-65 grayscale hover:grayscale-0'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-cyan-400">
                          {sip.category} // {sip.frequency.toUpperCase()}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-black ${
                          sip.active 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                            : 'bg-white/10 text-white/40 border border-white/15'
                        }`}>
                          {sip.active ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-white text-xs leading-snug truncate" title={sip.fundName}>
                        {sip.fundName}
                      </h4>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleActive(sip.id, sip.fundName, sip.active)}
                        className={`p-1.5 border border-white/5 rounded cursor-pointer hover:bg-white/5 transition-colors ${
                          sip.active ? 'text-[#ffaa00]' : 'text-emerald-400'
                        }`}
                        title={sip.active ? 'Pause SIP' : 'Resume SIP'}
                      >
                        {sip.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteSip(sip.id, sip.fundName)}
                        className="p-1.5 border border-white/5 text-rose-400 rounded cursor-pointer hover:bg-rose-500/10 transition-colors"
                        title="Cancel SIP"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Summary metric matrix */}
                  <div className="grid grid-cols-3 gap-2 bg-white/[0.01] border border-white/5 p-2 rounded text-[9.5px] text-white/40">
                    <div>
                      <span>PREMIUM AMOUNT</span>
                      <span className="block text-white font-black mt-0.5">{formatCurrency(sip.monthlyAmount)}</span>
                    </div>
                    <div>
                      <span>INSTALLMENTS</span>
                      <span className="block text-white font-bold mt-0.5">{sip.installmentsPaid} paid</span>
                    </div>
                    <div>
                      <span>TOTAL COMMITTED</span>
                      <span className="block text-white font-bold mt-0.5">{formatCurrency(sip.totalInvested)}</span>
                    </div>
                  </div>

                  {/* Next payment date & manual transaction activator */}
                  <div className="flex flex-wrap justify-between items-center gap-2 pt-1 border-t border-white/5 text-[10px]">
                    <div className="flex items-center gap-1 text-white/40">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Next payment: <strong className="text-white">{formatDate(sip.nextPaymentDate)}</strong></span>
                    </div>

                    {sip.active && (
                      <button
                        onClick={() => handleTriggerInstallment(sip.id, sip.fundName)}
                        className="px-2.5 py-1 bg-cyan-400/10 border border-cyan-400/35 text-cyan-300 hover:bg-cyan-400 hover:text-black font-extrabold rounded cursor-pointer text-[8px] uppercase tracking-wider transition-all"
                      >
                        Pay Installment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
