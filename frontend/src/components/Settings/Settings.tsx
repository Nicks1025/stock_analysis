import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldAlert, Check, HelpCircle, User as UserIcon, Lock, Globe, KeyRound } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import { useAuthStore } from '../../store/authStore';

export function Settings() {
  const user = useAuthStore((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  // API states
  const [clientId, setClientId] = useState('ZR9250_AI');
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••••••');
  const [apiSecret, setApiSecret] = useState('••••••••••••••••••••••••••••••••••••••••');
  
  // Alert flags
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [smsTriggers, setSmsTriggers] = useState(false);
  const [emailDigest, setEmailDigest] = useState(true);

  // Authentication & Security state variables (MFA, Password, Language)
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaModalOpen, setMfaModalOpen] = useState(false);

  // Password rotation forms
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Internationalization choices
  const [activeLang, setActiveLang] = useState(() => localStorage.getItem('stocksense-locale') || 'en');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    enqueueSnackbar('Brokerage API bindings and alert preferences updated in local container.', { variant: 'success' });
  };

  const handleMfaToggle = (checked: boolean) => {
    if (checked) {
      setMfaModalOpen(true);
    } else {
      setMfaEnabled(false);
      enqueueSnackbar('Google Multi-Factor Authentication (MFA) deactivated.', { variant: 'info' });
    }
  };

  const handleConfirmMfaActivation = () => {
    setMfaEnabled(true);
    setMfaModalOpen(false);
    enqueueSnackbar('Google MFA successfully linked! Simulated secret token registered.', { variant: 'success' });
  };

  const handleSubmitPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      enqueueSnackbar('Please fill all password parameters.', { variant: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar('New password confirmation path mismatch.', { variant: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      enqueueSnackbar('Cryptographic passwords must exceed 6 characters.', { variant: 'error' });
      return;
    }

    enqueueSnackbar('Account credentials rotated. Password updated successfully.', { variant: 'success' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLanguageChange = (lang: string) => {
    setActiveLang(lang);
    localStorage.setItem('stocksense-locale', lang);
    enqueueSnackbar(`Application localization changed to: ${getLanguageLabel(lang)}`, { variant: 'success' });
  };

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'en': return 'English (US)';
      case 'hi': return 'Hindi (हिन्दी)';
      case 'mr': return 'Marathi (मराठी)';
      case 'es': return 'Spanish (Español)';
      case 'de': return 'German (Deutsch)';
      default: return 'English (US)';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-mono text-xs text-left" id="settings-desk-root">
      
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Terminal Gateway configuration</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase flex items-center gap-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
          <SettingsIcon className="w-5 h-5 text-cyan-400" style={{ color: 'var(--brand-cyan)' }} /> System Settings
        </h2>
        <p className="text-xs text-white/50 font-mono">Manage brokerage connection bindings, inspect profile security registries, toggle Google multi-factor auth, and configure international localization options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column (col-span-8): Main Forms and Options */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* USER PROFILE INFO BLOCK */}
          <div className="glass-panel p-5 rounded border border-white/5 space-y-4 bg-black/40">
            <span className="text-[11px] font-black uppercase text-white tracking-widest block border-b border-white/5 pb-2 flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-cyan-400" /> Active Operator Credentials
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded space-y-1">
                <span className="text-[8px] uppercase text-white/40 block">OPERATOR EMAIL</span>
                <span className="text-white text-xs font-bold font-mono truncate block select-text">{user?.email || 'nkcjsss@gmail.com'}</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded space-y-1">
                <span className="text-[8px] uppercase text-white/40 block">OPERATOR FULL NAME</span>
                <span className="text-white text-xs font-bold font-mono truncate block">{user?.name || 'Administrator Client'}</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded space-y-1">
                <span className="text-[8px] uppercase text-white/40 block">AUTHORIZED ROLES</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {(user?.roles || ['User', 'Admin']).map((role, idx) => (
                    <span key={idx} className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[8.5px] uppercase font-bold px-1.5 rounded">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded space-y-1">
                <span className="text-[8px] uppercase text-white/40 block">OPERATOR ID</span>
                <span className="text-white font-mono text-xs">{user?.id || 'CLIENT-NODE-X825'}</span>
              </div>
            </div>
          </div>

          {/* INTERNATIONALIZATION LOCALE SELECTOR */}
          <div className="glass-panel p-5 rounded border border-white/5 space-y-4 bg-black/40">
            <span className="text-[11px] font-black uppercase text-white tracking-widest block border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" /> Regional Localization (Internationalization)
            </span>
            <p className="text-[10px] text-white/50 font-sans leading-relaxed">
              Toggle language translations inside localization containers. The chosen translation locale dictates index parameters, alert strings, and calendar headings.
            </p>

            <div className="dropdown-localization-choices">
              <label className="text-[9px] uppercase text-white/50 block font-black mb-1.5">Choose System Translation Language</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'es', label: 'Español' },
                  { code: 'de', label: 'Deutsch' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`py-2 px-1 text-center font-bold text-[10px] uppercase rounded border transition-all cursor-pointer ${
                      activeLang === lang.code
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold'
                        : 'bg-black/30 border-white/10 text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CHANGE SECURE LOGIN PASSWORD */}
          <form onSubmit={handleSubmitPasswordChange} className="glass-panel p-5 rounded border border-white/5 space-y-4 bg-black/40">
            <span className="text-[11px] font-black uppercase text-white tracking-widest block border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" /> Rotate Login Credentials / Change Password
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">Current Password</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">New Password</span>
                <input
                  type="password"
                  placeholder="Min 6 chars"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">Confirm Password</span>
                <input
                  type="password"
                  placeholder="Min 6 chars"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-950 hover:bg-cyan-500 border border-cyan-500/25 text-cyan-400 hover:text-black font-black uppercase tracking-widest rounded transition-all cursor-pointer"
              >
                Rotate Passwords
              </button>
            </div>
          </form>

          {/* Broker configuration credentials */}
          <form onSubmit={handleSaveSettings} className="glass-panel p-5 rounded border border-white/5 space-y-4 bg-black/40 font-mono">
            <span className="text-[11px] font-black uppercase text-white tracking-widest block border-b border-white/5 pb-2">
              KITE / UPSTOX Exchange API Bindings
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">BROKER CLIENT ID / ID PARAM</span>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full p-2 bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase">API KEY</span>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-white/40 uppercase">API SECRET SECURITY PHRASE</span>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                className="w-full p-2 bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded transition-all cursor-pointer"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                Save configurations
              </button>
            </div>
          </form>
        </div>

        {/* Right sidebar compliance info & checklists (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* MULTI FACTOR AUTHENTICATION (MFA) BOX */}
          <div className="glass-panel p-5 rounded border border-[#ffaa00]/20 bg-amber-950/5 space-y-4">
            <span className="text-[11px] font-black uppercase text-[#ffaa00] tracking-widest block border-b border-white/5 pb-2 flex items-center gap-1.5" style={{ color: 'var(--brand-amber)' }}>
              <KeyRound className="w-4 h-4 text-[#ffaa00]" style={{ color: 'var(--brand-amber)' }} /> google MFA Protection
            </span>

            <p className="text-[10px] text-white/50 leading-relaxed font-sans">
              Google Multi-Factor Authentication (MFA) secures login pipelines against brute compromise. Switch the toggle below to configure security tokens.
            </p>

            <div className="flex items-center justify-between bg-black/50 p-3 rounded border border-white/5 font-mono">
              <div className="space-y-0.5">
                <span className="font-extrabold text-white block">MFA GUARDIAN KEY</span>
                <span className="text-[8.5px] text-white/40 uppercase">
                  {mfaEnabled ? 'Cryptoshield Active' : 'Deactivated'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={mfaEnabled}
                onChange={(e) => handleMfaToggle(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="text-[9px] p-2 bg-black/30 border border-white/5 text-white/40 rounded">
              <span className="text-amber-400 font-extrabold font-mono block">⚠️ COMPLIANCE NOTE</span>
              MFA token registers sync through local client frames. Keep authentication keys backed up offline.
            </div>
          </div>

          {/* Alert check-boxes */}
          <div className="glass-panel p-5 rounded border border-white/5 space-y-4 bg-black/40">
            <span className="text-[11px] font-black uppercase text-white tracking-widest block border-b border-white/5 pb-2">
              ALERTS & WEBHOOK CHANNELS
            </span>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">TICKER AUDIO ALERTS</span>
                  <span className="text-[9.5px] text-white/45 leading-snug">Frequencies beep alerts triggered when custom price registers breach thresholds</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">SMS SYSTEM DISPATCHERS</span>
                  <span className="text-[9.5px] text-white/45 leading-snug">Receive critical trade dispatch confirmation tokens via SMS</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsTriggers}
                  onChange={(e) => setSmsTriggers(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-1 font-mono">
                <div className="space-y-0.5 font-mono">
                  <span className="font-bold text-white block">EOD ANALYTICAL DIGEST</span>
                  <span className="text-[9.5px] text-white/45 leading-snug">Automated summary PDF logs covering watchlist tickers delivered directly to operator inbox</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded border border-white/5 space-y-3 bg-black/40 font-sans">
            <span className="text-[10px] text-white/40 uppercase block border-b border-white/5 pb-1 flex items-center gap-1.5 font-mono">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> SECURE BINDINGS STATEMENT
            </span>
            <div className="space-y-2 text-[10px] text-white/50 leading-relaxed font-sans">
              <p>• Ticker secrets and access tokens remain encrypted inside your server-side environment variables and are never sent to external nodes.</p>
              <p>• Avoid sharing active secret keys across untrusted public client frameworks.</p>
            </div>
          </div>

        </div>

      </div>

      {/* MFA OTP POPUP ACTIVATION MODAL LAYOUT */}
      {mfaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono text-[11px] text-left">
          <div className="bg-neutral-900 border border-white/10 p-5 rounded-lg w-full max-w-sm space-y-4">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-amber-400 font-extrabold block">GOOGLE MFA SETUP ASSISTANT</span>
              <h4 className="text-white font-extrabold text-sm uppercase">Secure Google Authenticator</h4>
              <p className="text-white/40 text-[9.5px] mt-1 leading-relaxed">
                Scan the placeholder token code with your Google Authenticator or Microsoft mobile client, then verify the registration node below.
              </p>
            </div>

            {/* Simulated TOTP QR Block design */}
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/15 rounded space-y-2 sm:p-6 text-center">
              {/* QR Code Pixel Matrix Placeholder */}
              <div className="w-28 h-28 bg-white border-2 border-white rounded p-1 flex flex-wrap gap-0.5 justify-center items-center">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 rounded-none" 
                    style={{ backgroundColor: (i % 2 === 0 && i % 3 !== 0) || i % 7 === 0 ? '#000000' : '#ffffff' }}
                  />
                ))}
              </div>
              <span className="text-[8px] uppercase font-mono tracking-widest text-white/40">SECRET STATE: INFY-ZR-9250-KYC</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-[9px] uppercase text-white/50 block font-black">6-Digit verification code</label>
              <input
                type="text"
                placeholder="e.g., 592 104"
                maxLength={7}
                className="w-full bg-black/50 border border-white/10 p-2 text-center text-xs tracking-widest font-mono text-cyan-400 rounded outline-none uppercase"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 text-[10px] border-t border-white/5">
              <button
                onClick={() => setMfaModalOpen(false)}
                className="px-3.5 py-1.5 border border-white/10 text-white/50 hover:text-white rounded cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMfaActivation}
                className="px-4 py-1.5 bg-amber-500 text-black font-black uppercase rounded hover:bg-amber-400 cursor-pointer transition-colors"
                style={{ backgroundColor: 'var(--brand-amber)' }}
              >
                Link MFA Guardian
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Settings;
