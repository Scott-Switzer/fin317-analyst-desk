import { describe, it, expect } from "vitest";
import { gradeStockValuationSubmission } from "@/lib/grading/gradeStockValuation";

describe("gradeStockValuationSubmission", () => {
  it("returns perfect score for correct answers", () => {
    const result = gradeStockValuationSubmission({
      costOfEquityCAPM: 0.118,
      costOfEquityDGM: 0.098462,
      intrinsicValueConstantGrowth: 37.058824,
      intrinsicValueTwoStage: 31.151377,
    });
    expect(result.score).toBe(4);
    expect(result.total).toBe(4);
    expect(result.results.costOfEquityCAPM.correct).toBe(true);
    expect(result.results.intrinsicValueTwoStage.correct).toBe(true);
  });

  it("detects wrong cost of equity", () => {
    const result = gradeStockValuationSubmission({
      costOfEquityCAPM: 0.10,
      costOfEquityDGM: 0.12,
      intrinsicValueConstantGrowth: 37.058824,
      intrinsicValueTwoStage: 31.151377,
    });
    expect(result.results.costOfEquityCAPM.correct).toBe(false);
    expect(result.results.costOfEquityDGM.correct).toBe(false);
  });

  it("detects wrong intrinsic values", () => {
    const result = gradeStockValuationSubmission({
      costOfEquityCAPM: 0.118,
      costOfEquityDGM: 0.098462,
      intrinsicValueConstantGrowth: 52.0,
      intrinsicValueTwoStage: 52.0,
    });
    expect(result.results.intrinsicValueConstantGrowth.correct).toBe(false);
    expect(result.results.intrinsicValueTwoStage.correct).toBe(false);
  });

  it("tolerates small rounding differences", () => {
    const result = gradeStockValuationSubmission({
      costOfEquityCAPM: 0.118,
      costOfEquityDGM: 0.098,
      intrinsicValueConstantGrowth: 37.06,
      intrinsicValueTwoStage: 31.15,
    });
    expect(result.score).toBeGreaterThanOrEqual(3);
  });
});
