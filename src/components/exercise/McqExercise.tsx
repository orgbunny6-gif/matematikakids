/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Question } from '../../types.ts';
import { EquationView } from '../math/EquationView.tsx';
import { soundService } from '../../services/soundService.ts';

interface McqExerciseProps {
  question: Question;
  onSubmit: (ans: number | string) => void;
  disabled?: boolean;
}

export function McqExercise({ question, onSubmit, disabled = false }: McqExerciseProps) {
  const options = question.options ?? [Number(question.answer), 5, 8, 10];

  // Keyboard numbers 1, 2, 3, 4 shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= options.length) {
        const selected = options[keyNum - 1];
        if (selected !== undefined) {
          soundService.playClick();
          onSubmit(selected);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, options, onSubmit]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Equation display */}
      <div className="py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 w-full flex justify-center">
        <EquationView
          equation={question.equationString}
          unknownSymbol={question.unknownSymbol}
          size="lg"
        />
      </div>

      {/* 2x2 Option Buttons */}
      <div className="grid grid-cols-2 gap-3.5 w-full">
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => {
              soundService.playClick();
              onSubmit(opt);
            }}
            className="relative h-18 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 shadow-sm active:scale-95 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span className="absolute top-2 left-3 text-xs font-bold text-slate-400 dark:text-slate-500">
              {idx + 1}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
