/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Compass, Info, Plus, X, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import { SPermissionTree, PermissionModule } from '../common/SPermissionTree';

export interface PermissionSpec {
  module: string;
  action: string;
  scope: string;
  clearanceLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
  description: string;
}

const SEED_PERMISSIONS: PermissionSpec[] = [
  { module: 'stocks', action: 'READ', scope: 'stocks:read', clearanceLevel: 'LEVEL_1', description: 'Allows search and stock quote charts loading.' },
  { module: 'stocks', action: 'COMPARE', scope: 'stocks:compare', clearanceLevel: 'LEVEL_1', description: 'Runs competitor fundamental and technical side-by-side matrices.' },
  { module: 'stocks', action: 'SCREEN', scope: 'stocks:screen', clearanceLevel: 'LEVEL_2', description: 'Compile and save technical filters screener results sets.' },
  { module: 'stocks', action: 'INSIDER_DEALS', scope: 'stocks:insider', clearanceLevel: 'LEVEL_2', description: 'Examine promoters trades, Bulk and Block exchange filings.' },
  
  { module: 'portfolio', action: 'READ', scope: 'portfolio:read', clearanceLevel: 'LEVEL_1', description: 'Allows fetching of client asset hold holdings.' },
  { module: 'portfolio', action: 'WRITE', scope: 'portfolio:write', clearanceLevel: 'LEVEL_2', description: 'Record trade positions manually inside the broker ledger.' },
  { module: 'portfolio', action: 'REBALANCE', scope: 'portfolio:rebalance', clearanceLevel: 'LEVEL_2', description: 'Query AI risk analyzer concentration and allocation shift suggestion guides.' },
  { module: 'portfolio', action: 'TAX_EXPORT', scope: 'portfolio:taxes', clearanceLevel: 'LEVEL_3', description: 'Render capital gains taxes report compilations and download PDFs.' },
  
  { module: 'mutual_funds', action: 'READ', scope: 'mutual_funds:read', clearanceLevel: 'LEVEL_1', description: 'Load mutual fund holdings ledger and check true XIRR CAGR.' },
  { module: 'mutual_funds', action: 'BUY', scope: 'mutual_funds:buy', clearanceLevel: 'LEVEL_2', description: 'Approve lump sum capital placement deploy limits.' },
  { module: 'mutual_funds', action: 'REDEEM', scope: 'mutual_funds:redeem', clearanceLevel: 'LEVEL_2', description: 'Confirm selling of active mutual fund units.' },
  { module: 'mutual_funds', action: 'SIP', scope: 'mutual_funds:sip', clearanceLevel: 'LEVEL_2', description: 'Authorize periodic systematic premium debit plan agreements.' },
  
  { module: 'admin', action: 'VIEW_LOGS', scope: 'admin:logs', clearanceLevel: 'LEVEL_3', description: 'Inspect stdout debugging lines and error logs stream.' },
  { module: 'admin', action: 'CLEAR_CACHE', scope: 'admin:cache', clearanceLevel: 'LEVEL_3', description: 'Instruct Redis engine to wipe cached exchange quotes and rebuild buffers.' },
  { module: 'admin', action: 'MANAGE_USERS', scope: 'admin:users', clearanceLevel: 'LEVEL_3', description: 'Determine user account availability status caps.' },
  { module: 'admin', action: 'MANAGE_RBAC', scope: 'admin:rbac', clearanceLevel: 'LEVEL_3', description: 'Modify and declare custom permissions and system security groups.' },
];

