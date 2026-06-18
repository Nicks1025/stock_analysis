/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Chrome } from 'lucide-react';
import { SButton } from '../common/SButton';

interface GoogleLoginButtonProps {
  onSuccess: (idToken: string) => void;
  loading?: boolean;
}

export function GoogleLoginButton({ onSuccess, loading = false }: GoogleLoginButtonProps) {
  const handleGoogleClick = () => {
    // Mimic triggering Google One Tap or standard OAuth pop-up workflow
    // Return a hypothetical token for the client session
    const mockIdToken = 'google-id-token-jwt-credential-' + Math.random().toString(36).substring(7);
    onSuccess(mockIdToken);
  };

  return (
    <SButton
      label="Use Google Credential"
      variant="outline"
      loading={loading}
      icon={<Chrome className="w-4.5 h-4.5 text-cyan-400" />}
      onClick={handleGoogleClick}
      className="w-full font-mono text-[11px]"
    />
  );
}
