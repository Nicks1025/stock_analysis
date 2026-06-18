import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] text-[#e0e0ff] flex flex-col justify-center items-center font-mono select-none">
      <h1 className="text-6xl text-red-500 animate-pulse font-extrabold mb-4">404</h1>
      <p className="text-xs text-white/50 mb-6 uppercase tracking-widest">TRANSMISSION ROUTE LOSS DETECTED</p>
      <Link 
        to="/" 
        className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs uppercase tracking-widest font-black rounded cursor-pointer transition-all"
        style={{ backgroundColor: 'var(--brand-cyan)' }}
      >
        Return to Core Node
      </Link>
    </div>
  );
}

export default NotFound;
