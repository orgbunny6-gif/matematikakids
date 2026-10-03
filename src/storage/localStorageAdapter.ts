/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StorageAdapter } from './StorageAdapter.ts';

const PREFIX = 'tenglama.v1.';

export class LocalStorageAdapter implements StorageAdapter {
  private inMemoryFallback = new Map<string, string>();
  private isStorageAvailable: boolean;

  constructor() {
    this.isStorageAvailable = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = `${PREFIX}__test__`;
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (_) {
      return false;
    }
  }

  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    const fullKey = `${PREFIX}${key}`;
    try {
      let raw: string | null = null;
      if (this.isStorageAvailable) {
        raw = window.localStorage.getItem(fullKey);
      } else {
        raw = this.inMemoryFallback.get(fullKey) ?? null;
      }

      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (_) {
      return defaultValue;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    const fullKey = `${PREFIX}${key}`;
    try {
      const serialized = JSON.stringify(value);
      if (this.isStorageAvailable) {
        window.localStorage.setItem(fullKey, serialized);
      } else {
        this.inMemoryFallback.set(fullKey, serialized);
      }
    } catch (e) {
      // QuotaExceededError or private mode block: save to in-memory fallback
      try {
        this.inMemoryFallback.set(fullKey, JSON.stringify(value));
      } catch (_) {}
    }
  }

  async removeItem(key: string): Promise<void> {
    const fullKey = `${PREFIX}${key}`;
    try {
      if (this.isStorageAvailable) {
        window.localStorage.removeItem(fullKey);
      }
      this.inMemoryFallback.delete(fullKey);
    } catch (_) {}
  }

  async clear(): Promise<void> {
    try {
      if (this.isStorageAvailable) {
        Object.keys(window.localStorage)
          .filter((k) => k.startsWith(PREFIX))
          .forEach((k) => window.localStorage.removeItem(k));
      }
      this.inMemoryFallback.clear();
    } catch (_) {}
  }
}

export const defaultStorage = new LocalStorageAdapter();
