/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { getGradeSummaryKey } from '../engine/grading.ts';
import { soundService } from '../services/soundService.ts';
import { Star, CheckCircle, XCircle, ArrowLeft, RotateCcw, AlertTriangle } from 'lucide-react';

interface TestResultPageProps {
  attemptId: string;
  onNavigate: (route: string) => void;
}

export function TestResultPage({ attemptId, onNavigate }: TestResultPageProps) {
  const { testHistory } = useApp();
  const { t } = useT();

  const attempt = testHistory.find((a) => a.id === attemptId) || testHistory[0];

  if (!attempt) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <h2 className="text-xl font-bold">Natija topilmadi</h2>
        <button
          type="button"
          onClick={() => onNavigate('/tests')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Testlarga qaytish
        </button>
      </div>
    );
  }

  const gradeKey = getGradeSummaryKey(attempt.score);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => onNavigate('/tests')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('tests')}</span>
        </button>
        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
          Test Natijalari
        </span>
      </div>

      {/* Score Summary Card */}
      <div className="flex flex-col items-center text-center gap-4 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-9 h-9 ${
                s <= attempt.stars ? 'fill-amber-400 text-amber-500 animate-bounce-gentle' : 'text-slate-200 dark:text-slate-800'
              }`}
            />
          ))}
        </div>

        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          {attempt.score}%
        </h2>

        <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
          {t(gradeKey)}
        </span>

        <p className="text-xs text-slate-400">
          +{attempt.xpEarned} XP qo‘shildi
        </p>
      </div>

      {/* Question Breakdown List */}
      <div className="flex flex-col gap-3">
        <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
          Savollar bo‘yicha tahlil:
        </h3>

        <div className="flex flex-col gap-2.5">
          {attempt.questions.map((q, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                q.isCorrect
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {q.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {q.equationString}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Sizning javobingiz: <span className="font-extrabold">{q.givenAnswer || '—'}</span>{' '}
                {!q.isCorrect && (
                  <span className="text-emerald-600 dark:text-emerald-400 ml-1">
                    (To‘g‘ri: {q.correctAnswer})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onNavigate(`/tests/${attempt.testId}`)}
          className="flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Qayta topshirish</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('/mistakes')}
          className="flex-1 py-3 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>{t('workOnMistakes')}</span>
        </button>
      </div>
    </div>
  );
}
