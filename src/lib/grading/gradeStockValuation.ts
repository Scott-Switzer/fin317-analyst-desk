import answerKey from "@/../rubrics/stock-valuation.answer-key.v1.json";

export function gradeNumericFieldStock(
  studentValue: number,
  correctValue: number,
  tolerance: number
): { correct: boolean; diff: number } {
  const diff = studentValue - correctValue;
  const correct = Math.abs(diff) <= tolerance;
  return { correct, diff };
}

export function gradeStockValuationSubmission(
  studentAnswers: Record<string, number>
): {
  score: number;
  total: number;
  results: Record<string, { correct: boolean; diff: number }>;
} {
  const results: Record<string, { correct: boolean; diff: number }> = {};

  const fields: { key: string; correct: number; tolerance: number }[] = [
    { key: "costOfEquityCAPM", correct: answerKey.costOfEquityCAPM, tolerance: 0.005 },
    { key: "costOfEquityDGM", correct: answerKey.costOfEquityDGM, tolerance: 0.005 },
    { key: "intrinsicValueConstantGrowth", correct: answerKey.intrinsicValueConstantGrowth, tolerance: 1.00 },
    { key: "intrinsicValueTwoStage", correct: answerKey.intrinsicValueTwoStage, tolerance: 1.00 },
  ];

  let score = 0;
  for (const field of fields) {
    const studentValue = studentAnswers[field.key] ?? NaN;
    const result = gradeNumericFieldStock(studentValue, field.correct, field.tolerance);
    results[field.key] = result;
    if (result.correct) score++;
  }

  return { score, total: fields.length, results };
}