export function Permissions() {
  const { enqueueSnackbar } = useSnackbar();

  // Load permissions dynamically from localStorage (simulated DB)
  const [permissions] = useState<PermissionSpec[]>(() => {
    const saved = localStorage.getItem('stocksense_rbac_permissions_specs');
    return saved ? JSON.parse(saved) : SEED_PERMISSIONS;
  });

  // Modal control for adding a role
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>(['stocks:READ']);

  // Dynamic tree structure generator - builds permission tree strictly from whatever exists in DB
  const getDynamicTreeFromDb = (): PermissionModule[] => {
    const modulesMap: Record<string, string[]> = {};
    permissions.forEach(p => {
      const mod = p.module || 'others';
      if (!modulesMap[mod]) {
        modulesMap[mod] = [];
      }
      if (!modulesMap[mod].includes(p.action)) {
        modulesMap[mod].push(p.action);
      }
    });

    return Object.keys(modulesMap).map(moduleName => ({
      module: moduleName,
      actions: modulesMap[moduleName]
    }));
  };

  const dynamicPermissionModules = getDynamicTreeFromDb();
  const allSystemPermissionsList = permissions.map(p => `${p.module}:${p.action}`);

  // Handle addition of role
  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      enqueueSnackbar('Please specify a valid role name.', { variant: 'error' });
      return;
    }

    if (selectedPerms.length === 0) {
      enqueueSnackbar('Role must contain at least 1 enabled permission.', { variant: 'error' });
      return;
    }

    const formattedRoleName = roleName.trim().toUpperCase().replace(/\s+/g, '_');

    // Retrieve active roles from database
    const savedRolesRaw = localStorage.getItem('stocksense_rbac_roles_db');
    const existingRoles = savedRolesRaw ? JSON.parse(savedRolesRaw) : [];

    const nameExists = existingRoles.some((r: any) => r.name === formattedRoleName);
    if (nameExists) {
      enqueueSnackbar(`A role named "${formattedRoleName}" already exists.`, { variant: 'error' });
      return;
    }

    const newRoleObj = {
      id: 'rol-' + Math.random().toString(36).substring(4),
      name: formattedRoleName,
      description: `${formattedRoleName} custom authorization group.`,
      permissions: selectedPerms
    };

    const updatedRoles = [...existingRoles, newRoleObj];
    localStorage.setItem('stocksense_rbac_roles_db', JSON.stringify(updatedRoles));

    enqueueSnackbar(`Security group [${formattedRoleName}] established successfully!`, { variant: 'success' });
    
    // Clear form states
    setRoleName('');
    setSelectedPerms(['stocks:READ']);
    setRoleModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none" id="gatekeeper-permissions-matrix">
      
      {/* Dynamic Header Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-neutral-900 via-neutral-950 to-cyan-950/20 border border-white/5 rounded-lg gap-4">
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Dynamic Tree Layout Authorization</div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5 animate-fade-in" style={{ color: 'var(--brand-cyan)' }}>
            <ShieldCheck className="w-5.5 h-5.5 text-cyan-400" /> System Permissions Matrix
          </h2>
          <p className="text-xs text-white/50 font-mono">Hierarchical tree representation automatically computed from active system records</p>
        </div>

        {/* Dynamic Add Role Trigger Option */}
        <button
          onClick={() => setRoleModalOpen(true)}
          className="text-[10px] uppercase tracking-wider font-mono font-black text-black bg-cyan-400 hover:bg-cyan-300 px-4 py-2.5 rounded cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
          style={{ backgroundColor: 'var(--brand-cyan)' }}
        >
          <Plus className="w-4 h-4 font-black text-black" /> Add Role
        </button>
      </div>

      {/* Info Notice Panel */}
      <div className="flex items-start gap-3 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-lg text-left text-xs text-cyan-200">
        <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
        <p className="leading-relaxed font-mono text-[10.5px]">
          The permissions displayed below are pulled live from the database and constructed into a visual, hierarchical structure. Custom custom-declared categories, features, and action tags will automatically append as separate tree nodes upon database insertion.
        </p>
      </div>

      {/* Exclusively tree view render */}
      <div className="glass-panel p-5 rounded border border-white/5 bg-black/40 space-y-4">
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Compass className="w-4 h-4 text-cyan-400" /> System Permissions Group Tree Matrix (Audit Mode)
          </h3>
          <p className="text-[10px] text-white/40 mt-1 font-mono">All permissions from the database grouped automatically</p>
        </div>

        {/* Render Tree in read-only audit mode showing standard list of active keys */}
        <SPermissionTree
          permissions={dynamicPermissionModules}
          checked={allSystemPermissionsList}
          readOnly={true}
        />
      </div>

      {/* POPUP MODAL: ADD ROLE (WITH ROLENAME & DYNAMIC PERMISSION SELECTOR ONLY) */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm font-mono text-[11px] overflow-y-auto">
          <form 
            onSubmit={handleAddRole} 
            className="bg-neutral-900 border border-white/10 p-5 rounded-lg w-full max-w-xl space-y-4 my-8 relative animate-fade-in text-left"
          >
            {/* Close modal */}
            <button 
              type="button"
              onClick={() => setRoleModalOpen(false)}
              className="absolute right-4 top-4 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-extrabold block">RBAC ROLE GENERATION</span>
              <h4 className="text-white font-extrabold text-sm uppercase">Add Role Instance</h4>
              <p className="text-white/45 text-[9.5px] mt-1 leading-relaxed">
                Add a new security authority group by specifying its exact name and enabling its active operational clearance scopes below.
              </p>
            </div>

            <div className="space-y-4">
              {/* RoleName Input */}
              <div className="space-y-1">
                <span className="text-[9px] text-white/40 uppercase font-black">Role Name Identifier</span>
                <input
                  required
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. PORTFOLIO_SUPERVISOR_VIP"
                  className="w-full p-2.5 bg-black/60 border border-white/10 rounded text-xs text-white uppercase focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[8.5px] text-white/30 block">Unique uppercase identifier with no spaces.</span>
              </div>

              {/* Permission select checkboxes built dynamically from DB permissions */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] text-white/40 uppercase font-black block">Clearance Permission Matrix</span>
                <div className="max-h-[250px] overflow-y-auto pr-1">
                  <SPermissionTree
                    permissions={dynamicPermissionModules}
                    checked={selectedPerms}
                    onChange={(nextKeys) => setSelectedPerms(nextKeys)}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex gap-2.5 justify-end pt-2 text-[10.5px]">
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="px-3.5 py-1.5 border border-white/10 text-white/50 hover:text-white rounded cursor-pointer transition-colors font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4.5 py-1.5 bg-cyan-400 text-black font-black uppercase rounded hover:opacity-95 cursor-pointer transition-opacity"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                Register Role Authority
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default Permissions;
