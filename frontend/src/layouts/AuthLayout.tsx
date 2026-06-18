/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Cpu, Terminal } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#050508] text-[#e0e0ff] font-sans relative flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Background ambient tracking lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c16_1px,transparent_1px),linear-gradient(to_bottom,#0c0c16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Central Glass Frame Box */}
      <div className="w-full max-w-md glass-panel relative rounded-lg overflow-hidden border border-[rgba(100,100,255,0.15)] bg-[rgba(10,10,22,0.85)] shadow-[0_12px_45px_rgba(0,0,0,0.7)] flex flex-col z-10 transition-transform duration-300">
        
        {/* Scanning telemetry line bar */}
        <div className="absolute top-0 left-0 w-full scan-line pointer-events-none" />
        
        {/* Layout branding header */}
        <header className="px-6 py-5 border-b border-white/10 flex items-center gap-3 bg-white/[0.01]">
          <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/35 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-cyan-400 font-mono">Terminal Gateway</div>
            <h1 className="text-sm font-black tracking-widest text-white neon-text-cyan uppercase">StockSense AI Core</h1>
          </div>
        </header>

        {/* Form Container Wrapper */}
        <div className="p-6 md:p-8">
          <Outlet />
        </div>

        {/* Aesthetic telemetry diagnostic console indicator */}
        <footer className="mt-auto px-6 py-4 border-t border-white/5 bg-black/40 flex justify-between items-center text-[9px] font-mono opacity-50">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_5px_cyan]"></span>
            SECURE PORT SSL_TS_3000
          </div>
          <div>EST: 2026_EST_V2</div>
        </footer>
      </div>
    </div>
  );
}
