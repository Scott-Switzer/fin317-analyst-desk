import Decimal from 'decimal.js';

export function calculateStockPriceDividendGrowth(
  dividendNext: number,
  requiredReturn: number,
  growthRate: number
): Decimal {
  const d1 = new Decimal(dividendNext);
  const r = new Decimal(requiredReturn);
  const g = new Decimal(growthRate);
  return d1.dividedBy(r.minus(g));
}

export function calculateCostOfEquityCapm(
  riskFreeRate: number,
  beta: number,
  marketRiskPremium: number
): Decimal {
  return new Decimal(riskFreeRate).plus(new Decimal(beta).times(marketRiskPremium));
}
