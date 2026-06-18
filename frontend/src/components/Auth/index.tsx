import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { rules } from '../../utils/rules';
import { KeyRound, Mail, User, ShieldAlert, Sparkles, Flame, Shield, HelpCircle } from 'lucide-react';
import { STextField } from '../common/STextField';
import { SButton } from '../common/SButton';
import { SPhoneNumber } from '../common/SPhoneNumber';
import { GoogleLoginButton } from './GoogleLoginButton';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { OtpVerificationForm } from './OtpVerificationForm';
import { useSnackbar } from '../common/SnackbarProvider';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field-level validations
    const emailCheck = rules.email()(email);
    if (emailCheck !== true) {
      setError(emailCheck);
      enqueueSnackbar(emailCheck, { variant: 'error' });
      return;
    }

    const passwordCheck = rules.password()(password);
    if (passwordCheck !== true) {
      setError(passwordCheck);
      enqueueSnackbar(passwordCheck, { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Simulate OAuth network round-trip auth phase
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      login({
        accessToken: 'sample-access-token-jwt-stocksense-' + Math.random().toString(36).substring(5),
        refreshToken: 'sample-refresh-token-jwt-stocksense-' + Math.random().toString(36).substring(5)
      }, {
        id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        name: email.split('@')[0].toUpperCase(),
        email: email,
        roles: ['user'],
        avatar: email.substring(0, 2).toUpperCase()
      });

      enqueueSnackbar('Successfully initialized user session', { variant: 'success' });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (idToken: string) => {
    setLoading(true);
    setTimeout(() => {
      login({
        accessToken: 'google-access-token-jwt-stocksense-' + Math.random().toString(36).substring(5),
        refreshToken: 'google-refresh-token-jwt-stocksense-' + Math.random().toString(36).substring(5)
      }, {
        id: 'USR-G923',
        name: 'Operator Google',
        email: 'operator.google@stocksense.ai',
        roles: ['user'],
        avatar: 'OG'
      });
      enqueueSnackbar('Google credential verified.', { variant: 'success' });
      navigate('/dashboard');
      setLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-sm font-black text-white tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4 text-cyan-400 animate-pulse" /> Gateway Credentials
          </h2>
          <p className="text-[11px] text-white/50 mt-1">Authenticate terminal session to resume security feeds</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <STextField
          label="Security Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          required
          placeholder="operator@stocksense.ai"
          icon={<Mail className="w-4 h-4" />}
          rules={[rules.email()]}
        />

        <div className="space-y-1 text-left relative">
          <STextField
            label="Access Key Phrase"
            type="password"
            value={password}
            onChange={setPassword}
            required
            placeholder="••••••••••••"
            icon={<KeyRound className="w-4 h-4" />}
            rules={[rules.password()]}
          />
          <div className="text-right mt-1">
            <Link to="/forgot-password" className="text-[10px] font-mono text-cyan-400 hover:underline">
              Lost credentials?
            </Link>
          </div>
        </div>

        <SButton
          type="submit"
          label="Sign in Session"
          variant="primary"
          loading={loading}
          className="w-full text-[11px]"
        />
      </form>

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 border-t border-white/5" />
        <span className="relative px-3 bg-[#0a0a16] text-[9px] font-mono text-white/30 uppercase tracking-widest">or connectivity</span>
      </div>

      <GoogleLoginButton onSuccess={handleGoogleSuccess} loading={loading} />

      <div className="flex flex-col gap-2 text-center text-xs pt-2">
        <div>
          <span className="text-white/40">New agent node? </span>
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">Provision credentials</Link>
        </div>
        <div className="pt-1.5 border-t border-white/5 mt-1">
          <Link to="/admin-login" className="text-[10px] font-mono text-red-400/80 hover:text-red-400 hover:underline inline-flex items-center gap-1 uppercase tracking-wider">
            <Shield className="w-3 h-3 text-red-500" /> Administrative Secure Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailCheck = rules.email()(email);
    if (emailCheck !== true) {
      setError(emailCheck);
      enqueueSnackbar(emailCheck, { variant: 'error' });
      return;
    }

    const passwordCheck = rules.password()(password);
    if (passwordCheck !== true) {
      setError(passwordCheck);
      enqueueSnackbar(passwordCheck, { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Simulate administrative key authorization sequence
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      login({
        accessToken: 'admin-access-token-jwt-stocksense-' + Math.random().toString(36).substring(5),
        refreshToken: 'admin-refresh-token-jwt-stocksense-' + Math.random().toString(36).substring(5)
      }, {
        id: 'ADM-' + Math.floor(1000 + Math.random() * 9000),
        name: email.split('@')[0].toUpperCase() + ' (ADMIN)',
        email: email,
        roles: ['admin', 'user'],
        avatar: 'AD'
      });

      enqueueSnackbar('Cryptographic credentials matched. Administrative terminal session active.', { variant: 'success' });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Access denied. Administrative security lock engaged.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-red-950/20 border border-red-500/25 text-red-300 text-[10px] rounded font-mono flex items-start gap-2 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-red-400 block uppercase mb-0.5 tracking-wider">RESTRICTED PORT</span>
          Authorized administrator login only. IP addresses, session fingerprints, and actions are logged under audit compliance protocols.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-2">
          <h2 className="text-sm font-black text-white tracking-widest uppercase flex items-center justify-center gap-1.5 text-red-400">
            <Shield className="w-4 h-4 text-red-500 animate-pulse" /> Console Authority
          </h2>
          <p className="text-[11px] text-white/50 mt-1">Authenticate administrative credentials to resume system root feeds</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/15 border border-red-500/40 text-red-200 text-xs rounded font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <STextField
          label="Root Security Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          placeholder="admin@stocksense.ai"
          icon={<Mail className="w-4 h-4 text-red-400/80" />}
          rules={[rules.email()]}
        />

        <STextField
          label="Root Console Access Key"
          type="password"
          value={password}
          onChange={setPassword}
          required
          placeholder="••••••••••••"
          icon={<KeyRound className="w-4 h-4 text-red-400/80" />}
          rules={[rules.password()]}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 px-4 mt-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-50 text-white font-mono font-black text-[11px] uppercase tracking-widest rounded border border-red-500/40 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center"
        >
          {loading ? 'Decrypting Secure Seal...' : 'Authorize Admin Terminal'}
        </button>
      </form>

      <div className="text-center text-xs pt-2 border-t border-white/5">
        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-mono text-[10px] uppercase tracking-wider hover:underline">
          Return to Standard Gateway
        </Link>
      </div>
    </div>
  );
}


export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { enqueueSnackbar } = useSnackbar();

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.length < 2) {
      enqueueSnackbar('Name must be at least 2 characters', { variant: 'error' });
      return;
    }
    const emailCheck = rules.email()(email);
    if (emailCheck !== true) {
      enqueueSnackbar(emailCheck, { variant: 'error' });
      return;
    }
    const phoneCheck = rules.phone()(phone);
    if (phoneCheck !== true) {
      enqueueSnackbar(phoneCheck, { variant: 'error' });
      return;
    }
    const passwordCheck = rules.password()(password);
    if (passwordCheck !== true) {
      enqueueSnackbar(passwordCheck, { variant: 'error' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      enqueueSnackbar('Challenge OTP dispatched successfully to terminal device.', { variant: 'success' });
    }, 600);
  };

  const handleOtpVerifySuccess = (otpCode: string) => {
    setLoading(true);
    setTimeout(() => {
      login({
        accessToken: 'sample-access-token-jwt-stocksense-' + Math.random().toString(36).substring(5),
        refreshToken: 'sample-refresh-token-jwt-stocksense-' + Math.random().toString(36).substring(5)
      }, {
        id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        name,
        email,
        roles: ['user'],
        avatar: name.substring(0, 2).toUpperCase()
      });

      enqueueSnackbar('Cryptographic keys registered successfully. Access granted.', { variant: 'success' });
      navigate('/dashboard');
      setLoading(false);
    }, 800);
  };

  const handleGoogleSuccess = (idToken: string) => {
    setLoading(true);
    setTimeout(() => {
      login({
        accessToken: 'google-access-token-jwt-stocksense-' + Math.random().toString(36).substring(5),
        refreshToken: 'google-refresh-token-jwt-stocksense-' + Math.random().toString(36).substring(5)
      }, {
        id: 'USR-G923',
        name: 'New Google Operator',
        email: 'operator.g@stocksense.ai',
        roles: ['user'],
        avatar: 'NG'
      });
      enqueueSnackbar('Google profile auto-provisioned successfully.', { variant: 'success' });
      navigate('/dashboard');
      setLoading(false);
    }, 700);
  };

  if (step === 'otp') {
    return (
      <OtpVerificationForm
        userId="PENDING-T1"
        phoneOrEmail={email}
        onSuccess={handleOtpVerifySuccess}
        onBack={() => setStep('info')}
        loading={loading}
      />
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleInfoSubmit} className="space-y-3.5">
        <div className="text-center mb-3">
          <h2 className="text-sm font-black text-white tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" /> Node Provision
          </h2>
          <p className="text-[11px] text-white/50 mt-1">Register dynamic certificate keys for StockSense access</p>
        </div>

        <STextField
          label="Full Name"
          type="text"
          value={name}
          onChange={setName}
          required
          placeholder="Nitin Kumar"
          icon={<User className="w-4 h-4" />}
          rules={[rules.required('Name')]}
        />

        <STextField
          label="Secure Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          placeholder="nkcjsss@gmail.com"
          icon={<Mail className="w-4 h-4" />}
          rules={[rules.email()]}
        />

        <SPhoneNumber
          label="Phone Signature"
          value={phone}
          onChange={setPhone}
          required
        />

        <STextField
          label="Access Key Code"
          type="password"
          value={password}
          onChange={setPassword}
          required
          placeholder="••••••••••••"
          icon={<KeyRound className="w-4 h-4" />}
          rules={[rules.password()]}
        />

        <SButton
          type="submit"
          label="Issue Verification Token"
          variant="primary"
          loading={loading}
          className="w-full text-[11px]"
        />
      </form>

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 border-t border-white/5" />
        <span className="relative px-3 bg-[#0a0a16] text-[9px] font-mono text-white/30 uppercase tracking-widest">or connectivity</span>
      </div>

      <GoogleLoginButton onSuccess={handleGoogleSuccess} loading={loading} />

      <div className="text-center text-xs pt-1">
        <span className="text-white/40">Registered before? </span>
        <Link to="/login" className="text-cyan-400 font-bold hover:underline">Access terminal</Link>
      </div>
    </div>
  );
}

export function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <ForgotPasswordForm
      onBackToLogin={() => navigate('/login')}
      onSubmitSuccess={(email) => {
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 3000);
      }}
    />
  );
}

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  return (
    <ResetPasswordForm
      token={token}
      onBackToLogin={() => navigate('/login')}
      onSubmitSuccess={() => {
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }}
    />
  );
}

export function OtpVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your device email';

  return (
    <OtpVerificationForm
      userId="USR-DIRECT-01"
      phoneOrEmail={email}
      onSuccess={() => {
        navigate('/dashboard');
      }}
      onBack={() => navigate('/login')}
    />
  );
}

