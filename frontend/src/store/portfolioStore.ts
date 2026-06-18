/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface Holding {
  symbol: string;
  companyName: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pandl: number;
  pandlPercent: number;
  sector: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL';
  date: string;
  sector: string;
}

export interface DividendRecord {
  id: string;
  symbol: string;
  companyName: string;
  recordDate: string;
  paymentDate: string;
  amountPerShare: number;
  totalPayout: number;
  status: 'PAID' | 'DECLARED' | 'UPCOMING';
}

interface PortfolioState {
  holdings: Holding[];
  transactions: Transaction[];
  dividends: DividendRecord[];
  summary: {
    totalInvestment: number;
    currentValue: number;
    totalProfitLoss: number;
    profitLossPercent: number;
    dailyProfitLoss?: number;
    dailyProfitLossPercent?: number;
    
    // Snapshot metrics
    totalValue: number;
    totalProfitAndLoss: number;
    totalProfitAndLossPercent: number;
    todayProfitAndLoss: number;
    todayProfitAndLossPercent: number;
  } | null;
  rebalanceSuggestions: any[];
  dividendIncome: any | null;
  
  // Actions
  setHoldings: (holdings: Holding[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setDividends: (dividends: DividendRecord[]) => void;
  setSummary: (summary: any) => void;
  setRebalanceSuggestions: (suggestions: any[]) => void;
  setDividendIncome: (income: any) => void;
  
  // Helpers
  addLocalTransaction: (tx: Transaction) => void;
  removeLocalTransaction: (id: string) => void;
}

// Get deterministic sectors for assets
export const getSectorForSymbol = (symbol: string): string => {
  const sym = symbol.toUpperCase();
  if (['TCS', 'INFY', 'WIT', 'TECHM', 'WIPRO'].includes(sym)) return 'Information Technology';
  if (['RELIANCE', 'IOC', 'BPCL', 'ONGC'].includes(sym)) return 'Energy & Utilities';
  if (['HDFCBANK', 'SBIN', 'ICICIBANK', 'AXISBANK', 'KOTAKBANK'].includes(sym)) return 'Financial Services';
  if (['L&T', 'LT', 'BHEL', 'SIEMENS'].includes(sym)) return 'Industrials & Capital Goods';
  if (['TATAMOTORS', 'M&M', 'MARUTI'].includes(sym)) return 'Automotive';
  if (['ITC', 'HUL', 'NESTLEIND'].includes(sym)) return 'FMCG & Consumer Goods';
  return 'Healthcare & Pharamaceuticals';
};

export const getCompanyNameForSymbol = (symbol: string): string => {
  const sym = symbol.toUpperCase();
  const names: Record<string, string> = {
    RELIANCE: 'Reliance Industries Ltd.',
    TCS: 'Tata Consultancy Services Ltd.',
    INFY: 'Infosys Limited',
    HDFCBANK: 'HDFC Bank Ltd.',
    SBIN: 'State Bank of India',
    ICICIBANK: 'ICICI Bank Ltd.',
    'L&T': 'Larsen & Toubro Ltd.',
    WIT: 'Wipro Limited'
  };
  return names[sym] || `${sym} Enterprises Ltd.`;
};

// Initial mock transactions to seed sandbox beautifully
const initialTransactions: Transaction[] = [
  { id: 'tx-1', symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd.', quantity: 150, price: 2450.00, type: 'BUY', date: '2025-10-14', sector: 'Energy & Utilities' },
  { id: 'tx-2', symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd.', quantity: 80, price: 3410.00, type: 'BUY', date: '2025-11-20', sector: 'Information Technology' },
  { id: 'tx-3', symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd.', quantity: 200, price: 1480.00, type: 'BUY', date: '2026-01-15', sector: 'Financial Services' },
  { id: 'tx-4', symbol: 'L&T', companyName: 'Larsen & Toubro Ltd.', quantity: 45, price: 1850.00, type: 'BUY', date: '2026-03-02', sector: 'Industrials & Capital Goods' },
  { id: 'tx-5', symbol: 'INFY', companyName: 'Infosys Limited', quantity: 120, price: 1350.00, type: 'BUY', date: '2026-04-10', sector: 'Information Technology' }
];

const initialDividends: DividendRecord[] = [
  { id: 'div-1', symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd.', recordDate: '2026-01-18', paymentDate: '2026-02-05', amountPerShare: 28.00, totalPayout: 2240, status: 'PAID' },
  { id: 'div-2', symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd.', recordDate: '2026-07-15', paymentDate: '2026-08-01', amountPerShare: 10.00, totalPayout: 1500, status: 'DECLARED' },
  { id: 'div-3', symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd.', recordDate: '2026-05-10', paymentDate: '2026-05-25', amountPerShare: 19.50, totalPayout: 3900, status: 'PAID' },
  { id: 'div-4', symbol: 'INFY', companyName: 'Infosys Limited', recordDate: '2026-08-10', paymentDate: '2026-08-25', amountPerShare: 18.00, totalPayout: 2160, status: 'UPCOMING' }
];

// Current stock latest prices to calculate portfolio value live
const latestMockPrices: Record<string, number> = {
  RELIANCE: 2945.50,
  TCS: 3820.10,
  HDFCBANK: 1610.20,
  'L&T': 2140.40,
  INFY: 1485.40,
  WIT: 462.50,
  SBIN: 812.30,
  ICICIBANK: 1120.50
};

// Compute holdings from transactions
const computeHoldingsFromTx = (txs: Transaction[]): Holding[] => {
  const stockMap: Record<string, { qty: number; totalCost: number }> = {};
  
  txs.forEach((tx) => {
    const sym = tx.symbol.toUpperCase();
    if (!stockMap[sym]) {
      stockMap[sym] = { qty: 0, totalCost: 0 };
    }
    if (tx.type === 'BUY') {
      stockMap[sym].qty += tx.quantity;
      stockMap[sym].totalCost += tx.quantity * tx.price;
    } else {
      stockMap[sym].qty -= tx.quantity;
      // In a real weighted ledger, cost of sell doesn't alter acquisition price
      stockMap[sym].totalCost -= tx.quantity * (stockMap[sym].totalCost / Math.max(1, stockMap[sym].qty + tx.quantity));
    }
  });

  const parsedHoldings: Holding[] = [];
  
  Object.keys(stockMap).forEach((sym) => {
    const data = stockMap[sym];
    if (data.qty > 0) {
      const avg = parseFloat((data.totalCost / data.qty).toFixed(2));
      const currentPrice = latestMockPrices[sym] || avg * 1.05; // fallback
      const totalCostVal = avg * data.qty;
      const totalVal = currentPrice * data.qty;
      const pandl = totalVal - totalCostVal;
      const pandlPercent = totalCostVal > 0 ? (pandl / totalCostVal) * 100 : 0;
      
      parsedHoldings.push({
        symbol: sym,
        companyName: getCompanyNameForSymbol(sym),
        quantity: data.qty,
        avgPrice: avg,
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        pandl: parseFloat(pandl.toFixed(2)),
        pandlPercent: parseFloat(pandlPercent.toFixed(2)),
        sector: getSectorForSymbol(sym)
      });
    }
  });

  return parsedHoldings;
};

// Compute summary stats
const computeSummaryStats = (holdingsList: Holding[]) => {
  let totalInv = 0;
  let totalVal = 0;
  let totalDailyPL = 0; // fake dynamic daily delta for interactive dashboards
  
  holdingsList.forEach((h) => {
    totalInv += h.avgPrice * h.quantity;
    totalVal += h.currentPrice * h.quantity;
    // simulated 52w or daily drift (e.g. 0.8% of current value)
    const seed = h.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dailyDrift = ((seed % 7) - 3.2) * 0.005; // ranges between -1.6% and +1.8%
    totalDailyPL += h.currentPrice * h.quantity * dailyDrift;
  });

  const totalPL = totalVal - totalInv;
  const plPercent = totalInv > 0 ? (totalPL / totalInv) * 100 : 0;
  const dailyPLPercent = totalVal > 0 ? (totalDailyPL / totalVal) * 100 : 0;

  return {
    totalInvestment: parseFloat(totalInv.toFixed(2)),
    currentValue: parseFloat(totalVal.toFixed(2)),
    totalProfitLoss: parseFloat(totalPL.toFixed(2)),
    profitLossPercent: parseFloat(plPercent.toFixed(2)),
    dailyProfitLoss: parseFloat(totalDailyPL.toFixed(2)),
    dailyProfitLossPercent: parseFloat(dailyPLPercent.toFixed(2)),
    
    // Backward compatibility for PortfolioSnapshot
    totalValue: parseFloat(totalVal.toFixed(2)),
    totalProfitAndLoss: parseFloat(totalPL.toFixed(2)),
    totalProfitAndLossPercent: parseFloat(plPercent.toFixed(2)),
    todayProfitAndLoss: parseFloat(totalDailyPL.toFixed(2)),
    todayProfitAndLossPercent: parseFloat(dailyPLPercent.toFixed(2))
  };
};

const initialHoldings = computeHoldingsFromTx(initialTransactions);
const initialSummary = computeSummaryStats(initialHoldings);

export const usePortfolioStore = create<PortfolioState>((set) => ({
  holdings: initialHoldings,
  transactions: initialTransactions,
  dividends: initialDividends,
  summary: initialSummary,
  rebalanceSuggestions: [],
  dividendIncome: null,
  
  setHoldings: (holdings) => set((state) => ({ 
    holdings,
    summary: computeSummaryStats(holdings)
  })),
  setTransactions: (transactions) => set((state) => {
    const nextHoldings = computeHoldingsFromTx(transactions);
    return {
      transactions,
      holdings: nextHoldings,
      summary: computeSummaryStats(nextHoldings)
    };
  }),
  setDividends: (dividends) => set({ dividends }),
  setSummary: (sum) => set((state) => {
    if (!sum) return { summary: null };
    const totalInv = sum.totalInvestment ?? 0;
    const totalVal = sum.currentValue ?? sum.totalValue ?? 0;
    const totalPL = sum.totalProfitLoss ?? sum.totalProfitAndLoss ?? (totalVal - totalInv);
    const plPercent = sum.profitLossPercent ?? sum.totalProfitAndLossPercent ?? (totalInv > 0 ? (totalPL / totalInv) * 100 : 0);
    const dailyPL = sum.dailyProfitLoss ?? sum.todayProfitAndLoss ?? 0;
    const dailyPLPercent = sum.dailyProfitLossPercent ?? sum.todayProfitAndLossPercent ?? 0;

    return {
      summary: {
        totalInvestment: totalInv,
        currentValue: totalVal,
        totalProfitLoss: totalPL,
        profitLossPercent: plPercent,
        dailyProfitLoss: dailyPL,
        dailyProfitLossPercent: dailyPLPercent,
        
        totalValue: totalVal,
        totalProfitAndLoss: totalPL,
        totalProfitAndLossPercent: plPercent,
        todayProfitAndLoss: dailyPL,
        todayProfitAndLossPercent: dailyPLPercent
      }
    };
  }),
  setRebalanceSuggestions: (rebalanceSuggestions) => set({ rebalanceSuggestions }),
  setDividendIncome: (dividendIncome) => set({ dividendIncome }),
  
  addLocalTransaction: (tx) => set((state) => {
    const nextTxs = [tx, ...state.transactions];
    const nextHoldings = computeHoldingsFromTx(nextTxs);
    
    // Dynamically calculate and add potential dividends from corporate listings
    const newDividends = [...state.dividends];
    const isFirstTime = !state.dividends.some(d => d.symbol === tx.symbol);
    if (isFirstTime && tx.type === 'BUY') {
      newDividends.push({
        id: 'div-' + Date.now(),
        symbol: tx.symbol,
        companyName: getCompanyNameForSymbol(tx.symbol),
        recordDate: '2026-09-12',
        paymentDate: '2026-09-30',
        amountPerShare: parseFloat(((tx.price * 0.012)).toFixed(2)), // 1.2% mock dividend yield
        totalPayout: parseFloat((tx.quantity * (tx.price * 0.012)).toFixed(2)),
        status: 'DECLARED'
      });
    }

    return {
      transactions: nextTxs,
      holdings: nextHoldings,
      dividends: newDividends,
      summary: computeSummaryStats(nextHoldings)
    };
  }),

  removeLocalTransaction: (id) => set((state) => {
    const nextTxs = state.transactions.filter(t => t.id !== id);
    const nextHoldings = computeHoldingsFromTx(nextTxs);
    return {
      transactions: nextTxs,
      holdings: nextHoldings,
      summary: computeSummaryStats(nextHoldings)
    };
  })
}));
