import Decimal from 'decimal.js';

export function calculateNpv(
  initialOutlay: number,
  cashFlows: number[],
  discountRate: number
): Decimal {
  const r = new Decimal(discountRate);
  let npv = new Decimal(-initialOutlay);

  cashFlows.forEach((cf, index) => {
    const period = index + 1;
    const pv = new Decimal(cf).dividedBy(Decimal.pow(r.plus(1), period));
    npv = npv.plus(pv);
  });

  return npv;
}

export function calculateIrr(initialOutlay: number, cashFlows: number[]): number {
  const flows = [-initialOutlay, ...cashFlows];

  let guess = 0.1;
  const maxIterations = 100;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let t = 0; t < flows.length; t++) {
      const factor = Math.pow(1 + guess, t);
      npv += flows[t] / factor;
      derivative -= (t * flows[t]) / Math.pow(1 + guess, t + 1);
    }

    if (Math.abs(npv) < tolerance) {
      return guess;
    }

    if (Math.abs(derivative) < 1e-12) {
      break;
    }

    guess = guess - npv / derivative;
  }

  let low = -0.9999;
  let high = 10;

  const npvAt = (rate: number) => {
    return flows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
  };

  let mid = (low + high) / 2;
  for (let i = 0; i < 100; i++) {
    const npvMid = npvAt(mid);
    if (Math.abs(npvMid) < tolerance) return mid;

    if (npvAt(low) * npvMid < 0) {
      high = mid;
    } else {
      low = mid;
    }
    mid = (low + high) / 2;
  }

  return mid;
}

export function calculateMirr(
  initialOutlay: number,
  cashFlows: number[],
  financeRate: number,
  reinvestRate: number
): Decimal {
  const flows = [-initialOutlay, ...cashFlows];
  const n = flows.length - 1;

  let pvNeg = new Decimal(0);
  let fvPos = new Decimal(0);

  for (let t = 0; t < flows.length; t++) {
    const cf = flows[t];
    if (cf < 0) {
      pvNeg = pvNeg.plus(
        new Decimal(cf).dividedBy(Decimal.pow(new Decimal(1).plus(financeRate), t))
      );
    } else {
      fvPos = fvPos.plus(
        new Decimal(cf).times(Decimal.pow(new Decimal(1).plus(reinvestRate), n - t))
      );
    }
  }

  const absPvNeg = pvNeg.abs();

  if (absPvNeg.isZero()) {
    return new Decimal(Infinity);
  }

  return Decimal.pow(fvPos.dividedBy(absPvNeg), new Decimal(1).dividedBy(n)).minus(1);
}

export function calculatePayback(
  initialOutlay: number,
  cashFlows: number[]
): number {
  let cumulative = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    cumulative += cashFlows[i];
    if (cumulative >= initialOutlay) {
      const previousCumulative = cumulative - cashFlows[i];
      const fraction = (initialOutlay - previousCumulative) / cashFlows[i];
      return i + fraction;
    }
  }
  return Infinity;
}

export function calculateDiscountedPayback(
  initialOutlay: number,
  cashFlows: number[],
  discountRate: number
): number {
  let cumulative = new Decimal(0);
  for (let i = 0; i < cashFlows.length; i++) {
    const pv = new Decimal(cashFlows[i]).dividedBy(
      Decimal.pow(new Decimal(1).plus(discountRate), i + 1)
    );
    cumulative = cumulative.plus(pv);
    if (cumulative.greaterThanOrEqualTo(initialOutlay)) {
      const previousCumulative = cumulative.minus(pv);
      const fraction = new Decimal(initialOutlay)
        .minus(previousCumulative)
        .dividedBy(pv)
        .toNumber();
      return i + fraction;
    }
  }
  return Infinity;
}
