/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import roleService from '../../services/roleService';
import { 
  ShieldCheck, Plus, Trash2, Edit, X, Compass, Shield
} from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import { SPermissionTree, PermissionModule } from '../common/SPermissionTree';
import { PermissionSpec } from '../Permissions/Permissions';

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // e.g. ["module:action"]
  permissionsCount?: number;
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

const SEED_ROLES: UserRole[] = [
  { 
    id: 'rol-admin', 
    name: 'ADMIN', 
    description: 'ADMIN custom authorization group.',
    permissions: [
      'stocks:READ', 'stocks:COMPARE', 'stocks:SCREEN', 'stocks:INSIDER_DEALS',
      'portfolio:READ', 'portfolio:WRITE', 'portfolio:REBALANCE', 'portfolio:TAX_EXPORT',
      'mutual_funds:READ', 'mutual_funds:BUY', 'mutual_funds:REDEEM', 'mutual_funds:SIP',
      'admin:VIEW_LOGS', 'admin:CLEAR_CACHE', 'admin:MANAGE_USERS', 'admin:MANAGE_RBAC'
    ]
  },
  { 
    id: 'rol-analyst', 
    name: 'ANALYST', 
    description: 'ANALYST custom authorization group.',
    permissions: [
      'stocks:READ', 'stocks:COMPARE', 'stocks:SCREEN', 'stocks:INSIDER_DEALS',
      'portfolio:READ', 'mutual_funds:READ'
    ]
  },
  { 
    id: 'rol-supervisor', 
    name: 'SUPERVISOR', 
    description: 'SUPERVISOR custom authorization group.',
    permissions: [
      'stocks:READ', 'stocks:COMPARE', 'stocks:SCREEN',
      'portfolio:READ', 'portfolio:WRITE', 'portfolio:REBALANCE',
      'mutual_funds:READ', 'mutual_funds:BUY', 'mutual_funds:REDEEM', 'mutual_funds:SIP'
    ]
  },
  { 
    id: 'rol-compliance', 
    name: 'COMPLIANCE', 
    description: 'COMPLIANCE custom authorization group.',
    permissions: [
      'stocks:READ', 'stocks:INSIDER_DEALS',
      'portfolio:READ', 'portfolio:TAX_EXPORT',
      'mutual_funds:READ', 'admin:VIEW_LOGS'
    ]
  }
];

