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

interface PassAndPlayGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

export function PassAndPlayGame({ onFinish, onBack }: PassAndPlayGameProps) {
  const [turn, setTurn] = useState<1 | 2>(1);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [round, setRound] = useState(1);
  const totalRounds = 6;
  const [isGameOver, setIsGameOver] = useState(false);
  const [question, setQuestion] = useState<Question>(() => generateQuestion({ difficulty: 'easy' }));

  const handleAnswer = (ans: number | string) => {
    if (isGameOver) return;
    const isCorrect = Number(ans) === Number(question.answer);

    if (isCorrect) {
      soundService.playCorrect();
      if (turn === 1) {
        setScore1((prev) => prev + 10);
      } else {
        setScore2((prev) => prev + 10);
      }
    } else {
      soundService.playWrong();
    }

    if (round >= totalRounds) {
      soundService.playFanfare();
      fireCelebrationConfetti();
      setIsGameOver(true);
      onFinish(Math.max(score1, score2), 3);
    } else {
      setRound((r) => r + 1);
      setTurn((t) => (t === 1 ? 2 : 1));
      setQuestion(generateQuestion({ difficulty: 'easy' }));
    }
  };

  const options = question.options ?? [Number(question.answer), 3, 5, 8];

  return (
    <GameShell
      title="👫 Ikki Kishilik Bellashuv"
      score={score1 + score2}
      stars={3}
      isGameOver={isGameOver}
      onRestart={() => {
        setTurn(1);
        setScore1(0);
        setScore2(0);
        setRound(1);
        setIsGameOver(false);
        setQuestion(generateQuestion({ difficulty: 'easy' }));
      }}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-6">
        {/* Turn scoreboard */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div
            className={`p-3 rounded-2xl border-2 flex flex-col items-center transition-all ${
              turn === 1
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 scale-102 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
            }`}
          >
            <span className="text-xs font-black text-blue-600 dark:text-blue-400">1-O‘quvchi</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{score1} ball</span>
          </div>

          <div
            className={`p-3 rounded-2xl border-2 flex flex-col items-center transition-all ${
              turn === 2
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 scale-102 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
            }`}
          >
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">2-O‘quvchi</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{score2} ball</span>
          </div>
        </div>

        <div className="text-sm font-black text-slate-600 dark:text-slate-300">
          Hozir navbat: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{turn}-O‘quvchi</span> ({round} / {totalRounds})
        </div>

        {/* Current equation */}
        <div className="py-3 px-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
          <EquationView
            equation={question.equationString}
            unknownSymbol={question.unknownSymbol}
            size="lg"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAnswer(opt)}
              className="h-16 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black text-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
