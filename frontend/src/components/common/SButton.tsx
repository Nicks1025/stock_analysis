/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface SButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}

export function SButton({
  label,
  variant = 'primary',
  loading = false,
  size = 'medium',
  icon,
  className = '',
  disabled,
  ...props
}: SButtonProps) {
  // Styles base
  const baseStyle = 'inline-flex items-center justify-center font-semibold font-mono tracking-wider transition-all duration-200 uppercase rounded cursor-pointer select-none';

  // Size variations
  const sizeStyles = {
    small: 'text-[10px] px-3.5 py-1.5 gap-1.5',
    medium: 'text-xs px-5 py-2.5 gap-2',
    large: 'text-sm px-6 py-3.5 gap-2.5',
  };

  // Variant variations matching the theme
  const variantStyles = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,242,255,0.2)] disabled:bg-cyan-950 disabled:text-white/30 disabled:shadow-none border border-transparent',
    secondary: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.2)] disabled:bg-emerald-950 disabled:text-white/30 disabled:shadow-none border border-transparent',
    outline: 'bg-transparent border border-white/20 text-white/80 hover:text-white hover:bg-white/5 hover:border-white/40 disabled:border-white/5 disabled:text-white/20',
    ghost: 'bg-transparent text-white/60 hover:text-white hover:bg-white/5 disabled:text-white/20',
    danger: 'bg-red-500 hover:bg-red-400 text-white shadow-[0_0_12px_rgba(239,68,68,0.2)] disabled:bg-red-950/20 disabled:text-white/20 border border-transparent',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {!loading && icon}
      <span>{label}</span>
    </button>
  );
}
