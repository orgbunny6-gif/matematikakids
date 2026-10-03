/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Locale } from '../types.ts';

class SpeechService {
  public enabled = true;

  speak(text: string, locale: Locale) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for 7-8yo kids
      utterance.pitch = 1.1; // Gentle friendly tone

      if (locale === 'ru') {
        utterance.lang = 'ru-RU';
      } else {
        utterance.lang = 'uz-UZ';
      }

      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const speechService = new SpeechService();
