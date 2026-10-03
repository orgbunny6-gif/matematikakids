/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { PLANETS, Planet } from '../data/planets.ts';
import { LESSONS } from '../data/lessons.ts';
import { soundService } from '../services/soundService.ts';
import { Lock, Star, Play, CheckCircle2, X } from 'lucide-react';

interface MapPageProps {
  onNavigate: (route: string) => void;
}

export function MapPage({ onNavigate }: MapPageProps) {
  const { progress } = useApp();
  const { t, locale } = useT();
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const getPlanetStars = (planet: Planet): number => {
    let sum = 0;
    planet.lessonIds.forEach((lid) => {
      sum += progress.lessons[lid]?.stars ?? 0;
    });
    return sum;
  };

  const isPlanetUnlocked = (planet: Planet): boolean => {
    return progress.stars >= planet.minStarsToUnlock;
  };

  const handlePlanetClick = (planet: Planet) => {
    soundService.playClick();
    setSelectedPlanet(planet);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('map')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Sayyoralar bo‘ylab sayohat qiling va barcha yulduzlarni to‘plang!
        </p>
      </div>

      {/* Cosmic Map Journey Path */}
      <div className="relative flex flex-col gap-8 py-6">
        {PLANETS.map((planet, index) => {
          const unlocked = isPlanetUnlocked(planet);
          const starsEarned = getPlanetStars(planet);
          const isCurrent = unlocked && index === PLANETS.findIndex((p) => isPlanetUnlocked(p) && getPlanetStars(p) < p.lessonIds.length * 3);

          return (
            <div
              key={planet.id}
              className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl border-2 transition-all ${
                unlocked
                  ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900 shadow-md hover:border-indigo-500 hover:scale-102 cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
              onClick={() => unlocked && handlePlanetClick(planet)}
            >
              <div className="flex items-center gap-4">
                {/* Planet Sphere Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${planet.gradient} text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0 relative`}
                >
                  {planet.number}
                  {isCurrent && (
                    <span className="absolute -top-3 -right-2 text-2xl animate-bounce-gentle">
                      🚀
                    </span>
                  )}
                </div>

                <div className="flex flex-col text-center sm:text-left">
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                    {t(planet.titleKey as any)}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-md">
                    {t(planet.descKey as any)}
                  </p>
                </div>
              </div>

              {/* Status & Stars */}
              <div className="flex items-center gap-3">
                {unlocked ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-black text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{starsEarned} / {planet.lessonIds.length * 3}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold text-xs">
                    <Lock className="w-4 h-4" />
                    <span>{planet.minStarsToUnlock} ⭐ kerak</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Planet Lessons Drawer / Modal */}
      {selectedPlanet && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-bounce-gentle">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                {t(selectedPlanet.titleKey as any)}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedPlanet(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Ushbu sayyoradagi darslar:
            </p>

            <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto">
              {selectedPlanet.lessonIds.map((lid) => {
                const lessonDef = LESSONS.find((l) => l.id === lid);
                const lProgress = progress.lessons[lid];
                const isUnlocked = lProgress && lProgress.status !== 'locked';

                if (!lessonDef) return null;

                const titleText =
                  locale === 'ru'
                    ? lessonDef.title.ru
                    : locale === 'uz-Cyrl'
                    ? lessonDef.title.uzCyrl
                    : lessonDef.title.uzLatn;

                return (
                  <button
                    key={lid}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => {
                      soundService.playClick();
                      onNavigate(`/lessons/${lid}`);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isUnlocked
                        ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 cursor-pointer'
                        : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center">
                        {lessonDef.number}
                      </div>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {titleText}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className={`w-4 h-4 ${lProgress?.stars ? 'fill-amber-400' : 'text-slate-300'}`} />
                      <span>{lProgress?.stars ?? 0}/3</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
