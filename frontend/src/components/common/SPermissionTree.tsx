/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';

export interface PermissionModule {
  module: string;
  actions: string[]; // e.g. ["CREATE", "READ", "UPDATE", "DELETE"]
}

interface SPermissionTreeProps {
  permissions: PermissionModule[];
  checked?: string[]; // list of "module:action" strings
  onChange?: (updatedChecked: string[]) => void;
  readOnly?: boolean;
  className?: string;
}

export function SPermissionTree({
  permissions,
  checked = [],
  onChange,
  readOnly = false,
  className = '',
}: SPermissionTreeProps) {
  // Store collapsed state per module
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapse = (moduleName: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const handleActionToggle = (moduleName: string, actionName: string) => {
    if (readOnly || !onChange) return;

    const targetKey = `${moduleName}:${actionName}`;
    const nextChecked = checked.includes(targetKey)
      ? checked.filter((key) => key !== targetKey)
      : [...checked, targetKey];

    onChange(nextChecked);
  };

  const handleModuleToggle = (module: PermissionModule) => {
    if (readOnly || !onChange) return;

    const moduleKeys = module.actions.map((act) => `${module.module}:${act}`);
    const allChecked = moduleKeys.every((key) => checked.includes(key));

    let nextChecked: string[];
    if (allChecked) {
      // Remove all elements of the module
      nextChecked = checked.filter((key) => !moduleKeys.includes(key));
    } else {
      // Add missing elements of the module
      const uniqueNewKeys = moduleKeys.filter((key) => !checked.includes(key));
      nextChecked = [...checked, ...uniqueNewKeys];
    }

    onChange(nextChecked);
  };

  return (
    <div className={`space-y-3.5 border border-white/5 rounded-lg p-5 bg-black/40 ${className}`}>
      <div className="flex items-center gap-2.5 pb-3 border-b border-white/5 text-left mb-2 select-none">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-white">System Permission Matrix</span>
      </div>

      <div className="space-y-3">
        {permissions.map((moduleItem) => {
          const { module, actions } = moduleItem;
          const isCollapsed = collapsed[module];
          const moduleKeys = actions.map((act) => `${module}:${act}`);
          const checkedCount = moduleKeys.filter((key) => checked.includes(key)).length;
          const allChecked = checkedCount === actions.length;
          const isPartial = checkedCount > 0 && checkedCount < actions.length;

          return (
            <div key={module} className="border border-white/5 rounded bg-black/20 overflow-hidden">
              {/* Module Header Bar Row */}
              <div className="flex items-center justify-between p-3.5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors select-none">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(module)}
                    className="p-1 rounded text-white/55 hover:text-white cursor-pointer hover:bg-white/5"
                  >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleModuleToggle(moduleItem)}
                    className={`flex items-center gap-2 text-xs font-mono font-bold uppercase transition-colors text-left ${readOnly ? 'opacity-85 pointer-events-none' : 'cursor-pointer hover:text-cyan-300'}`}
                  >
                    {allChecked ? (
                      <CheckSquare className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                    ) : isPartial ? (
                      <div className="w-4.5 h-4.5 rounded border border-cyan-400/60 bg-cyan-400/20 flex items-center justify-center shrink-0">
                        <div className="w-2 h-0.5 bg-cyan-400" />
                      </div>
                    ) : (
                      <Square className="w-4.5 h-4.5 text-white/20 shrink-0" />
                    )}
                    <span>{module}</span>
                  </button>
                </div>

                <div className="text-[10px] font-mono text-white/30 px-2 py-0.5 border border-white/5 rounded">
                  {checkedCount}/{actions.length} ENABLED
                </div>
              </div>

              {/* Collapsible Action Checkboxes Panel */}
              {!isCollapsed && (
                <div className="p-4 bg-black/40 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {actions.map((act) => {
                    const actionKey = `${module}:${act}`;
                    const isChecked = checked.includes(actionKey);

                    return (
                      <button
                        key={act}
                        type="button"
                        disabled={readOnly}
                        onClick={() => handleActionToggle(module, act)}
                        className={`
                          flex items-center gap-2 p-2.5 rounded border text-left font-mono text-[10px] transition-all
                          ${readOnly ? 'opacity-80 pointer-events-none' : 'cursor-pointer'}
                          ${isChecked
                            ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-200' 
                            : 'bg-white/[0.01] border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10'
                          }
                        `}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-white/10 shrink-0" />
                        )}
                        <span>{act}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
