/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#ec4899', '#3b82f6', '#eab308', '#22c55e'],
      disableForReducedMotion: true,
    });
  } catch (_) {}
}

export function fireStarBurst() {
  try {
    confetti({
      particleCount: 40,
      angle: 90,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#fbbf24', '#fef08a'],
      shapes: ['star', 'circle'],
      disableForReducedMotion: true,
    });
  } catch (_) {}
}
