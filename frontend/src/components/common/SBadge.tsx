/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SBadgeProps {
  color?: 'cyan' | 'emerald' | 'red' | 'amber' | 'gray';
  content?: string | number;
  children?: React.ReactNode;
  className?: string;
}

export function SBadge({
  color = 'cyan',
  content,
  children,
  className = '',
}: SBadgeProps) {
  const bgColors = {
    cyan: 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(0,242,255,0.4)]',
    emerald: 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    red: 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    amber: 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.4)]',
    gray: 'bg-white/20 text-white',
  };

  const badgeContent = content !== undefined ? String(content) : '';

  if (!children) {
    return (
      <span
        className={`
          inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-mono font-black scale-90 tracking-wider uppercase
          ${bgColors[color]}
          ${className}
        `}
      >
        {badgeContent}
      </span>
    );
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {badgeContent && (
        <span
          className={`
            absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[8px] font-mono font-black tracking-normal flex items-center justify-center border border-[#050508] transform translate-x-1/4 -translate-y-1/4 select-none
            ${bgColors[color]}
          `}
        >
          {badgeContent}
        </span>
      )}
    </div>
  );
}
