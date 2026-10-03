/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameShell } from './common/GameShell.tsx';
import { generateQuestion } from '../engine/questionGenerator.ts';
import { Question } from '../types.ts';
import { EquationView } from '../components/math/EquationView.tsx';
import { soundService } from '../services/soundService.ts';
import { fireStarBurst } from '../services/confettiService.ts';

interface TargetPracticeGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

export function TargetPracticeGame({ onFinish, onBack }: TargetPracticeGameProps) {
  const [hits, setHits] = useState(0);
  const totalTargets = 6;
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [question, setQuestion] = useState<Question>(() => generateQuestion({ difficulty: 'easy' }));

  const handleShoot = (ans: number | string) => {
    if (isGameOver) return;
    const isCorrect = Number(ans) === Number(question.answer);

    if (isCorrect) {
      soundService.playCorrect();
      fireStarBurst();
      const nextHits = hits + 1;
      const nextScore = score + 20;
      setHits(nextHits);
      setScore(nextScore);

      if (nextHits >= totalTargets) {
        setTimeout(() => {
          setIsGameOver(true);
          onFinish(nextScore, 3);
        }, 600);
      } else {
        setQuestion(generateQuestion({ difficulty: 'easy' }));
      }
    } else {
      soundService.playWrong();
    }
  };

  const options = question.options ?? [Number(question.answer), 2, 5, 8];

  return (
    <GameShell
      title="🎯 Mo‘ljal"
      score={score}
      stars={3}
      isGameOver={isGameOver}
      onRestart={() => {
        setHits(0);
        setScore(0);
        setIsGameOver(false);
        setQuestion(generateQuestion({ difficulty: 'easy' }));
      }}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-6">
        <div className="text-xs font-bold text-slate-500">
          Urilgan nishonlar: {hits} / {totalTargets}
        </div>

        {/* Current equation */}
        <div className="py-3 px-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
          <EquationView
            equation={question.equationString}
            unknownSymbol={question.unknownSymbol}
            size="lg"
          />
        </div>

        {/* Targets grid */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 py-2">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleShoot(opt)}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-rose-500 hover:bg-rose-600 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-108 active:scale-95 text-white font-black text-3xl"
              aria-label={`Nishon ${opt}`}
            >
              {/* Concentric rings */}
              <div className="absolute inset-2 rounded-full border-2 border-white/60 pointer-events-none" />
              <div className="absolute inset-5 rounded-full border-2 border-white/40 pointer-events-none" />
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
