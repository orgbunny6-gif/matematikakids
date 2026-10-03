/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameShell } from './common/GameShell.tsx';
import { soundService } from '../services/soundService.ts';
import { fireStarBurst } from '../services/confettiService.ts';

interface MemoryMatchGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

interface CardItem {
  id: string;
  pairId: string;
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const INITIAL_PAIRS = [
  { eq: 'x + 3 = 7', ans: 'x = 4' },
  { eq: '5 + x = 9', ans: 'x = 4' },
  { eq: 'x - 2 = 6', ans: 'x = 8' },
  { eq: '10 - x = 7', ans: 'x = 3' },
];

function buildCards(): CardItem[] {
  const cards: CardItem[] = [];
  INITIAL_PAIRS.forEach((p, idx) => {
    cards.push({
      id: `c_${idx}_eq`,
      pairId: `pair_${idx}`,
      text: p.eq,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `c_${idx}_ans`,
      pairId: `pair_${idx}`,
      text: p.ans,
      isFlipped: false,
      isMatched: false,
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export function MemoryMatchGame({ onFinish, onBack }: MemoryMatchGameProps) {
  const [cards, setCards] = useState<CardItem[]>(() => buildCards());
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleCardClick = (cardId: string) => {
    if (flippedIds.length >= 2) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    soundService.playClick();
    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      const first = cards.find((c) => c.id === newFlipped[0]);
      const second = cards.find((c) => c.id === newFlipped[1]);

      if (first && second && first.pairId === second.pairId) {
        // Matched!
        soundService.playCorrect();
        fireStarBurst();
        const nextScore = score + 25;
        setScore(nextScore);

        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            );
            if (updated.every((c) => c.isMatched)) {
              setIsGameOver(true);
              onFinish(nextScore, 3);
            }
            return updated;
          });
          setFlippedIds([]);
        }, 600);
      } else {
        // Not matched
        soundService.playWrong();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIds([]);
        }, 900);
      }
    }
  };

  const handleRestart = () => {
    setCards(buildCards());
    setFlippedIds([]);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <GameShell
      title="🧠 Xotira Juftliklari"
      score={score}
      stars={3}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-4">
        <div className="text-xs font-bold text-slate-500">
          Tenglamani uning yechimi bilan juftlang!
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
          {cards.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCardClick(c.id)}
              disabled={c.isMatched}
              className={`h-24 sm:h-28 rounded-2xl font-black text-base sm:text-lg border-2 transition-all duration-300 flex items-center justify-center p-2 shadow-sm ${
                c.isMatched
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-700 dark:text-emerald-300 opacity-60'
                  : c.isFlipped
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-600 dark:text-indigo-300 scale-102'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-transparent hover:border-indigo-400'
              }`}
            >
              {c.isFlipped || c.isMatched ? c.text : '❓'}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
