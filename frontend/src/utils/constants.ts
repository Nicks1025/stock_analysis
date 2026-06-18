/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const POLLING_INTERVALS = {
  LIVE_INDICES: 30000,      // 30s
  MARKET_STATUS: 60000,     // 60s
  STOCK_QUOTE: 60000,       // 60s
  WATCHLIST_PRICES: 60000,  // 60s
  PORTFOLIO_PL: 120000,     // 2min
  NOTIFICATIONS: 120000,    // 2min
};

export const SECTORS = [
  'IT',
  'Financial Services',
  'Consumer Goods',
  'Automobile',
  'Oil & Gas',
  'Metals & Mining',
  'Pharmaceuticals',
  'Chemicals',
  'Construction',
  'Power & Utilities',
  'Telecommunication'
];

export const SENTIMENTS = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral'
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  BROKER: 'broker'
};
