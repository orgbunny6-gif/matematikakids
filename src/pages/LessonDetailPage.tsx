/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { LessonId, Question } from '../types.ts';
import { LESSONS } from '../data/lessons.ts';
import { generateQuestion } from '../engine/questionGenerator.ts';
import { MascotBubble } from '../components/mascot/MascotBubble.tsx';
import { ExerciseShell } from '../components/exercise/ExerciseShell.tsx';
import { McqExercise } from '../components/exercise/McqExercise.tsx';
import { FillExercise } from '../components/exercise/FillExercise.tsx';
import { BalanceScale } from '../components/math/BalanceScale.tsx';
import { calculateStars } from '../engine/xpRules.ts';
import { soundService } from '../services/soundService.ts';
import { fireCelebrationConfetti } from '../services/confettiService.ts';
import { ArrowLeft, ArrowRight, Star, CheckCircle } from 'lucide-react';

interface LessonDetailPageProps {
  lessonId: LessonId;
  onNavigate: (route: string) => void;
}

type LessonStage = 'story' | 'theory' | 'practice' | 'minitest' | 'completed';

export function LessonDetailPage({ lessonId, onNavigate }: LessonDetailPageProps) {
  const { completeLesson, recordQuestionResult } = useApp();
  const { t, locale } = useT();

  const lesson = LESSONS.find((l) => l.id === lessonId) || LESSONS[0]!;

  const [stage, setStage] = useState<LessonStage>('story');
  const [theoryStep, setTheoryStep] = useState(0);

  // Practice session state (5 questions)
  const totalPracticeQuestions = 5;
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceCorrect, setPracticeCorrect] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    generateQuestion({ topicId: lesson.topicId, difficulty: 'easy' })
  );

  const titleText =
    locale === 'ru'
      ? lesson.title.ru
      : locale === 'uz-Cyrl'
      ? lesson.title.uzCyrl
      : lesson.title.uzLatn;

  const storyText =
    locale === 'ru'
      ? lesson.story.ru
      : locale === 'uz-Cyrl'
      ? lesson.story.uzCyrl
      : lesson.story.uzLatn;

  const currentStep = lesson.steps[theoryStep] || lesson.steps[0]!;

  const stepTitle =
    locale === 'ru'
      ? currentStep.title.ru
      : locale === 'uz-Cyrl'
      ? currentStep.title.uzCyrl
      : currentStep.title.uzLatn;

  const stepContent =
    locale === 'ru'
      ? currentStep.content.ru
      : locale === 'uz-Cyrl'
      ? currentStep.content.uzCyrl
      : currentStep.content.uzLatn;

  const handleNextTheory = () => {
    soundService.playClick();
    if (theoryStep < lesson.steps.length - 1) {
      setTheoryStep((prev) => prev + 1);
    } else {
      setStage('practice');
      setPracticeIndex(0);
      setPracticeCorrect(0);
      setCurrentQuestion(generateQuestion({ topicId: lesson.topicId, difficulty: 'easy' }));
    }
  };

  const handlePracticeAnswer = (
    isCorrect: boolean,
    givenAns: number | boolean | string,
    hintsUsed: number,
    timeMs: number
  ) => {
    recordQuestionResult({
      questionId: currentQuestion.id,
      equationString: currentQuestion.equationString,
      topicId: lesson.topicId,
      givenAnswer: givenAns,
      correctAnswer: currentQuestion.answer,
      isCorrect,
      hintsUsed,
      attempts: 1,
      timeMs,
    });

    if (isCorrect) {
      setPracticeCorrect((prev) => prev + 1);
    }

    if (practiceIndex < totalPracticeQuestions - 1) {
      setTimeout(() => {
        setPracticeIndex((prev) => prev + 1);
        setCurrentQuestion(generateQuestion({ topicId: lesson.topicId, difficulty: 'easy' }));
      }, 1000);
    } else {
      // Completed lesson!
      const percentage = Math.round(((practiceCorrect + (isCorrect ? 1 : 0)) / totalPracticeQuestions) * 100);
      const stars = calculateStars(percentage);

      setTimeout(() => {
        completeLesson(lesson.id, stars, percentage);
        setStage('completed');
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header with back */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => onNavigate('/lessons')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('lessons')}</span>
        </button>
        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
          {titleText}
        </span>
      </div>

      {/* Stage 1: Story Intro */}
      {stage === 'story' && (
        <div className="flex flex-col items-center text-center gap-6 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md animate-bounce-gentle">
          <MascotBubble mood="happy" message={storyText} className="max-w-md" />
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              setStage('theory');
            }}
            className="py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            <span>{t('start')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stage 2: Visual Theory */}
      {stage === 'theory' && (
        <div className="flex flex-col items-center gap-6 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 text-center">
            {stepTitle}
          </h2>

          <div className="w-full flex justify-center py-2">
            <BalanceScale
              leftUnknownSymbol={currentStep.visualData.symbol || 'x'}
              leftUnknownValue={currentStep.visualData.unknown || 0}
              leftKnownBlocks={currentStep.visualData.left}
              rightBlocks={currentStep.visualData.right}
            />
          </div>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 text-center max-w-lg font-medium leading-relaxed">
            {stepContent}
          </p>

          <button
            type="button"
            onClick={handleNextTheory}
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-105 text-white font-black text-base shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            <span>{theoryStep < lesson.steps.length - 1 ? t('next') : 'Mashqlarni boshlash'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stage 3: Practice Questions */}
      {stage === 'practice' && (
        <ExerciseShell
          question={currentQuestion}
          questionNumber={practiceIndex + 1}
          totalQuestions={totalPracticeQuestions}
          onAnswerSubmit={handlePracticeAnswer}
        >
          {({ onSubmitAnswer, disabled }) =>
            currentQuestion.format === 'fill' ? (
              <FillExercise
                question={currentQuestion}
                onSubmit={onSubmitAnswer}
                disabled={disabled}
              />
            ) : (
              <McqExercise
                question={currentQuestion}
                onSubmit={onSubmitAnswer}
                disabled={disabled}
              />
            )
          }
        </ExerciseShell>
      )}

      {/* Stage 4: Completed Reward Screen */}
      {stage === 'completed' && (
        <div className="flex flex-col items-center text-center gap-5 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl animate-bounce-gentle">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-4xl shadow-inner">
            🌟
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            {t('congratulations')}
          </h2>
          <p className="text-sm font-medium text-slate-500 max-w-md">
            Siz ushbu darsni a’lo darajada yakunladingiz va +50 XP ga ega bo‘ldingiz!
          </p>

          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <Star key={s} className="w-8 h-8 fill-amber-400 text-amber-500 animate-bounce-gentle" />
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              onClick={() => onNavigate('/map')}
              className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all"
            >
              {t('map')}ga qaytish
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/lessons')}
              className="py-3 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm hover:bg-slate-200 active:scale-95 transition-all"
            >
              Keyingi dars
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
