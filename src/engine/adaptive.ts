/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TopicId, TopicMastery } from '../types.ts';

export function updateTopicMastery(
  current: TopicMastery | undefined,
  isCorrect: boolean,
  timeMs: number
): TopicMastery {
  const existingRecent = current?.recent ? [...current.recent] : [];
  existingRecent.push(isCorrect);
  if (existingRecent.length > 10) {
    existingRecent.shift();
  }

  // Weight recent outcomes more heavily
  let weightedSum = 0;
  let weightTotal = 0;
  existingRecent.forEach((res, i) => {
    const weight = 1 + i * 0.2;
    weightedSum += (res ? 100 : 0) * weight;
    weightTotal += weight;
  });

  const calculatedMastery = Math.round(weightedSum / weightTotal);
  const attempts = (current?.attempts ?? 0) + 1;
  const correct = (current?.correct ?? 0) + (isCorrect ? 1 : 0);
  const avgTimeMs = current?.avgTimeMs
    ? Math.round((current.avgTimeMs * (attempts - 1) + timeMs) / attempts)
    : timeMs;

  // Spaced repetition interval
  const now = Date.now();
  const nextIntervalDays = calculatedMastery >= 80 ? 4 : calculatedMastery >= 50 ? 2 : 1;
  const nextReviewAt = now + nextIntervalDays * 86400000;

  return {
    mastery: calculatedMastery,
    attempts,
    correct,
    avgTimeMs,
    recent: existingRecent,
    lastSeenAt: now,
    nextReviewAt,
  };
}

export function identifyWeakTopics(topics: Record<string, TopicMastery>): TopicId[] {
  const weak: TopicId[] = [];
  Object.entries(topics).forEach(([topicId, mastery]) => {
    if (mastery.attempts >= 3 && mastery.mastery < 60) {
      weak.push(topicId as TopicId);
    }
  });
  return weak;
}

export function identifyStrongTopics(topics: Record<string, TopicMastery>): TopicId[] {
  const strong: TopicId[] = [];
  Object.entries(topics).forEach(([topicId, mastery]) => {
    if (mastery.attempts >= 5 && mastery.mastery >= 80) {
      strong.push(topicId as TopicId);
    }
  });
  return strong;
}
