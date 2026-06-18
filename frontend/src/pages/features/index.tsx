import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Unlock, ArrowRight, ShieldAlert, Cpu, 
  KeyRound, HelpCircle, Layers, Fingerprint, RefreshCcw, Check, Sparkles, X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePermission } from '../../routes/RouteGuards';
import { useSnackbar } from '../../components/common/SnackbarProvider';

// Map features alongside their required security clearance tags
interface FeatureLockSpec {
  id: string;
  name: string;
  path: string;
  requiredPermission: string | null;
  category: 'Market Intelligence' | 'Portfolio & Capital' | 'Advanced Calculators' | 'Administration';
  description: string;
  extendedDetails: string;
}

const FEATURE_LIST: FeatureLockSpec[] = [
  {
    id: 'feat-dashboard',
    name: 'StockSense Core Console',
    path: '/dashboard',
    requiredPermission: null,
    category: 'Market Intelligence',
    description: 'Dynamic central telemetry for retail indices, top gainers/losers, and live tickers.',
    extendedDetails: 'Available to all registered operator nodes as a standard reference environment.'
  },
  {
    id: 'feat-stocks',
    name: 'Securities Active Terminal',
    path: '/stocks',
    requiredPermission: 'stocks:READ',
    category: 'Market Intelligence',
    description: 'Real-time charts, historical financial data, promoter trades, and key operating ratios.',
    extendedDetails: 'Requires simple READ privileges to buffer and query live exchange quotes.'
  },
  {
    id: 'feat-screener',
    name: 'Modular Stock Screener',
    path: '/screener',
    requiredPermission: 'stocks:SCREEN',
    category: 'Market Intelligence',
    description: 'Filter equities with custom technical and fundamental indicator sets.',
    extendedDetails: 'Demands level-2 SCREEN authority to execute intense multi-variant query filters.'
  },
  {
    id: 'feat-saved-screener',
    name: 'Screener Query Vault',
    path: '/screener/saved',
    requiredPermission: 'stocks:SCREEN',
    category: 'Market Intelligence',
    description: 'Save, reload, and monitor complex search query configurations.',
    extendedDetails: 'Inherits level-2 SCREEN permission policies under standard RBAC rules.'
  },
  {
    id: 'feat-compare',
    name: 'Firms Comparison Matrix',
    path: '/compare',
    requiredPermission: 'stocks:COMPARE',
    category: 'Market Intelligence',
    description: 'Side-by-side fundamentally aligned comparison of competing securities.',
    extendedDetails: 'Requires dedicated COMPARE authorization profiles to compile fundamental datasets.'
  },
  {
    id: 'feat-portfolio',
    name: 'Asset Positions Ledger',
    path: '/portfolio',
    requiredPermission: 'portfolio:READ',
    category: 'Portfolio & Capital',
    description: 'Review cost price structures, current value assessments, and sector weights.',
    extendedDetails: 'Gated under READ portfolio clearances to keep financial summaries fully encrypted.'
  },
  {
    id: 'feat-mutual-funds',
    name: 'Mutual Funds Analytics',
    path: '/mutual-funds',
    requiredPermission: 'mutual_funds:READ',
    category: 'Portfolio & Capital',
    description: 'Examine active mutual fund holdings, XIRR calculations, and sip models.',
    extendedDetails: 'Secured under mutual_funds:READ parameters to preserve investment data integrity.'
  },
  {
    id: 'feat-tax-reports',
    name: 'Capital Gains Tax Center',
    path: '/tax-reports',
    requiredPermission: 'portfolio:TAX_EXPORT',
    category: 'Advanced Calculators',
    description: 'Automate tax compilations, yield analyses, and export downloadable PDFs.',
    extendedDetails: 'Restricted under high-clearance LEVEL_3 TAX_EXPORT rules for absolute privacy.'
  },
  {
    id: 'feat-admin',
    name: 'Administrative Panel',
    path: '/admin',
    requiredPermission: 'admin:MANAGE_RBAC', // requires high privilege
    category: 'Administration',
    description: 'Hardware health indicators, database states, active container feeds, and telemetry logs.',
    extendedDetails: 'Requires strict administrator authority credentials to inspect.'
  },
  {
    id: 'feat-roles',
    name: 'RBAC Roles Customizer',
    path: '/roles',
    requiredPermission: 'admin:MANAGE_RBAC',
    category: 'Administration',
    description: 'Configure cryptographic security groups and assign specific authorized keys.',
    extendedDetails: 'Superuser permission ONLY. Any unauthorized call hooks security logs.'
  },
  {
    id: 'feat-permissions',
    name: 'System Tree Permissions Matrix',
    path: '/permissions',
    requiredPermission: 'admin:MANAGE_RBAC',
    category: 'Administration',
    description: 'Inspect complete hierarchical map computed instantly from database seeds.',
    extendedDetails: 'Superuser clearance path to audit overall clearance compliance rules.'
  }
];

