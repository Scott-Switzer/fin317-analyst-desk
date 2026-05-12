export function calculateXpAward(
  score: number,
  maxScore: number,
  timeBonus?: number
): number {
  if (maxScore <= 0) return 0;
  const base = (score / maxScore) * 100;
  const bonus = timeBonus ?? 0;
  return Math.round(base + bonus);
}
