/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Activity, Sliders, Menu } from 'lucide-react';
import { debounce } from '../../utils/debounce';

export interface HeaderItem {
  key: string;
  label: string;
  sort?: boolean;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

export interface RowAction {
  label: string;
  icon: React.ReactNode;
  onClick: (row: any) => void;
}

interface SDataTableProps {
  headers: HeaderItem[];
  data: any[];
  loading?: boolean;
  totalCount?: number;
  pagination?: { page: number; limit: number };
  onPaginationChange?: (page: number, limit: number) => void;
  onSort?: (sortKey: string, sortOrder: 'ASC' | 'DESC' | '') => void;
  onSearch?: (searchText: string) => void;
  searchPlaceholder?: string;
  rowActions?: RowAction[];
}

export function SDataTable({
  headers,
  data,
  loading = false,
  totalCount = 0,
  pagination = { page: 1, limit: 10 },
  onPaginationChange,
  onSort,
  onSearch,
  searchPlaceholder = 'Filter node data...',
  rowActions = [],
}: SDataTableProps) {
  const [internalSearch, setInternalSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | ''>('');

  const debouncedSearchRef = useRef<((val: string) => void) | null>(null);

  useEffect(() => {
    if (onSearch) {
      debouncedSearchRef.current = debounce((val: string) => {
        onSearch(val);
      }, 400);
    }
  }, [onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalSearch(val);
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(val);
    }
  };

  const handleSortClick = (headerKey: string) => {
    if (!onSort) return;
    
    let nextOrder: 'ASC' | 'DESC' | '' = 'ASC';
    if (sortKey === headerKey) {
      if (sortOrder === 'ASC') {
        nextOrder = 'DESC';
      } else if (sortOrder === 'DESC') {
        nextOrder = ''; // reset
      } else {
        nextOrder = 'ASC';
      }
    }

    setSortKey(nextOrder ? headerKey : '');
    setSortOrder(nextOrder);
    onSort(nextOrder ? headerKey : '', nextOrder);
  };

  const handlePageChange = (newPage: number) => {
    if (!onPaginationChange) return;
    onPaginationChange(newPage, pagination.limit);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onPaginationChange) return;
    onPaginationChange(1, parseInt(e.target.value, 10));
  };

  const totalPages = Math.ceil(totalCount / pagination.limit) || 1;
  const startRow = (pagination.page - 1) * pagination.limit + 1;
  const endRow = Math.min(pagination.page * pagination.limit, totalCount);

  return (
    <div className="space-y-4">
      {/* Search Header Action Bar */}
      {onSearch && (
        <div className="flex justify-end">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={internalSearch}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full bg-black/60 border border-white/10 rounded py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
      )}

      {/* Main Table Responsive Grid */}
      <div className="border border-white/5 rounded-lg overflow-hidden bg-black/40 min-w-full relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                {headers.map((h) => {
                  const aligns = {
                    left: 'text-left',
                    center: 'text-center',
                    right: 'text-right',
                  };
                  return (
                    <th
                      key={h.key}
                      style={{ width: h.width }}
                      onClick={() => h.sort && handleSortClick(h.key)}
                      className={`
                        p-4 uppercase tracking-wider font-mono font-bold text-[10px] text-white/50 select-none
                        ${aligns[h.align || 'left']}
                        ${h.sort ? 'cursor-pointer hover:text-white hover:bg-white/[0.01]' : ''}
                      `}
                    >
                      <div className={`inline-flex items-center gap-1.5 ${h.align === 'right' ? 'justify-end w-full' : ''}`}>
                        <span>{h.label}</span>
                        {h.sort && sortKey === h.key && (
                          <span>
                            {sortOrder === 'ASC' ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />}
                          </span>
                        )}
                        {h.sort && sortKey !== h.key && (
                          <span className="opacity-0 hover:opacity-100 text-white/20">
                            <ChevronUp className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
                {rowActions.length > 0 && (
                  <th className="p-4 uppercase tracking-wider font-mono font-semibold text-[10px] text-white/40 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              {loading ? (
                // SKELETON LOADER ROWS
                Array.from({ length: pagination.limit }).map((_, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/[0.01] animate-pulse">
                    {headers.map((h, cIdx) => (
                      <td key={cIdx} className="p-4">
                        <div className="h-4 bg-white/5 rounded w-3/4" />
                      </td>
                    ))}
                    {rowActions.length > 0 && (
                      <td className="p-4 text-right">
                        <div className="h-4 bg-white/5 rounded w-1/3 ml-auto" />
                      </td>
                    )}
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-cyan-500/[0.02] border-b border-white/5 transition-colors">
                    {headers.map((h) => {
                      const aligns = {
                        left: 'text-left',
                        center: 'text-center',
                        right: 'text-right',
                      };
                      return (
                        <td key={h.key} className={`p-4 text-white/80 ${aligns[h.align || 'left']}`}>
                          {row[h.key] !== undefined ? row[h.key] : '—'}
                        </td>
                      );
                    })}
                    {rowActions.length > 0 && (
                      <td className="p-4 text-right space-x-2">
                        <div className="flex gap-2 justify-end">
                          {rowActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              title={action.label}
                              onClick={() => action.onClick(row)}
                              className="p-1.5 rounded border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-white/60 hover:text-cyan-300 cursor-pointer transition-all"
                            >
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                // EMPTY STATE ROWS
                <tr>
                  <td colSpan={headers.length + (rowActions.length > 0 ? 1 : 0)} className="py-12 text-center text-white/40">
                    <div className="flex flex-col items-center gap-2">
                      <Activity className="w-10 h-10 stroke-current text-white/20 animate-pulse" />
                      <span className="font-mono text-xs text-white/50">Zero telemetry nodes matching criteria</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination control layer footer */}
      {onPaginationChange && totalCount > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/50 py-2">
          <div>
            Showing <span className="text-white font-bold">{startRow}</span> to <span className="text-white font-bold">{endRow}</span> of <span className="text-white font-bold">{totalCount}</span> metrics
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Lines per cycle:</span>
              <select
                value={pagination.limit}
                onChange={handleLimitChange}
                className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-1.5 rounded border border-white/10 disabled:border-white/5 disabled:opacity-30 hover:bg-white/5 text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span>
                Page <span className="text-white font-bold">{pagination.page}</span> of <span className="text-white font-bold">{totalPages}</span>
              </span>

              <button
                disabled={pagination.page >= totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-1.5 rounded border border-white/10 disabled:border-white/5 disabled:opacity-30 hover:bg-white/5 text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
