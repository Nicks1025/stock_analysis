/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type SnackbarVariant = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarMessage {
  id: string;
  message: string;
  variant: SnackbarVariant;
}

interface SnackbarContextType {
  enqueueSnackbar: (message: string, options?: { variant?: SnackbarVariant }) => void;
  closeSnackbar: (id: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({ children }: ProviderProps) {
  const [toasts, setToasts] = useState<SnackbarMessage[]>([]);

  const closeSnackbar = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const enqueueSnackbar = useCallback((message: string, options?: { variant?: SnackbarVariant }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const variant = options?.variant || 'info';
    
    setToasts((prev) => [...prev, { id, message, variant }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      closeSnackbar(id);
    }, 4000);
  }, [closeSnackbar]);

  const getVariantStyles = (variant: SnackbarVariant) => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-[rgba(6,28,18,0.92)]',
          border: 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
          text: 'text-emerald-300',
          icon: <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-[rgba(28,6,6,0.92)]',
          border: 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
          text: 'text-red-300',
          icon: <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-[rgba(28,21,6,0.92)]',
          border: 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
          text: 'text-amber-300',
          icon: <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-[rgba(6,18,28,0.92)]',
          border: 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
          text: 'text-cyan-300',
          icon: <Info className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
        };
    }
  };

  return (
    <SnackbarContext.Provider value={{ enqueueSnackbar, closeSnackbar }}>
      {children}
      
      {/* Toast Portal Container Viewport Layer */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const styles = getVariantStyles(toast.variant);
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded border ${styles.bg} ${styles.border} transition-all duration-300 animate-[slideIn_0.25s_ease-out]`}
            >
              {styles.icon}
              <div className="flex-1 text-xs font-sans font-medium text-white/90 leading-relaxed text-left">
                {toast.message}
              </div>
              <button
                onClick={() => closeSnackbar(toast.id)}
                className="text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </SnackbarContext.Provider>
  );
}
