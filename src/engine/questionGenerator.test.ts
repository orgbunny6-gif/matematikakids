/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { generateQuestion } from './questionGenerator.ts';
import { verifyQuestion } from './verify.ts';
import { SeededRNG } from './rng.ts';
import { calculateLevel, calculateStars, getXpForQuestion } from './xpRules.ts';
import { encodeHomework, decodeHomework } from './homeworkCode.ts';

describe('Math Engine & Question Generator Invariants', () => {
  it('generates 1,000 mathematically valid questions with 100% verification pass', () => {
    const rng = new SeededRNG(42);
    for (let i = 0; i < 1000; i++) {
      const q = generateQuestion({ rng });
      const isValid = verifyQuestion(q);
      expect(isValid).toBe(true);

      if (typeof q.answer === 'number') {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(q.answer)).toBe(true);
      }

      if (q.options) {
        // Options must not contain duplicate answers
        const uniqueSet = new Set(q.options);
        expect(uniqueSet.size).toBe(q.options.length);
        // Options must contain the answer
        expect(q.options).toContain(q.answer);
      }
    }
  });

  it('produces deterministic output with same seed', () => {
    const rng1 = new SeededRNG(12345);
    const rng2 = new SeededRNG(12345);

    const q1 = generateQuestion({ rng: rng1, difficulty: 'medium' });
    const q2 = generateQuestion({ rng: rng2, difficulty: 'medium' });

    expect(q1.equationString).toBe(q2.equationString);
    expect(q1.answer).toBe(q2.answer);
  });

  it('correctly calculates XP and progressive levels', () => {
    expect(getXpForQuestion(true, 0)).toBe(10);
    expect(getXpForQuestion(true, 1)).toBe(5);
    expect(getXpForQuestion(false, 0)).toBe(4);

    const lvl1 = calculateLevel(0);
    expect(lvl1.level).toBe(1);

    const lvl2 = calculateLevel(110);
    expect(lvl2.level).toBe(2);

    expect(calculateStars(100)).toBe(3);
    expect(calculateStars(85)).toBe(2);
    expect(calculateStars(60)).toBe(1);
    expect(calculateStars(40)).toBe(0);
  });

  it('encodes and decodes homework codes accurately without loss', () => {
    const original = {
      title: 'Dars 1 Vazifasi',
      config: {
        count: 5,
        difficulty: 'easy' as const,
        hasTimer: false,
        topics: ['add_x_first' as const],
      },
      seed: 98765,
    };

    const code = encodeHomework(original);
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThan(0);

    const decoded = decodeHomework(code);
    expect(decoded).not.toBeNull();
    expect(decoded?.title).toBe(original.title);
    expect(decoded?.config.count).toBe(original.config.count);
    expect(decoded?.seed).toBe(original.seed);
  });
});
