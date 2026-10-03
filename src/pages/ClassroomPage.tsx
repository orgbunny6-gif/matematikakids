/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useT } from '../i18n/I18nContext.tsx';
import { generateQuestion } from '../engine/questionGenerator.ts';
import { Question } from '../types.ts';
import { EquationView } from '../components/math/EquationView.tsx';
import { soundService } from '../services/soundService.ts';
import { Maximize, Play, RotateCcw, Eye, Clock, Users } from 'lucide-react';

export function ClassroomPage() {
  const { t } = useT();

  const [question, setQuestion] = useState<Question>(() => generateQuestion({ difficulty: 'medium' }));
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Group Battle Mode
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);

  const handleNextQuestion = () => {
    soundService.playClick();
    setShowAnswer(false);
    setTimerSeconds(30);
    setIsTimerRunning(false);
    setQuestion(generateQuestion({ difficulty: 'medium' }));
  };

  const toggleFullscreen = () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            {t('classroomModeTitle')}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Interaktiv doska va proyektorlar uchun maxsus katta ekran rejimi
          </p>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 shadow-sm"
          title="To‘liq ekran"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      {/* Main Giant Display Card */}
      <div className="p-8 sm:p-14 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900 shadow-xl flex flex-col items-center gap-8 text-center">
        <div className="text-base sm:text-xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Tenglamani birgalikda yechamiz:
        </div>

        <div className="py-6 px-10 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/60 border-2 border-indigo-300 dark:border-indigo-700">
          <EquationView
            equation={question.equationString}
            unknownSymbol={question.unknownSymbol}
            size="xl"
          />
        </div>

        {/* Revealed Answer Box */}
        {showAnswer && (
          <div className="p-4 px-8 rounded-2xl bg-emerald-500 text-white font-black text-3xl sm:text-4xl shadow-lg animate-bounce-gentle">
            x = {String(question.answer)} ✓
          </div>
        )}

        {/* Teacher Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-5 h-5" />
            <span>{showAnswer ? 'Javobni yashirish' : t('showAnswer')}</span>
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{t('nextQuestion')}</span>
          </button>
        </div>
      </div>

      {/* Team Battle Scoreboard (A Guruhi vs B Guruhi) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-900 flex flex-col items-center gap-3">
          <span className="font-black text-lg text-blue-600 dark:text-blue-400">
            {t('teamA')}
          </span>
          <span className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-slate-100">
            {teamAScore}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTeamAScore((s) => Math.max(0, s - 1))}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border text-xl font-black active:scale-95"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => {
                soundService.playCorrect();
                setTeamAScore((s) => s + 1);
              }}
              className="w-10 h-10 rounded-xl bg-blue-600 text-white text-xl font-black active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-900 flex flex-col items-center gap-3">
          <span className="font-black text-lg text-amber-600 dark:text-amber-400">
            {t('teamB')}
          </span>
          <span className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-slate-100">
            {teamBScore}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTeamBScore((s) => Math.max(0, s - 1))}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border text-xl font-black active:scale-95"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => {
                soundService.playCorrect();
                setTeamBScore((s) => s + 1);
              }}
              className="w-10 h-10 rounded-xl bg-amber-600 text-white text-xl font-black active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
