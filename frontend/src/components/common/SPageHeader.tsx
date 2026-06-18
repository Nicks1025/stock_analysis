/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function SPageHeader({
  title,
  subtitle,
  actions,
  className = '',
}: SPageHeaderProps) {
  return (
    <div 
      className={`
        relative pb-4 border-b border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none
        ${className}
      `}
    >
      {/* Decorative cyber horizontal track line */}
      <div className="absolute bottom-0 left-0 w-32 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent" />

      <div className="space-y-1 text-left">
        <h1 className="text-sm font-black tracking-[0.2em] text-white uppercase flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[10px] text-white/40 font-mono tracking-wider">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 self-start md:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}
