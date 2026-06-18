/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Terminal } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error('Uncaught Exception Boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050508] text-[#e0e0ff] font-mono flex items-center justify-center p-4 md:p-6 select-none relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c16_1px,transparent_1px),linear-gradient(to_bottom,#0c0c16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Core Diagnostic Glass Panel */}
          <div className="w-full max-w-xl glass-panel relative rounded-lg overflow-hidden border border-red-500/20 bg-[rgba(10,10,22,0.92)] shadow-[0_12px_45px_rgba(0,0,0,0.8)] flex flex-col z-10 p-6 md:p-8 space-y-6">
            <div className="absolute top-0 left-0 w-full scan-line pointer-events-none bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
            
            <div className="flex items-center gap-3.5 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded bg-red-500/10 border border-red-500/35 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-red-500">System Core Fault</span>
                <h1 className="text-sm font-black tracking-widest text-white uppercase">Fatal Exception Captured</h1>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                A critical runtime rendering mismatch triggered a crash event. The secure kernel preserved memory space and locked session variables successfully.
              </p>

              {/* Error Stack Information Block */}
              <div className="p-4 bg-black/60 rounded border border-red-500/10 text-[11px] leading-relaxed text-red-200/90 font-mono space-y-1.5 overflow-x-auto max-h-48 custom-scrollbar">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[10px] uppercase font-bold text-red-400">Core Diagnostic Stack</span>
                </div>
                <p className="font-bold text-white">Error: {this.state.error?.message || 'Unknown Runtime Stack Error'}</p>
                {this.state.error?.stack && (
                  <pre className="text-[10px] text-red-200/60 leading-normal font-mono whitespace-pre-wrap font-light">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-200 font-bold text-[11px] uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Force Boot Kernel (Recover)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
