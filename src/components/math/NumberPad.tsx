/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Delete, Check } from 'lucide-react';
import { soundService } from '../../services/soundService.ts';

interface NumberPadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function NumberPad({
  onDigit,
  onBackspace,
  onClear,
  onSubmit,
  disabled = false,
}: NumberPadProps) {
  const handleDigit = (d: string) => {
    if (disabled) return;
    soundService.playClick();
    onDigit(d);
  };

  const handleBackspace = () => {
    if (disabled) return;
    soundService.playClick();
    onBackspace();
  };

  const handleClear = () => {
    if (disabled) return;
    soundService.playClick();
    onClear();
  };

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit();
  };

  return (
    <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto w-full select-none">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          type="button"
          disabled={disabled}
          onClick={() => handleDigit(String(num))}
          className="h-14 sm:h-16 text-2xl sm:text-3xl font-extrabold rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {num}
        </button>
      ))}

      <button
        type="button"
        disabled={disabled}
        onClick={handleClear}
        className="h-14 sm:h-16 text-sm font-black rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 hover:bg-slate-200 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 uppercase tracking-wider"
      >
        C
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => handleDigit('0')}
        className="h-14 sm:h-16 text-2xl sm:text-3xl font-extrabold rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        0
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={handleBackspace}
        className="h-14 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 hover:bg-slate-200 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label="O'chirish"
      >
        <Delete className="w-6 h-6" />
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={handleSubmit}
        className="col-span-3 h-14 sm:h-16 text-lg font-black rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md active:scale-95 hover:brightness-105 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <Check className="w-6 h-6 stroke-[3]" />
        Tekshirish
      </button>
    </div>
  );
}
