/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useMemo } from 'react';
import { Locale } from '../types.ts';
import { TranslationDictionary, TranslationKey } from './types.ts';
import { uzLatn } from './locales/uz-Latn.ts';
import { uzCyrl } from './locales/uz-Cyrl.ts';
import { ru } from './locales/ru.ts';

const dictionaries: Record<Locale, TranslationDictionary> = {
  'uz-Latn': uzLatn,
  'uz-Cyrl': uzCyrl,
  ru: ru,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  setLocale,
  children,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  children: React.ReactNode;
}) {
  const t = useMemo(() => {
    const dict = dictionaries[locale] || dictionaries['uz-Latn'];
    return (key: TranslationKey, params?: Record<string, string | number>): string => {
      let text = dict[key] ?? uzLatn[key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return text;
    };
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useT must be used inside I18nProvider');
  }
  return ctx;
}
