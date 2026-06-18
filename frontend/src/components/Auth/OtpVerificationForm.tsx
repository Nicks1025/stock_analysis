/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Timer, Phone, ShieldCheck, RefreshCw } from 'lucide-react';
import { SButton } from '../common/SButton';
import { useSnackbar } from '../common/SnackbarProvider';

interface OtpVerificationFormProps {
  userId: string;
  phoneOrEmail: string;
  onSuccess: (otp: string) => void;
  onBack: () => void;
  loading?: boolean;
}

export function OtpVerificationForm({
  userId,
  phoneOrEmail,
  onSuccess,
  onBack,
  loading = false,
}: OtpVerificationFormProps) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60s countdown
  const { enqueueSnackbar } = useSnackbar();

  // Timer Countdown Effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      enqueueSnackbar('Verification token must be 6 digits', { variant: 'error' });
      return;
    }
    // Fire callback success state
    onSuccess(otp);
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    
    // Simulate API delay resending MFA
    setTimeLeft(60);
    enqueueSnackbar('Cryptographic 6-digit OTP code has been re-dispatched cleanly.', { variant: 'success' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-center font-mono">
      <div>
        <h2 className="text-base font-black text-white tracking-wide uppercase">Identity Challenge</h2>
        <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
          Provide the 6-digit authorization token sent to <span className="text-cyan-400 font-bold">{phoneOrEmail}</span>
        </p>
      </div>

      {/* Cryptographic digits blocks entry layout */}
      <div className="space-y-1.5 text-xs text-left">
        <label className="text-white/40 font-mono text-[9px] uppercase tracking-widest text-center block w-full">
          6-DIGIT VERIFICATION ID
        </label>
        
        <input 
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          required
          autoFocus
          className="w-full tracking-[1.2em] text-center bg-black/65 border border-white/10 rounded py-3 text-xl font-bold text-cyan-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,242,255,0.12)] transition-all font-mono"
          placeholder="000000"
        />
      </div>

      <SButton
        type="submit"
        label="Confirm Credentials Token"
        variant="primary"
        loading={loading}
        className="w-full text-[11px]"
      />

      <div className="flex items-center justify-between text-[11px] text-white/40 border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5">
          <Timer className={`w-3.5 h-3.5 ${timeLeft > 0 ? 'text-cyan-400 animate-pulse' : 'text-white/20'}`} />
          {timeLeft > 0 ? (
            <span>EXPIRY: {timeLeft}s</span>
          ) : (
            <span className="text-red-400 font-bold">EXPIRED</span>
          )}
        </div>

        <button
          type="button"
          disabled={timeLeft > 0}
          onClick={handleResend}
          className={`flex items-center gap-1 cursor-pointer transition-colors font-semibold ${timeLeft > 0 ? 'opacity-35 pointer-events-none' : 'text-cyan-400 hover:text-cyan-300'}`}
        >
          <RefreshCw className="w-3.5 h-3.5" /> RESEND
        </button>
      </div>

      <button 
        type="button" 
        onClick={onBack} 
        className="w-full text-[11px] text-white/30 hover:text-white cursor-pointer"
      >
        ← Return to details
      </button>
    </form>
  );
}
