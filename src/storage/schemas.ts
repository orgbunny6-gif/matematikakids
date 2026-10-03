/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarId: z.string(),
  createdAt: z.number(),
  lastActive: z.number(),
});

export const SettingsSchema = z.object({
  language: z.enum(['uz-Latn', 'uz-Cyrl', 'ru']),
  theme: z.enum(['light', 'dark', 'system']),
  soundEnabled: z.boolean(),
  speechEnabled: z.boolean(),
  reduceMotion: z.boolean(),
  fontSize: z.enum(['normal', 'large', 'huge']),
  dyslexiaFont: z.boolean(),
  timerEnabled: z.boolean(),
  parentPinHash: z.string(),
  restReminders: z.boolean(),
  lowPowerMode: z.boolean(),
});

export const LessonProgressSchema = z.object({
  status: z.enum(['locked', 'unlocked', 'completed']),
  stars: z.number().min(0).max(3),
  bestScore: z.number(),
  attempts: z.number(),
  completedAt: z.number().optional(),
});

export const TopicMasterySchema = z.object({
  mastery: z.number(),
  attempts: z.number(),
  correct: z.number(),
  avgTimeMs: z.number(),
  recent: z.array(z.boolean()),
  lastSeenAt: z.number(),
  nextReviewAt: z.number(),
});

export const GameStatsSchema = z.object({
  timesPlayed: z.number(),
  highScore: z.number(),
  stars: z.number().min(0).max(3),
  lastPlayedAt: z.number(),
});

export const DailyResultSchema = z.object({
  completed: z.boolean(),
  dateKey: z.string(),
  score: z.number(),
  stars: z.number(),
  xpEarned: z.number(),
});

export const ProgressSchema = z.object({
  xp: z.number(),
  level: z.number(),
  stars: z.number(),
  streak: z.object({
    current: z.number(),
    longest: z.number(),
    lastActiveDate: z.string(),
    freezesAvailable: z.number(),
  }),
  lessons: z.record(z.string(), LessonProgressSchema),
  topics: z.record(z.string(), TopicMasterySchema),
  games: z.record(z.string(), GameStatsSchema),
  daily: z.record(z.string(), DailyResultSchema),
  totalQuestionsSolved: z.number(),
  totalCorrect: z.number(),
});
