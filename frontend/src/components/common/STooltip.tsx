/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from 'react';

interface STooltipProps {
  title: string | ReactNode;
  children: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function STooltip({
  title,
  children,
  placement = 'top',
  className = '',
}: STooltipProps) {
  const placements = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPlacements = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[rgba(10,10,22,0.95)]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[rgba(10,10,22,0.95)]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[rgba(10,10,22,0.95)]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[rgba(10,10,22,0.95)]',
  };

  return (
    <div className={`relative inline-block group ${className}`}>
      {children}
      
      {/* Tooltip Content Body Layer */}
      <div
        className={`
          absolute z-50 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 pointer-events-none transition-all duration-150 ease-out delay-100
          ${placements[placement]}
        `}
      >
        <div className="bg-[rgba(10,10,22,0.95)] border border-white/10 rounded px-2.5 py-1.5 text-[10px] font-mono text-white/95 uppercase tracking-wider relative whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          {title}
          
          {/* Micro triangular pointer/arrow layout */}
          <div 
            className={`
              absolute w-0 h-0 border-4 border-transparent
              ${arrowPlacements[placement]}
            `} 
          />
        </div>
      </div>
    </div>
  );
}
