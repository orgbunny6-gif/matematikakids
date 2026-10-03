/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameShell } from './common/GameShell.tsx';
import { soundService } from '../services/soundService.ts';
import { fireStarBurst } from '../services/confettiService.ts';

interface MysteryBoxGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

export function MysteryBoxGame({ onFinish, onBack }: MysteryBoxGameProps) {
  const [openedBoxes, setOpenedBoxes] = useState<number[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | null>(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const boxes = [
    { eq: 'x + 2 = 6', ans: 4 },
    { eq: 'x + 5 = 8', ans: 3 },
    { eq: 'x - 3 = 4', ans: 7 },
    { eq: '7 + x = 11', ans: 4 },
    { eq: '9 - x = 3', ans: 6 },
    { eq: 'x - 1 = 9', ans: 10 },
  ];

  const current = selectedBox !== null ? boxes[selectedBox] : null;

  const handlePickAnswer = (val: number) => {
    if (!current || selectedBox === null) return;
    if (val === current.ans) {
      soundService.playCorrect();
      fireStarBurst();
      const nextOpened = [...openedBoxes, selectedBox];
      const nextScore = score + 20;
      setOpenedBoxes(nextOpened);
      setScore(nextScore);

      if (nextOpened.length >= boxes.length) {
        setTimeout(() => {
          setIsGameOver(true);
          onFinish(nextScore, 3);
        }, 700);
      } else {
        const nextIdx = boxes.findIndex((_, i) => !nextOpened.includes(i));
        setSelectedBox(nextIdx >= 0 ? nextIdx : null);
      }
    } else {
      soundService.playWrong();
    }
  };

  const options = current
    ? [current.ans, current.ans + 2, Math.max(1, current.ans - 1), current.ans + 3]
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort(() => Math.random() - 0.5)
    : [];

  return (
    <GameShell
      title="📦 Sirli Quti Ovchisi"
      score={score}
      stars={3}
      isGameOver={isGameOver}
      onRestart={() => {
        setOpenedBoxes([]);
        setSelectedBox(0);
        setScore(0);
        setIsGameOver(false);
      }}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-6">
        {/* 3x2 Grid of Mystery Boxes */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {boxes.map((b, idx) => {
            const isOpened = openedBoxes.includes(idx);
            const isSelected = selectedBox === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => !isOpened && setSelectedBox(idx)}
                className={`h-22 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all ${
                  isOpened
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-600'
                    : isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 scale-105 shadow-md'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-3xl mb-1">{isOpened ? '🎁' : '📦'}</span>
                <span className="text-xs font-black">
                  {isOpened ? `x = ${b.ans}` : `Quti ${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Current box riddle */}
        {current && (
          <div className="w-full flex flex-col items-center gap-3 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 animate-bounce-gentle">
            <span className="text-xs font-black text-indigo-500 uppercase tracking-wider">
              Qutini ochish uchun x ni toping:
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
              {current.eq}
            </span>
            <div className="flex flex-wrap justify-center gap-3 mt-1">
              {options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePickAnswer(opt)}
                  className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-400 text-indigo-700 dark:text-indigo-300 font-black text-2xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
