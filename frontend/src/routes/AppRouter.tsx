/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import { AuthGuard, AdminGuard, PermissionGuard } from './RouteGuards';

// Immersive visual page features
import { CompareStocks } from '../pages/CompareStocks';
import { Goals } from '../pages/Goals';
import { TaxReports } from '../pages/TaxReports';
import { Stocks } from '../pages/Stocks';
import { StockScreener } from '../pages/StockScreener';
import { Portfolio } from '../pages/Portfolio';
import { MutualFunds } from '../pages/MutualFunds';
import { News } from '../pages/News';
import { Watchlist } from '../pages/Watchlist';
import { Settings } from '../pages/Settings';
import { Alerts } from '../pages/Alerts';
import { EconomicCalendar } from '../pages/EconomicCalendar';
import { DividendCalendar } from '../pages/DividendCalendar';
import { IPOs } from '../pages/IPOs';
import { Earnings } from '../pages/Earnings';
import { SavedScreeners } from '../pages/SavedScreeners';
import { AdminPanel } from '../pages/Admin';
import { Roles } from '../pages/Roles';
import { Permissions } from '../pages/Permissions';
import { Features } from '../pages/features';

// Public Gateway credentials
import { Login } from '../pages/Login';
import { AdminLogin } from '../pages/AdminLogin';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { OtpVerification } from '../pages/OtpVerification';
import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';

// Dynamic Core Pages
import { Dashboard } from '../pages/Dashboard';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROOT GATEWAYS */}
        <Route path="/" element={<Home />} />
        
        {/* AUTH GATEWAY SHELLS (LOGIN, REGISTER) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
        </Route>

        {/* SECURE PROTECTED PLATFORM ROTATIONS */}
        <Route element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/stocks/:symbol" element={<Stocks />} />

            {/* Screener module authorization */}
            <Route element={<PermissionGuard requiredPermission="stocks:SCREEN" />}>
              <Route path="/screener" element={<StockScreener />} />
              <Route path="/screener/saved" element={<SavedScreeners />} />
            </Route>

            {/* Portfolio and holds ledger authorization */}
            <Route element={<PermissionGuard requiredPermission="portfolio:READ" />}>
              <Route path="/portfolio" element={<Portfolio />} />
            </Route>

            {/* Mutual funds module authorization */}
            <Route element={<PermissionGuard requiredPermission="mutual_funds:READ" />}>
              <Route path="/mutual-funds" element={<MutualFunds />} />
            </Route>

            <Route path="/news" element={<News />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/economic-calendar" element={<EconomicCalendar />} />
            <Route path="/dividend-calendar" element={<DividendCalendar />} />
            <Route path="/ipo" element={<IPOs />} />
            <Route path="/earnings" element={<Earnings />} />

            {/* Stock Comparison authorization */}
            <Route element={<PermissionGuard requiredPermission="stocks:COMPARE" />}>
              <Route path="/compare" element={<CompareStocks />} />
            </Route>

            <Route path="/goals" element={<Goals />} />

            {/* Tax reports capital gains list authorization */}
            <Route element={<PermissionGuard requiredPermission="portfolio:TAX_EXPORT" />}>
              <Route path="/tax-reports" element={<TaxReports />} />
            </Route>
            
            {/* ADMIN CONSOLE PROTECIED SEGMENT */}
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/permissions" element={<Permissions />} />
            </Route>
          </Route>
        </Route>

        {/* FALLBACK REDIRECT BOUNDARIES */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export { AuthGuard, AdminGuard };
