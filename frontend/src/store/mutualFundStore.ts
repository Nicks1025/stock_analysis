/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface Scheme {
  id: string;
  name: string;
  category: 'EQUITY' | 'DEBT' | 'HYBRID';
  subCategory: string;
  aum: number;
  nav: number;
  return1Y: number;
  return3Y: number;
  return5Y: number;
  riskRating: 'Low' | 'Moderate' | 'High' | 'Very High';
  expenseRatio: number;
  beta: number;
  stdDev: number; // Std deviation of returns (%)
  sharpeRatio: number;
  equityPercent: number;
  debtPercent: number;
  goldPercent: number;
  cashPercent: number;
  topHoldings: { company: string; weight: number }[];
  minSipAmount: number;
  manager: string;
}

export interface Investment {
  id: string;
  fundId: string;
  fundName: string;
  category: 'EQUITY' | 'DEBT' | 'HYBRID';
  investedAmount: number;
  units: number;
  purchaseNAV: number;
  currentNAV: number;
  currentValue: number;
  purchaseDate: string;
  mappedGoalId: string | null;
}

export interface SIP {
  id: string;
  fundId: string;
  fundName: string;
  category: 'EQUITY' | 'DEBT' | 'HYBRID';
  monthlyAmount: number;
  startDate: string;
  nextPaymentDate: string;
  frequency: 'Monthly' | 'Quarterly';
  installmentsPaid: number;
  totalInvested: number;
  active: boolean;
  mappedGoalId: string | null;
}

interface MutualFundState {
  funds: Scheme[];
  investments: Investment[];
  sips: SIP[];
  compareFundIds: string[];
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  
  setFunds: (funds: Scheme[]) => void;
  setInvestments: (investments: Investment[]) => void;
  setSips: (sips: SIP[]) => void;
  setRiskProfile: (profile: 'conservative' | 'moderate' | 'aggressive') => void;
  
  addInvestment: (investment: Omit<Investment, 'id' | 'currentNAV' | 'currentValue'>) => void;
  redeemInvestment: (id: string, unitsToRedeem: number) => void;
  
  addSip: (sip: Omit<SIP, 'id' | 'installmentsPaid' | 'totalInvested' | 'active'>) => void;
  toggleSipActive: (id: string) => void;
  triggerSipInstallment: (id: string) => void;
  deleteSip: (id: string) => void;
  updateSipGoal: (id: string, goalId: string | null) => void;
  updateInvestmentGoal: (id: string, goalId: string | null) => void;
  
  toggleCompareFund: (fundId: string) => void;
  clearCompare: () => void;
}

