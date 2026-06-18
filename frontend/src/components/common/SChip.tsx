/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';

interface SChipProps {
  label: string;
  color?: 'default' | 'success' | 'error' | 'warning' | 'info';
  variant?: 'filled' | 'outline';
  icon?: React.ReactNode;
  onDelete?: () => void;
  className?: string;
}

export function SChip({
  label,
  color = 'default',
  variant = 'filled',
  icon,
  onDelete,
  className = '',
}: SChipProps) {
  // Styles based on color mappings
  const themeColors = {
    default: {
      filled: 'bg-white/10 text-white/80 border border-transparent',
      outline: 'bg-transparent border border-white/20 text-white/70',
    },
    success: {
      filled: 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.05)]',
      outline: 'bg-transparent border border-emerald-500/30 text-emerald-300',
    },
    error: {
      filled: 'bg-red-950/40 text-red-300 border border-red-500/10 shadow-[0_0_8px_rgba(239,68,68,0.05)]',
      outline: 'bg-transparent border border-red-500/30 text-red-300',
    },
    warning: {
      filled: 'bg-amber-950/40 text-amber-300 border border-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.05)]',
      outline: 'bg-transparent border border-amber-500/30 text-amber-300',
    },
    info: {
      filled: 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.05)]',
      outline: 'bg-transparent border border-cyan-500/30 text-cyan-300',
    },
  };

  const style = themeColors[color][variant];

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold select-none
        ${style}
        ${className}
      `}
    >
      {icon && <span className="scale-75 shrink-0">{icon}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="hover:text-white transition-colors cursor-pointer shrink-0 ml-0.5 scale-90"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
