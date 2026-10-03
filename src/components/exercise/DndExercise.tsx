/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Question } from '../../types.ts';
import { soundService } from '../../services/soundService.ts';

interface DndExerciseProps {
  question: Question;
  onSubmit: (ans: number) => void;
  disabled?: boolean;
}

export function DndExercise({ question, onSubmit, disabled = false }: DndExerciseProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const options = question.options ?? [Number(question.answer), 3, 6, 9];

  const handleTilePick = (val: number | string) => {
    if (disabled) return;
    const num = Number(val);
    setSelectedSlot(num);
    soundService.playClick();
    onSubmit(num);
  };

  const tokens = question.equationString.split(' ');

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Target Equation with droppable/tap slot */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 w-full min-h-[90px]">
        {tokens.map((token, i) => {
          const isSlot = token === question.unknownSymbol || token === 'x' || token === '□' || token === '?';
          if (isSlot) {
            return (
              <div
                key={i}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 border-dashed border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 flex items-center justify-center font-black text-3xl sm:text-4xl text-indigo-600 dark:text-indigo-400 shadow-inner"
              >
                {selectedSlot !== null ? selectedSlot : '?'}
              </div>
            );
          }
          return (
            <span key={i} className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-slate-100">
              {token}
            </span>
          );
        })}
      </div>

      <div className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
        To‘g‘ri raqam kartochkasini tanlang:
      </div>

      {/* Tiles to pick from */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => handleTilePick(opt)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black text-2xl sm:text-3xl border-2 border-slate-300 dark:border-slate-600 shadow-md hover:border-indigo-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
