/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { TopicId, Question } from '../types.ts';
import { generateQuestion } from '../engine/questionGenerator.ts';
import { identifyWeakTopics } from '../engine/adaptive.ts';
import { ExerciseShell } from '../components/exercise/ExerciseShell.tsx';
import { McqExercise } from '../components/exercise/McqExercise.tsx';
import { FillExercise } from '../components/exercise/FillExercise.tsx';
import { BalanceExercise } from '../components/exercise/BalanceExercise.tsx';
import { TrueFalseExercise } from '../components/exercise/TrueFalseExercise.tsx';
import { DndExercise } from '../components/exercise/DndExercise.tsx';
import { soundService } from '../services/soundService.ts';
import { fireCelebrationConfetti } from '../services/confettiService.ts';
import { ArrowLeft, Star, RotateCcw } from 'lucide-react';

interface PracticeSessionPageProps {
  practiceType: string;
  onNavigate: (route: string) => void;
}

export function PracticeSessionPage({ practiceType, onNavigate }: PracticeSessionPageProps) {
  const { recordQuestionResult, progress } = useApp();
  const { t } = useT();

  const totalQuestions = 8;
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const getTopicForType = (type: string): TopicId => {
    if (type === 'add') return Math.random() > 0.5 ? 'add_x_first' : 'add_x_second';
    if (type === 'sub') return Math.random() > 0.5 ? 'sub_x_first' : 'sub_x_second';
    if (type === 'scale') return 'concept_scale';
    if (type === 'word') return 'word_problems';
    if (type === 'chain') return 'chain_equations';
    if (type === 'weak') {
      const weak = identifyWeakTopics(progress.topics);
      if (weak.length > 0) return weak[Math.floor(Math.random() * weak.length)]!;
    }
    return 'add_x_first';
  };

  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    generateQuestion({ topicId: getTopicForType(practiceType) })
  );

  const handleAnswerSubmit = (
    isCorrect: boolean,
    givenAns: number | boolean | string,
    hintsUsed: number,
    timeMs: number
  ) => {
    recordQuestionResult({
      questionId: currentQuestion.id,
      equationString: currentQuestion.equationString,
      topicId: currentQuestion.topicId,
      givenAnswer: givenAns,
      correctAnswer: currentQuestion.answer,
      isCorrect,
      hintsUsed,
      attempts: 1,
      timeMs,
    });

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    if (index < totalQuestions - 1) {
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setCurrentQuestion(generateQuestion({ topicId: getTopicForType(practiceType) }));
      }, 1000);
    } else {
      setTimeout(() => {
        soundService.playFanfare();
        fireCelebrationConfetti();
        setIsFinished(true);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setCorrectCount(0);
    setIsFinished(false);
    setCurrentQuestion(generateQuestion({ topicId: getTopicForType(practiceType) }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => onNavigate('/practice')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('practice')}</span>
        </button>
        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 capitalize">
          Mashq Sessiyasi ({practiceType})
        </span>
      </div>

      {!isFinished ? (
        <ExerciseShell
          question={currentQuestion}
          questionNumber={index + 1}
          totalQuestions={totalQuestions}
          onAnswerSubmit={handleAnswerSubmit}
        >
          {({ onSubmitAnswer, disabled }) => {
            if (currentQuestion.format === 'balance') {
              return (
                <BalanceExercise
                  question={currentQuestion}
                  onSubmit={(ans) => onSubmitAnswer(ans)}
                  disabled={disabled}
                />
              );
            }
            if (currentQuestion.format === 'tf') {
              return (
                <TrueFalseExercise
                  question={currentQuestion}
                  onSubmit={(ans) => onSubmitAnswer(ans)}
                  disabled={disabled}
                />
              );
            }
            if (currentQuestion.format === 'dnd') {
              return (
                <DndExercise
                  question={currentQuestion}
                  onSubmit={(ans) => onSubmitAnswer(ans)}
                  disabled={disabled}
                />
              );
            }
            if (currentQuestion.format === 'fill') {
              return (
                <FillExercise
                  question={currentQuestion}
                  onSubmit={(ans) => onSubmitAnswer(ans)}
                  disabled={disabled}
                />
              );
            }
            return (
              <McqExercise
                question={currentQuestion}
                onSubmit={(ans) => onSubmitAnswer(ans)}
                disabled={disabled}
              />
            );
          }}
        </ExerciseShell>
      ) : (
        <div className="flex flex-col items-center text-center gap-5 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl animate-bounce-gentle">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-4xl shadow-inner">
            🎉
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Mashq Muvaffaqiyatli Yakunlandi!
          </h2>
          <p className="text-sm font-bold text-slate-500">
            Natija: <span className="text-indigo-600 dark:text-indigo-400 text-lg font-black">{correctCount} / {totalQuestions}</span> ta to‘g‘ri javob!
          </p>

          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={handleRestart}
              className="py-3 px-6 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yana mashq qilish</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/practice')}
              className="py-3 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Mashq markaziga
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
