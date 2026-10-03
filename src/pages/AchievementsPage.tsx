/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { ACHIEVEMENTS } from '../data/achievementsList.ts';
import { STICKERS, SHOP_ITEMS } from '../data/stickers.ts';
import { soundService } from '../services/soundService.ts';
import { Award, Star, ShoppingBag, Sparkles } from 'lucide-react';

interface AchievementsPageProps {
  onNavigate: (route: string) => void;
}

export function AchievementsPage({ onNavigate }: AchievementsPageProps) {
  const { progress, inventory, equipAccessory, buyShopItem } = useApp();
  const { t, locale } = useT();

  const [tab, setTab] = useState<'badges' | 'stickers' | 'shop'>('badges');

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('achievements')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          To‘plangan medallar, stikerlar va Tengo uchun aksessuarlar
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start">
        <button
          type="button"
          onClick={() => setTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            tab === 'badges'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Medallar ({ACHIEVEMENTS.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('stickers')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            tab === 'stickers'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Stikerlar ({inventory.unlockedStickers.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('shop')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            tab === 'shop'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Tengo Do‘koni 🛍️
        </button>
      </div>

      {/* Tab 1: Badges Grid */}
      {tab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = progress.xp > 50 || ach.id === 'first_step';
            const title =
              locale === 'ru'
                ? ach.title.ru
                : locale === 'uz-Cyrl'
                ? ach.title.uzCyrl
                : ach.title.uzLatn;
            const desc =
              locale === 'ru'
                ? ach.desc.ru
                : locale === 'uz-Cyrl'
                ? ach.desc.uzCyrl
                : ach.desc.uzLatn;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-3xl border-2 flex items-start gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-2xl shrink-0">
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate">
                      {title}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
                      {ach.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Stickers Album */}
      {tab === 'stickers' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STICKERS.map((st) => {
            const isUnlocked = inventory.unlockedStickers.includes(st.id);
            const name =
              locale === 'ru'
                ? st.name.ru
                : locale === 'uz-Cyrl'
                ? st.name.uzCyrl
                : st.name.uzLatn;

            return (
              <div
                key={st.id}
                className={`p-5 rounded-3xl border-2 flex flex-col items-center text-center gap-2 ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-40'
                }`}
              >
                <div className="text-4xl mb-1">{isUnlocked ? st.icon : '🔒'}</div>
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                  {isUnlocked ? name : 'Sirli Stiker'}
                </span>
                <span className="text-[10px] font-black uppercase text-indigo-500">
                  {st.rarity}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Tengo Shop */}
      {tab === 'shop' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Sizdagi yulduzlar:
            </span>
            <div className="flex items-center gap-1.5 text-lg font-black text-amber-500">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>{progress.stars} ⭐</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SHOP_ITEMS.map((item) => {
              const isBought = inventory.unlockedAccessories.includes(item.id);
              const isEquipped = inventory.activeAccessory === item.id;
              const name =
                locale === 'ru'
                  ? item.name.ru
                  : locale === 'uz-Cyrl'
                  ? item.name.uzCyrl
                  : item.name.uzLatn;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-3xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                        {name}
                      </h4>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                        {item.costStars} ⭐
                      </span>
                    </div>
                  </div>

                  <div>
                    {isBought ? (
                      <button
                        type="button"
                        onClick={() => equipAccessory(item.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          isEquipped
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isEquipped ? 'Kiyilgan ✓' : 'Kiyish'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={progress.stars < item.costStars}
                        onClick={() => buyShopItem(item.id, item.costStars)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md disabled:opacity-40 transition-all cursor-pointer"
                      >
                        Sotib olish
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
