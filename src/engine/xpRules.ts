/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationKey } from '../i18n/types.ts';

export const XP_RULES = {
  CORRECT_FIRST_TRY: 10,
  CORRECT_WITH_HINT: 5,
  LESSON_COMPLETE: 50,
  TEST_BASE: 30,
  DAILY_CHALLENGE: 35,
  STREAK_BONUS_PER_DAY: 5,
  MAX_STREAK_BONUS: 25,
};

export function getXpForQuestion(firstTry: boolean, hintsUsed: number): number {
  if (!firstTry) return 4;
  if (hintsUsed === 0) return XP_RULES.CORRECT_FIRST_TRY;
  return XP_RULES.CORRECT_WITH_HINT;
}

export function calculateLevel(xp: number): {
  level: number;
  currentLevelXp: number;
  xpNeededForNext: number;
  progressPercent: number;
} {
  // Progressive XP threshold: Level 1 starts at 0.
  // Level n -> n+1 requires 100 + 60 * (n - 1) XP.
  let currentLevel = 1;
  let accumulatedXp = 0;

  while (true) {
    const costForNext = 100 + 60 * (currentLevel - 1);
    if (xp < accumulatedXp + costForNext) {
      const currentLevelXp = xp - accumulatedXp;
      const progressPercent = Math.min(100, Math.round((currentLevelXp / costForNext) * 100));
      return {
        level: currentLevel,
        currentLevelXp,
        xpNeededForNext: costForNext,
        progressPercent,
      };
    }
    accumulatedXp += costForNext;
    currentLevel++;
  }
}

export function getLevelTitleKey(level: number): TranslationKey {
  if (level <= 1) return 'levelTitle1';
  if (level === 2) return 'levelTitle2';
  if (level === 3) return 'levelTitle3';
  if (level === 4) return 'levelTitle4';
  if (level === 5) return 'levelTitle5';
  if (level === 6) return 'levelTitle6';
  if (level === 7) return 'levelTitle7';
  return 'levelTitle8';
}

export function calculateStars(percentage: number): number {
  if (percentage >= 90) return 3;
  if (percentage >= 70) return 2;
  if (percentage >= 50) return 1;
  return 0;
}
