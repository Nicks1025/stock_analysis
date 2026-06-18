/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMutualFundStore } from '../../store/mutualFundStore';
import { useGoalStore, Goal } from '../../store/goalStore';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';
import { Target, Gift, Home, GraduationCap, AlertCircle, Sparkles, FolderKanban, Link2, Award } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

export function MFGoalMapping() {
  const { investments, sips, updateInvestmentGoal, updateSipGoal } = useMutualFundStore();
  const { goals, addGoal } = useGoalStore();
  const { enqueueSnackbar } = useSnackbar();

  const [mappingTargetSub, setMappingTargetSub] = useState<{ type: 'inv' | 'sip'; id: string } | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  // 1. If parent goals store is empty, lets seed a few mock goals so the user has beautiful goals to map right away!
  React.useEffect(() => {
    if (goals.length === 0) {
      addGoal({
        id: 'goal-retirement',
        goalType: 'retirement',
        title: 'Prudential Retirement Nest Egg',
        targetAmount: 2500000,
        currentProgress: 120000,
        targetDate: '2035-12-31',
        expectedCagr: 12.0
      });
      addGoal({
        id: 'goal-house',
        goalType: 'house',
        title: 'Premium Penthouse Downpayment',
        targetAmount: 1000000,
        currentProgress: 50000,
        targetDate: '2029-06-30',
        expectedCagr: 11.5
      });
      addGoal({
        id: 'goal-education',
        goalType: 'education',
        title: "Children's University Fund",
        targetAmount: 1500000,
        currentProgress: 30000,
        targetDate: '2032-05-15',
        expectedCagr: 12.0
      });
    }
  }, [goals, addGoal]);

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'retirement': return <Award className="w-4 h-4 text-rose-400" />;
      case 'house': return <Home className="w-4 h-4 text-emerald-400" />;
      case 'education': return <GraduationCap className="w-4 h-4 text-sky-400" />;
      default: return <Target className="w-4 h-4 text-cyan-400" />;
    }
  };

  const handleOpenMap = (type: 'inv' | 'sip', id: string) => {
    setMappingTargetSub({ type, id });
    const currentMappedGoal = type === 'inv' 
      ? investments.find(i => i.id === id)?.mappedGoalId 
      : sips.find(s => s.id === id)?.mappedGoalId;
    setSelectedGoalId(currentMappedGoal || '');
  };

  const handleApplyMap = () => {
    if (!mappingTargetSub) return;
    
    const targetId = selectedGoalId === 'unmap' ? null : selectedGoalId || null;
    const goalTitle = goals.find(g => g.id === targetId)?.title || 'No Goal';

    if (mappingTargetSub.type === 'inv') {
      updateInvestmentGoal(mappingTargetSub.id, targetId);
      enqueueSnackbar(targetId 
        ? `Investment successfully mapped to: ${goalTitle}`
        : 'Investment unmapped successfully', 
        { variant: 'success' }
      );
    } else {
      updateSipGoal(mappingTargetSub.id, targetId);
      enqueueSnackbar(targetId 
        ? `SIP premium mapped to: ${goalTitle}`
        : 'SIP unmapped successfully', 
        { variant: 'success' }
      );
    }

    setMappingTargetSub(null);
  };

  return (
    <div className="glass-panel p-5 rounded border border-white/5 space-y-6" id="mf-goal-mapping">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <h3 className="text-xs font-black uppercase tracking-wider font-mono text-white flex items-center gap-1.5">
          <Target className="w-4 h-4 text-cyan-400" />
          Intelligent Goal Mapping Desk
        </h3>
        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/50 font-mono">
          Linked: {investments.filter(i => i.mappedGoalId).length + sips.filter(s => s.mappedGoalId).length} assets
        </span>
      </div>

      {/* Grid of Goals mapped performance */}
      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => {
          // Calculate assets mapped to this specific goal
          const goalInvestments = investments.filter(i => i.mappedGoalId === goal.id);
          const goalSips = sips.filter(s => s.mappedGoalId === goal.id);

          const mappedLumpValue = goalInvestments.reduce((sum, i) => sum + i.currentValue, 0);
          const mappedSipPremium = goalSips.reduce((sum, s) => sum + s.monthlyAmount, 0);

          // Work out timelines
          const today = new Date();
          const target = new Date(goal.targetDate);
          const yearsRemaining = Math.max(0.1, (target.getTime() - today.getTime()) / (365 * 24 * 60 * 60 * 1000));
          const monthsRemaining = Math.ceil(yearsRemaining * 12);

          // Future Value projecting (compound interest formula on current lumpsum + recurring monthly SIP premium)
          // FV_lump = PV * (1 + r)^t
          // FV_sip = PMT * [((1 + r)^n) - 1] / r * (1 + r)
          const monthlyRate = goal.expectedCagr / 12 / 100;
          const totalMonths = Math.max(1, monthsRemaining);
          
          const futureValLump = mappedLumpValue * Math.pow(1 + goal.expectedCagr / 100, yearsRemaining);
          const futureValSip = monthlyRate > 0 
            ? mappedSipPremium * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
            : mappedSipPremium * totalMonths;

          const totalProjectedValue = futureValLump + futureValSip;
          const goalPctComplete = (totalProjectedValue / goal.targetAmount) * 100;

          return (
            <div key={goal.id} className="bg-black/45 p-4 rounded border border-white/5 hover:border-white/10 transition-all font-mono space-y-3.5 relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded">
                    {getGoalIcon(goal.goalType)}
                    <span className="text-[8px] font-black uppercase text-white/50">{goal.goalType}</span>
                  </div>
                  <span className="text-[9px] text-white/40">{monthsRemaining} Months Left</span>
                </div>

                <h4 className="font-extrabold text-white text-xs mt-1.5 line-clamp-1">{goal.title}</h4>
                <div className="text-[10px] text-white/40 mt-1 flex justify-between">
                  <span>Target Sum:</span>
                  <span className="text-white font-bold">{formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>

              {/* Mapped stats */}
              <div className="p-2 bg-white/[0.01] border border-white/5 rounded text-[9px] space-y-1 text-white/50">
                <div className="flex justify-between">
                  <span>Current Mapped Assets:</span>
                  <span className="text-white font-bold">{formatCurrency(mappedLumpValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Linked SIP Monthly:</span>
                  <span className="text-white font-semibold">{formatCurrency(mappedSipPremium)}/mo</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1 mt-1 font-bold">
                  <span>Projected Sum (FV):</span>
                  <span className="text-cyan-400">{formatCurrency(totalProjectedValue)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] uppercase tracking-wider font-extrabold text-white/30">
                  <span>PROJECTED COVERAGE</span>
                  <span className={goalPctComplete >= 100 ? 'text-emerald-400' : 'text-cyan-400'}>
                    {goalPctComplete.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500`}
                    style={{ 
                      width: `${Math.min(100, goalPctComplete)}%`,
                      background: goalPctComplete >= 100 ? 'var(--brand-emerald, #10b981)' : 'var(--brand-cyan, #06b6d4)'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unified mappings list */}
      <div className="space-y-3 font-mono">
        <span className="text-[10px] font-bold uppercase text-white/40 block">MAP HOLDINGS & PREMIUMS TO GOALS</span>

        <div className="grid grid-cols-1 gap-4">
          {/* Investments allocation mapper */}
          <div className="bg-black/35 p-3 rounded border border-white/5 space-y-2">
            <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider">Unmapped Lump Investments</span>
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
              {investments.map((inv) => (
                <div key={inv.id} className="p-2 bg-black/40 border border-white/5 rounded flex justify-between items-center text-[10px]">
                  <div className="min-w-0 max-w-[70%]">
                    <span className="text-white font-bold block truncate">{inv.fundName}</span>
                    <span className="text-[8px] text-white/40">
                      VALUE: {formatCurrency(inv.currentValue)} // {inv.mappedGoalId ? `MAPPED: ${goals.find(g => g.id === inv.mappedGoalId)?.title}` : 'UNLINKED'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenMap('inv', inv.id)}
                    className="px-2 py-1 border border-white/10 hover:border-cyan-400 text-[8px] font-bold text-white rounded cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Link2 className="w-2.5 h-2.5 text-cyan-400" />
                    {inv.mappedGoalId ? 'Re-link' : 'Link'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SIP allocation mapper */}
          <div className="bg-black/35 p-3 rounded border border-white/5 space-y-2">
            <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider">Unmapped Monthly SIPs</span>
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
              {sips.map((sip) => (
                <div key={sip.id} className="p-2 bg-black/40 border border-white/5 rounded flex justify-between items-center text-[10px]">
                  <div className="min-w-0 max-w-[70%]">
                    <span className="text-white font-bold block truncate">{sip.fundName}</span>
                    <span className="text-[8px] text-white/40">
                      PREMIUM: {formatCurrency(sip.monthlyAmount)}/mo // {sip.mappedGoalId ? `MAPPED: ${goals.find(g => g.id === sip.mappedGoalId)?.title}` : 'UNLINKED'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenMap('sip', sip.id)}
                    className="px-2 py-1 border border-white/10 hover:border-cyan-400 text-[8px] font-bold text-white rounded cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Link2 className="w-2.5 h-2.5 text-cyan-400" />
                    {sip.mappedGoalId ? 'Re-link' : 'Link'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Goal mapping popover card dialog */}
      {mappingTargetSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono text-[11px]">
          <div className="bg-neutral-900 border border-white/10 p-5 rounded w-full max-w-sm space-y-4">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-extrabold block">ASSET GOAL ASSISTANT</span>
              <h4 className="text-white font-extrabold text-sm uppercase">Link to Financial Goal</h4>
              <p className="text-white/40 text-[9.5px] mt-1 leading-relaxed">
                Assigning this asset aggregates its cash values and monthly premium forecasts inside the target goal timeline.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-[9px] uppercase text-white/50 block font-black">Choose Active Goal target</label>
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full bg-black/50 border border-white/10 p-2 text-xs font-mono text-white rounded outline-none focus:border-cyan-400"
              >
                <option value="">-- Click to Select Goal Target --</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title} (₹{goal.targetAmount.toLocaleString()})
                  </option>
                ))}
                <option value="unmap">-- Remove Goal Mapping (Unlink) --</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-2 text-[10px]">
              <button
                onClick={() => setMappingTargetSub(null)}
                className="px-3.5 py-1.5 border border-white/10 text-white/50 hover:text-white rounded cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyMap}
                className="px-4 py-1.5 bg-cyan-500 text-black font-black uppercase rounded hover:bg-cyan-400 cursor-pointer transition-colors"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
