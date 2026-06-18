/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { KeyRound, ShieldAlert, ArrowLeft, Terminal } from 'lucide-react';
import { STextField } from '../common/STextField';
import { SButton } from '../common/SButton';
import { rules } from '../../utils/rules';
import { useSnackbar } from '../common/SnackbarProvider';

interface ResetPasswordFormProps {
  onBackToLogin: () => void;
  onSubmitSuccess: () => void;
  token?: string;
  loading?: boolean;
}

export function ResetPasswordForm({
  onBackToLogin,
  onSubmitSuccess,
  token: initialToken = '',
  loading = false,
}: ResetPasswordFormProps) {
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict validations
    if (!token) {
      enqueueSnackbar('Token identifier is required', { variant: 'error' });
      return;
    }

    const passwordError = rules.password()(password);
    if (passwordError !== true) {
      enqueueSnackbar(passwordError, { variant: 'error' });
      return;
    }

    const confirmCheck = rules.confirmPassword(password)(confirmPassword);
    if (confirmCheck !== true) {
      enqueueSnackbar(confirmCheck, { variant: 'error' });
      return;
    }

    setLocalLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      enqueueSnackbar('Secure access password updated successfully.', { variant: 'success' });
      onSubmitSuccess();
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Password update cycle failure.', { variant: 'error' });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetSubmit} className="space-y-4 text-left">
      <div className="text-center mb-5">
        <h2 className="text-base font-black text-white tracking-wide uppercase">Configure New Phrase</h2>
        <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
          Provide your cryptographic token and define a highly secure new access signature
        </p>
      </div>

      <STextField
        label="Cryptographic Security Token"
        type="text"
        value={token}
        onChange={setToken}
        required
        placeholder="ST-928421"
        icon={<Terminal className="w-4 h-4" />}
        rules={[rules.required('Token')]}
      />

      <STextField
        label="New Access Key Phrase"
        type="password"
        value={password}
        onChange={setPassword}
        required
        placeholder="••••••••••••"
        icon={<KeyRound className="w-4 h-4" />}
        rules={[rules.password()]}
      />

      <STextField
        label="Verify New Access Key"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        required
        placeholder="••••••••••••"
        icon={<KeyRound className="w-4 h-4" />}
        rules={[rules.confirmPassword(password)]}
      />

      <SButton
        type="submit"
        label="Update Security Core"
        variant="primary"
        loading={loading || localLoading}
        className="w-full text-[11px]"
      />

      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full text-[11px] text-center text-white/40 hover:text-white mt-1 cursor-pointer font-mono hover:underline flex items-center justify-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Terminal
      </button>
    </form>
  );
}
