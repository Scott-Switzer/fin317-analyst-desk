export function awardBadges(
  score: number,
  maxScore: number,
  perfectFields: string[],
  allFields: string[]
): string[] {
  const badges: string[] = [];
  const ratio = maxScore > 0 ? score / maxScore : 0;

  if (ratio >= 0.9) {
    badges.push('Gold Star');
  } else if (ratio >= 0.75) {
    badges.push('Silver Star');
  } else if (ratio >= 0.5) {
    badges.push('Bronze Star');
  }

  if (perfectFields.length === allFields.length && allFields.length > 0) {
    badges.push('Perfect Score');
  }

  if (ratio === 1 && maxScore > 0) {
    badges.push('Ace Analyst');
  }

  return badges;
}
