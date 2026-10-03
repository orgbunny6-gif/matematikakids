/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HomeworkConfig, Homework } from '../types.ts';

export function encodeHomework(hw: {
  title: string;
  config: HomeworkConfig;
  seed: number;
}): string {
  try {
    const payload = JSON.stringify({
      t: hw.title,
      c: hw.config.count,
      d: hw.config.difficulty,
      tm: hw.config.hasTimer ? 1 : 0,
      tp: hw.config.topics,
      s: hw.seed,
    });
    return btoa(encodeURIComponent(payload));
  } catch (_) {
    return '';
  }
}

export function decodeHomework(code: string): Homework | null {
  try {
    const decoded = decodeURIComponent(atob(code.trim()));
    const data = JSON.parse(decoded);
    if (!data.t || !data.c || !data.s) return null;

    return {
      id: `hw_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: String(data.t),
      config: {
        count: Number(data.c),
        difficulty: data.d,
        hasTimer: Boolean(data.tm),
        topics: Array.isArray(data.tp) ? data.tp : ['add_x_first'],
      },
      seed: Number(data.s),
      status: 'new',
    };
  } catch (_) {
    return null;
  }
}
