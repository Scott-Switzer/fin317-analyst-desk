import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import {
  calculateMarketValueEquity,
  calculateMarketValueDebt,
  calculateMarketValuePreferred,
  calculateCapitalWeights,
  calculateCostOfEquityDividendGrowth,
  calculateCostOfPreferred,
  calculateAfterTaxCostOfDebt,
  calculateWacc,
} from '@/lib/finance/wacc';

describe('calculateMarketValueEquity', () => {
  it('multiplies shares outstanding by price per share', () => {
    const result = calculateMarketValueEquity(1000, 50);
    expect(result.toNumber()).toBe(50000);
  });
});

describe('calculateMarketValueDebt', () => {
  it('calculates present value of coupons and face value', () => {
    const result = calculateMarketValueDebt(1000, 0.05, 0.06, 10, 1000);
    expect(result.toNumber()).toBeCloseTo(926.4, 1);
  });
});

describe('calculateMarketValuePreferred', () => {
  it('calculates preferred stock market value', () => {
    const result = calculateMarketValuePreferred(5, 0.08, 200);
    expect(result.toNumber()).toBeCloseTo(12500, 1);
  });
});

describe('calculateCapitalWeights', () => {
  it('returns proportional weights', () => {
    const weights = calculateCapitalWeights(
      new Decimal(600),
      new Decimal(300),
      new Decimal(100)
    );
    expect(weights.ws.toNumber()).toBeCloseTo(0.6, 4);
    expect(weights.wd.toNumber()).toBeCloseTo(0.3, 4);
    expect(weights.wp.toNumber()).toBeCloseTo(0.1, 4);
  });
});

describe('calculateCostOfEquityDividendGrowth', () => {
  it('returns D1/P0 + g', () => {
    const result = calculateCostOfEquityDividendGrowth(2, 40, 0.05);
    expect(result.toNumber()).toBeCloseTo(0.1, 4);
  });
});

describe('calculateCostOfPreferred', () => {
  it('returns dividend divided by price', () => {
    const result = calculateCostOfPreferred(3, 30);
    expect(result.toNumber()).toBeCloseTo(0.1, 4);
  });
});

describe('calculateAfterTaxCostOfDebt', () => {
  it('applies tax shield', () => {
    const result = calculateAfterTaxCostOfDebt(0.08, 0.25);
    expect(result.toNumber()).toBeCloseTo(0.06, 4);
  });
});

describe('calculateWacc', () => {
  it('computes weighted average cost of capital', () => {
    const weights = {
      wd: new Decimal(0.4),
      wp: new Decimal(0.1),
      ws: new Decimal(0.5),
    };
    const costs = {
      rd: new Decimal(0.06),
      rp: new Decimal(0.08),
      rs: new Decimal(0.12),
    };
    const result = calculateWacc(weights, costs, 0.25);
    expect(result.toNumber()).toBeCloseTo(0.086, 4);
  });
});
