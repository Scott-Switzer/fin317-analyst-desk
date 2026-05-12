import Decimal from 'decimal.js';

export function calculateMarketValueEquity(
  sharesOutstanding: number,
  pricePerShare: number
): Decimal {
  return new Decimal(sharesOutstanding).times(pricePerShare);
}

export function calculateMarketValueDebt(
  bookValueDebt: number,
  couponRate: number,
  ytm: number,
  yearsToMaturity: number,
  faceValue: number
): Decimal {
  const couponPayment = new Decimal(faceValue).times(couponRate);
  const ytmDecimal = new Decimal(ytm);
  const periods = new Decimal(yearsToMaturity);

  const pvCoupons = couponPayment.times(
    Decimal.sub(1, Decimal.pow(ytmDecimal.plus(1), periods.negated())).div(ytmDecimal)
  );

  const pvFace = new Decimal(faceValue).div(Decimal.pow(ytmDecimal.plus(1), periods));

  return pvCoupons.plus(pvFace);
}

export function calculateMarketValuePreferred(
  dividendPerShare: number,
  requiredReturn: number,
  sharesOutstanding: number
): Decimal {
  const totalDividend = new Decimal(dividendPerShare).times(sharesOutstanding);
  return totalDividend.dividedBy(requiredReturn);
}

export function calculateCapitalWeights(
  mvEquity: Decimal,
  mvDebt: Decimal,
  mvPreferred: Decimal
): { wd: Decimal; wp: Decimal; ws: Decimal } {
  const total = mvEquity.plus(mvDebt).plus(mvPreferred);
  return {
    wd: mvDebt.dividedBy(total),
    wp: mvPreferred.dividedBy(total),
    ws: mvEquity.dividedBy(total),
  };
}

export function calculateCostOfEquityDividendGrowth(
  dividendPerShare: number,
  price: number,
  growthRate: number
): Decimal {
  const d1 = new Decimal(dividendPerShare);
  const p = new Decimal(price);
  const g = new Decimal(growthRate);
  return d1.dividedBy(p).plus(g);
}

export function calculateCostOfPreferred(
  dividendPerShare: number,
  price: number
): Decimal {
  return new Decimal(dividendPerShare).dividedBy(price);
}

export function calculateAfterTaxCostOfDebt(
  pretaxCost: number,
  taxRate: number
): Decimal {
  return new Decimal(pretaxCost).times(new Decimal(1).minus(taxRate));
}

export function calculateWacc(
  weights: { wd: Decimal; wp: Decimal; ws: Decimal },
  costs: { rd: Decimal; rp: Decimal; rs: Decimal },
  taxRate: number
): Decimal {
  const t = new Decimal(taxRate);
  return weights.wd
    .times(costs.rd)
    .times(Decimal.sub(1, t))
    .plus(weights.wp.times(costs.rp))
    .plus(weights.ws.times(costs.rs));
}
