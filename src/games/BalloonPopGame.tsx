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

interface BalloonPopGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

const BALLOON_COLORS = [
  'bg-pink-500 border-pink-400',
  'bg-indigo-500 border-indigo-400',
  'bg-emerald-500 border-emerald-400',
  'bg-amber-500 border-amber-400',
  'bg-sky-500 border-sky-400',
];

export function BalloonPopGame({ onFinish, onBack }: BalloonPopGameProps) {
  const [poppedCount, setPoppedCount] = useState(0);
  const targetPops = 8;
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [question, setQuestion] = useState<Question>(() => generateQuestion({ difficulty: 'easy' }));

  const options = question.options ?? [Number(question.answer), 3, 6, 8];

  const handlePop = (val: number | string) => {
    if (isGameOver) return;
    const isCorrect = Number(val) === Number(question.answer);

    if (isCorrect) {
      soundService.playPop();
      fireStarBurst();
      const nextPops = poppedCount + 1;
      const nextCombo = combo + 1;
      const nextScore = score + 15 * nextCombo;
      setPoppedCount(nextPops);
      setCombo(nextCombo);
      setScore(nextScore);

      if (nextPops >= targetPops) {
        setIsGameOver(true);
        onFinish(nextScore, 3);
      } else {
        setQuestion(generateQuestion({ difficulty: 'easy' }));
      }
    } else {
      soundService.playWrong();
      setCombo(0);
    }
  };

  const handleRestart = () => {
    setPoppedCount(0);
    setScore(0);
    setCombo(0);
    setIsGameOver(false);
    setQuestion(generateQuestion({ difficulty: 'easy' }));
  };

  return (
    <GameShell
      title="🎈 Sharlarni Yorish"
      score={score}
      combo={combo}
      stars={3}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-6">
        <div className="text-xs font-bold text-slate-500">
          Yorilgan sharlar: {poppedCount} / {targetPops}
        </div>

        {/* Current equation */}
        <div className="py-3 px-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
          <EquationView
            equation={question.equationString}
            unknownSymbol={question.unknownSymbol}
            size="lg"
          />
        </div>

        {/* Floating Balloons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4">
          {options.map((val, idx) => {
            const colorClass = BALLOON_COLORS[idx % BALLOON_COLORS.length];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePop(val)}
                className={`relative w-20 h-26 sm:w-24 sm:h-30 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] ${colorClass} text-white font-black text-2xl sm:text-3xl shadow-lg border-2 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-90 animate-float`}
                style={{ animationDelay: `${idx * 0.4}s` }}
                aria-label={`Shar ${val}`}
              >
                {/* Balloon highlight */}
                <div className="absolute top-3 left-4 w-4 h-6 rounded-full bg-white/40 -rotate-25 pointer-events-none" />
                <span>{val}</span>
                {/* Knot & String */}
                <div className="absolute -bottom-1.5 w-3 h-2 bg-inherit rounded-sm" />
                <div className="absolute -bottom-6 w-0.5 h-5 bg-slate-400" />
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
