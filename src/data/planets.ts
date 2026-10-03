/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LessonId } from '../types.ts';

export interface Planet {
  id: string;
  number: number;
  titleKey: string;
  descKey: string;
  color: string;
  gradient: string;
  lessonIds: LessonId[];
  minStarsToUnlock: number;
}

export const PLANETS: Planet[] = [
  {
    id: 'planet_1',
    number: 1,
    titleKey: 'planet1Title',
    descKey: 'planet1Desc',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600',
    lessonIds: ['l1_equality', 'l2_scale'],
    minStarsToUnlock: 0,
  },
  {
    id: 'planet_2',
    number: 2,
    titleKey: 'planet2Title',
    descKey: 'planet2Desc',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-indigo-700',
    lessonIds: ['l3_secret_box', 'l4_letter_x'],
    minStarsToUnlock: 2,
  },
  {
    id: 'planet_3',
    number: 3,
    titleKey: 'planet3Title',
    descKey: 'planet3Desc',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-700',
    lessonIds: ['l5_add_x_first', 'l6_add_x_second'],
    minStarsToUnlock: 6,
  },
  {
    id: 'planet_4',
    number: 4,
    titleKey: 'planet4Title',
    descKey: 'planet4Desc',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    lessonIds: ['l7_sub_x_first', 'l8_sub_x_second'],
    minStarsToUnlock: 10,
  },
  {
    id: 'planet_5',
    number: 5,
    titleKey: 'planet5Title',
    descKey: 'planet5Desc',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    lessonIds: ['l9_check', 'l10_word_to_eq', 'l11_eq_to_story'],
    minStarsToUnlock: 16,
  },
  {
    id: 'planet_6',
    number: 6,
    titleKey: 'planet6Title',
    descKey: 'planet6Desc',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-violet-800',
    lessonIds: ['l12_super_mixed', 'l13_chain_bonus'],
    minStarsToUnlock: 22,
  },
];
