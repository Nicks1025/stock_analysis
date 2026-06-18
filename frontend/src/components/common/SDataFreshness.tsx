/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Database } from 'lucide-react';

interface SDataFreshnessProps {
  lastUpdated?: string | Date;
  onRefresh?: () => void;
  loading?: boolean;
  className?: string;
}

export function SDataFreshness({
  lastUpdated,
  onRefresh,
  loading = false,
  className = '',
}: SDataFreshnessProps) {
  // Parsing date string safely
  const formattedTime = (() => {
    if (!lastUpdated) return 'Telemetry core uninitialized';
    try {
      const date = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
      if (isNaN(date.getTime())) return String(lastUpdated);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return String(lastUpdated);
    }
  })();

  return (
    <div 
      className={`
        inline-flex items-center gap-3.5 px-3.5 py-2 rounded-lg border border-white/5 bg-black/40 text-[10px] font-mono text-white/50 select-none
        ${className}
      `}
    >
      <div className="flex items-center gap-1.5 leading-none">
        <Database className={`w-3.5 h-3.5 ${loading ? 'text-cyan-400' : 'text-white/30'}`} />
        <span>SYNC STATUS: <span className="text-white/80 font-bold">{loading ? 'ACQUIRING...' : 'ONLINE'}</span></span>
      </div>

      <div className="w-px h-3 bg-white/10" />

      <div className="leading-none">
        LATEST CYCLE: <span className="text-white/80 font-bold">{formattedTime}</span>
      </div>

      {onRefresh && (
        <>
          <div className="w-px h-3 bg-white/10" />
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-cyan-400 hover:text-cyan-300 disabled:opacity-35 disabled:text-white/30 transition-all focus:outline-none flex items-center justify-center p-0.5 cursor-pointer rounded hover:bg-white/5"
            title="Refresh diagnostics metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </>
      )}
    </div>
  );
}
