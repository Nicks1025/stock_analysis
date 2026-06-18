/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    // Redirect gracefully to login gateway
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminGuard() {
  const user = useAuthStore((state) => state.user);
  
  const isAdmin = user?.roles?.some(r => r.toLowerCase() === 'admin');

  if (!isAdmin) {
    // Gracefully route non-admins back to safety
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

const DEFAULT_SEED_ROLES = [
  { 
    name: 'ADMIN', 
    permissions: [
      'stocks:READ', 'stocks:COMPARE', 'stocks:SCREEN', 'stocks:INSIDER_DEALS',
      'portfolio:READ', 'portfolio:WRITE', 'portfolio:REBALANCE', 'portfolio:TAX_EXPORT',
      'mutual_funds:READ', 'mutual_funds:BUY', 'mutual_funds:REDEEM', 'mutual_funds:SIP',
      'admin:VIEW_LOGS', 'admin:CLEAR_CACHE', 'admin:MANAGE_USERS', 'admin:MANAGE_RBAC'
    ]
  },
  { 
    name: 'ANALYST', 
    permissions: [
      'stocks:READ', 'stocks:COMPARE', 'stocks:SCREEN', 'stocks:INSIDER_DEALS',
      'portfolio:READ', 'mutual_funds:READ'
    ]
  },
  { 
    name: 'SUPERVISOR', 
    permissions: [
      'stocks:READ', 'stocks:COMPARE', 'stocks:SCREEN',
      'portfolio:READ', 'portfolio:WRITE', 'portfolio:REBALANCE',
      'mutual_funds:READ', 'mutual_funds:BUY', 'mutual_funds:REDEEM', 'mutual_funds:SIP'
    ]
  },
  { 
    name: 'COMPLIANCE', 
    permissions: [
      'stocks:READ', 'stocks:INSIDER_DEALS',
      'portfolio:READ', 'portfolio:TAX_EXPORT',
      'mutual_funds:READ', 'admin:VIEW_LOGS'
    ]
  }
];

const DEFAULT_USER_PERMISSIONS = ['stocks:READ', 'portfolio:READ', 'mutual_funds:READ'];

export function usePermission() {
  const user = useAuthStore((state) => state.user);

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user) return false;
    const userRoles = user.roles || [];
    
    // Admin has superuser override
    if (userRoles.some(r => r.toLowerCase() === 'admin')) {
      return true;
    }

    // Load active roles mapping from local db/cache
    const savedRolesRaw = localStorage.getItem('stocksense_rbac_roles_db');
    const roles: any[] = savedRolesRaw ? JSON.parse(savedRolesRaw) : DEFAULT_SEED_ROLES;

    // Check permissions across assigned roles
    const hasAssignedPerm = userRoles.some(userRoleName => {
      const matchedRole = roles.find(r => r.name.toLowerCase() === userRoleName.toLowerCase());
      if (!matchedRole) return false;
      return matchedRole.permissions?.some((p: string) => p.toLowerCase() === requiredPermission.toLowerCase());
    });

    if (hasAssignedPerm) return true;

    // Default basic privileges for raw'user' or unmapped roles
    if (userRoles.some(r => r.toLowerCase() === 'user')) {
      return DEFAULT_USER_PERMISSIONS.some(p => p.toLowerCase() === requiredPermission.toLowerCase());
    }

    return false;
  };

  return { hasPermission };
}

interface PermissionGuardProps {
  requiredPermission: string;
}

export function PermissionGuard({ requiredPermission }: PermissionGuardProps) {
  const { hasPermission } = usePermission();
  
  if (!hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
