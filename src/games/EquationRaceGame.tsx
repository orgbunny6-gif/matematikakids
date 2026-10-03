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

interface EquationRaceGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

export function EquationRaceGame({ onFinish, onBack }: EquationRaceGameProps) {
  const [playerDist, setPlayerDist] = useState(0);
  const [robotDist, setRobotDist] = useState(0);
  const finishLine = 6;
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [question, setQuestion] = useState<Question>(() => generateQuestion({ difficulty: 'easy' }));

  const handleAnswer = (val: number | string) => {
    if (isGameOver) return;
    const isCorrect = Number(val) === Number(question.answer);

    if (isCorrect) {
      soundService.playCorrect();
      fireStarBurst();
      const nextPlayer = playerDist + 1;
      const nextRobot = robotDist + (Math.random() > 0.4 ? 1 : 0);
      const nextScore = score + 20;
      setPlayerDist(nextPlayer);
      setRobotDist(nextRobot);
      setScore(nextScore);

      if (nextPlayer >= finishLine) {
        setIsGameOver(true);
        onFinish(nextScore, 3);
      } else {
        setQuestion(generateQuestion({ difficulty: 'easy' }));
      }
    } else {
      soundService.playWrong();
      setRobotDist((prev) => Math.min(finishLine - 1, prev + 1));
    }
  };

  const handleRestart = () => {
    setPlayerDist(0);
    setRobotDist(0);
    setScore(0);
    setIsGameOver(false);
    setQuestion(generateQuestion({ difficulty: 'easy' }));
  };

  const options = question.options ?? [Number(question.answer), 2, 5, 8];

  return (
    <GameShell
      title="🏎️ Tenglama Poygasi"
      score={score}
      stars={3}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-6">
        {/* Race Track */}
        <div className="w-full flex flex-col gap-3 p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700">
          {/* Player Lane */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">Sening mashinang:</span>
            <div className="relative h-10 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden flex items-center px-2">
              <div
                className="absolute text-2xl transition-all duration-500 ease-out"
                style={{ left: `${(playerDist / finishLine) * 85}%` }}
              >
                🏎️
              </div>
              <div className="absolute right-2 text-xl font-bold">🏁</div>
            </div>
          </div>

          {/* Robot Lane */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-slate-500">Robot do‘st:</span>
            <div className="relative h-10 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden flex items-center px-2">
              <div
                className="absolute text-2xl transition-all duration-500 ease-out"
                style={{ left: `${(robotDist / finishLine) * 85}%` }}
              >
                🚗
              </div>
              <div className="absolute right-2 text-xl font-bold">🏁</div>
            </div>
          </div>
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
              className="h-16 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black text-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
