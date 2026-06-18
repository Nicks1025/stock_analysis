/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { STextField } from '../common/STextField';
import { SButton } from '../common/SButton';
import { rules } from '../../utils/rules';
import { useSnackbar } from '../common/SnackbarProvider';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onSubmitSuccess: (email: string) => void;
  loading?: boolean;
}

export function ForgotPasswordForm({
  onBackToLogin,
  onSubmitSuccess,
  loading = false,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const emailError = rules.email()(email);
    if (emailError !== true) {
      enqueueSnackbar(emailError, { variant: 'error' });
      return;
    }

    setLocalLoading(true);
    try {
      // Simulate API call delay sending password reset link
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSubmitted(true);
      enqueueSnackbar('Cryptographic reset link dispatched successfully.', { variant: 'success' });
      onSubmitSuccess(email);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to dispatch reset key.', { variant: 'error' });
    } finally {
      setLocalLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-5 text-center font-mono">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Instructions Dispatched</h3>
          <p className="text-[11px] text-white/50 leading-relaxed mt-1 p-2 bg-black/40 border border-white/5 rounded">
            Check <span className="text-cyan-300 font-bold underline">{email}</span> for secure access tokens and instructions to reset access phrase.
          </p>
        </div>
        <SButton
          label="Back to Terminal"
          onClick={onBackToLogin}
          variant="outline"
          className="w-full text-xs mt-2"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-left">
      <div className="text-center mb-5">
        <h2 className="text-base font-black text-white tracking-wide uppercase">Reset Session Access</h2>
        <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
          Provide your verification email to obtain a security reset token signature
        </p>
      </div>

      <STextField
        label="Operator Security Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
        placeholder="operator@stocksense.ai"
        icon={<Mail className="w-4 h-4" />}
        rules={[rules.email()]}
      />

      <SButton
        type="submit"
        label="Dispatch Reset Phrase"
        variant="primary"
        loading={loading || localLoading}
        className="w-full text-[11px]"
      />

      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full text-[11px] text-center text-white/40 hover:text-white mt-1 cursor-pointer font-mono hover:underline flex items-center justify-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
      </button>
    </form>
  );
}
