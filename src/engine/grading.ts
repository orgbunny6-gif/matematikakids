/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationKey } from '../i18n/types.ts';

export function getGradeSummaryKey(percentage: number): TranslationKey {
  if (percentage >= 90) return 'gradeExcellent';
  if (percentage >= 70) return 'gradeVeryGood';
  if (percentage >= 50) return 'gradeGood';
  return 'gradePracticeMore';
}

export function formatTimeSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
