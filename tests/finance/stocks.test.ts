import { describe, it, expect } from 'vitest';
import {
  calculateStockPriceDividendGrowth,
  calculateCostOfEquityCapm,
} from '@/lib/finance/stocks';

describe('calculateStockPriceDividendGrowth', () => {
  it('calculates price using Gordon Growth Model', () => {
    const result = calculateStockPriceDividendGrowth(2.5, 0.12, 0.04);
    expect(result.toNumber()).toBeCloseTo(31.25, 2);
  });
});

describe('calculateCostOfEquityCapm', () => {
  it('calculates cost of equity using CAPM', () => {
    const result = calculateCostOfEquityCapm(0.03, 1.2, 0.06);
    expect(result.toNumber()).toBeCloseTo(0.102, 3);
  });
});
