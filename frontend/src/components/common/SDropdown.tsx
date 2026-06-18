/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { SelectHTMLAttributes, useState, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface SDropdownProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange' | 'value'> {
  label: string;
  options: DropdownOption[];
  required?: boolean;
  rules?: Array<(value: any) => true | string>;
  size?: 'small' | 'medium' | 'large';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function SDropdown({
  label,
  options,
  required = false,
  rules = [],
  size = 'medium',
  value = '',
  onChange,
  error: manualError,
  className = '',
  onBlur,
  ...props
}: SDropdownProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const validate = (val: string) => {
    if (required && !val) {
      setLocalError(`${label} is required`);
      return false;
    }
    for (const rule of rules) {
      const result = rule(val);
      if (result !== true) {
        setLocalError(result);
        return false;
      }
    }
    setLocalError(null);
    return true;
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) {
      onChange(val);
    }
    if (localError) {
      validate(val);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    validate(internalValue);
    if (onBlur) {
      onBlur(e);
    }
  };

  const activeError = manualError || localError;

  const sizeStyles = {
    small: 'py-1.5 px-3 text-[11px]',
    medium: 'py-2.5 px-4 text-xs',
    large: 'py-3.5 px-5 text-sm',
  };

  return (
    <div className={`space-y-1.5 text-left w-full ${className}`}>
      <label className="text-white/60 font-mono text-[10px] uppercase tracking-wider block">
        {label} {required && <span className="text-red-400 font-bold">*</span>}
      </label>

      <div className="relative">
        <select
          value={internalValue}
          onChange={handleSelectChange}
          onBlur={handleBlur}
          className={`
            w-full bg-black/60 border rounded text-white focus:outline-none transition-colors font-mono appearance-none cursor-pointer
            ${sizeStyles[size]}
            ${activeError 
              ? 'border-red-500/60 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.1)]' 
              : 'border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,242,255,0.05)]'
            }
          `}
          {...props}
        >
          <option value="" disabled className="bg-[#0c0c16] text-white/40">Select option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0c0c16] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom arrow indicator */}
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-white/40">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {activeError && (
        <span className="text-[10px] text-red-400 font-mono block animate-[slideIn_0.15s_ease-out]">
          {activeError}
        </span>
      )}
    </div>
  );
}
