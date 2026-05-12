import { describe, it, expect } from 'vitest';
import {
  calculateNpv,
  calculateIrr,
  calculateMirr,
  calculatePayback,
  calculateDiscountedPayback,
} from '@/lib/finance/capitalBudgeting';

describe('calculateNpv', () => {
  it('discounts cash flows and subtracts initial outlay', () => {
    const result = calculateNpv(1000, [500, 400, 300], 0.1);
    expect(result.toNumber()).toBeCloseTo(10.52, 2);
  });
});

describe('calculateIrr', () => {
  it('finds the rate that makes NPV zero', () => {
    const result = calculateIrr(1000, [500, 400, 300]);
    expect(result).toBeCloseTo(0.1065, 4);
  });
});

describe('calculateMirr', () => {
  it('calculates MIRR with finance and reinvest rates', () => {
    const result = calculateMirr(1000, [500, 400, 300], 0.1, 0.1);
    expect(result.toNumber()).toBeCloseTo(0.1038, 4);
  });
});

describe('calculatePayback', () => {
  it('returns the period to recover initial outlay', () => {
    const result = calculatePayback(1000, [400, 400, 400]);
    expect(result).toBeCloseTo(2.5, 2);
  });

  it('returns Infinity if never recovered', () => {
    const result = calculatePayback(1000, [100, 100]);
    expect(result).toBe(Infinity);
  });
});

describe('calculateDiscountedPayback', () => {
  it('returns the period to recover initial outlay with discounting', () => {
    const result = calculateDiscountedPayback(1000, [500, 400, 300], 0.1);
    expect(result).toBeCloseTo(2.95, 2);
  });

  it('returns Infinity if never recovered', () => {
    const result = calculateDiscountedPayback(1000, [100, 100], 0.1);
    expect(result).toBe(Infinity);
  });
});
