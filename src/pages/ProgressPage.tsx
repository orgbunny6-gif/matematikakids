/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { calculateLevel, getLevelTitleKey } from '../engine/xpRules.ts';
import { identifyWeakTopics, identifyStrongTopics } from '../engine/adaptive.ts';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Star,
  Zap,
} from 'lucide-react';

interface ProgressPageProps {
  onNavigate: (route: string) => void;
}

export function ProgressPage({ onNavigate }: ProgressPageProps) {
  const { progress } = useApp();
  const { t } = useT();

  const { level, currentLevelXp, xpNeededForNext, progressPercent } = calculateLevel(progress.xp);
  const levelTitleKey = getLevelTitleKey(level);

  const accuracy =
    progress.totalQuestionsSolved > 0
      ? Math.round((progress.totalCorrect / progress.totalQuestionsSolved) * 100)
      : 100;

  const weakTopics = identifyWeakTopics(progress.topics);
  const strongTopics = identifyStrongTopics(progress.topics);

  // Mock weekly activity 7 bars
  const weekDays = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
  const dayActivity = [12, 18, 15, 22, 10, 25, progress.totalQuestionsSolved % 30];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('progress')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          O‘quv natijalari, rivojlanish va ko‘rsatkichlar
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center text-xl mb-2">
            <Zap className="w-5 h-5 fill-indigo-500" />
          </div>
          <span className="text-xs font-bold text-slate-400">{t('level')}</span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {level}
          </span>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
            {t(levelTitleKey)}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xl mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-xs font-bold text-slate-400">{t('accuracy')}</span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {accuracy}%
          </span>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            {progress.totalCorrect} ta to‘g‘ri
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-xl mb-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
          <span className="text-xs font-bold text-slate-400">{t('stars')}</span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {progress.stars}
          </span>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
            yig‘ilgan
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center text-xl mb-2">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
          </div>
          <span className="text-xs font-bold text-slate-400">{t('streak')}</span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {progress.streak.current} kun
          </span>
          <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
            rekord: {progress.streak.longest} kun
          </span>
        </div>
      </div>

      {/* Weekly Activity SVG Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
        <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <span>Haftalik faollik (yechilgan savollar)</span>
        </h3>

        <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
          {weekDays.map((day, idx) => {
            const count = dayActivity[idx] || 5;
            const heightPct = Math.min(100, Math.max(15, count * 3));
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-black text-indigo-500">{count}</span>
                <div
                  className="w-full max-w-[36px] bg-gradient-to-t from-indigo-600 to-purple-500 rounded-xl transition-all duration-500 hover:brightness-110"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[11px] font-bold text-slate-400">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak & Strong Topics Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>{t('weakTopics')}</span>
          </h4>
          {weakTopics.length === 0 ? (
            <span className="text-xs text-slate-400 font-medium py-3">
              Zo‘r! Hozircha zaif mavzular aniqlanmadi.
            </span>
          ) : (
            weakTopics.map((wt) => (
              <div
                key={wt}
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {wt.replace(/_/g, ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(`/practice/${wt}`)}
                  className="px-3 py-1 rounded-xl bg-amber-500 text-white font-black text-xs active:scale-95 transition-all"
                >
                  Mashq
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{t('strongTopics')}</span>
          </h4>
          {strongTopics.length === 0 ? (
            <span className="text-xs text-slate-400 font-medium py-3">
              Mashqlarni davom ettiring va mavzularni o‘zlashtiring!
            </span>
          ) : (
            strongTopics.map((st) => (
              <div
                key={st}
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs font-bold text-slate-800 dark:text-slate-200 capitalize"
              >
                <span>{st.replace(/_/g, ' ')}</span>
                <span className="text-emerald-600 font-black">A’lo ✓</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
