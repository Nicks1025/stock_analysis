import React, { useEffect, useState } from 'react';
import goalService from '../../services/goalService';
import calculatorService from '../../services/calculatorService';
import { Target, TrendingUp, Plus, Trash2, HelpCircle } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface InvestmentGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  timelineYears: number;
  expectedReturn?: number;
}

export function Goals() {
  const [goals, setGoals] = useState<InvestmentGoal[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create Goal Form
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [timelineYears, setTimelineYears] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await goalService.getGoals();
      const rawData = res?.data || res;
      if (Array.isArray(rawData)) {
        setGoals(rawData);
      } else {
        setGoals([]);
      }
    } catch (err) {
      console.error(err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !currentAmount || !timelineYears) return;

    try {
      const targetVal = parseFloat(targetAmount);
      const currentVal = parseFloat(currentAmount);
      const yearsVal = parseInt(timelineYears);

      const payload = {
        name,
        targetAmount: targetVal,
        currentAmount: currentVal,
        timelineYears: yearsVal,
        expectedReturn: 12
      };

      await goalService.createGoal(payload);

      const newGoal: InvestmentGoal = {
        id: 'GOL-' + Math.random().toString(36).substring(5),
        name,
        targetAmount: targetVal,
        currentAmount: currentVal,
        timelineYears: yearsVal,
        expectedReturn: 12
      };

      setGoals(prev => [newGoal, ...prev]);
      enqueueSnackbar(`Goal target "${name}" registered successfully!`, { variant: 'success' });
      
      setName('');
      setTargetAmount('');
      setCurrentAmount('');
      setTimelineYears('');
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Access error creating investment goal target.', { variant: 'error' });
    }
  };

  const handleDeleteGoal = async (id: string, name: string) => {
    try {
      await goalService.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      enqueueSnackbar(`Purged investment goal: "${name}"`, { variant: 'success' });
    } catch (err) {
      setGoals(prev => prev.filter(g => g.id !== id));
      enqueueSnackbar(`Purged investment goal "${name}" offline.`, { variant: 'success' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Securities secondary target mappings</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
          <Target className="w-5 h-5 text-red-400 font-bold" /> Investment Goals
        </h2>
        <p className="text-xs text-white/50 font-mono">Register major life capital benchmarks, allocation rules, and see dynamic progress gauges</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Left Span: Active goals progress logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-4 rounded border border-white/5 space-y-5 bg-black/40">
            <span className="text-[11px] font-black uppercase text-white tracking-widest block">Active Target Benchmarks</span>

            {loading ? (
              <div className="text-center py-12 text-white/30 animate-pulse">Running target computations...</div>
            ) : goals.length > 0 ? (
              <div className="space-y-5">
                {goals.map((g) => {
                  const percent = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
                  // Approximate required monthly sip
                  const monthlySip = calculatorService.computeSip(g.targetAmount, g.currentAmount, g.timelineYears, g.expectedReturn || 12);

                  return (
                    <div key={g.id} className="p-4 rounded border border-white/5 bg-black/45 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-[#00f2ff] text-sm uppercase" style={{ color: 'var(--brand-cyan)' }}>{g.name}</h4>
                          <span className="text-[10px] text-white/40 uppercase">TIME HORIZON: {g.timelineYears} YEARS // EST. CAGR: {g.expectedReturn || 12}%</span>
                        </div>
                        <button
                          onClick={() => handleDeleteGoal(g.id, g.name)}
                          className="text-red-400 hover:text-red-300 font-bold text-xs cursor-pointer"
                        >
                          Purge
                        </button>
                      </div>

                      {/* Bar indicator gauge */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-white/60">
                          <span>Progress: {percent.toFixed(1)}%</span>
                          <span>₹{g.currentAmount.toLocaleString()} / ₹{g.targetAmount.toLocaleString()} Target</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${percent}%`, backgroundColor: 'var(--brand-cyan)' }} />
                        </div>
                      </div>

                      <div className="text-[10px] text-white/40 uppercase">
                        Recommended Monthly SIP contribution: <span className="text-emerald-400 font-bold">₹{Math.ceil(monthlySip).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-white/35 border border-white/5 rounded bg-black/20 p-6">No target benchmarks declared. Use the tracking slider form.</div>
            )}
          </div>
        </div>

        {/* Right Span: New goal targets builder */}
        <div className="space-y-6">
          <form onSubmit={handleCreateGoal} className="glass-panel p-4 rounded border border-white/5 bg-cyan-950/5 space-y-4">
            <span className="text-[10px] font-black uppercase text-cyan-300 tracking-widest block border-b border-cyan-500/15 pb-2">
              BUILD GOAL VECTOR
            </span>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">Target Goal Title</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dream House Fund"
                  className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] text-white/40 uppercase">Target Amount (₹)</span>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="e.g. 5000000"
                    className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                    min="1"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-white/40 uppercase">Held Capital (₹)</span>
                  <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="e.g. 100000"
                    className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">Timeline Horizon (Years)</span>
                <input
                  type="number"
                  value={timelineYears}
                  onChange={(e) => setTimelineYears(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                  min="1"
                  max="50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black font-black uppercase tracking-widest rounded transition-all cursor-pointer"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                Register Goal target
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Goals;
