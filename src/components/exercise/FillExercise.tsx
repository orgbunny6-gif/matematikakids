/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Question } from '../../types.ts';
import { EquationView } from '../math/EquationView.tsx';
import { NumberPad } from '../math/NumberPad.tsx';

interface FillExerciseProps {
  question: Question;
  onSubmit: (ans: number) => void;
  disabled?: boolean;
}

export function FillExercise({ question, onSubmit, disabled = false }: FillExerciseProps) {
  const [val, setVal] = useState('');

  const handleDigit = (d: string) => {
    if (val.length < 3) {
      setVal((prev) => prev + d);
    }
  };

  const handleBackspace = () => {
    setVal((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setVal('');
  };

  const handleSubmit = () => {
    if (!val || disabled) return;
    onSubmit(Number(val));
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 w-full flex justify-center">
        <EquationView
          equation={question.equationString}
          unknownSymbol={question.unknownSymbol}
          size="lg"
        />
      </div>

      {/* Answer display box */}
      <div className="flex items-center gap-3">
        <span className="text-xl sm:text-2xl font-black text-slate-600 dark:text-slate-300">
          {question.unknownSymbol} =
        </span>
        <div className="w-24 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-500 flex items-center justify-center font-black text-3xl sm:text-4xl text-indigo-600 dark:text-indigo-400 shadow-inner">
          {val || '?'}
        </div>
      </div>

      {/* Physical & Touch NumberPad */}
      <NumberPad
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onClear={handleClear}
        onSubmit={handleSubmit}
        disabled={disabled || !val}
      />
    </div>
  );
}