export function Features() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const { hasPermission } = usePermission();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [requestModalSpec, setRequestModalSpec] = useState<FeatureLockSpec | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick switch between demo persona nodes to allow rapid testing
  const handleQuickSwitchPersona = (roleName: 'user' | 'analyst' | 'supervisor' | 'compliance' | 'admin') => {
    if (!user) {
      enqueueSnackbar('No active security context found. Please log in first.', { variant: 'error' });
      return;
    }

    const emailPrefix = user.email.split('@')[0];
    const uppercaseRole = roleName.toUpperCase();
    
    login(
      {
        accessToken: 'sample-access-token-jwt-stocksense-' + Math.random().toString(36).substring(5),
        refreshToken: 'sample-refresh-token-jwt-stocksense-' + Math.random().toString(36).substring(5)
      },
      {
        id: user.id,
        name: `${emailPrefix.toUpperCase()} (${uppercaseRole})`,
        email: user.email,
        roles: [roleName],
        avatar: roleName.substring(0, 2).toUpperCase()
      }
    );

    enqueueSnackbar(`Security profile rotated to: ${uppercaseRole}. Permission scopes updated.`, { variant: 'success' });
  };

  const handleRequestClearanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalSpec) return;

    setIsSubmitting(true);
    setTimeout(() => {
      enqueueSnackbar(`Clearance dispatch request logged for [${requestModalSpec.requiredPermission}]. Pending admin seal approval.`, { 
        variant: 'info' 
      });
      setIsSubmitting(false);
      setRequestModalSpec(null);
      setRequestNotes('');
    }, 800);
  };

  // Filter features list matching query & dropdown indicators
  const filteredFeatures = FEATURE_LIST.filter(feat => {
    const matchesSearch = feat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          feat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (feat.requiredPermission && feat.requiredPermission.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'ALL' || feat.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'Market Intelligence', 'Portfolio & Capital', 'Advanced Calculators', 'Administration'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none" id="features-clearance-matrix-root">
      
      {/* 1. Page Header Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-neutral-900 via-neutral-950 to-cyan-950/20 border border-white/5 rounded-lg gap-4">
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Platform Clearance Directory</div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
            <KeyRound className="w-5.5 h-5.5 text-cyan-400" /> Features & Permissions Guard
          </h2>
          <p className="text-xs text-white/50 font-mono">Verify active security clearance, view permission tags, and audit system rules in real-time</p>
        </div>

        {/* Dynamic Authority Status Badge */}
        <div className="flex items-center gap-3 bg-black/45 border border-white/5 p-2 rounded shrink-0">
          <div className="text-right">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Active Clearance Role</span>
            <span className="text-xs font-black uppercase text-cyan-400 tracking-wide block" style={{ color: 'var(--brand-cyan)' }}>
              {user?.roles?.join(', ') || 'GUEST'}
            </span>
          </div>
          <Fingerprint className="w-6.5 h-6.5 text-cyan-400" />
        </div>
      </div>

      {/* 2. Interactive Role Swapping Suite */}
      <div className="glass-panel p-4 rounded border border-cyan-500/15 bg-cyan-950/5 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-3">
          <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> RBAC Authority Simulation Sandbox
              </h3>
              <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed font-mono">
                StockSense is engineered with true Role-Based Access Control. Use the toggles below to immediately swap virtual personnel nodes and watch how the sidebar layout, screens, and permission gates respond dynamically.
              </p>
            </div>

            {/* Simulated Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {(['user', 'analyst', 'supervisor', 'compliance', 'admin'] as const).map((role) => {
                const isActive = user?.roles?.some(r => r.toLowerCase() === role.toLowerCase());
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleQuickSwitchPersona(role)}
                    className={`px-3 py-1.5 text-[9px] font-mono rounded cursor-pointer uppercase tracking-wider transition-all border ${
                      isActive 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-extrabold shadow-[0_0_8px_rgba(0,242,255,0.15)]' 
                        : 'bg-black/45 border-white/10 text-white/40 hover:text-white/80 hover:border-white/20'
                    }`}
                  >
                    {role === 'user' ? '👤 Regular User' : 
                     role === 'analyst' ? '🔬 Analyst' : 
                     role === 'supervisor' ? '💼 Supervisor' : 
                     role === 'compliance' ? '⚖️ Compliance Officer' : 
                     '👑 Administrator'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Category Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between text-left">
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feature keyword or permission tag..."
            className="w-full h-9 bg-black/60 border border-white/10 rounded px-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[9px] font-mono rounded uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-black'
                  : 'bg-black/35 border border-white/5 text-white/40 hover:text-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFeatures.map((feat) => {
          const isAuthorized = !feat.requiredPermission || hasPermission(feat.requiredPermission);
          
          return (
            <div 
              key={feat.id}
              className={`group relative rounded border p-5 transition-all text-left flex flex-col justify-between ${
                isAuthorized 
                  ? 'bg-emerald-950/5 border-emerald-500/10 hover:border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.01)] hover:shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                  : 'bg-red-950/5 border-red-500/10 hover:border-red-500/25 shadow-[0_0_10px_rgba(239,68,68,0.01)] hover:shadow-[0_0_15px_rgba(239,68,68,0.05)]'
              }`}
            >
              <div className="space-y-3">
                {/* Visual Status Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-[8.5px] font-mono tracking-widest uppercase font-extrabold text-white/30">
                    {feat.category}
                  </span>
                  
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-mono uppercase font-black tracking-widest ${
                    isAuthorized
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {isAuthorized ? <Unlock className="w-2.5 h-2.5 text-emerald-400" /> : <Lock className="w-2.5 h-2.5 text-red-400" />}
                    {isAuthorized ? 'Authorized' : 'Restricted'}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white tracking-wide group-hover:text-cyan-400 transition-colors uppercase">
                    {feat.name}
                  </h4>
                  <p className="text-white/50 text-[11px] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Requirements Indicator */}
                <div className="bg-black/45 border border-white/5 p-2 rounded font-mono text-[9.5px] space-y-1">
                  <div className="flex justify-between text-white/40">
                    <span>CLEARANCE SCOPE:</span>
                    <span className={feat.requiredPermission ? 'text-cyan-300 font-bold' : 'text-white/35'}>
                      {feat.requiredPermission || 'PUBLIC_GATEWAY'}
                    </span>
                  </div>
                  <div className="text-white/30 text-[9px] leading-snug">
                    {feat.extendedDetails}
                  </div>
                </div>
              </div>

              {/* Action Button at bottom */}
              <div className="pt-4 mt-auto">
                {isAuthorized ? (
                  <button
                    onClick={() => navigate(feat.path)}
                    className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 group-hover:text-emerald-300 text-[10px] font-mono font-black uppercase tracking-widest rounded cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    Launch Component <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={() => setRequestModalSpec(feat)}
                    className="w-full py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest rounded cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Request Clearance
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="p-12 border border-dashed border-white/10 rounded-lg text-center text-white/30 font-mono text-xs">
          No system feature indicators match your designated search credentials.
        </div>
      )}

      {/* 5. Help FAQ block */}
      <div className="flex items-start gap-4 p-5 bg-black/40 border border-white/5 rounded-lg text-left text-xs leading-relaxed">
        <HelpCircle className="w-5.5 h-5.5 shrink-0 text-cyan-400 mt-0.5" />
        <div className="space-y-1.5 font-mono text-[10.5px]">
          <span className="font-extrabold text-white text-[11px] block uppercase font-sans">Security Operational Directive</span>
          <p className="text-white/50">
            RBAC parameters reside in local database profiles synchronized across all peer clusters dynamically. Temporary locks prevent race condition transaction feeds inside simulated retail accounts. Contact compliance operators for absolute database key expansions.
          </p>
        </div>
      </div>

      {/* Request Clearance popup modal */}
      {requestModalSpec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm font-mono text-[11px] overflow-y-auto">
          <form 
            onSubmit={handleRequestClearanceSubmit} 
            className="bg-neutral-900 border border-white/10 p-5 rounded-lg w-full max-w-md space-y-4 my-8 relative animate-fade-in text-left"
          >
            {/* Close button */}
            <button 
              type="button"
              onClick={() => setRequestModalSpec(null)}
              className="absolute right-4 top-4 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[8px] uppercase tracking-wider text-red-400 font-extrabold block">ENCRYPTED CLEARANCE REQUEST</span>
              <h4 className="text-white font-extrabold text-sm uppercase">Request Feature Access</h4>
              <p className="text-white/45 text-[9.5px] mt-1 leading-relaxed">
                Dispatch an authorized application message to administrators to request immediate authorization of the [<strong>{requestModalSpec.requiredPermission}</strong>] key.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-black/60 border border-white/15 p-2.5 rounded text-[9.5px] text-white/60 space-y-1">
                <div>FEATURE: <span className="text-white font-bold">{requestModalSpec.name}</span></div>
                <div>KEY TAG: <span className="text-cyan-400 font-bold">{requestModalSpec.requiredPermission}</span></div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase font-bold block">Business Justification Statement</span>
                <textarea
                  required
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="e.g., Audit dividend payout metrics and adjust portfolio sector concentration weights."
                  className="w-full p-2 bg-black/60 border border-white/10 rounded text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-400 resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-end pt-2 text-[10.5px]">
              <button
                type="button"
                onClick={() => setRequestModalSpec(null)}
                className="px-3.5 py-1.5 border border-white/10 text-white/50 hover:text-white rounded cursor-pointer transition-colors font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4.5 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-black uppercase rounded cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'TRANSFUSING PACKETS...' : 'DISPATCH REQUEST'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default Features;
