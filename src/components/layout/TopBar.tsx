/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.tsx';
import { useT } from '../../i18n/I18nContext.tsx';
import { Locale } from '../../types.ts';
import { soundService } from '../../services/soundService.ts';
import { Flame, Star, Zap, Sun, Moon, Volume2, VolumeX, Globe } from 'lucide-react';

interface TopBarProps {
  onNavigate: (route: string) => void;
  activeRoute: string;
}

export function TopBar({ onNavigate, activeRoute }: TopBarProps) {
  const { settings, updateSettings, progress, activeProfile } = useApp();
  const { locale, setLocale, t } = useT();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const toggleTheme = () => {
    soundService.playClick();
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const toggleSound = () => {
    const nextSound = !settings.soundEnabled;
    updateSettings({ soundEnabled: nextSound });
    soundService.enabled = nextSound;
    if (nextSound) soundService.playClick();
  };

  const handleSelectLang = (newLocale: Locale) => {
    soundService.playClick();
    setLocale(newLocale);
    updateSettings({ language: newLocale });
    setLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Active Student */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
            aria-label="Tenglama Olami bosh sahifa"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-transform">
              🪐
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                {t('appName')}
              </span>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                2-sinf matematika
              </span>
            </div>
          </button>
        </div>

        {/* Gamification Stats: Streak, Stars, XP */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Streak Flame */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-black border border-orange-200/60 dark:border-orange-800/40"
            title={`${progress.streak.current} kunlik seriya`}
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>{progress.streak.current}</span>
          </div>

          {/* Stars */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-black border border-amber-200/60 dark:border-amber-800/40"
            title={`${progress.stars} yulduz`}
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{progress.stars}</span>
          </div>

          {/* XP & Level Badge */}
          <button
            type="button"
            onClick={() => onNavigate('/progress')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-black border border-indigo-200/60 dark:border-indigo-800/40 hover:bg-indigo-100 transition-colors"
            title={`Daraja: ${progress.level}`}
          >
            <Zap className="w-4 h-4 fill-indigo-500 text-indigo-500" />
            <span>{progress.xp} XP</span>
          </button>
        </div>

        {/* Controls: Sound, Theme, Language, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            title={settings.soundEnabled ? 'Ovozni o‘chirish' : 'Ovozni yoqish'}
            aria-label="Ovoz"
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 opacity-60" />}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            title="Mavzuni almashtirish"
            aria-label="Theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="Til tanlash"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                {locale === 'uz-Latn' ? "O'zb" : locale === 'uz-Cyrl' ? 'Ўзб' : 'Рус'}
              </span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-bounce-gentle">
                <button
                  type="button"
                  onClick={() => handleSelectLang('uz-Latn')}
                  className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-slate-700 ${
                    locale === 'uz-Latn' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  O‘zbekcha
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLang('uz-Cyrl')}
                  className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-slate-700 ${
                    locale === 'uz-Cyrl' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Ўзбекча
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLang('ru')}
                  className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-slate-700 ${
                    locale === 'ru' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Русский
                </button>
              </div>
            )}
          </div>

          {/* Student Profile Avatar */}
          <button
            type="button"
            onClick={() => onNavigate('/profiles')}
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title={activeProfile.name}
            aria-label="Profil"
          >
            <span className="text-lg">{activeProfile.avatarId}</span>
            <span className="hidden md:inline text-xs font-black text-slate-700 dark:text-slate-200 max-w-[80px] truncate">
              {activeProfile.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