const mockSchemes: Scheme[] = [
  {
    id: 'ppfas-flexicap',
    name: 'Parag Parikh Flexi Cap Fund - Direct (G)',
    category: 'EQUITY',
    subCategory: 'Flexi Cap',
    aum: 48620,
    nav: 84.50,
    return1Y: 28.45,
    return3Y: 22.40,
    return5Y: 19.82,
    riskRating: 'Very High',
    expenseRatio: 0.62,
    beta: 0.85,
    stdDev: 14.18,
    sharpeRatio: 1.55,
    equityPercent: 88,
    debtPercent: 2,
    goldPercent: 0,
    cashPercent: 10,
    topHoldings: [
      { company: 'HDFC Bank Ltd.', weight: 8.12 },
      { company: 'Microsoft Corporation', weight: 6.45 },
      { company: 'ICICI Bank Ltd.', weight: 5.80 },
      { company: 'Alphabet Inc.', weight: 4.90 },
      { company: 'ITC Ltd.', weight: 4.15 }
    ],
    minSipAmount: 1000,
    manager: 'Rajeev Thakkar'
  },
  {
    id: 'sbi-bluechip',
    name: 'SBI Bluechip Fund - Direct (G)',
    category: 'EQUITY',
    subCategory: 'Large Cap',
    aum: 39150,
    nav: 72.10,
    return1Y: 18.20,
    return3Y: 15.60,
    return5Y: 14.15,
    riskRating: 'High',
    expenseRatio: 0.85,
    beta: 0.95,
    stdDev: 12.75,
    sharpeRatio: 1.12,
    equityPercent: 96,
    debtPercent: 0,
    goldPercent: 0,
    cashPercent: 4,
    topHoldings: [
      { company: 'ICICI Bank Ltd.', weight: 9.15 },
      { company: 'Reliance Industries Ltd.', weight: 7.82 },
      { company: 'Infosys Ltd.', weight: 6.90 },
      { company: 'Larsen & Toubro Ltd.', weight: 5.40 },
      { company: 'Tata Consultancy Services', weight: 4.88 }
    ],
    minSipAmount: 500,
    manager: 'Sohini Andani'
  },
  {
    id: 'hdfc-balanced',
    name: 'HDFC Balanced Advantage Fund - Direct (G)',
    category: 'HYBRID',
    subCategory: 'Dynamic Asset Allocation',
    aum: 28400,
    nav: 125.40,
    return1Y: 22.40,
    return3Y: 18.20,
    return5Y: 15.80,
    riskRating: 'Moderate',
    expenseRatio: 0.78,
    beta: 0.72,
    stdDev: 10.45,
    sharpeRatio: 1.45,
    equityPercent: 55,
    debtPercent: 32,
    goldPercent: 5,
    cashPercent: 8,
    topHoldings: [
      { company: 'State Bank of India', weight: 6.20 },
      { company: 'HDFC Bank Ltd.', weight: 5.95 },
      { company: 'GOI Floating Rate 2033', weight: 4.80 },
      { company: 'NTPC Ltd.', weight: 3.50 },
      { company: 'Gold ETF Feeder', weight: 5.00 }
    ],
    minSipAmount: 1000,
    manager: 'Gopal Agrawal'
  },
  {
    id: 'absl-corporate-debt',
    name: 'Aditya Birla Sun Life Medium Term Plan',
    category: 'DEBT',
    subCategory: 'Corporate Bond',
    aum: 15230,
    nav: 32.10,
    return1Y: 8.12,
    return3Y: 7.20,
    return5Y: 6.85,
    riskRating: 'Low',
    expenseRatio: 0.45,
    beta: 0.25,
    stdDev: 3.48,
    sharpeRatio: 0.95,
    equityPercent: 0,
    debtPercent: 92,
    goldPercent: 0,
    cashPercent: 8,
    topHoldings: [
      { company: '7.18% GOI Sovereign 2033', weight: 12.40 },
      { company: 'NABARD Corporate Bond', weight: 8.50 },
      { company: 'REC Ltd. AAA Bond', weight: 7.10 },
      { company: 'HDFC Bank Certificate of Deposit', weight: 6.20 },
      { company: 'Small Industries Dev Bank', weight: 5.80 }
    ],
    minSipAmount: 1000,
    manager: 'Kaustubh Gupta'
  },
  {
    id: 'nippon-gold',
    name: 'Nippon India Gold Savings Fund - Direct (G)',
    category: 'HYBRID',
    subCategory: 'Gold ETF Feeder',
    aum: 6840,
    nav: 24.80,
    return1Y: 16.50,
    return3Y: 12.50,
    return5Y: 11.20,
    riskRating: 'Moderate',
    expenseRatio: 0.50,
    beta: 0.40,
    stdDev: 9.15,
    sharpeRatio: 1.05,
    equityPercent: 0,
    debtPercent: 0,
    goldPercent: 98,
    cashPercent: 2,
    topHoldings: [
      { company: 'Nippon India Gold Exchange Traded Scheme', weight: 98.45 },
      { company: 'Cash/Triparty Repo Treasury', weight: 1.55 }
    ],
    minSipAmount: 100,
    manager: 'Vikram Dhawan'
  }
];

