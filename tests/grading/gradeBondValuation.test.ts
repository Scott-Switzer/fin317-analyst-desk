import { describe, it, expect } from "vitest";
import { gradeBondValuationSubmission } from "@/lib/grading/gradeBondValuation";

describe("gradeBondValuationSubmission", () => {
  it("returns perfect score for correct answers", () => {
    const result = gradeBondValuationSubmission({
      bondPrice: 1055.151189,
      currentYield: 0.066341,
      capitalGainsYield: -0.003841,
      yieldToCall: 0.0655,
    });
    expect(result.score).toBe(4);
    expect(result.total).toBe(4);
    expect(result.results.bondPrice.correct).toBe(true);
  });

  it("returns zero for completely wrong answers", () => {
    const result = gradeBondValuationSubmission({
      bondPrice: 900,
      currentYield: 0.05,
      capitalGainsYield: 0.05,
      yieldToCall: 0.03,
    });
    expect(result.score).toBe(0);
  });

  it("handles missing fields", () => {
    const result = gradeBondValuationSubmission({
      bondPrice: 1055.151189,
    } as Record<string, number>);
    expect(result.results.bondPrice.correct).toBe(true);
    expect(result.results.currentYield.correct).toBe(false);
  });

  it("tolerates small rounding differences", () => {
    const result = gradeBondValuationSubmission({
      bondPrice: 1055.15,
      currentYield: 0.0663,
      capitalGainsYield: -0.0038,
      yieldToCall: 0.0655,
    });
    expect(result.score).toBeGreaterThanOrEqual(3);
  });

  it("handles NaN gracefully", () => {
    const result = gradeBondValuationSubmission({
      bondPrice: NaN,
      currentYield: NaN,
      capitalGainsYield: NaN,
      yieldToCall: NaN,
    });
    expect(result.score).toBe(0);
  });
});
