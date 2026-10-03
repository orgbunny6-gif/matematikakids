/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Locale } from '../types.ts';

const pluralRules: Record<Locale, Intl.PluralRules> = {
  'uz-Latn': new Intl.PluralRules('uz'),
  'uz-Cyrl': new Intl.PluralRules('uz-Cyrl'),
  ru: new Intl.PluralRules('ru'),
};

export function formatPlural(
  locale: Locale,
  count: number,
  forms: { one: string; few?: string; many?: string; other: string }
): string {
  const rule = pluralRules[locale].select(count);
  switch (rule) {
    case 'one':
      return forms.one;
    case 'few':
      return forms.few ?? forms.other;
    case 'many':
      return forms.many ?? forms.other;
    default:
      return forms.other;
  }
}
