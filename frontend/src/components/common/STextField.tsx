/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { InputHTMLAttributes, useState, useEffect, useRef } from 'react';
import { debounce } from '../../utils/debounce';

interface STextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label: string;
  size?: 'small' | 'medium' | 'large';
  required?: boolean;
  rules?: Array<(value: any) => true | string>;
  debounceMs?: number;
  onSearch?: (value: string) => void;
  error?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
}

export function STextField({
  label,
  size = 'medium',
  required = false,
  rules = [],
  debounceMs,
  onSearch,
  error: manualError,
  onChange,
  value = '',
  icon,
  className = '',
  onBlur,
  ...props
}: STextFieldProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Create a ref for onSearch to avoid recreate debounce on each render
  const debouncedSearchRef = useRef<((val: string) => void) | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (onSearch && debounceMs) {
      debouncedSearchRef.current = debounce((val: string) => {
        onSearch(val);
      }, debounceMs);
    } else if (onSearch) {
      debouncedSearchRef.current = onSearch;
    }
  }, [onSearch, debounceMs]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    
    if (onChange) {
      onChange(val);
    }

    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(val);
    }

    if (localError) {
      // Re-validate instantly if there's an active error
      validate(val);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validate(internalValue as string);
    if (onBlur) {
      onBlur(e);
    }
  };

  const activeError = manualError || localError;

  // Sizes conversion to class styles
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
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
            {icon}
          </div>
        )}
        
        <input
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`
            w-full bg-black/60 border rounded text-white focus:outline-none transition-colors font-mono
            ${icon ? 'pl-10' : ''}
            ${sizeStyles[size]}
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
