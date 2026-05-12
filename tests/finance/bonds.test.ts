import { describe, it, expect } from 'vitest';
import {
  calculateBondPrice,
  calculateCurrentYield,
  calculateCapitalGainsYield,
} from '@/lib/finance/bonds';

describe('calculateBondPrice', () => {
  it('calculates the present value of bond cash flows', () => {
    const result = calculateBondPrice(1000, 0.05, 0.06, 10);
    expect(result.toNumber()).toBeCloseTo(926.4, 1);
  });
});

describe('calculateCurrentYield', () => {
  it('returns annual coupon divided by price', () => {
    const result = calculateCurrentYield(50, 926.4);
    expect(result.toNumber()).toBeCloseTo(0.054, 3);
  });
});

describe('calculateCapitalGainsYield', () => {
  it('returns YTM minus current yield', () => {
    const result = calculateCapitalGainsYield(0.06, 0.054);
    expect(result.toNumber()).toBeCloseTo(0.006, 3);
  });
});
