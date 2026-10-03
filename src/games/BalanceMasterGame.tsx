/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameShell } from './common/GameShell.tsx';
import { BalanceScale } from '../components/math/BalanceScale.tsx';
import { soundService } from '../services/soundService.ts';
import { fireStarBurst } from '../services/confettiService.ts';

interface BalanceMasterGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

export function BalanceMasterGame({ onFinish, onBack }: BalanceMasterGameProps) {
  const [round, setRound] = useState(1);
  const totalRounds = 5;
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Round parameters
  const [knownLeft, setKnownLeft] = useState(3);
  const [knownRight, setKnownRight] = useState(8);
  const [currentVal, setCurrentVal] = useState(0);

  const targetAnswer = knownRight - knownLeft;

  const handlePickWeight = (val: number) => {
    setCurrentVal(val);
    if (val === targetAnswer) {
      soundService.playCorrect();
      fireStarBurst();
      const nextScore = score + 20 * (combo + 1);
      setScore(nextScore);
      setCombo((prev) => prev + 1);

      setTimeout(() => {
        if (round >= totalRounds) {
          setIsGameOver(true);
          onFinish(nextScore, 3);
        } else {
          setRound((r) => r + 1);
          const nextL = Math.floor(Math.random() * 5) + 2;
          const nextAns = Math.floor(Math.random() * 6) + 2;
          setKnownLeft(nextL);
          setKnownRight(nextL + nextAns);
          setCurrentVal(0);
        }
      }, 900);
    } else {
      soundService.playWrong();
      setCombo(0);
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setCombo(0);
    setIsGameOver(false);
    setKnownLeft(3);
    setKnownRight(8);
    setCurrentVal(0);
  };

  const candidates = [targetAnswer, targetAnswer + 2, Math.max(1, targetAnswer - 1), targetAnswer + 3]
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort(() => Math.random() - 0.5);

  return (
    <GameShell
      title="⚖️ Muvozanat Ustasi"
      score={score}
      combo={combo}
      stars={3}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-4">
        <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
          Bosqich {round} / {totalRounds}
        </div>

        <BalanceScale
          leftUnknownSymbol="📦"
          leftUnknownValue={currentVal}
          leftKnownBlocks={knownLeft}
          rightBlocks={knownRight}
        />

        <div className="text-sm font-bold text-slate-600 dark:text-slate-300 text-center">
          Tarozini muvozanatga keltirish uchun qutiga to‘g‘ri toshni qo‘ying:
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {candidates.map((w, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePickWeight(w)}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black text-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition-all shadow-sm flex items-center justify-center"
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
