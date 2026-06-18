/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const calculatorService = {
  /**
   * Calculates the required monthly SIP contribution to reach a target amount
   * given a current lump sum, expected annual return rate (%), and years.
   */
  computeSip: (
    targetAmount: number,
    currentAmount: number,
    timelineYears: number,
    expectedReturnRate: number = 12
  ): number => {
    const remaining = targetAmount - currentAmount;
    if (remaining <= 0) return 0;
    
    const r = expectedReturnRate / 100 / 12; // monthly rate
    const n = timelineYears * 12; // total monthly intervals
    
    if (r === 0) {
      return remaining / n;
    }
    
    // Formula: Future Value of SIP = SIP * [((1 + r)^n - 1) / r]
    // Re-arranging for SIP: SIP = remaining * r / [((1 + r)^n - 1)]
    const monthlySip = (remaining * r) / (Math.pow(1 + r, n) - 1);
    return Math.max(0, monthlySip);
  },

  /**
   * Simulates the growth of an investment with Dividend Reinvestment (DRIP)
   * over a given period of years, with periodic addition and dividend payouts.
   */
  simulateDrip: (
    initialInvestment: number,
    annualReturnRate: number,
    dividendYieldRate: number,
    timelineYears: number,
    reinvestDividends: boolean = true
  ) => {
    let balance = initialInvestment;
    const history = [];

    for (let yr = 1; yr <= timelineYears; yr++) {
      const dividendsEarned = balance * (dividendYieldRate / 100);
      const stockAppreciation = balance * (annualReturnRate / 100);
      
      const previousBalance = balance;
      if (reinvestDividends) {
        balance += stockAppreciation + dividendsEarned;
      } else {
        balance += stockAppreciation;
      }

      history.push({
        year: yr,
        dividendsEarned,
        appreciation: stockAppreciation,
        endingBalance: balance,
        cumulativeDividends: reinvestDividends ? (dividendsEarned + (history[yr - 2]?.cumulativeDividends || 0)) : (dividendsEarned * yr)
      });
    }

    return {
      endingBalance: balance,
      totalDividendsEarned: history.reduce((sum, h) => sum + h.dividendsEarned, 0),
      history
    };
  }
};

export default calculatorService;