export function Home() {
  return (
    <div className="min-h-screen bg-[#050508] text-[#e0e0ff] flex flex-col justify-center items-center text-center p-6 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c16_1px,transparent_1px),linear-gradient(to_bottom,#0c0c16_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-30" />
      <div className="max-w-xl glass-panel p-8 rounded-lg border border-white/15 relative space-y-6 bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 left-0 scan-line" />
        <h1 className="text-4xl font-extrabold tracking-widest text-white neon-text-cyan flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-cyan-400" /> STOCKSENSE AI
        </h1>
        <p className="text-xs leading-relaxed text-white/70 font-mono">
          Uncompromised analytical terminal powering premium indices intelligence, smart stock screening, and algorithmic portfolio diagnostics for Indian retail node networks.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/login"
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] cursor-pointer"
          >
            Access Terminal
          </Link>
          <Link 
            to="/register"
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs rounded transition-all cursor-pointer"
          >
            Register Code
          </Link>
        </div>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] text-[#e0e0ff] flex flex-col justify-center items-center font-mono">
      <h1 className="text-6xl text-red-500 animate-pulse font-extrabold mb-4">404</h1>
      <p className="text-xs text-white/50 mb-6 uppercase tracking-widest">TRANSMISSION ROUTE LOSS DETECTED</p>
      <Link to="/" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs uppercase tracking-widest font-black rounded cursor-pointer">
        Return to Core Node
      </Link>
    </div>
  );
}
