/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { Locale } from '../types.ts';
import { Tengo } from '../components/mascot/Tengo.tsx';
import { soundService } from '../services/soundService.ts';
import { fireCelebrationConfetti } from '../services/confettiService.ts';
import { ArrowRight, Check } from 'lucide-react';

interface WelcomePageProps {
  onFinish: () => void;
}

const AVATARS = ['🚀', '🪐', '👾', '🐱', '🐻', '🦁', '🦊', '🤖'];

export function WelcomePage({ onFinish }: WelcomePageProps) {
  const { createProfile, updateSettings } = useApp();
  const { locale, setLocale, t } = useT();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🚀');

  const handleLanguageSelect = (l: Locale) => {
    soundService.playClick();
    setLocale(l);
    updateSettings({ language: l });
    setStep(2);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    if (!name.trim()) return;
    setStep(3);
  };

  const handleStart = () => {
    soundService.playFanfare();
    fireCelebrationConfetti();
    createProfile(name, selectedAvatar);
    onFinish();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white select-none">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center gap-6 animate-bounce-gentle">
        <Tengo mood={step === 3 ? 'celebrating' : 'happy'} size="lg" />

        {/* Step 1: Language */}
        {step === 1 && (
          <div className="flex flex-col items-center gap-5 w-full">
            <h1 className="text-2xl sm:text-3xl font-black">
              Tilni tanlang / Тилни танланг / Выберите язык
            </h1>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={() => handleLanguageSelect('uz-Latn')}
                className="py-3.5 px-6 rounded-2xl bg-white text-indigo-900 font-black text-lg shadow-md hover:bg-indigo-50 active:scale-95 transition-all"
              >
                O‘zbekcha (Lotin)
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSelect('uz-Cyrl')}
                className="py-3.5 px-6 rounded-2xl bg-white text-indigo-900 font-black text-lg shadow-md hover:bg-indigo-50 active:scale-95 transition-all"
              >
                Ўзбекча (Кирилл)
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSelect('ru')}
                className="py-3.5 px-6 rounded-2xl bg-white text-indigo-900 font-black text-lg shadow-md hover:bg-indigo-50 active:scale-95 transition-all"
              >
                Русский
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Name & Avatar */}
        {step === 2 && (
          <form onSubmit={handleProfileSubmit} className="flex flex-col items-center gap-5 w-full">
            <h2 className="text-2xl sm:text-3xl font-black">
              {t('whatsYourName')}
            </h2>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Ali"
              className="w-full max-w-xs px-5 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/50 text-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-white"
            />

            <div className="flex flex-col gap-2 w-full">
              <span className="text-xs font-bold text-indigo-200">
                {t('chooseYourHero')}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setSelectedAvatar(av);
                    }}
                    className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                      selectedAvatar === av
                        ? 'bg-white text-indigo-900 scale-110 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="mt-2 w-full max-w-xs py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg shadow-lg hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{t('continue')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* Step 3: Ready to Launch */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-2xl sm:text-3xl font-black">
              {t('welcomeTitle')}
            </h2>
            <p className="text-base text-indigo-200 max-w-md">
              Do‘stim {name}, Tengo bilan birgalikda tenglamalarning sirli olamiga sayohat qilamiz!
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="w-full max-w-xs py-4 px-8 rounded-2xl bg-white text-indigo-900 font-black text-xl shadow-xl hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer"
            >
              {t('letsBeginAdventure')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
