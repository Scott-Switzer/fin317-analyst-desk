import { describe, it, expect } from 'vitest';
import {
  gradeNumericField,
  gradeProjectFalconSubmission,
} from '@/lib/grading/gradeProjectFalcon';
import { calculateXpAward } from '@/lib/grading/xp';
import { awardBadges } from '@/lib/grading/badges';

describe('gradeNumericField', () => {
  it('marks correct when within tolerance', () => {
    const result = gradeNumericField(10.01, 10, 0.05);
    expect(result.correct).toBe(true);
    expect(result.diff).toBeCloseTo(0.01, 4);
  });

  it('marks incorrect when outside tolerance', () => {
    const result = gradeNumericField(10.2, 10, 0.05);
    expect(result.correct).toBe(false);
  });
});

describe('gradeProjectFalconSubmission', () => {
  it('scores a submission against an answer key', () => {
    const student = { a: 10, b: 20 };
    const key = { a: 10, b: 21 };
    const result = gradeProjectFalconSubmission(student, key);
    expect(result.score).toBe(1);
    expect(result.total).toBe(2);
    expect(result.results.a.correct).toBe(true);
    expect(result.results.b.correct).toBe(false);
  });
});

describe('calculateXpAward', () => {
  it('awards base XP proportional to score', () => {
    expect(calculateXpAward(8, 10)).toBe(80);
  });

  it('adds time bonus when provided', () => {
    expect(calculateXpAward(8, 10, 10)).toBe(90);
  });

  it('returns 0 when maxScore is 0 or negative', () => {
    expect(calculateXpAward(5, 0)).toBe(0);
  });
});

describe('awardBadges', () => {
  it('awards Gold Star for high scores', () => {
    const badges = awardBadges(9, 10, ['a', 'b'], ['a', 'b', 'c']);
    expect(badges).toContain('Gold Star');
  });

  it('awards Perfect Score and Ace Analyst for 100%', () => {
    const badges = awardBadges(10, 10, ['a', 'b'], ['a', 'b']);
    expect(badges).toContain('Perfect Score');
    expect(badges).toContain('Ace Analyst');
  });

  it('awards Bronze Star for passing score', () => {
    const badges = awardBadges(5, 10, [], ['a', 'b']);
    expect(badges).toContain('Bronze Star');
  });
});
