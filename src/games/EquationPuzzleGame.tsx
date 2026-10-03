/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameShell } from './common/GameShell.tsx';
import { soundService } from '../services/soundService.ts';
import { fireStarBurst } from '../services/confettiService.ts';
import { Check, RotateCcw } from 'lucide-react';

interface EquationPuzzleGameProps {
  onFinish: (score: number, stars: number) => void;
  onBack: () => void;
}

export function EquationPuzzleGame({ onFinish, onBack }: EquationPuzzleGameProps) {
  const [level, setLevel] = useState(1);
  const totalLevels = 5;
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Puzzle pieces for level 1: x + 3 = 8
  const puzzleRounds = [
    { target: ['x', '+', '3', '=', '8'], answer: 5 },
    { target: ['x', '+', '5', '=', '9'], answer: 4 },
    { target: ['x', '-', '2', '=', '6'], answer: 8 },
    { target: ['4', '+', 'x', '=', '10'], answer: 6 },
    { target: ['9', '-', 'x', '=', '5'], answer: 4 },
  ];

  const currentRound = puzzleRounds[(level - 1) % puzzleRounds.length]!;

  const [availablePieces, setAvailablePieces] = useState<string[]>(() =>
    [...currentRound.target].sort(() => Math.random() - 0.5)
  );
  const [placedPieces, setPlacedPieces] = useState<string[]>([]);
  const [solutionValue, setSolutionValue] = useState<number | null>(null);

  const handlePlacePiece = (piece: string, index: number) => {
    soundService.playClick();
    setPlacedPieces((prev) => [...prev, piece]);
    setAvailablePieces((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetPieces = () => {
    soundService.playClick();
    setPlacedPieces([]);
    setAvailablePieces([...currentRound.target].sort(() => Math.random() - 0.5));
    setSolutionValue(null);
  };

  const handleCheck = (val: number) => {
    if (val === currentRound.answer) {
      soundService.playCorrect();
      fireStarBurst();
      const nextScore = score + 30;
      setScore(nextScore);

      setTimeout(() => {
        if (level >= totalLevels) {
          setIsGameOver(true);
          onFinish(nextScore, 3);
        } else {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          const nextRound = puzzleRounds[(nextLevel - 1) % puzzleRounds.length]!;
          setPlacedPieces([]);
          setAvailablePieces([...nextRound.target].sort(() => Math.random() - 0.5));
          setSolutionValue(null);
        }
      }, 800);
    } else {
      soundService.playWrong();
    }
  };

  const isEquationFormed = placedPieces.length === currentRound.target.length;

  return (
    <GameShell
      title="🧩 Tenglama Jumbog‘i"
      score={score}
      stars={3}
      isGameOver={isGameOver}
      onRestart={() => {
        setLevel(1);
        setScore(0);
        setIsGameOver(false);
        setPlacedPieces([]);
        setAvailablePieces([...puzzleRounds[0]!.target].sort(() => Math.random() - 0.5));
        setSolutionValue(null);
      }}
      onBack={onBack}
    >
      <div className="w-full flex flex-col items-center gap-6">
        <div className="text-xs font-bold text-slate-500">
          Jumboq {level} / {totalLevels}
        </div>

        {/* Puzzle assembly board */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-dashed border-indigo-300 dark:border-indigo-700 min-h-[80px] w-full max-w-md">
          {placedPieces.length === 0 ? (
            <span className="text-sm font-bold text-indigo-400">
              Qismlarni bu yerga terib tenglama tuzing
            </span>
          ) : (
            placedPieces.map((p, idx) => (
              <div
                key={idx}
                className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-white dark:bg-slate-800 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md animate-bounce-gentle"
              >
                {p}
              </div>
            ))
          )}
        </div>

        {/* Pieces tray */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          {availablePieces.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePlacePiece(p, idx)}
              className="w-14 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 font-black text-2xl text-slate-800 dark:text-slate-100 shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              {p}
            </button>
          ))}
          {placedPieces.length > 0 && (
            <button
              type="button"
              onClick={handleResetPieces}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 transition-colors"
              title="Qayta terish"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* When equation is formed, ask for x! */}
        {isEquationFormed && (
          <div className="flex flex-col items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 w-full animate-bounce-gentle">
            <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
              Ajoyib! Endi x ning qiymatini toping:
            </span>
            <div className="flex gap-3">
              {[currentRound.answer, currentRound.answer + 1, Math.max(1, currentRound.answer - 2), currentRound.answer + 3]
                .filter((v, i, a) => a.indexOf(v) === i)
                .sort(() => Math.random() - 0.5)
                .map((ansVal, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCheck(ansVal)}
                    className="w-14 h-14 rounded-2xl bg-emerald-500 text-white font-black text-xl shadow-md hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center"
                  >
                    {ansVal}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
