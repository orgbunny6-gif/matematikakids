/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { generateQuestion } from '../engine/questionGenerator.ts';
import { SeededRNG, createDateSeed } from '../engine/rng.ts';
import { ExerciseShell } from '../components/exercise/ExerciseShell.tsx';
import { McqExercise } from '../components/exercise/McqExercise.tsx';
import { FillExercise } from '../components/exercise/FillExercise.tsx';
import { calculateStars } from '../engine/xpRules.ts';
import { Calendar, Star, CheckCircle, Gift } from 'lucide-react';

interface DailyPageProps {
  onNavigate: (route: string) => void;
}

export function DailyPage({ onNavigate }: DailyPageProps) {
  const { progress, completeDailyChallenge } = useApp();
  const { t } = useT();

  const todayKey = new Date().toISOString().split('T')[0]!;
  const isAlreadyDone = Boolean(progress.daily[todayKey]?.completed);

  // Generate 5 questions seeded by today's date
  const [questions] = useState(() => {
    const seed = createDateSeed(todayKey);
    const rng = new SeededRNG(seed);
    return Array.from({ length: 5 }, () => generateQuestion({ difficulty: 'easy', rng }));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) setCorrectCount((c) => c + 1);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
      }, 900);
    } else {
      const finalScore = Math.round(((correctCount + (isCorrect ? 1 : 0)) / questions.length) * 100);
      const stars = calculateStars(finalScore);

      setTimeout(() => {
        completeDailyChallenge(finalScore, stars);
        setSessionFinished(true);
      }, 1000);
    }
  };

  const currentQ = questions[currentIndex]!;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('daily')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Har kuni 5 ta maxsus savol yeching va xazina sandig‘ini oching!
        </p>
      </div>

      {isAlreadyDone || sessionFinished ? (
        <div className="flex flex-col items-center text-center gap-5 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl animate-bounce-gentle">
          <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-5xl shadow-inner">
            🎁
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Bugungi chaqiriq bajarildi!
          </h2>
          <p className="text-sm font-medium text-slate-500 max-w-md">
            Siz bugungi kunlik mukofot (+35 XP va yulduzlar)ni qabul qilib oldingiz. Yangi chaqiriq ertaga ochiladi!
          </p>

          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="py-3 px-8 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      ) : (
        <ExerciseShell
          question={currentQ}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onAnswerSubmit={handleAnswerSubmit}
        >
          {({ onSubmitAnswer, disabled }) =>
            currentQ.format === 'fill' ? (
              <FillExercise
                question={currentQ}
                onSubmit={onSubmitAnswer}
                disabled={disabled}
              />
            ) : (
              <McqExercise
                question={currentQ}
                onSubmit={onSubmitAnswer}
                disabled={disabled}
              />
            )
          }
        </ExerciseShell>
      )}
    </div>
  );
}