const mockInvestments: Investment[] = [
  {
    id: 'inv-1',
    fundId: 'ppfas-flexicap',
    fundName: 'Parag Parikh Flexi Cap Fund - Direct (G)',
    category: 'EQUITY',
    investedAmount: 120000,
    units: 1530.58,
    purchaseNAV: 78.40,
    currentNAV: 84.50,
    currentValue: 129334.01,
    purchaseDate: '2025-04-10',
    mappedGoalId: null // initially unmapped, to let users test mapping
  },
  {
    id: 'inv-2',
    fundId: 'sbi-bluechip',
    fundName: 'SBI Bluechip Fund - Direct (G)',
    category: 'EQUITY',
    investedAmount: 80000,
    units: 1142.86,
    purchaseNAV: 70.00,
    currentNAV: 72.10,
    currentValue: 82399.96,
    purchaseDate: '2025-09-12',
    mappedGoalId: null
  },
  {
    id: 'inv-3',
    fundId: 'absl-corporate-debt',
    fundName: 'Aditya Birla Sun Life Medium Term Plan',
    category: 'DEBT',
    investedAmount: 50000,
    units: 1612.90,
    purchaseNAV: 31.00,
    currentNAV: 32.10,
    currentValue: 51774.09,
    purchaseDate: '2026-01-15',
    mappedGoalId: null
  }
];

const mockSips: SIP[] = [
  {
    id: 'sip-1',
    fundId: 'ppfas-flexicap',
    fundName: 'Parag Parikh Flexi Cap Fund - Direct (G)',
    category: 'EQUITY',
    monthlyAmount: 10000,
    startDate: '2025-05-10',
    nextPaymentDate: '2026-07-10',
    frequency: 'Monthly',
    installmentsPaid: 13,
    totalInvested: 130000,
    active: true,
    mappedGoalId: null
  },
  {
    id: 'sip-2',
    fundId: 'hdfc-balanced',
    fundName: 'HDFC Balanced Advantage Fund - Direct (G)',
    category: 'HYBRID',
    monthlyAmount: 5000,
    startDate: '2025-08-15',
    nextPaymentDate: '2026-07-15',
    frequency: 'Monthly',
    installmentsPaid: 10,
    totalInvested: 50000,
    active: true,
    mappedGoalId: null
  }
];

