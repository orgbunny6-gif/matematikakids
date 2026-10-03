/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { MascotBubble } from '../components/mascot/MascotBubble.tsx';
import { identifyWeakTopics } from '../engine/adaptive.ts';
import { calculateLevel, getLevelTitleKey } from '../engine/xpRules.ts';
import { soundService } from '../services/soundService.ts';
import {
  Rocket,
  MapPin,
  Dumbbell,
  Gamepad2,
  Calendar,
  AlertTriangle,
  Play,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { activeProfile, progress, inventory } = useApp();
  const { t } = useT();

  const weakTopics = identifyWeakTopics(progress.topics);
  const { level, currentLevelXp, xpNeededForNext, progressPercent } = calculateLevel(progress.xp);
  const levelTitleKey = getLevelTitleKey(level);

  const todayKey = new Date().toISOString().split('T')[0]!;
  const dailyDone = progress.daily[todayKey]?.completed;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto animate-bounce-gentle">
      {/* Welcome Banner with Tengo */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t(levelTitleKey)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Salom, {activeProfile.name}! 👋
            </h1>
            <p className="text-sm sm:text-base font-medium text-indigo-100">
              Bugun tenglamalar olamida yangi yulduzlarni kashf qilishga tayyormisan?
            </p>

            {/* Big Primary CTA */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onNavigate('/map');
                }}
                className="px-6 py-3.5 rounded-2xl bg-white text-indigo-700 font-extrabold text-base shadow-lg hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-indigo-600" />
                <span>{t('continue')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onNavigate('/daily');
                }}
                className="px-5 py-3.5 rounded-2xl bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-bold text-sm border border-white/30 backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('daily')}</span>
              </button>
            </div>
          </div>

          {/* Tengo Mascot Card */}
          <div className="shrink-0">
            <MascotBubble
              mood="cheering"
              accessory={inventory.activeAccessory}
              message={t('tengoGreeting')}
              className="max-w-xs bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
      </div>

      {/* Weak Topics Warning & Direct Practice Action */}
      {weakTopics.length > 0 && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                {t('weakTopics')}
              </h4>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Tengo ushbu mavzularda ko‘proq mashq qilishni tavsiya etadi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(`/practice/${weakTopics[0]}`)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm active:scale-95 transition-all shrink-0"
          >
            {t('practiceWeakNow')}
          </button>
        </div>
      )}

      {/* Level & XP Progress Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-black">
          <span className="text-indigo-600 dark:text-indigo-400">
            {t('level')} {level}: {t(levelTitleKey)}
          </span>
          <span className="text-slate-500">
            {currentLevelXp} / {xpNeededForNext} XP ({progressPercent}%)
          </span>
        </div>
        <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Launch Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('/map')}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 hover:scale-102 active:scale-98 transition-all text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🗺️
          </div>
          <span className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {t('map')}
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            6 ta sayyora
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/games')}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-pink-500 hover:scale-102 active:scale-98 transition-all text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🎮
          </div>
          <span className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {t('games')}
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            12 ta o‘yin
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/practice')}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 hover:scale-102 active:scale-98 transition-all text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            💪
          </div>
          <span className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {t('practice')}
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            Moslashuvchan
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/tests')}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 hover:scale-102 active:scale-98 transition-all text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📝
          </div>
          <span className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {t('tests')}
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            Baholash
          </span>
        </button>
      </div>
    </div>
  );
}
