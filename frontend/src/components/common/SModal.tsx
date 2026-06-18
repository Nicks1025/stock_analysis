/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, ReactNode } from 'react';
import { X, Cpu } from 'lucide-react';

interface SModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function SModal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md',
}: SModalProps) {
  // Disable body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop blur layer */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" 
      />

      {/* Main glass dialog wrapper */}
      <div 
        className={`
          w-full ${maxWidthStyles[maxWidth]} glass-panel relative rounded-lg overflow-hidden border border-[rgba(100,100,255,0.18)] bg-[rgba(10,10,22,0.92)] shadow-[0_12px_50px_rgba(0,0,0,0.85)] flex flex-col z-10 animate-[zoomIn_0.22s_ease-out] max-h-[90vh]
        `}
      >
        <div className="absolute top-0 left-0 w-full scan-line pointer-events-none" />

        {/* Modal Header Panel */}
        <header className="px-6 py-4.5 border-b border-white/5 flex items-center justify-between bg-white/[0.005]">
          <div className="flex items-center gap-2.5 text-left">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              {title}
            </h3>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-white/55 hover:text-white transition-all flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Modal body container (Scrollable list if long) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {children}
        </div>

        {/* Footer pane with operation buttons */}
        {actions && (
          <footer className="px-6 py-4 border-t border-white/5 bg-black/40 flex justify-end gap-3.5">
            {actions}
          </footer>
        )}
      </div>
    </div>
  );
}