export const useMutualFundStore = create<MutualFundState>((set) => ({
  funds: mockSchemes,
  investments: mockInvestments,
  sips: mockSips,
  compareFundIds: ['ppfas-flexicap', 'sbi-bluechip'], // Default compared items
  riskProfile: 'moderate',

  setFunds: (funds) => set({ funds }),
  setInvestments: (investments) => set({ investments }),
  setSips: (sips) => set({ sips }),
  setRiskProfile: (riskProfile) => set({ riskProfile }),

  addInvestment: (newInv) => set((state) => {
    const fund = state.funds.find((f) => f.id === newInv.fundId);
    const nav = fund ? fund.nav : newInv.purchaseNAV;
    const currentVal = newInv.units * nav;
    
    const investment: Investment = {
      id: `inv-${Date.now()}`,
      fundId: newInv.fundId,
      fundName: newInv.fundName,
      category: newInv.category,
      investedAmount: newInv.investedAmount,
      units: newInv.units,
      purchaseNAV: newInv.purchaseNAV,
      currentNAV: nav,
      currentValue: parseFloat(currentVal.toFixed(2)),
      purchaseDate: newInv.purchaseDate,
      mappedGoalId: newInv.mappedGoalId
    };

    return {
      investments: [...state.investments, investment]
    };
  }),

  redeemInvestment: (id, unitsToRedeem) => set((state) => {
    const investments = state.investments.map((inv) => {
      if (inv.id !== id) return inv;
      const updatedUnits = Math.max(0, inv.units - unitsToRedeem);
      if (updatedUnits <= 0) return null;
      
      const ratio = updatedUnits / inv.units;
      return {
        ...inv,
        units: parseFloat(updatedUnits.toFixed(4)),
        investedAmount: parseFloat((inv.investedAmount * ratio).toFixed(2)),
        currentValue: parseFloat((inv.currentValue * ratio).toFixed(2))
      };
    }).filter(Boolean) as Investment[];

    return { investments };
  }),

  addSip: (newSip) => set((state) => {
    const sip: SIP = {
      id: `sip-${Date.now()}`,
      fundId: newSip.fundId,
      fundName: newSip.fundName,
      category: newSip.category,
      monthlyAmount: newSip.monthlyAmount,
      startDate: newSip.startDate,
      nextPaymentDate: newSip.nextPaymentDate,
      frequency: newSip.frequency,
      installmentsPaid: 0,
      totalInvested: 0,
      active: true,
      mappedGoalId: newSip.mappedGoalId
    };
    return {
      sips: [...state.sips, sip]
    };
  }),

  toggleSipActive: (id) => set((state) => ({
    sips: state.sips.map((s) => s.id === id ? { ...s, active: !s.active } : s)
  })),

  triggerSipInstallment: (id) => set((state) => {
    const sipIndex = state.sips.findIndex((s) => s.id === id);
    if (sipIndex === -1) return {};

    const sip = state.sips[sipIndex];
    const fund = state.funds.find((f) => f.id === sip.fundId);
    const nav = fund ? fund.nav : 100; // fallback navigate
    const unitsAllocated = parseFloat((sip.monthlyAmount / nav).toFixed(4));
    
    // Add real transaction to investments, merging with existing same-fund transaction or adding as new one
    const newHold = {
      fundId: sip.fundId,
      fundName: sip.fundName,
      category: sip.category,
      investedAmount: sip.monthlyAmount,
      units: unitsAllocated,
      purchaseNAV: nav,
      purchaseDate: new Date().toISOString().split('T')[0],
      mappedGoalId: sip.mappedGoalId
    };

    // Fast-forward next date by 1 month
    const currentDate = new Date(sip.nextPaymentDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
    const nextDateStr = currentDate.toISOString().split('T')[0];

    const updatedSips = state.sips.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          installmentsPaid: s.installmentsPaid + 1,
          totalInvested: s.totalInvested + s.monthlyAmount,
          nextPaymentDate: nextDateStr
        };
      }
      return s;
    });

    // Create unique investment record for audit trace
    const navVal = fund ? fund.nav : nav;
    const currentVal = unitsAllocated * navVal;
    
    const investment: Investment = {
      id: `inv-sip-${Date.now()}`,
      fundId: newHold.fundId,
      fundName: newHold.fundName,
      category: newHold.category,
      investedAmount: newHold.investedAmount,
      units: newHold.units,
      purchaseNAV: newHold.purchaseNAV,
      currentNAV: navVal,
      currentValue: parseFloat(currentVal.toFixed(2)),
      purchaseDate: newHold.purchaseDate,
      mappedGoalId: newHold.mappedGoalId
    };

    return {
      sips: updatedSips,
      investments: [...state.investments, investment]
    };
  }),

  deleteSip: (id) => set((state) => ({
    sips: state.sips.filter((s) => s.id !== id)
  })),

  updateSipGoal: (id, goalId) => set((state) => ({
    sips: state.sips.map((s) => s.id === id ? { ...s, mappedGoalId: goalId } : s)
  })),

  updateInvestmentGoal: (id, goalId) => set((state) => ({
    investments: state.investments.map((inv) => inv.id === id ? { ...inv, mappedGoalId: goalId } : inv)
  })),

  toggleCompareFund: (fundId) => set((state) => {
    const alreadyCompare = state.compareFundIds.includes(fundId);
    if (alreadyCompare) {
      return {
        compareFundIds: state.compareFundIds.filter((id) => id !== fundId)
      };
    } else {
      if (state.compareFundIds.length >= 3) {
        // limit to max 3
        return {
          compareFundIds: [...state.compareFundIds.slice(1), fundId]
        };
      }
      return {
        compareFundIds: [...state.compareFundIds, fundId]
      };
    }
  }),

  clearCompare: () => set({ compareFundIds: [] })
}));
