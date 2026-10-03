/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { Question, QuestionResult, TestAttempt } from '../types.ts';
import { generateQuestion } from '../engine/questionGenerator.ts';
import { EquationView } from '../components/math/EquationView.tsx';
import { calculateStars } from '../engine/xpRules.ts';
import { soundService } from '../services/soundService.ts';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface TestSessionPageProps {
  testId: string;
  onNavigate: (route: string) => void;
}

export function TestSessionPage({ testId, onNavigate }: TestSessionPageProps) {
  const { recordTestAttempt } = useApp();
  const { t } = useT();

  const totalQuestions = testId === 'super_exam' ? 20 : 10;

  const [questions] = useState<Question[]>(() =>
    Array.from({ length: totalQuestions }, () =>
      generateQuestion({
        difficulty: testId === 'super_exam' ? 'hard' : 'medium',
      })
    )
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | string>>({});
  const [startTime] = useState(Date.now());

  const currentQ = questions[currentIndex]!;
  const options = currentQ.options ?? [Number(currentQ.answer), 3, 6, 8];

  const handleSelectOption = (opt: number | string) => {
    soundService.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: opt }));
  };

  const handleNext = () => {
    soundService.playClick();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    let correctCount = 0;
    const results: QuestionResult[] = questions.map((q, idx) => {
      const given = selectedAnswers[idx] ?? '';
      const isCorrect = Number(given) === Number(q.answer);
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        equationString: q.equationString,
        topicId: q.topicId,
        givenAnswer: given,
        correctAnswer: q.answer,
        isCorrect,
        hintsUsed: 0,
        attempts: 1,
        timeMs: 5000,
      };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const stars = calculateStars(score);
    const xpEarned = 30 + correctCount * 5;

    const attempt: TestAttempt = {
      id: `test_att_${Date.now()}`,
      testId,
      titleKey: testId,
      startedAt: startTime,
      finishedAt: Date.now(),
      questions: results,
      score,
      stars,
      xpEarned,
    };

    recordTestAttempt(attempt);
    onNavigate(`/tests/result/${attempt.id}`);
  };

  const isCurrentAnswered = selectedAnswers[currentIndex] !== undefined;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => onNavigate('/tests')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Chiqish</span>
        </button>

        <span className="text-xs font-black text-slate-500">
          Savol {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col items-center gap-6">
        <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
          Tenglamani yeching va to‘g‘ri javobni belgilang:
        </div>

        <div className="py-4 px-8 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
          <EquationView
            equation={currentQ.equationString}
            unknownSymbol={currentQ.unknownSymbol}
            size="lg"
          />
        </div>

        {/* 2x2 Options */}
        <div className="grid grid-cols-2 gap-3.5 w-full">
          {options.map((opt, i) => {
            const isSelected = selectedAnswers[currentIndex] === opt;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`h-18 rounded-2xl font-black text-2xl border-2 transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!isCurrentAnswered}
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-base shadow-md hover:brightness-105 active:scale-98 transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{currentIndex < totalQuestions - 1 ? t('next') : t('finish')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
