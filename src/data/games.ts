/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameId } from '../types.ts';
import { TranslationKey } from '../i18n/types.ts';

export interface GameDefinition {
  id: GameId;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon: string;
  badgeColor: string;
  minStarsToUnlock: number;
}

export const GAMES: GameDefinition[] = [
  {
    id: 'rocket',
    titleKey: 'gameRocketTitle',
    descKey: 'gameRocketDesc',
    icon: '🚀',
    badgeColor: 'bg-indigo-500',
    minStarsToUnlock: 0,
  },
  {
    id: 'balance_master',
    titleKey: 'gameBalanceTitle',
    descKey: 'gameBalanceDesc',
    icon: '⚖️',
    badgeColor: 'bg-emerald-500',
    minStarsToUnlock: 1,
  },
  {
    id: 'balloon_pop',
    titleKey: 'gameBalloonTitle',
    descKey: 'gameBalloonDesc',
    icon: '🎈',
    badgeColor: 'bg-pink-500',
    minStarsToUnlock: 2,
  },
  {
    id: 'puzzle',
    titleKey: 'gamePuzzleTitle',
    descKey: 'gamePuzzleDesc',
    icon: '🧩',
    badgeColor: 'bg-amber-500',
    minStarsToUnlock: 3,
  },
  {
    id: 'treasure',
    titleKey: 'gameTreasureTitle',
    descKey: 'gameTreasureDesc',
    icon: '🏴‍☠️',
    badgeColor: 'bg-yellow-500',
    minStarsToUnlock: 4,
  },
  {
    id: 'memory',
    titleKey: 'gameMemoryTitle',
    descKey: 'gameMemoryDesc',
    icon: '🧠',
    badgeColor: 'bg-purple-500',
    minStarsToUnlock: 5,
  },
  {
    id: 'fix_robot',
    titleKey: 'gameFixRobotTitle',
    descKey: 'gameFixRobotDesc',
    icon: '🤖',
    badgeColor: 'bg-blue-500',
    minStarsToUnlock: 6,
  },
  {
    id: 'race',
    titleKey: 'gameRaceTitle',
    descKey: 'gameRaceDesc',
    icon: '🏎️',
    badgeColor: 'bg-red-500',
    minStarsToUnlock: 7,
  },
  {
    id: 'mystery_box',
    titleKey: 'gameMysteryBoxTitle',
    descKey: 'gameMysteryBoxDesc',
    icon: '📦',
    badgeColor: 'bg-teal-500',
    minStarsToUnlock: 8,
  },
  {
    id: 'star_ladder',
    titleKey: 'gameStarLadderTitle',
    descKey: 'gameStarLadderDesc',
    icon: '⭐',
    badgeColor: 'bg-amber-400',
    minStarsToUnlock: 9,
  },
  {
    id: 'target',
    titleKey: 'gameTargetTitle',
    descKey: 'gameTargetDesc',
    icon: '🎯',
    badgeColor: 'bg-rose-500',
    minStarsToUnlock: 10,
  },
  {
    id: 'pass_play',
    titleKey: 'gamePassPlayTitle',
    descKey: 'gamePassPlayDesc',
    icon: '👫',
    badgeColor: 'bg-violet-600',
    minStarsToUnlock: 0,
  },
];
