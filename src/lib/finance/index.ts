// src/lib/finance/index.ts
// Core finance utility functions for WACC and capital budgeting calculations.

export function calculateBondMarketValue(
  faceValue: number,
  couponRate: number,
  ytm: number,
  yearsToMaturity: number
): number {
  const coupon = faceValue * couponRate;
  const pvCoupons =
    (coupon * (1 - Math.pow(1 + ytm, -yearsToMaturity))) / ytm;
  const pvFace = faceValue / Math.pow(1 + ytm, yearsToMaturity);
  return pvCoupons + pvFace;
}

export function calculatePreferredMarketValue(
  dividendPerShare: number,
  requiredReturn: number,
  sharesOutstanding: number
): number {
  const pricePerShare = dividendPerShare / requiredReturn;
  return pricePerShare * sharesOutstanding;
}

export function calculateEquityMarketValue(
  sharesOutstanding: number,
  pricePerShare: number
): number {
  return sharesOutstanding * pricePerShare;
}

export function calculateCapitalWeights(
  mvDebt: number,
  mvPreferred: number,
  mvEquity: number
): { wd: number; wp: number; ws: number } {
  const total = mvDebt + mvPreferred + mvEquity;
  return {
    wd: mvDebt / total,
    wp: mvPreferred / total,
    ws: mvEquity / total,
  };
}

export function calculateAfterTaxCostOfDebt(
  ytm: number,
  taxRate: number
): number {
  return ytm * (1 - taxRate);
}

export function calculateCostOfPreferred(
  dividendPerShare: number,
  marketPricePerShare: number
): number {
  return dividendPerShare / marketPricePerShare;
}

export function calculateCostOfEquityCAPM(
  riskFreeRate: number,
  beta: number,
  marketRiskPremium: number
): number {
  return riskFreeRate + beta * marketRiskPremium;
}

export function calculateCostOfEquityDGM(
  dividendPerShare: number,
  growthRate: number,
  pricePerShare: number
): number {
  return (dividendPerShare * (1 + growthRate)) / pricePerShare + growthRate;
}

export function calculateWACC(
  wd: number,
  wp: number,
  ws: number,
  afterTaxCostOfDebt: number,
  costOfPreferred: number,
  costOfEquity: number
): number {
  return (
    wd * afterTaxCostOfDebt +
    wp * costOfPreferred +
    ws * costOfEquity
  );
}

export function calculateNPV(
  rate: number,
  initialOutlay: number,
  annualFlows: number[]
): number {
  let pv = 0;
  for (let i = 0; i < annualFlows.length; i++) {
    pv += annualFlows[i] / Math.pow(1 + rate, i + 1);
  }
  return pv - initialOutlay;
}

export function calculateIRR(
  initialOutlay: number,
  annualFlows: number[]
): number {
  const maxIterations = 200;
  const precision = 1e-12;
  let low = -0.9999;
  let high = 1.0;

  // Expand upper bound if NPV is still positive
  while (calculateNPV(high, initialOutlay, annualFlows) > 0 && high < 100) {
    high *= 2;
  }

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const npv = calculateNPV(mid, initialOutlay, annualFlows);
    if (Math.abs(npv) < precision) {
      return mid;
    }
    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

export function calculateMIRR(
  initialOutlay: number,
  annualFlows: number[],
  financeRate: number,
  reinvestmentRate: number
): number {
  const n = annualFlows.length;
  let pvNegative = initialOutlay;

  for (let i = 0; i < annualFlows.length; i++) {
    if (annualFlows[i] < 0) {
      pvNegative += annualFlows[i] / Math.pow(1 + financeRate, i + 1);
    }
  }

  let fvPositive = 0;
  for (let i = 0; i < annualFlows.length; i++) {
    if (annualFlows[i] > 0) {
      fvPositive +=
        annualFlows[i] * Math.pow(1 + reinvestmentRate, n - (i + 1));
    }
  }

  return Math.pow(fvPositive / pvNegative, 1 / n) - 1;
}

export function calculatePaybackPeriod(
  initialOutlay: number,
  annualFlows: number[]
): number {
  let cumulative = 0;
  for (let i = 0; i < annualFlows.length; i++) {
    cumulative += annualFlows[i];
    if (cumulative >= initialOutlay) {
      const previousCumulative = cumulative - annualFlows[i];
      const fraction =
        (initialOutlay - previousCumulative) / annualFlows[i];
      return i + fraction;
    }
  }
  return annualFlows.length;
}

export function calculateDiscountedPaybackPeriod(
  rate: number,
  initialOutlay: number,
  annualFlows: number[]
): number {
  let cumulative = 0;
  for (let i = 0; i < annualFlows.length; i++) {
    const discounted = annualFlows[i] / Math.pow(1 + rate, i + 1);
    cumulative += discounted;
    if (cumulative >= initialOutlay) {
      const previousCumulative = cumulative - discounted;
      const fraction =
        (initialOutlay - previousCumulative) / discounted;
      return i + fraction;
    }
  }
  return annualFlows.length;
}
