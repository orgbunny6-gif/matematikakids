/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Question } from '../../types.ts';
import { useT } from '../../i18n/I18nContext.tsx';
import { MascotBubble } from '../mascot/MascotBubble.tsx';
import { soundService } from '../../services/soundService.ts';
import { fireStarBurst } from '../../services/confettiService.ts';
import { Lightbulb, ArrowRight, RotateCcw } from 'lucide-react';

interface ExerciseShellProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (isCorrect: boolean, answer: number | boolean | string, hintsUsed: number, timeMs: number) => void;
  children: (props: {
    onSubmitAnswer: (ans: number | boolean | string) => void;
    isSubmitted: boolean;
    isCorrect: boolean | null;
    disabled: boolean;
  }) => React.ReactNode;
}

export function ExerciseShell({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSubmit,
  children,
}: ExerciseShellProps) {
  const { t, locale } = useT();
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | boolean | string>('');
  const [startTime, setStartTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // Reset state on new question
    setHintsUsed(0);
    setIsSubmitted(false);
    setIsCorrect(null);
    setUserAnswer('');
    setShowExplanation(false);
    setStartTime(Date.now());
  }, [question.id]);

  const handleUseHint = () => {
    if (hintsUsed < question.hintSteps.length) {
      soundService.playClick();
      setHintsUsed((prev) => prev + 1);
    }
  };

  const handleChildAnswer = (ans: number | boolean | string) => {
    if (isSubmitted) return;
    const timeMs = Date.now() - startTime;
    setUserAnswer(ans);

    let correct = false;
    if (typeof question.answer === 'boolean') {
      correct = ans === question.answer;
    } else {
      correct = Number(ans) === Number(question.answer);
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      soundService.playCorrect();
      fireStarBurst();
    } else {
      soundService.playWrong();
    }

    onAnswerSubmit(correct, ans, hintsUsed, timeMs);
  };

  const handleNext = () => {
    soundService.playClick();
    // Next question will trigger useEffect reset via parent
  };

  // Determine feedback message for Tengo
  let feedbackMessage = '';
  if (!isSubmitted) {
    if (hintsUsed > 0) {
      feedbackMessage = question.hintSteps[hintsUsed - 1] || t('tengoHelp');
    } else {
      feedbackMessage = question.wordProblemText
        ? locale === 'ru'
          ? question.wordProblemText.ru
          : locale === 'uz-Cyrl'
          ? question.wordProblemText.uzCyrl
          : question.wordProblemText.uzLatn
        : t('tengoThinking');
    }
  } else if (isCorrect) {
    feedbackMessage = t('correct1');
  } else {
    feedbackMessage = t('wrongSoft1');
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5 p-4 sm:p-6 bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-lg border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
      {/* Header bar: progress & hints */}
      <div className="flex items-center justify-between gap-4">
        {/* Progress pills */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            <span>
              {t('questionNumber', { current: questionNumber, total: totalQuestions })}
            </span>
            <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Hint button */}
        {!isSubmitted && question.hintSteps.length > 0 && (
          <button
            type="button"
            onClick={handleUseHint}
            disabled={hintsUsed >= question.hintSteps.length}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              hintsUsed >= question.hintSteps.length
                ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-200 active:scale-95'
            }`}
          >
            <Lightbulb className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{t('hint')} ({question.hintSteps.length - hintsUsed})</span>
          </button>
        )}
      </div>

      {/* Tengo mascot helper bubble */}
      <MascotBubble
        mood={isSubmitted ? (isCorrect ? 'happy' : 'encouraging') : hintsUsed > 0 ? 'thinking' : 'idle'}
        message={feedbackMessage}
      />

      {/* Main Exercise Interactive Slot */}
      <div className="py-2">
        {children({
          onSubmitAnswer: handleChildAnswer,
          isSubmitted,
          isCorrect,
          disabled: isSubmitted,
        })}
      </div>

      {/* Feedback & Next controls */}
      {isSubmitted && (
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-bounce-gentle">
          <div className="flex items-center justify-between">
            <span
              className={`text-base font-extrabold ${
                isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isCorrect ? `✓ ${t('congratulations')}` : `🤔 ${t('correctAnswerWas')} ${question.answer}`}
            </span>

            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t('whyThisWorks')}
            </button>
          </div>

          {showExplanation && (
            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl text-sm text-slate-700 dark:text-slate-300">
              {question.explanation}
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-base sm:text-lg shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>{t('nextQuestion')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
