/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { InputHTMLAttributes, useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';

interface SDatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label: string;
  required?: boolean;
  rules?: Array<(value: any) => true | string>;
  minDate?: string;
  maxDate?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function SDatePicker({
  label,
  required = false,
  rules = [],
  minDate,
  maxDate,
  value = '',
  onChange,
  error: manualError,
  className = '',
  onBlur,
  ...props
}: SDatePickerProps) {
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) {
      onChange(val);
    }
    if (localError) {
      validate(val);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validate(internalValue);
    if (onBlur) {
      onBlur(e);
    }
  };

  const activeError = manualError || localError;

  return (
    <div className={`space-y-1.5 text-left w-full ${className}`}>
      <label className="text-white/60 font-mono text-[10px] uppercase tracking-wider block">
        {label} {required && <span className="text-red-400 font-bold">*</span>}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
          <CalendarDays className="w-4 h-4" />
        </div>
        
        <input
          type="date"
          value={internalValue}
          min={minDate}
          max={maxDate}
          onChange={handleDateChange}
          onBlur={handleBlur}
          className={`
            w-full bg-black/60 border rounded text-white focus:outline-none transition-colors font-mono py-2.5 pl-10 pr-4 text-xs
            [color-scheme:dark]
            ${activeError 
              ? 'border-red-500/60 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.1)]' 
              : 'border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,242,255,0.05)]'
            }
          `}
          {...props}
        />
      </div>

      {activeError && (
        <span className="text-[10px] text-red-400 font-mono block animate-[slideIn_0.15s_ease-out]">
          {activeError}
        </span>
      )}
    </div>
  );
}
