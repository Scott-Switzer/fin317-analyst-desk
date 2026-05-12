import answerKey from "@/../rubrics/bond-valuation.answer-key.v1.json";

export function gradeNumericFieldBond(
  studentValue: number,
  correctValue: number,
  tolerance: number
): { correct: boolean; diff: number } {
  const diff = studentValue - correctValue;
  const correct = Math.abs(diff) <= tolerance;
  return { correct, diff };
}

export function gradeBondValuationSubmission(
  studentAnswers: Record<string, number>
): {
  score: number;
  total: number;
  results: Record<string, { correct: boolean; diff: number }>;
} {
  const results: Record<string, { correct: boolean; diff: number }> = {};

  const fields: { key: string; correct: number; tolerance: number }[] = [
    { key: "bondPrice", correct: answerKey.bondPrice, tolerance: 0.50 },
    { key: "currentYield", correct: answerKey.currentYield, tolerance: 0.001 },
    { key: "capitalGainsYield", correct: answerKey.capitalGainsYield, tolerance: 0.001 },
    { key: "yieldToCall", correct: answerKey.yieldToCall, tolerance: 0.002 },
  ];

  let score = 0;
  for (const field of fields) {
    const studentValue = studentAnswers[field.key] ?? NaN;
    const result = gradeNumericFieldBond(studentValue, field.correct, field.tolerance);
    results[field.key] = result;
    if (result.correct) score++;
  }

  return { score, total: fields.length, results };
}
