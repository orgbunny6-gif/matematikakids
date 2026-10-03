/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Question } from '../../types.ts';
import { BalanceScale } from '../math/BalanceScale.tsx';
import { soundService } from '../../services/soundService.ts';

interface BalanceExerciseProps {
  question: Question;
  onSubmit: (ans: number) => void;
  disabled?: boolean;
}

export function BalanceExercise({ question, onSubmit, disabled = false }: BalanceExerciseProps) {
  const [selectedVal, setSelectedVal] = useState<number>(0);
  const options = question.options ?? [Number(question.answer), 2, 5, 8];

  const handleSelectOption = (opt: number | string) => {
    if (disabled) return;
    const num = Number(opt);
    setSelectedVal(num);
    soundService.playClick();
    onSubmit(num);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Visual Balance Scale */}
      <BalanceScale
        leftUnknownSymbol={question.unknownSymbol}
        leftUnknownValue={selectedVal}
        leftKnownBlocks={question.operands.a}
        rightBlocks={question.operands.b}
      />

      <div className="text-center font-bold text-sm text-slate-600 dark:text-slate-300">
        Tarozini tenglashtirish uchun sirli quti o‘rniga qaysi sonni qo‘yish kerak?
      </div>

      {/* Option Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => handleSelectOption(opt)}
            className="h-16 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
