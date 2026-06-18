/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MFPortfolioAnalysis } from './MFPortfolioAnalysis';
import { MFAssetAllocation } from './MFAssetAllocation';
import { MFSIPTracking } from './MFSIPTracking';
import { MFGoalMapping } from './MFGoalMapping';
import { MFRebalancing } from './MFRebalancing';
import { MFRiskMetrics } from './MFRiskMetrics';
import { MFExplorer } from './MFExplorer';
import { MFFundComparison } from './MFFundComparison';
import { Briefcase, Landmark, ShieldAlert, Compass, Target, ArrowLeftRight } from 'lucide-react';

export function MutualFunds() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTabState] = useState<'portfolio' | 'sip' | 'risk' | 'explore'>(
    (searchParams.get('tab') as any) || 'portfolio'
  );

  const setActiveTab = (tab: 'portfolio' | 'sip' | 'risk' | 'explore') => {
    setActiveTabState(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (!tab) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', activeTab);
      setSearchParams(newParams, { replace: true });
    } else if (tab !== activeTab) {
      setActiveTabState(tab as any);
    }
  }, [searchParams, activeTab, setSearchParams]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none" id="mutual-funds-module">
      {/* Upper Terminal Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-cyan-950/15 border border-white/5 rounded-lg gap-4">
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">INTELLIGENT WEALTH SUITE</div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
            Mutual Funds Hub
          </h2>
          <p className="text-[11px] text-white/50 font-mono">
            Deploy capital, audit systemic inflation risk ratios, execute target rebalancing, and track long-term systematic plans.
          </p>
        </div>

        {/* Live status metadata to match our elegant cyber slate style */}
        <div className="flex gap-4 font-mono text-[9px] text-white/40 shrink-0 select-text">
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <span className="block uppercase text-white/30 text-[7px] tracking-wider">CALCULATOR ENG</span>
            <span className="text-emerald-400 font-bold">XIRR-NEWTON LIVE</span>
          </div>
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <span className="block uppercase text-white/30 text-[7px] tracking-wider">INDEX FEED</span>
            <span className="text-cyan-400 font-bold">MUTUALS API-V2</span>
          </div>
        </div>
      </div>

      {/* Primary Tab Selector Selection */}
      <div className="flex flex-wrap gap-1 bg-black/30 p-1 border border-white/5 rounded-lg font-mono text-[10.5px]">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2.5 rounded-md cursor-pointer transition-all flex items-center gap-2 uppercase tracking-wider font-extrabold flex-1 sm:flex-none justify-center ${
            activeTab === 'portfolio'
              ? 'bg-cyan-500/10 border border-cyan-400/25 text-cyan-300'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-4 h-4 text-cyan-400 shrink-0" />
          your portfolio (upcoming)
        </button>

        <button
          onClick={() => setActiveTab('sip')}
          className={`px-4 py-2.5 rounded-md cursor-pointer transition-all flex items-center gap-2 uppercase tracking-wider font-extrabold flex-1 sm:flex-none justify-center ${
            activeTab === 'sip'
              ? 'bg-cyan-500/10 border border-cyan-400/25 text-cyan-300'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <Target className="w-4 h-4 text-rose-400 shrink-0" />
          systematic & goals
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`px-4 py-2.5 rounded-md cursor-pointer transition-all flex items-center gap-2 uppercase tracking-wider font-extrabold flex-1 sm:flex-none justify-center ${
            activeTab === 'risk'
              ? 'bg-cyan-500/10 border border-cyan-400/25 text-cyan-300'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-[#ffaa00] shrink-0" />
          risk & rebalancer
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`px-4 py-2.5 rounded-md cursor-pointer transition-all flex items-center gap-2 uppercase tracking-wider font-extrabold flex-1 sm:flex-none justify-center ${
            activeTab === 'explore'
              ? 'bg-cyan-500/10 border border-cyan-400/25 text-cyan-300'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
          explore & compare
        </button>
      </div>

      {/* Tabs panels render */}
      <div className="space-y-6">
        {activeTab === 'portfolio' && (
          <div className="glass-panel p-8 rounded-lg border border-cyan-500/15 bg-cyan-950/5 relative overflow-hidden text-center space-y-6 max-w-4xl mx-auto py-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Briefcase className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="text-[10px] uppercase font-mono tracking-[0.3em] font-black text-cyan-400">Upcoming Portfolio Integration</div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Automated Portfolio Sync Hub</h3>
              <p className="text-xs text-white/50 max-w-lg mx-auto font-mono leading-relaxed">
                Connect your CDSL / NSDL depository transactions using Consolidated Account Statement (CAS) secure tokens. This section is temporarily closed pending SEBI compliance certificate clearance of the mutual fund aggregators API.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left font-mono">
              <div className="p-3 bg-black/45 border border-white/5 rounded">
                <span className="text-[9px] uppercase text-cyan-400 font-extrabold block mb-1">⚡ CDSL/NSDL Live Sync</span>
                <p className="text-[10px] text-white/40 leading-snug">Auto-import mutual fund holdings directly using secure OTP auth tokens linked to your PAN record.</p>
              </div>
              <div className="p-3 bg-black/45 border border-white/5 rounded">
                <span className="text-[9px] uppercase text-indigo-400 font-extrabold block mb-1">📊 CAS Statement Upload</span>
                <p className="text-[10px] text-white/40 leading-snug">Upload digital PDF Consolidated Account Statements from MFCentral, KFintech, or CAMS effortlessly.</p>
              </div>
              <div className="p-3 bg-black/45 border border-white/5 rounded">
                <span className="text-[9px] uppercase text-emerald-400 font-extrabold block mb-1">🛡️ Cryptographic Privacy</span>
                <p className="text-[10px] text-white/40 leading-snug">All transactions are processed at the local client gateway. No financial logs are harvested on company servers.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 rounded text-[9.5px] uppercase tracking-wider font-extrabold font-mono">
                🚀 API Phase 3.0 // Scheduled for release
              </span>
            </div>
          </div>
        )}

        {activeTab === 'sip' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 space-y-6 animate-fade-in">
              <MFSIPTracking />
            </div>
            <div>
              <MFGoalMapping />
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <MFRebalancing />
            </div>
            <div>
              <MFRiskMetrics />
            </div>
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <MFExplorer />
            </div>
            <div>
              <MFFundComparison />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MutualFunds;
