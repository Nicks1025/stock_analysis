/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  elevation?: number;
  noPadding?: boolean;
  className?: string;
}

export function SCard({
  title,
  subtitle,
  action,
  children,
  elevation = 1,
  noPadding = false,
  className = '',
}: SCardProps) {
  // Elevating card styles based on indices level
  const shadowStyles = [
    'shadow-[0_4px_12px_rgba(0,0,0,0.4)]',
    'shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-[rgba(100,100,255,0.12)]',
    'shadow-[0_12px_45px_rgba(0,0,0,0.73)] border border-[rgba(100,100,255,0.22)]',
  ];

  const shadowClass = shadowStyles[Math.min(elevation, shadowStyles.length - 1)];

  return (
    <div 
      className={`
        glass-panel rounded-lg bg-[rgba(10,10,22,0.8)] relative overflow-hidden transition-all duration-300
        ${shadowClass}
        ${className}
      `}
    >
      {/* Absolute top scanline overlay */}
      <div className="absolute top-0 left-0 w-full scan-line pointer-events-none opacity-50 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />

      {/* Card Header Layer */}
      {(title || subtitle || action) && (
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between gap-4 bg-white/[0.005]">
          <div className="space-y-0.5 text-left">
            {title && (
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="text-[10px] text-white/40 font-mono scale-95 origin-left">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {/* Main Content Pane */}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  );
}
