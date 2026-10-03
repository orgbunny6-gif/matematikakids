/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { MistakeRecord } from '../types.ts';
import { EquationView } from '../components/math/EquationView.tsx';
import { soundService } from '../services/soundService.ts';
import { fireStarBurst } from '../services/confettiService.ts';
import { AlertCircle, CheckCircle, RotateCcw, Lightbulb } from 'lucide-react';

interface MistakesPageProps {
  onNavigate: (route: string) => void;
}

export function MistakesPage({ onNavigate }: MistakesPageProps) {
  const { mistakes, resolveMistake } = useApp();
  const { t } = useT();
  const [activeMistake, setActiveMistake] = useState<MistakeRecord | null>(null);
  const [userAnswer, setUserAnswer] = useState('');

  const unresolved = mistakes.filter((m) => !m.resolved);

  const handleResolveAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMistake || !userAnswer.trim()) return;

    if (Number(userAnswer) === Number(activeMistake.question.answer)) {
      soundService.playCorrect();
      fireStarBurst();
      resolveMistake(activeMistake.id);
      setActiveMistake(null);
      setUserAnswer('');
    } else {
      soundService.playWrong();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('mistakes')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Xatolar — o‘rganish yo‘lidagi muhim qadamlardir!
        </p>
      </div>

      {unresolved.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
          Ajoyib! Xatolar daftarida hal qilinmagan savollar yo‘q. Siz barcha mashqlarni to‘g‘ri yechgansiz! 🎉
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {unresolved.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    {m.question.equationString}
                  </h3>
                  <span className="text-xs text-rose-500 font-bold">
                    Kiritilgan noto‘g‘ri javob: {String(m.incorrectAnswer)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setActiveMistake(m);
                  setUserAnswer('');
                }}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Qayta yechish
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Re-solve Modal */}
      {activeMistake && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleResolveAttempt}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-5 animate-bounce-gentle"
          >
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 text-center">
              Xatoni to‘g‘rilaymiz
            </h3>

            <div className="py-4 px-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
              <EquationView
                equation={activeMistake.question.equationString}
                unknownSymbol={activeMistake.question.unknownSymbol}
                size="lg"
              />
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <span>{activeMistake.question.hintSteps[0] || 'Teskari amalni qo‘llang!'}</span>
            </div>

            <input
              type="number"
              required
              autoFocus
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="To‘g‘ri javobni yozing"
              className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center text-2xl font-black text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveMistake(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md active:scale-95 transition-all"
              >
                Tekshirish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
