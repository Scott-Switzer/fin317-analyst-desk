import Decimal from 'decimal.js';

export function calculateBondPrice(
  faceValue: number,
  couponRate: number,
  ytm: number,
  periods: number
): Decimal {
  const couponPayment = new Decimal(faceValue).times(couponRate);
  const ytmDecimal = new Decimal(ytm);
  const n = new Decimal(periods);

  const pvCoupons = couponPayment.times(
    Decimal.sub(1, Decimal.pow(ytmDecimal.plus(1), n.negated())).dividedBy(ytmDecimal)
  );

  const pvFace = new Decimal(faceValue).dividedBy(Decimal.pow(ytmDecimal.plus(1), n));

  return pvCoupons.plus(pvFace);
}

export function calculateCurrentYield(annualCoupon: number, price: number): Decimal {
  return new Decimal(annualCoupon).dividedBy(price);
}

export function calculateCapitalGainsYield(ytm: number, currentYield: number): Decimal {
  return new Decimal(ytm).minus(currentYield);
}
