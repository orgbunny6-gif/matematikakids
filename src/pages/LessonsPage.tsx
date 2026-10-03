/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { LESSONS } from '../data/lessons.ts';
import { soundService } from '../services/soundService.ts';
import { Star, Lock, Play, CheckCircle2 } from 'lucide-react';

interface LessonsPageProps {
  onNavigate: (route: string) => void;
}

export function LessonsPage({ onNavigate }: LessonsPageProps) {
  const { progress } = useApp();
  const { t, locale } = useT();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('lessons')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Barcha 13 ta interaktiv darslar ro‘yxati
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LESSONS.map((lesson) => {
          const lProgress = progress.lessons[lesson.id];
          const isUnlocked = lProgress && lProgress.status !== 'locked';
          const isCompleted = lProgress && lProgress.status === 'completed';

          const titleText =
            locale === 'ru'
              ? lesson.title.ru
              : locale === 'uz-Cyrl'
              ? lesson.title.uzCyrl
              : lesson.title.uzLatn;

          const descText =
            locale === 'ru'
              ? lesson.description.ru
              : locale === 'uz-Cyrl'
              ? lesson.description.uzCyrl
              : lesson.description.uzLatn;

          return (
            <div
              key={lesson.id}
              onClick={() => {
                if (isUnlocked) {
                  soundService.playClick();
                  onNavigate(`/lessons/${lesson.id}`);
                }
              }}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-4 ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-sm hover:border-indigo-500 hover:scale-102 cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black text-lg flex items-center justify-center shrink-0">
                    {lesson.number}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 leading-snug">
                      {titleText}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {descText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer status */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
                {isUnlocked ? (
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= (lProgress?.stars ?? 0) ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Qulflangan</span>
                  </span>
                )}

                {isCompleted && (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tugatilgan</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
