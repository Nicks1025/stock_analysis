/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu } from 'lucide-react';

interface SLoaderProps {
  fullscreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

export function SLoader({
  fullscreen = false,
  size = 'medium',
  label = 'Reading telemetry core...',
}: SLoaderProps) {
  const sizeClasses = {
    small: 'w-5 h-5 text-cyan-400',
    medium: 'w-10 h-10 text-cyan-400',
    large: 'w-16 h-16 text-cyan-400',
  };

  const containerClass = fullscreen 
    ? 'fixed inset-0 z-50 bg-[#050508]/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4' 
    : 'py-12 flex flex-col items-center justify-center space-y-3 w-full';

  return (
    <div className={containerClass}>
      <div className="relative flex items-center justify-center">
        {/* Animated outer cyber-ring */}
        <div 
          className={`
            border-2 border-cyan-500/10 border-t-cyan-400 rounded-full animate-spin
            ${size === 'small' ? 'w-8 h-8' : size === 'medium' ? 'w-16 h-16' : 'w-24 h-24'}
          `} 
        />
        
        {/* Centered microchip diagnostic icon */}
        <div className="absolute">
          <Cpu className={`animate-pulse ${sizeClasses[size]}`} />
        </div>
      </div>

      {label && (
        <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase animate-pulse select-none">
          {label}
        </span>
      )}
    </div>
  );
}
