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
import { fireCelebrationConfetti } from '../services/confettiService.ts';

interface StarLadderGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

export function StarLadderGame({ onFinish, onBack }: StarLadderGameProps) {
  const [rung, setRung] = useState(0);
  const totalRungs = 7;
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [question, setQuestion] = useState<Question>(() => generateQuestion({ difficulty: 'easy' }));

  const handleAnswer = (val: number | string) => {
    if (isGameOver) return;
    const isCorrect = Number(val) === Number(question.answer);

    if (isCorrect) {
      soundService.playCorrect();
      const nextRung = rung + 1;
      const nextScore = score + 15;
      setRung(nextRung);
      setScore(nextScore);

      if (nextRung >= totalRungs) {
        soundService.playFanfare();
        fireCelebrationConfetti();
        setTimeout(() => {
          setIsGameOver(true);
          onFinish(nextScore, 3);
        }, 800);
      } else {
        setQuestion(generateQuestion({ difficulty: 'easy' }));
      }
    } else {
      soundService.playWrong();
      setRung((prev) => Math.max(0, prev - 1));
    }
  };

  const handleRestart = () => {
    setRung(0);
    setScore(0);
    setIsGameOver(false);
    setQuestion(generateQuestion({ difficulty: 'easy' }));
  };

  const options = question.options ?? [Number(question.answer), 3, 6, 8];

  return (
    <GameShell
      title="⭐ Yulduz Zinapoyasi"
      score={score}
      stars={3}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      onBack={onBack}
    >
      <div className="w-full flex items-center justify-between gap-6">
        {/* Ladder Graphic */}
        <div className="flex flex-col-reverse items-center justify-between h-72 w-24 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border-2 border-slate-300 dark:border-slate-700 relative">
          {/* Golden Star at the top */}
          <div className="text-3xl animate-bounce-gentle">⭐</div>

          {Array.from({ length: totalRungs }).map((_, idx) => {
            const isClimbed = idx <= rung;
            const isCurrent = idx === rung;

            return (
              <div
                key={idx}
                className={`w-full h-5 rounded-md flex items-center justify-center text-xs font-black transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : isClimbed
                    ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-700'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {isCurrent ? '🧗' : idx + 1}
              </div>
            );
          })}
        </div>

        {/* Right Pane: Question & Choices */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <span className="text-xs font-bold text-slate-500">
            Pog‘ona: {rung} / {totalRungs}
          </span>

          <div className="py-3 px-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 w-full text-center">
            <EquationView
              equation={question.equationString}
              unknownSymbol={question.unknownSymbol}
              size="md"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(opt)}
                className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black text-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
}
