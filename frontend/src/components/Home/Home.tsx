import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-[#050508] text-[#e0e0ff] flex flex-col justify-center items-center text-center p-6 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c16_1px,transparent_1px),linear-gradient(to_bottom,#0c0c16_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-30" />
      
      {/* Decorative details */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-white/30 hidden md:block">
        CORE_GATEWAY: 127.0.0.1 // SSL_CONNECTED
      </div>
      <div className="absolute top-4 right-4 font-mono text-[9px] text-white/30 hidden md:block">
        BUILD_VER: STOCKSENSE_AI_V2.4
      </div>

      <div className="max-w-xl glass-panel p-8 rounded-lg border border-white/15 relative space-y-6 bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 left-0 scan-line pointer-events-none" />
        
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-[#00f2ff]" style={{ color: 'var(--brand-cyan)' }}>
            <Sparkles className="w-7 h-7" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-widest text-white flex items-center justify-center gap-2 uppercase">
          STOCKSENSE AI
        </h1>
        
        <p className="text-xs leading-relaxed text-white/70 font-mono">
          Uncompromised analytical terminal powering premium indices intelligence, smart stock screening, and algorithmic portfolio diagnostics for Indian retail node networks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/login"
            className="px-6 py-2.5 bg-[#00f2ff] hover:opacity-90 text-black font-black text-xs uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] cursor-pointer"
            style={{ backgroundColor: 'var(--brand-cyan)' }}
          >
            Access Terminal
          </Link>
          <Link 
            to="/register"
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs rounded transition-all cursor-pointer"
          >
            Register Code
          </Link>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-white/40">
          <span>ALL NODE SYSTEMS DEPLOYED</span>
          <span>NIFTY_REALTIME_FEED: ONLINE</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
