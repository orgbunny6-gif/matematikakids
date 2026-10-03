/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { Locale, ThemeMode, FontSize } from '../types.ts';
import { soundService } from '../services/soundService.ts';
import {
  Settings as SettingsIcon,
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Type,
  Clock,
  Sparkles,
} from 'lucide-react';

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const { locale, setLocale, t } = useT();

  const handleLangChange = (l: Locale) => {
    soundService.playClick();
    setLocale(l);
    updateSettings({ language: l });
  };

  const handleThemeChange = (th: ThemeMode) => {
    soundService.playClick();
    updateSettings({ theme: th });
  };

  const handleFontSizeChange = (fs: FontSize) => {
    soundService.playClick();
    updateSettings({ fontSize: fs });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-indigo-600" />
          <span>{t('settings')}</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Ilova sozlamalari va qulaylik parametrlari
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Language Selection */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <label className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>{t('language')}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'uz-Latn', label: "O'zbekcha" },
              { id: 'uz-Cyrl', label: 'Ўзбекча' },
              { id: 'ru', label: 'Русский' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLangChange(item.id as Locale)}
                className={`py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all ${
                  locale === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <label className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{t('theme')}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: t('themeLight') },
              { id: 'dark', label: t('themeDark') },
              { id: 'system', label: t('themeSystem') },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => handleThemeChange(th.id as ThemeMode)}
                className={`py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all ${
                  settings.theme === th.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size & Dyslexia Friendly Mode */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-500" />
              <span>{t('fontSize')}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: t('fontSizeNormal') },
                { id: 'large', label: t('fontSizeLarge') },
                { id: 'huge', label: t('fontSizeHuge') },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFontSizeChange(f.id as FontSize)}
                  className={`py-2 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all ${
                    settings.fontSize === f.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                {t('dyslexiaFont')}
              </span>
              <span className="text-[11px] text-slate-400">
                Harflar oralig‘ini kengaytiradi va o‘qishni osonlashtiradi
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.dyslexiaFont}
              onChange={(e) => {
                soundService.playClick();
                updateSettings({ dyslexiaFont: e.target.checked });
              }}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Audio & Effects toggles */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {t('sound')}
            </span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => {
                soundService.enabled = e.target.checked;
                updateSettings({ soundEnabled: e.target.checked });
              }}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {t('speech')}
            </span>
            <input
              type="checkbox"
              checked={settings.speechEnabled}
              onChange={(e) => {
                updateSettings({ speechEnabled: e.target.checked });
              }}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {t('restReminder')}
            </span>
            <input
              type="checkbox"
              checked={settings.restReminders}
              onChange={(e) => {
                updateSettings({ restReminders: e.target.checked });
              }}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
