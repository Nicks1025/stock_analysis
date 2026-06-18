/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SAlertProps {
  severity?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export function SAlert({
  severity = 'info',
  message,
  onClose,
  className = '',
}: SAlertProps) {
  const getStyles = () => {
    switch (severity) {
      case 'success':
        return {
          bg: 'bg-emerald-950/15 border-emerald-500/20 text-emerald-200',
          icon: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-red-950/15 border-red-500/20 text-red-200',
          icon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/15 border-amber-500/20 text-amber-200',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-cyan-950/15 border-cyan-500/20 text-cyan-200',
          icon: <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        };
    }
  };

  const styles = getStyles();

  return (
    <div 
      className={`
        p-3 rounded border font-mono text-xs flex items-start gap-2.5 relative overflow-hidden transition-all duration-300
        ${styles.bg}
        ${className}
      `}
    >
      {styles.icon}
      
      <div className="flex-1 text-left">
        {message}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors cursor-pointer shrink-0 ml-1 scale-90"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
