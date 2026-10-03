/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { identifyWeakTopics } from '../engine/adaptive.ts';
import { soundService } from '../services/soundService.ts';
import { Dumbbell, Target, Sparkles, Scale, BookOpen, Layers } from 'lucide-react';

interface PracticePageProps {
  onNavigate: (route: string) => void;
}

export function PracticePage({ onNavigate }: PracticePageProps) {
  const { progress } = useApp();
  const { t } = useT();
  const weakTopics = identifyWeakTopics(progress.topics);

  const practiceCategories = [
    {
      type: 'add',
      title: 'Qo‘shish Tenglamalari',
      desc: 'x + a = b va a + x = b turlari bo‘yicha mashqlar',
      icon: '➕',
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
    {
      type: 'sub',
      title: 'Ayirish Tenglamalari',
      desc: 'x - a = b va a - x = b turlari bo‘yicha mashqlar',
      icon: '➖',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    {
      type: 'scale',
      title: 'Tarozi Muvozanati',
      desc: 'Vizual tarozi yordamida noma’lumni topish',
      icon: '⚖️',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      type: 'word',
      title: 'So‘zli Masalalar',
      desc: 'Matnli hayotiy voqealardan tenglama tuzish',
      icon: '📖',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    },
    {
      type: 'chain',
      title: 'Ketma-ket Amalli',
      desc: 'x + a + c = b ko‘rinishidagi murakkabroq tenglamalar',
      icon: '⛓️',
      color: 'bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400',
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('practice')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          O‘zingizga kerakli mashq turini tanlab bilimingizni mustahkamlang!
        </p>
      </div>

      {/* Weak Spot Smart Recommender */}
      {weakTopics.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/20 text-2xl">🎯</div>
            <div>
              <h3 className="font-black text-lg">
                Shaxsiy tavsiya: Zaif mavzular ustida mashq
              </h3>
              <p className="text-xs text-amber-100">
                Tizim siz ko‘p xato qilgan mavzular bo‘yicha maxsus to‘plam tayyorladi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(`/practice/weak`)}
            className="px-6 py-3 rounded-2xl bg-white text-amber-900 font-extrabold text-sm shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            Boshlash
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {practiceCategories.map((cat) => (
          <button
            key={cat.type}
            type="button"
            onClick={() => {
              soundService.playClick();
              onNavigate(`/practice/${cat.type}`);
            }}
            className="flex items-start gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 hover:scale-102 active:scale-98 transition-all text-left group cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${cat.color} group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {cat.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
