/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameShell } from './common/GameShell.tsx';
import { generateQuestion } from '../engine/questionGenerator.ts';
import { Question } from '../types.ts';
import { EquationView } from '../components/math/EquationView.tsx';
import { soundService } from '../services/soundService.ts';
import { fireCelebrationConfetti } from '../services/confettiService.ts';

interface RocketLaunchGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

export function RocketLaunchGame({ onFinish, onBack }: RocketLaunchGameProps) {
  const [fuel, setFuel] = useState(0);
  const maxFuel = 6;
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [question, setQuestion] = useState<Question>(() => generateQuestion({ difficulty: 'easy' }));
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleAnswer = (ans: number | string) => {
    if (isLaunching || isGameOver) return;
    const isCorrect = Number(ans) === Number(question.answer);

    if (isCorrect) {
      soundService.playCorrect();
      const nextFuel = fuel + 1;
      const nextCombo = combo + 1;
      const nextScore = score + 10 * nextCombo;
      setFuel(nextFuel);
      setCombo(nextCombo);
      setScore(nextScore);

      if (nextFuel >= maxFuel) {
        setIsLaunching(true);
        soundService.playFanfare();
        fireCelebrationConfetti();
        setTimeout(() => {
          setIsGameOver(true);
          onFinish(nextScore, 3);
        }, 1800);
      } else {
        setQuestion(generateQuestion({ difficulty: 'easy' }));
      }
    } else {
      soundService.playWrong();
      setCombo(0);
    }
  };

  const handleRestart = () => {
    setFuel(0);
    setScore(0);
    setCombo(0);
    setIsGameOver(false);
    setIsLaunching(false);
    setQuestion(generateQuestion({ difficulty: 'easy' }));
  };

  const options = question.options ?? [Number(question.answer), 4, 7, 9];

  return (
    <GameShell
      title="🚀 Raketa Uchishi"
      score={score}
      combo={combo}
      stars={3}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-6">
        {/* Rocket and Fuel Tank indicator */}
        <div className="flex items-center justify-center gap-6 w-full py-2">
          {/* Fuel Gauges */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-black uppercase text-indigo-500 tracking-wider">
              Yoqilg‘i
            </span>
            <div className="flex flex-col-reverse gap-1.5 h-36 w-8 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full border border-slate-300 dark:border-slate-700">
              {Array.from({ length: maxFuel }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full flex-1 rounded-full transition-all duration-300 ${
                    i < fuel
                      ? 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-sm'
                      : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500">
              {fuel}/{maxFuel}
            </span>
          </div>

          {/* Rocket Graphic */}
          <div className="relative flex flex-col items-center">
            <div
              className={`text-7xl sm:text-8xl select-none transition-transform duration-1000 ${
                isLaunching ? '-translate-y-48 scale-110 opacity-0' : 'animate-float'
              }`}
            >
              🚀
            </div>
            {isLaunching && (
              <div className="text-4xl animate-bounce-gentle -mt-3">🔥</div>
            )}
            <div className="h-2 w-28 bg-slate-200 dark:bg-slate-800 rounded-full mt-2" />
          </div>
        </div>

        {/* Current Equation */}
        <div className="py-3 px-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
          <EquationView
            equation={question.equationString}
            unknownSymbol={question.unknownSymbol}
            size="lg"
          />
        </div>

        {/* Option choices */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAnswer(opt)}
              className="h-16 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black text-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 active:scale-95 transition-all shadow-sm flex items-center justify-center"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
