/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

export interface CountryItem {
  code: string;
  dial_code: string;
  flag: string;
  name: string;
}

const defaultCountries: CountryItem[] = [
  { code: 'IN', dial_code: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'US', dial_code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial_code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'AE', dial_code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: 'SG', dial_code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'CA', dial_code: '+1', flag: '🇨🇦', name: 'Canada' },
];

interface SPhoneNumberProps {
  label: string;
  countries?: CountryItem[];
  required?: boolean;
  rules?: Array<(value: any) => true | string>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

export function SPhoneNumber({
  label,
  countries = defaultCountries,
  required = false,
  rules = [],
  value = '',
  onChange,
  error: manualError,
  className = '',
}: SPhoneNumberProps) {
  // Parse initial value into country dial code + remainder
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(countries[0]);
  const [phoneNum, setPhoneNum] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      // Find matching country
      const matched = countries.find((c) => value.startsWith(c.dial_code));
      if (matched) {
        setSelectedCountry(matched);
        setPhoneNum(value.replace(matched.dial_code, '').trim());
      } else {
        setPhoneNum(value);
      }
    }
  }, [value, countries]);

  const validate = (fullVal: string) => {
    if (required && !fullVal.replace(selectedCountry.dial_code, '').trim()) {
      setLocalError(`${label} is required`);
      return false;
    }
    for (const rule of rules) {
      const result = rule(fullVal);
      if (result !== true) {
        setLocalError(result);
        return false;
      }
    }
    
    // Custom phone validation parameters
    const codeLess = fullVal.replace(selectedCountry.dial_code, '').trim();
    if (codeLess && (codeLess.length < 7 || codeLess.length > 15)) {
      setLocalError('Enter a valid phone length (7-15 digits)');
      return false;
    }

    setLocalError(null);
    return true;
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const matched = countries.find((c) => c.code === e.target.value);
    if (matched) {
      setSelectedCountry(matched);
      const updatedFullValue = `${matched.dial_code}${phoneNum}`;
      if (onChange) {
        onChange(updatedFullValue);
      }
      if (localError) {
        validate(updatedFullValue);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setPhoneNum(digitsOnly);
    
    const updatedFullValue = `${selectedCountry.dial_code}${digitsOnly}`;
    if (onChange) {
      onChange(updatedFullValue);
    }
    
    if (localError) {
      validate(updatedFullValue);
    }
  };

  const handleBlur = () => {
    const fullVal = `${selectedCountry.dial_code}${phoneNum}`;
    validate(fullVal);
  };

  const activeError = manualError || localError;

  return (
    <div className={`space-y-1.5 text-left w-full ${className}`}>
      <label className="text-white/60 font-mono text-[10px] uppercase tracking-wider block">
        {label} {required && <span className="text-red-400 font-bold">*</span>}
      </label>

      <div className="flex gap-2">
        {/* Left: Flag / Dial Code option selector */}
        <div className="relative shrink-0 w-24">
          <select
            value={selectedCountry.code}
            onChange={handleCountryChange}
            className={`
              w-full bg-black/60 border rounded text-white focus:outline-none transition-colors font-mono py-2.5 pl-3 pr-6 text-xs appearance-none cursor-pointer
              ${activeError ? 'border-red-500/60' : 'border-white/10 focus:border-cyan-400'}
            `}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#0c0c16] text-white">
                {c.flag} {c.dial_code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-white/40">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Right: Actual digit characters text field */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="tel"
            value={phoneNum}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            placeholder="98765 43210"
            className={`
              w-full bg-black/60 border rounded text-white focus:outline-none transition-colors font-mono py-2.5 pl-10 pr-4 text-xs
              ${activeError 
                ? 'border-red-500/60 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.1)]' 
                : 'border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,242,255,0.05)]'
              }
            `}
          />
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
