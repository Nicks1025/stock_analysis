/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { usePermission } from '../routes/RouteGuards';
import { 
  useAuthStore 
} from '../store/authStore';
import { 
  useStockStore 
} from '../store/stockStore';
import { 
  useNotificationStore 
} from '../store/notificationStore';
import { 
  LayoutDashboard, 
  Search, 
  SlidersHorizontal, 
  Briefcase, 
  Newspaper, 
  TrendingUp, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Compass, 
  Settings, 
  ShieldAlert, 
  CalendarDays, 
  KeyRound, 
  Award, 
  FileCheck, 
  HelpCircle, 
  Eye, 
  Calculator, 
  Coins, 
  FileSpreadsheet, 
  History,
  Activity,
  Cpu,
  BookmarkCheck,
  Palette,
  ArrowLeft
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeSelect, setShowThemeSelect] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('stocksense-theme');
    return (stored === 'light' || !stored) ? 'dark' : stored;
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const liveIndices = useStockStore((state) => state.liveIndices);
  const marketStatus = useStockStore((state) => state.marketStatus);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const notifications = useNotificationStore((state) => state.notifications);

  // Refs for closing on click-outside
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic body class theme updating
    document.documentElement.className = theme === 'dark' ? '' : `theme-${theme}`;
    localStorage.setItem('stocksense-theme', theme);
  }, [theme]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (showNotifications && notificationRef.current && !notificationRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (showThemeSelect && themeSelectRef.current && !themeSelectRef.current.contains(target)) {
        setShowThemeSelect(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserMenu, showThemeSelect]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname;

  const isLightTheme = theme === 'light';
  const dropdownBg = isLightTheme ? '#ffffff' : theme === 'amber' ? '#14100c' : theme === 'emerald' ? '#040d07' : '#0a0a14';
  const dropdownBorder = isLightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
  const textColor = isLightTheme ? '#1e293b' : '#e0e0ff';

  const { hasPermission } = usePermission();

  // Sidebar navigation routes matched exactly to guidelines
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Features Audit', path: '/features', icon: KeyRound },
    { label: 'Securities Terminal', path: '/stocks', icon: Activity },
    { label: 'Stock Screener', path: '/screener', icon: SlidersHorizontal, permission: 'stocks:SCREEN' },
    { label: 'Saved Screeners', path: '/screener/saved', icon: BookmarkCheck, permission: 'stocks:SCREEN' },
    { label: 'Mutual Funds', path: '/mutual-funds', icon: Coins, permission: 'mutual_funds:READ' },
    { label: 'Market News', path: '/news', icon: Newspaper },
    { label: 'Watchlist', path: '/watchlist', icon: Eye },
    { label: 'Price Alerts', path: '/alerts', icon: ShieldAlert },
    { label: 'Economic Calendar', path: '/economic-calendar', icon: CalendarDays },
    { label: 'Dividend Calendar', path: '/dividend-calendar', icon: FileSpreadsheet },
    { label: 'Earnings Center', path: '/earnings', icon: History },
    { label: 'IPO Center', path: '/ipo', icon: Award },
    { label: 'Compare Stocks', path: '/compare', icon: TrendingUp, permission: 'stocks:COMPARE' },
    { label: 'Investment Goals', path: '/goals', icon: Calculator },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  // Admin section routes conditionally rendered based on role
  const adminItems = [
    { label: 'Admin Health', path: '/admin', icon: Cpu },
    { label: 'Roles Management', path: '/roles', icon: ShieldAlert },
    { label: 'System Permissions', path: '/permissions', icon: ShieldAlert },
  ];

  const visibleNavItems = navItems.filter((item) => {
    return !item.permission || hasPermission(item.permission);
  });

  const isAdmin = user?.roles?.some(r => r.toLowerCase() === 'admin');

  return (
    <div 
      className="h-screen w-full font-sans flex flex-col relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--brand-dark)', color: textColor }}
    >
      {/* Background ambient grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c16_1px,transparent_1px),linear-gradient(to_bottom,#0c0c16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Horizontal Ambient Scanline ticker animation */}
      <div className="absolute top-0 left-0 w-full scan-line pointer-events-none" />

      {/* Live Market Scrolling Ticker Bar */}
      <div className="w-full h-11 bg-black/80 border-b border-white/5 flex items-center overflow-hidden relative z-20">
        <div className="flex flex-col justify-center px-4 h-full bg-cyan-950/20 border-r border-white/10 text-[10px] select-none shrink-0 border-l border-brand-cyan shadow-[inset_0_0_8px_rgba(0,242,255,0.1)]">
          <div className="flex items-center gap-1.5 tracking-wider uppercase font-mono font-bold text-cyan-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Tickers
          </div>
          <div className="flex items-center gap-1 mt-0.5 select-none">
            <span className={`w-1.5 h-1.5 rounded-full ${marketStatus?.isOpen ? 'bg-emerald-400 shadow-[0_0_5px_#10b981]' : 'bg-red-400 shadow-[0_0_5px_#f87171]'}`} />
            <span className="text-[8px] font-mono tracking-widest uppercase font-black" style={{ color: marketStatus?.isOpen ? '#34d399' : '#f87171' }}>
              {marketStatus?.isOpen ? 'open' : 'closed'}
            </span>
          </div>
        </div>
        
        {/* Horizontal scroll buffer */}
        <div className="flex items-center gap-8 px-6 animate-[marquee_25s_linear_infinite] shrink-0 min-w-full font-mono text-[11px] whitespace-nowrap">
          {liveIndices.length > 0 ? (
            liveIndices.map((idx, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-white/60 uppercase">{idx.name}</span>
                <span className="text-white font-bold">{idx.value.toLocaleString('en-IN', { minimumFractionDigits: 1 })}</span>
                <span className={idx.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {idx.changePercent >= 0 ? '▲' : '▼'} {formatPercent(idx.changePercent)}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-white/40">NIFTY 50</span>
                <span className="text-white/60 font-bold">23,512.40</span>
                <span className="text-emerald-400">▲ +0.62%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40">SENSEX</span>
                <span className="text-white/60 font-bold">77,301.10</span>
                <span className="text-emerald-400">▲ +0.63%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40">NIFTY BANK</span>
                <span className="text-white/60 font-bold">51,650.25</span>
                <span className="text-red-400">▼ -0.23%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40">NIFTY IT</span>
                <span className="text-white/60 font-bold">37,410.80</span>
                <span className="text-emerald-400">▲ +0.90%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Structural Wrapper Grid */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* COLLAPSIBLE SIDEBAR */}
        <aside 
          className={`fixed md:relative top-0 bottom-0 left-0 z-40 md:z-20 shrink-0 border-r border-white/5 bg-[rgba(6,6,12,0.95)] transition-all duration-300 flex flex-col h-full ${
            sidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'
          }`}
          style={{ backgroundColor: isLightTheme ? '#f1f5f9' : 'rgba(6,6,12,0.95)', borderRightColor: dropdownBorder }}
        >
          {/* Brand header panel */}
          <div className={`border-b border-white/5 flex items-center shrink-0 ${sidebarOpen ? 'p-4 justify-between' : 'py-4 justify-center w-full'}`} style={{ borderBottomColor: dropdownBorder }}>
            {sidebarOpen ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black tracking-widest text-[#00f2ff] uppercase" style={{ color: 'var(--brand-cyan)' }}>STOCKSENSE AI</h3>
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono">Terminal Console</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 text-white/45 hover:text-white hover:bg-white/5 transition-all cursor-pointer rounded animate-fade-in"
                  title="Collapse Sidebar"
                >
                  <X className="w-4 h-4 md:hidden" />
                  <SlidersHorizontal className="w-4 h-4 hidden md:block" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 text-white/45 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer rounded border border-transparent hover:border-cyan-500/15"
                  title="Expand Sidebar"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation block */}
          <div className={`flex-1 overflow-y-auto space-y-1.5 custom-scrollbar select-none ${sidebarOpen ? 'p-3' : 'py-3 px-1.5'}`}>
            {visibleNavItems.map((item, idx) => {
              const active = currentPath === item.path || currentPath.startsWith(item.path + '/');
              return (
                <Link
                  key={idx}
                  to={item.path}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`flex items-center rounded transition-all group relative ${
                    sidebarOpen ? 'px-3.5 py-2.5 gap-3.5 justify-start' : 'p-2.5 justify-center mx-auto w-10 h-10'
                  } ${
                    active 
                      ? 'bg-cyan-500/10 font-bold' 
                      : 'hover:bg-white/[0.02]'
                  }`}
                  style={{
                    color: active ? 'var(--brand-cyan)' : isLightTheme ? '#475569' : '#94a3b8'
                  }}
                >
                  <item.icon className="w-4 h-4 shrink-0" style={{ color: active ? 'var(--brand-cyan)' : undefined }} />
                  {sidebarOpen ? (
                    <span className="text-xs tracking-wider truncate">{item.label}</span>
                  ) : (
                    /* Floating Tooltip */
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-950 border border-white/10 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}

            {/* Admin item block context */}
            {isAdmin && adminItems.length > 0 && (
              <div className="pt-4 mt-4 border-t border-white/5" style={{ borderTopColor: dropdownBorder }}>
                {sidebarOpen && (
                  <span className="px-3.5 text-[9px] uppercase font-mono tracking-[0.2em] text-cyan-500/60 font-bold block mb-2">
                    Console Authority
                  </span>
                )}
                {adminItems.map((item, idx) => {
                  const active = currentPath === item.path || currentPath.startsWith(item.path + '/');
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      title={!sidebarOpen ? item.label : undefined}
                      className={`flex items-center rounded transition-all group relative ${
                        sidebarOpen ? 'px-3.5 py-2.5 gap-3.5 justify-start' : 'p-2.5 justify-center mx-auto w-10 h-10'
                      } ${
                        active 
                          ? 'bg-red-500/10 font-bold' 
                          : 'hover:bg-white/[0.02]'
                      }`}
                      style={{
                        color: active ? '#ef4444' : isLightTheme ? '#475569' : '#94a3b8'
                      }}
                    >
                      <item.icon className="w-4 h-4 shrink-0" style={{ color: active ? '#ef4444' : undefined }} />
                      {sidebarOpen ? (
                        <span className="text-xs tracking-wider truncate">{item.label}</span>
                      ) : (
                        /* Floating Tooltip */
                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-950 border border-white/10 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* PRIMARY CONCRETE CONTAINER */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* CENTRAL CONTENT TOPBAR */}
          <header className="h-16 shrink-0 border-b border-white/5 px-4 sm:px-6 flex justify-between items-center bg-[rgba(6,6,12,0.85)] backdrop-blur-xl relative z-10" style={{ borderBottomColor: dropdownBorder }}>
            
            {/* Left side actions with universal Back button */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 text-white/70 hover:text-white md:hidden cursor-pointer rounded hover:bg-white/5"
                title="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {location.pathname !== '/dashboard' && location.pathname !== '/' && (
                <button
                  onClick={() => navigate(-1)}
                  className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-all shrink-0 flex items-center justify-center p-0.5"
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4 relative">
              
              {/* Theme selector trigger */}
              <div className="relative" ref={themeSelectRef}>
                <button 
                  onClick={() => setShowThemeSelect(!showThemeSelect)}
                  className="text-white/70 hover:text-cyan-400 transition-all flex items-center justify-center cursor-pointer p-0.5"
                  title="Switch Theme"
                >
                  <Palette className="w-5 h-5" />
                </button>
                
                {/* Theme Selector List */}
                {showThemeSelect && (
                  <div 
                    className="absolute right-0 top-10 w-48 rounded border p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-left flex flex-col gap-1 z-50 transition-colors"
                    style={{ backgroundColor: dropdownBg, borderColor: dropdownBorder }}
                  >
                    <span className="text-[9px] font-mono tracking-wider font-extrabold text-cyan-400 px-2 py-1 block border-b border-white/5 mb-1">
                      CHOOSE VISUAL SUITE
                    </span>
                    <button
                      onClick={() => { setTheme('dark'); setShowThemeSelect(false); }}
                      className={`px-3 py-1.5 text-xs rounded text-left flex items-center justify-between hover:bg-cyan-500/10 cursor-pointer ${theme === 'dark' ? 'text-cyan-400 font-bold bg-cyan-400/5' : ''}`}
                    >
                      <span>Cyberpunk Dark</span>
                      {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                    <button
                      onClick={() => { setTheme('amber'); setShowThemeSelect(false); }}
                      className={`px-3 py-1.5 text-xs rounded text-left flex items-center justify-between hover:bg-cyan-500/10 cursor-pointer ${theme === 'amber' ? 'text-amber-400 font-bold bg-amber-500/5' : ''}`}
                    >
                      <span>Sunset Amber</span>
                      {theme === 'amber' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>
                    <button
                      onClick={() => { setTheme('emerald'); setShowThemeSelect(false); }}
                      className={`px-3 py-1.5 text-xs rounded text-left flex items-center justify-between hover:bg-cyan-500/10 cursor-pointer ${theme === 'emerald' ? 'text-emerald-400 font-bold bg-emerald-500/5' : ''}`}
                    >
                      <span>Forest Emerald</span>
                      {theme === 'emerald' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Notification bell trigger */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-white/70 hover:text-cyan-400 transition-all flex items-center justify-center relative cursor-pointer p-0.5"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-cyan-400 rounded-full border border-slate-950 animate-pulse" />
                  )}
                </button>

                {/* Collapsed Notifications Frame popover */}
                {showNotifications && (
                  <div 
                    className="absolute right-0 top-12 w-80 rounded border p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-left flex flex-col z-50"
                    style={{ backgroundColor: dropdownBg, borderColor: dropdownBorder }}
                  >
                    <span className="text-[10px] font-mono tracking-wider font-bold text-cyan-400 mb-2 block border-b border-white/5 pb-1">
                      SYSTEM TRANSMISSIONS ({unreadCount})
                    </span>
                    
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {notifications.length > 0 ? (
                        notifications.map((n, idx) => (
                          <div key={idx} className="p-2 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded text-xs">
                            <h5 className="font-bold text-white mb-0.5">{n.title}</h5>
                            <p className="text-white/55 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-white/30 text-center font-mono py-4">
                          Status clear. No pending transmissions.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu trigger */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full border border-white/15 bg-slate-800 flex items-center justify-center overflow-hidden cursor-pointer hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(0,242,255,0.1)]"
                >
                  <span className="text-xs uppercase font-bold text-cyan-300 font-mono">
                    {user?.name?.substring(0, 2) || 'US'}
                  </span>
                </button>

                {/* User menu list */}
                {showUserMenu && (
                  <div 
                    className="absolute right-0 top-12 w-48 rounded border py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50"
                    style={{ backgroundColor: dropdownBg, borderColor: dropdownBorder }}
                  >
                    <div className="px-4 py-2 border-b border-white/5 mb-1.5" style={{ borderBottomColor: dropdownBorder }}>
                      <span className="text-xs font-bold block truncate" style={{ color: isLightTheme ? '#1e293b' : '#ffffff' }}>{user?.name}</span>
                      <span className="text-[10px] text-white/40 block font-mono truncate">{user?.email}</span>
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer transition-all border-t border-white/5 mt-1"
                      style={{ borderTopColor: dropdownBorder }}
                    >
                      <LogOut className="w-3.5 h-3.5" /> Close Gateway (Logout)
                    </button>
                  </div>
                )}
              </div>

            </div>
          </header>

          {/* MAIN PAGE OUTLET CONTENT WRAPPER */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}
