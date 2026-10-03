/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameShell } from './common/GameShell.tsx';
import { soundService } from '../services/soundService.ts';
import { fireStarBurst } from '../services/confettiService.ts';
import { Tengo } from '../components/mascot/Tengo.tsx';

interface FixRobotGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

const PUZZLES = [
  { eq: 'x + 4 = 9', tengoAns: 13, correctAns: 5, bugReason: 'Tengo ayirish o‘rniga qo‘shib yubordi!' },
  { eq: 'x - 3 = 5', tengoAns: 2, correctAns: 8, bugReason: 'Tengo qo‘shish o‘rniga ayirib qo‘ydi!' },
  { eq: '6 + x = 10', tengoAns: 16, correctAns: 4, bugReason: 'Tengo sonlarni qo‘shib yubordi!' },
  { eq: '10 - x = 6', tengoAns: 16, correctAns: 4, bugReason: 'Ayriluvchini topishda xatolik!' },
];

export function FixRobotGame({ onFinish, onBack }: FixRobotGameProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const current = PUZZLES[round]!;

  const handleFix = (ans: number) => {
    if (ans === current.correctAns) {
      soundService.playCorrect();
      fireStarBurst();
      const nextScore = score + 25;
      setScore(nextScore);

      setTimeout(() => {
        if (round >= PUZZLES.length - 1) {
          setIsGameOver(true);
          onFinish(nextScore, 3);
        } else {
          setRound((r) => r + 1);
        }
      }, 700);
    } else {
      soundService.playWrong();
    }
  };

  const options = [current.correctAns, current.tengoAns, current.correctAns + 2, Math.max(1, current.correctAns - 1)]
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort(() => Math.random() - 0.5);

  return (
    <GameShell
      title="🤖 Robotga Yordam"
      score={score}
      stars={3}
      isGameOver={isGameOver}
      onRestart={() => {
        setRound(0);
        setScore(0);
        setIsGameOver(false);
      }}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-5">
        <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800">
          <Tengo mood="thinking" size="sm" />
          <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
            Tengo: “Menimcha, <span className="font-extrabold text-indigo-600">{current.eq}</span> uchun <span className="text-rose-500 font-extrabold">x = {current.tengoAns}</span> bo‘ladi. To‘g‘rimi?”
          </div>
        </div>

        <div className="text-sm font-black text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full border border-rose-200">
          ⚠️ Tengo xato hisobladi! To‘g‘ri javobni topib, unga yordam bering:
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleFix(opt)}
              className="w-18 h-18 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black text-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
