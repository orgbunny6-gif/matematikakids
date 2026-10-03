/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameShell } from './common/GameShell.tsx';
import { soundService } from '../services/soundService.ts';
import { fireStarBurst } from '../services/confettiService.ts';
import { Lock, Unlock } from 'lucide-react';

interface TreasureHuntGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

export function TreasureHuntGame({ onFinish, onBack }: TreasureHuntGameProps) {
  const [unlockedChests, setUnlockedChests] = useState<number[]>([]);
  const [activeChest, setActiveChest] = useState<number | null>(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const chests = [
    { eq: 'x + 3 = 8', ans: 5, reward: '💎 Zangori Yoqut' },
    { eq: '7 + x = 10', ans: 3, reward: '👑 Oltin Toj' },
    { eq: 'x - 4 = 5', ans: 9, reward: '⭐ Sehrli Yulduz' },
    { eq: '12 - x = 8', ans: 4, reward: '🪐 Kosmik Kristall' },
  ];

  const currentChest = activeChest !== null ? chests[activeChest] : null;

  const handleUnlockAttempt = (selectedVal: number) => {
    if (!currentChest || activeChest === null) return;

    if (selectedVal === currentChest.ans) {
      soundService.playCorrect();
      fireStarBurst();
      const nextUnlocked = [...unlockedChests, activeChest];
      const nextScore = score + 25;
      setUnlockedChests(nextUnlocked);
      setScore(nextScore);

      if (nextUnlocked.length >= chests.length) {
        setTimeout(() => {
          setIsGameOver(true);
          onFinish(nextScore, 3);
        }, 900);
      } else {
        // Next locked chest
        const nextIdx = chests.findIndex((_, idx) => !nextUnlocked.includes(idx));
        setActiveChest(nextIdx >= 0 ? nextIdx : null);
      }
    } else {
      soundService.playWrong();
    }
  };

  const options = currentChest
    ? [currentChest.ans, currentChest.ans + 1, Math.max(1, currentChest.ans - 2), currentChest.ans + 3]
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort(() => Math.random() - 0.5)
    : [];

  return (
    <GameShell
      title="🏴‍☠️ Xazina Ovi"
      score={score}
      stars={3}
      isGameOver={isGameOver}
      onRestart={() => {
        setUnlockedChests([]);
        setActiveChest(0);
        setScore(0);
        setIsGameOver(false);
      }}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-6">
        {/* Chests Island Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {chests.map((ch, idx) => {
            const isUnlocked = unlockedChests.includes(idx);
            const isSelected = activeChest === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => !isUnlocked && setActiveChest(idx)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  isUnlocked
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-600'
                    : isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 scale-105 shadow-md'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-80'
                }`}
              >
                <div className="text-3xl mb-1">{isUnlocked ? '🪙' : '📦'}</div>
                <div className="flex items-center gap-1 text-xs font-black">
                  {isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>Sandiq {idx + 1}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Chest Equation Riddle */}
        {currentChest && (
          <div className="w-full flex flex-col items-center gap-4 p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 animate-bounce-gentle">
            <span className="text-xs font-black tracking-wider uppercase text-amber-700 dark:text-amber-400">
              Sandiq qulfini ochish tenglamasi:
            </span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
              {currentChest.eq}
            </span>
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
              x ning to‘g‘ri kalitini tanlang:
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {options.map((optVal, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleUnlockAttempt(optVal)}
                  className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-400 text-amber-800 dark:text-amber-200 font-black text-2xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  {optVal}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
