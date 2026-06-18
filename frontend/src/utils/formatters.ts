/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const formatCurrency = (val: number | string | null | undefined, currency: string = 'INR'): string => {
  if (val === undefined || val === null || val === '') return '₹0.00';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '₹0.00';
  
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(num);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatPercent = (val: number | string | null | undefined): string => {
  if (val === undefined || val === null || val === '') return '0.00%';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0.00%';
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

export const formatLargeNumber = (val: number | string | null | undefined): string => {
  if (val === undefined || val === null || val === '') return '0.00';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0.00';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 10_000_000) { // 1 Crore = 10,000,000
    return `${sign}${(absNum / 10_000_000).toFixed(2)} Cr`;
  }
  if (absNum >= 100_000) { // 1 Lakh = 100,000
    return `${sign}${(absNum / 100_000).toFixed(2)} Lakh`;
  }
  if (absNum >= 1_000) {
    return `${sign}${(absNum / 1_000).toFixed(2)} K`;
  }
  return `${sign}${absNum.toFixed(2)}`;
};

export const formatDate = (val: string | Date | null | undefined, formatStr: string = 'DD MMM YYYY'): string => {
  if (!val) return '—';
  const date = typeof val === 'string' ? new Date(val) : val;
  if (isNaN(date.getTime())) return '—';
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  
  if (formatStr === 'DD MMM YYYY') {
    return `${day} ${monthName} ${year}`;
  }
  return date.toLocaleDateString();
};

export const getChangeColor = (val: number | string | null | undefined): string => {
  if (val === undefined || val === null || val === '') return 'text-white/40';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num) || num === 0) return 'text-white/40';
  return num > 0 ? 'text-emerald-400' : 'text-red-400';
};
