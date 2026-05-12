export function gradeNumericField(
  studentValue: number,
  correctValue: number,
  tolerance: number
): { correct: boolean; diff: number } {
  const diff = studentValue - correctValue;
  const correct = Math.abs(diff) <= tolerance;
  return { correct, diff };
}

export function gradeProjectFalconSubmission(
  studentAnswers: Record<string, number>,
  answerKey: Record<string, number>
): {
  score: number;
  total: number;
  results: Record<string, { correct: boolean; diff: number }>;
} {
  const results: Record<string, { correct: boolean; diff: number }> = {};
  let score = 0;

  const keys = Object.keys(answerKey);

  for (const key of keys) {
    const studentValue = studentAnswers[key] ?? NaN;
    const correctValue = answerKey[key];
    const tolerance = Math.max(1e-4, Math.abs(correctValue) * 0.001);
    const result = gradeNumericField(studentValue, correctValue, tolerance);
    results[key] = result;
    if (result.correct) score++;
  }

  return { score, total: keys.length, results };
}
