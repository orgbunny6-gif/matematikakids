/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { Question, Homework } from '../types.ts';
import { generateQuestion } from '../engine/questionGenerator.ts';
import { SeededRNG } from '../engine/rng.ts';
import { ExerciseShell } from '../components/exercise/ExerciseShell.tsx';
import { McqExercise } from '../components/exercise/McqExercise.tsx';
import { FillExercise } from '../components/exercise/FillExercise.tsx';
import { calculateStars } from '../engine/xpRules.ts';
import { soundService } from '../services/soundService.ts';
import { fireCelebrationConfetti } from '../services/confettiService.ts';
import { ArrowLeft, CheckCircle, Star } from 'lucide-react';

interface HomeworkSessionPageProps {
  homeworkId: string;
  onNavigate: (route: string) => void;
}

export function HomeworkSessionPage({ homeworkId, onNavigate }: HomeworkSessionPageProps) {
  const { homework, completeHomework } = useApp();
  const { t } = useT();

  const currentHw = homework.find((h) => h.id === homeworkId);

  // Generate questions deterministically from homework seed
  const [questions] = useState<Question[]>(() => {
    if (!currentHw) return [];
    const rng = new SeededRNG(currentHw.seed);
    return Array.from({ length: currentHw.config.count }, () => {
      const topic = rng.pick(currentHw.config.topics);
      return generateQuestion({ topicId: topic, difficulty: currentHw.config.difficulty, rng });
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!currentHw || questions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <h2 className="text-xl font-bold">Vazifa topilmadi</h2>
        <button
          type="button"
          onClick={() => onNavigate('/homework')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Uyga vazifalarga qaytish
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex]!;

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
        soundService.playFanfare();
        fireCelebrationConfetti();
        completeHomework(currentHw.id, finalScore, stars);
        setIsCompleted(true);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => onNavigate('/homework')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('homeworkTitle')}</span>
        </button>
        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
          {currentHw.title}
        </span>
      </div>

      {!isCompleted ? (
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
      ) : (
        <div className="flex flex-col items-center text-center gap-5 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl animate-bounce-gentle">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-4xl shadow-inner">
            🌟
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Vazifa Bajarildi!
          </h2>
          <p className="text-sm font-bold text-slate-500">
            To‘g‘ri javoblar: {correctCount} / {questions.length} (+40 XP)
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/homework')}
            className="mt-2 py-3 px-8 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Vazifalar ro‘yxatiga qaytish
          </button>
        </div>
      )}
    </div>
  );
}
