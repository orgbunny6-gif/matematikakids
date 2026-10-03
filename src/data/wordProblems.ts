/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WordProblemTemplate {
  uzLatn: (name: string, a: number, b: number, item: string) => string;
  uzCyrl: (name: string, a: number, b: number, item: string) => string;
  ru: (name: string, a: number, b: number, item: string) => string;
}

export const WORD_ITEMS = [
  { uzLatn: 'olma', uzCyrl: 'олма', ru: 'яблок(а)' },
  { uzLatn: 'shar', uzCyrl: 'шар', ru: 'шарик(ов)' },
  { uzLatn: 'qalam', uzCyrl: 'қалам', ru: 'карандаш(ей)' },
  { uzLatn: 'yulduzcha', uzCyrl: 'юлдузча', ru: 'звёздочек' },
  { uzLatn: 'kitob', uzCyrl: 'китоб', ru: 'книг' },
  { uzLatn: 'shirinlik', uzCyrl: 'ширинлик', ru: 'конфет' },
  { uzLatn: 'mashina', uzCyrl: 'машина', ru: 'машинок' },
];

export const STUDENT_NAMES = ['Ali', 'Madina', 'Jasur', 'Laylo', 'Temur', 'Zahro', 'Diyor'];

export const WORD_PROBLEM_TEMPLATES: Record<'ADD' | 'SUB', WordProblemTemplate> = {
  ADD: {
    // x + a = b
    uzLatn: (name, a, b, item) =>
      `${name}da bir nechta ${item} bor edi. Unga yana ${a} ta ${item} berishdi va jami ${b} ta bo‘ldi. Dastlab nechta ${item} bor edi?`,
    uzCyrl: (name, a, b, item) =>
      `${name}да бир нечта ${item} бор эди. Унга яна ${a} та ${item} беришди ва жами ${b} та бўлди. Дастлаб нечта ${item} бор эди?`,
    ru: (name, a, b, item) =>
      `У ${name} было несколько ${item}. Ему подарили ещё ${a} шт., и всего стало ${b} шт. Сколько ${item} было вначале?`,
  },
  SUB: {
    // x - a = b
    uzLatn: (name, a, b, item) =>
      `${name} savatdagi bir nechta ${item}dan ${a} tasini do‘stiga berdi va unda ${b} ta qoldi. Dastlab savatda nechta ${item} bo‘lgan?`,
    uzCyrl: (name, a, b, item) =>
      `${name} саватдаги бир нечта ${item}дан ${a} тасини дўстига берди ва унда ${b} та қолди. Дастлаб саватда нечта ${item} бўлган?`,
    ru: (name, a, b, item) =>
      `В корзине было несколько ${item}. ${name} отдал другу ${a} шт., и осталось ${b} шт. Сколько ${item} было сначала?`,
  },
};