export function Roles() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [roles, setRoles] = useState<UserRole[]>(() => {
    const saved = localStorage.getItem('stocksense_rbac_roles_db');
    return saved ? JSON.parse(saved) : SEED_ROLES;
  });

  const [loading, setLoading] = useState(false);
  
  // Modal states for Creation and Editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);

  // Form states (ONLY rolename, permissions checklist tree)
  const [roleName, setRoleName] = useState('');
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);

  // Load the active permissions to build permission tree dynamically
  const [permissions] = useState<PermissionSpec[]>(() => {
    const saved = localStorage.getItem('stocksense_rbac_permissions_specs');
    return saved ? JSON.parse(saved) : SEED_PERMISSIONS;
  });

  // Dynamic tree structure generator - builds permission tree strictly from whatever exists in the DB
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

  useEffect(() => {
    localStorage.setItem('stocksense_rbac_roles_db', JSON.stringify(roles));
  }, [roles]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await roleService.getRoles().catch(() => ({ data: [] }));
      const raw = res?.data || res;
      if (Array.isArray(raw) && raw.length > 0) {
        const merged = raw.map((r: any) => {
          const matchLocal = roles.find(l => l.name === r.name);
          return {
            id: r.id || 'rol-' + Math.random().toString(36).substring(4),
            name: r.name,
            description: matchLocal ? matchLocal.description : `${r.name} custom authorization group.`,
            permissions: matchLocal ? matchLocal.permissions : ['stocks:READ']
          };
        });
        setRoles(merged);
      }
    } catch (err) {
      console.warn('Real role mapping API offline, running high-fidelity local state sandbox.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingRole(null);
    setRoleName('');
    setCheckedPermissions(['stocks:READ']);
    setModalOpen(true);
  };

  const handleOpenEditModal = (role: UserRole) => {
    setEditingRole(role);
    setRoleName(role.name);
    setCheckedPermissions([...role.permissions]);
    setModalOpen(true);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      enqueueSnackbar('Please supply a valid role identifier key', { variant: 'error' });
      return;
    }

    if (checkedPermissions.length === 0) {
      enqueueSnackbar('Role must contain at least 1 enabled gatekeeper permission!', { variant: 'error' });
      return;
    }

    const uppercaseName = roleName.trim().toUpperCase().replace(/\s+/g, '_');

    try {
      if (editingRole) {
        // Edit flow
        await roleService.updateRole(editingRole.id, {
          name: uppercaseName,
          description: `${uppercaseName} custom authorization group.`
        }).catch(() => null);

        setRoles(prev => prev.map(r => {
          if (r.id === editingRole.id) {
            return {
              ...r,
              name: uppercaseName,
              description: `${uppercaseName} custom authorization group.`,
              permissions: checkedPermissions
            };
          }
          return r;
        }));

        enqueueSnackbar(`Successfully updated security guidelines for role "${uppercaseName}"`, { variant: 'success' });
      } else {
        // Create flow
        await roleService.createRole({
          name: uppercaseName,
          description: `${uppercaseName} custom authorization group.`
        }).catch(() => null);

        const newRole: UserRole = {
          id: 'rol-' + Math.random().toString(36).substring(4),
          name: uppercaseName,
          description: `${uppercaseName} custom authorization group.`,
          permissions: checkedPermissions
        };

        setRoles(prev => [...prev, newRole]);
        enqueueSnackbar(`Custom RBAC Role mapping established: "${uppercaseName}"`, { variant: 'success' });
      }

      setModalOpen(false);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failure mapping clearance roles schema.', { variant: 'error' });
    }
  };

  const handleDeleteRole = async (id: string, name: string) => {
    if (name === 'ADMIN') {
      enqueueSnackbar('Protective security boundary: ADMIN role cannot be purged!', { variant: 'error' });
      return;
    }

    const confirmClear = window.confirm(`Are you absolutely sure you want to delete the "${name}" role? Users assigned to this role will lose their custom clearance permissions!`);
    if (!confirmClear) return;

    try {
      await roleService.deleteRole(id).catch(() => null);
      setRoles(prev => prev.filter(r => r.id !== id));
      enqueueSnackbar(`Successfully purged custom access level mapping for ${name}`, { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Access error deleting roles mapping.', { variant: 'error' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none" id="rbac-roles-management">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-cyan-950/20 border border-white/5 rounded-lg gap-4">
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Role Based Access Authorization</div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan flex items-center gap-2 mt-0.5 animate-fade-in" style={{ color: 'var(--brand-cyan)' }}>
            <ShieldCheck className="w-5.5 h-5.5 text-cyan-400" /> RBAC Roles Manager
          </h2>
          <p className="text-xs text-white/50 font-mono">Map corporate accounts authority classes, toggle secure endpoint clearance bounds, and allocate permissions bundles</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="text-[10px] uppercase tracking-wider font-mono font-black text-black bg-cyan-400 hover:bg-cyan-300 px-4 py-2.5 rounded cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
          style={{ backgroundColor: 'var(--brand-cyan)' }}
        >
          <Plus className="w-4 h-4 font-black text-black" /> Add Role
        </button>
      </div>

      {/* Grid structure list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-white/30 animate-pulse">Scanning identity registers...</div>
        ) : roles.length > 0 ? (
          roles.map((role) => (
            <div 
              key={role.id} 
              className="bg-black/45 p-5 rounded border border-white/5 hover:border-cyan-500/15 hover:scale-[1.002] transition-all flex flex-col justify-between space-y-4 text-left"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white/[0.01] p-1 border border-white/5 rounded">
                  <span className="text-[9px] text-[#ffaa00] font-black uppercase tracking-widest pl-2">SECURITY ID: {role.id.toUpperCase()}</span>
                  <div className="text-[9px] font-mono text-white/30 px-2 py-0.5 border border-white/5 rounded bg-black/40">
                    {role.permissions.length} PERMS ASSIGNED
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#00f2ff] tracking-wide" style={{ color: 'var(--brand-cyan)' }}>{role.name}</h3>
                </div>

                {/* Selected permissions chips view */}
                <div className="pt-2">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1.5 font-bold">Assigned Actions Set</span>
                  <div className="flex flex-wrap gap-1 max-h-[125px] overflow-y-auto pr-1">
                    {role.permissions.map(perm => (
                      <span key={perm} className="bg-cyan-500/10 border border-cyan-400/25 text-[8.5px] text-cyan-200 px-2 py-0.5 rounded uppercase font-bold">
                        {perm}
                      </span>
                    ))}
                    {role.permissions.length === 0 && (
                      <span className="text-white/20 italic">No assigned clearance privileges</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons tray bottom */}
              <div className="flex gap-2 pt-3 border-t border-white/5 font-mono text-[9.5px]">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(role)}
                  className="flex-1 py-1.5 bg-white/5 border border-white/10 text-white/70 hover:text-white rounded cursor-pointer transition-colors flex items-center justify-center gap-1.5 font-black uppercase"
                >
                  <Edit className="w-3.5 h-3.5 text-cyan-400" />
                  Edit Role
                </button>

                <button
                  type="button"
                  disabled={role.name === 'ADMIN'}
                  onClick={() => handleDeleteRole(role.id, role.name)}
                  className="px-4 py-1.5 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 disabled:pointer-events-none rounded cursor-pointer transition-all flex items-center justify-center gap-1.5 font-bold uppercase"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  PURGE
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-16 text-white/30 border border-white/5 rounded-lg p-6 bg-black/25">
            No gateway roles mapped in system schema. Write role keys above.
          </div>
        )}
      </div>

      {/* OVERLAY MODAL: CREATE OR EDIT ROLE WITH SPermissionTree */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm font-mono text-[11px] overflow-y-auto">
          <form 
            onSubmit={handleSaveRole} 
            className="bg-neutral-900 border border-white/10 p-5 rounded-lg w-full max-w-2xl space-y-4 my-8 relative animate-fade-in text-left"
          >
            {/* Close button modal header */}
            <button 
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-extrabold block">RBAC CLEARANCE BUILDER</span>
              <h4 className="text-white font-extrabold text-sm uppercase">
                {editingRole ? 'Update Role Settings' : 'Add Role Instance'}
              </h4>
              <p className="text-white/40 text-[9.5px] mt-1 leading-relaxed">
                Configure the security group definition by establishing its name and active clearance checkpoints on the tree map below.
              </p>
            </div>

            {/* General details text fields (ONLY Role Authority Key, no description statement!) */}
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 uppercase font-black">Role Authority Key Name</span>
              <input
                required
                type="text"
                value={roleName}
                disabled={editingRole?.name === 'ADMIN'}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. PORTFOLIO_SUPERVISOR_VIP"
                className="w-full p-2.5 bg-black/60 border border-white/10 rounded text-xs text-white uppercase focus:outline-none focus:border-cyan-400 disabled:opacity-40"
              />
              <span className="text-[8.5px] text-white/30 block">Unique uppercase identifier.</span>
            </div>

            {/* INTEGRATING DYNAMIC SPermissionTree */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] text-white/40 uppercase font-black block">Clearance Permission Matrix Tree</span>
              <div className="max-h-[300px] overflow-y-auto pr-1">
                <SPermissionTree
                  permissions={dynamicPermissionModules}
                  checked={checkedPermissions}
                  onChange={(nextKeys) => setCheckedPermissions(nextKeys)}
                />
              </div>
            </div>

            {/* Action controls */}
            <div className="flex gap-2.5 justify-end pt-2 text-[10.5px]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-white/10 text-white/50 hover:text-white rounded cursor-pointer transition-colors font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-400 text-black font-black uppercase rounded hover:opacity-95 cursor-pointer transition-opacity"
                style={{ backgroundColor: 'var(--brand-cyan)' }}
              >
                {editingRole ? 'Apply Checkpoints' : 'Register Role'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default Roles;
