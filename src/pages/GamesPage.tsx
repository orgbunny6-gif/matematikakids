/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { GAMES } from '../data/games.ts';
import { soundService } from '../services/soundService.ts';
import { Star, Trophy, Play } from 'lucide-react';

interface GamesPageProps {
  onNavigate: (route: string) => void;
}

export function GamesPage({ onNavigate }: GamesPageProps) {
  const { progress } = useApp();
  const { t } = useT();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('games')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Matematikani o‘yinlar orqali quvnoq va qiziqarli o‘rganing!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((game) => {
          const stats = progress.games[game.id];
          const isUnlocked = progress.stars >= game.minStarsToUnlock;

          return (
            <div
              key={game.id}
              onClick={() => {
                if (isUnlocked) {
                  soundService.playClick();
                  onNavigate(`/games/${game.id}`);
                }
              }}
              className={`p-5 rounded-3xl border-2 flex flex-col justify-between gap-4 transition-all ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-sm hover:border-indigo-500 hover:scale-102 cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  {game.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    {t(game.titleKey)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {t(game.descKey)}
                  </p>
                </div>
              </div>

              {/* High score and stars footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-black">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{stats?.stars ?? 0}/3</span>
                </div>

                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Trophy className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Rekord: {stats?.highScore ?? 0}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
