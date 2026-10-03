/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SeededRNG } from './rng.ts';

export function generateDistractors(
  correctAnswer: number,
  operands: { a: number; b: number; c?: number },
  isAddition: boolean,
  rng: SeededRNG,
  maxNumber = 20
): number[] {
  const distractors = new Set<number>();
  const { a, b } = operands;

  // Pedagogical typical errors for 2nd grade:
  if (isAddition) {
    // Student added instead of subtracting: b + a
    const added = b + a;
    if (added !== correctAnswer && added <= maxNumber * 2 && added > 0) {
      distractors.add(added);
    }
    // Student picked operand 'a' or 'b'
    if (a !== correctAnswer && a >= 0) distractors.add(a);
    if (b !== correctAnswer && b >= 0) distractors.add(b);
  } else {
    // In subtraction: student subtracted instead of adding (or vice-versa)
    const diff = Math.abs(b - a);
    if (diff !== correctAnswer && diff >= 0) {
      distractors.add(diff);
    }
    const sum = b + a;
    if (sum !== correctAnswer && sum <= maxNumber * 2) {
      distractors.add(sum);
    }
  }

  // Neighbor off-by-one errors (common calculation slip)
  if (correctAnswer + 1 <= maxNumber * 2) distractors.add(correctAnswer + 1);
  if (correctAnswer - 1 >= 0 && correctAnswer - 1 !== correctAnswer) {
    distractors.add(correctAnswer - 1);
  }
  if (correctAnswer + 2 <= maxNumber * 2) distractors.add(correctAnswer + 2);
  if (correctAnswer - 2 >= 0) distractors.add(correctAnswer - 2);

  // Fill up if needed with random positive integers around the answer
  let attempts = 0;
  while (distractors.size < 3 && attempts < 30) {
    attempts++;
    const delta = rng.nextInt(-4, 4);
    const candidate = correctAnswer + delta;
    if (candidate >= 0 && candidate !== correctAnswer && candidate <= maxNumber * 2) {
      distractors.add(candidate);
    }
  }

  // Fallback if still under 3
  let fallback = 1;
  while (distractors.size < 3) {
    if (fallback !== correctAnswer) {
      distractors.add(fallback);
    }
    fallback++;
  }

  // Pick exactly 3 unique distractors and shuffle with correct answer
  const chosenDistractors = Array.from(distractors).slice(0, 3);
  return rng.shuffle([correctAnswer, ...chosenDistractors]);
}
