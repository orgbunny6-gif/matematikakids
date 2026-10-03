/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Sticker {
  id: string;
  name: { uzLatn: string; uzCyrl: string; ru: string };
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export const STICKERS: Sticker[] = [
  { id: 'st_mars', name: { uzLatn: 'Qizil Sayyora', uzCyrl: 'Қизил Сайёра', ru: 'Красная планета' }, icon: '🪐', rarity: 'common' },
  { id: 'st_star', name: { uzLatn: 'Yorqin Yulduz', uzCyrl: 'Ёрқин Юлдуз', ru: 'Яркая звезда' }, icon: '⭐', rarity: 'common' },
  { id: 'st_rocket', name: { uzLatn: 'Tezkor Raketa', uzCyrl: 'Тезкор Ракета', ru: 'Быстрая ракета' }, icon: '🚀', rarity: 'rare' },
  { id: 'st_alien', name: { uzLatn: 'Do‘stona O‘zga Sayyoralik', uzCyrl: 'Дўстона Ўзга Сайёралик', ru: 'Добрый пришелец' }, icon: '👾', rarity: 'rare' },
  { id: 'st_galaxy', name: { uzLatn: 'Aylana Galaktika', uzCyrl: 'Айлана Галактика', ru: 'Спиральная галактика' }, icon: '🌌', rarity: 'legendary' },
  { id: 'st_crown', name: { uzLatn: 'Matematik Toj', uzCyrl: 'Математик Тож', ru: 'Математическая корона' }, icon: '👑', rarity: 'legendary' },
  { id: 'st_diamond', name: { uzLatn: 'Kristall Yulduz', uzCyrl: 'Кристалл Юлдуз', ru: 'Кристальная звезда' }, icon: '💎', rarity: 'legendary' },
  { id: 'st_comet', name: { uzLatn: 'Olovli Kometa', uzCyrl: 'Оловли Комета', ru: 'Огненная комета' }, icon: '☄️', rarity: 'rare' },
];

export interface ShopItem {
  id: string;
  name: { uzLatn: string; uzCyrl: string; ru: string };
  type: 'hat' | 'glasses' | 'badge';
  icon: string;
  costStars: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'acc_cap', name: { uzLatn: 'Kosmonavt Shlyapasi', uzCyrl: 'Космонавт Шляпаси', ru: 'Шлем космонавта' }, type: 'hat', icon: '⛑️', costStars: 3 },
  { id: 'acc_glasses', name: { uzLatn: 'Aqlli Ko‘zoynak', uzCyrl: 'Ақлли Кўзойнак', ru: 'Умные очки' }, type: 'glasses', icon: '👓', costStars: 5 },
  { id: 'acc_crown', name: { uzLatn: 'Oltin Toj', uzCyrl: 'Олтин Тож', ru: 'Золотая корона' }, type: 'hat', icon: '👑', costStars: 10 },
  { id: 'acc_medal', name: { uzLatn: 'G‘olib Medali', uzCyrl: 'Ғолиб Медали', ru: 'Медаль победителя' }, type: 'badge', icon: '🏅', costStars: 8 },
];
