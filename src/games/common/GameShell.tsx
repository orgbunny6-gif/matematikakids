/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useT } from '../../i18n/I18nContext.tsx';
import { ArrowLeft, RotateCcw, Star, Flame, Trophy } from 'lucide-react';
import { soundService } from '../../services/soundService.ts';

interface GameShellProps {
  title: string;
  score: number;
  combo?: number;
  stars?: number;
  isGameOver?: boolean;
  onRestart: () => void;
  onBack: () => void;
  children: React.ReactNode;
}

export function GameShell({
  title,
  score,
  combo = 0,
  stars = 0,
  isGameOver = false,
  onRestart,
  onBack,
  children,
}: GameShellProps) {
  const { t } = useT();

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-4 sm:p-6 bg-white/95 dark:bg-slate-900/95 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </button>

        <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 truncate max-w-[200px] text-center">
          {title}
        </h2>

        <div className="flex items-center gap-2">
          {combo > 1 && (
            <div className="flex items-center gap-1 text-xs font-black text-orange-500 bg-orange-100 dark:bg-orange-950/60 px-2.5 py-1 rounded-full animate-bounce-gentle">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>x{combo}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onRestart();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t('restart')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="relative min-h-[360px] flex flex-col justify-center items-center">
        {isGameOver ? (
          <div className="flex flex-col items-center gap-4 text-center py-8 animate-bounce-gentle">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-4xl shadow-inner">
              🏆
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {t('congratulations')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-8 h-8 ${
                    starIdx <= stars
                      ? 'fill-amber-400 text-amber-500 animate-bounce-gentle'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {t('score')}: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">{score}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onRestart();
              }}
              className="mt-2 py-3 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-base shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              {t('playAgain')}
            </button>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
