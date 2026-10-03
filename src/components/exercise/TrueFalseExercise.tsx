/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Question } from '../../types.ts';
import { EquationView } from '../math/EquationView.tsx';
import { useT } from '../../i18n/I18nContext.tsx';
import { Check, X } from 'lucide-react';
import { soundService } from '../../services/soundService.ts';

interface TrueFalseExerciseProps {
  question: Question;
  onSubmit: (ans: boolean) => void;
  disabled?: boolean;
}

export function TrueFalseExercise({ question, onSubmit, disabled = false }: TrueFalseExerciseProps) {
  const { t } = useT();

  const handlePick = (val: boolean) => {
    if (disabled) return;
    soundService.playClick();
    onSubmit(val);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 w-full flex justify-center">
        <EquationView
          equation={question.equationString}
          size="lg"
        />
      </div>

      <div className="text-center text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
        {t('trueOrFalse')}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <button
          type="button"
          disabled={disabled}
          onClick={() => handlePick(true)}
          className="h-20 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <Check className="w-7 h-7 stroke-[3]" />
          <span>{t('isTrue')}</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => handlePick(false)}
          className="h-20 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xl shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <X className="w-7 h-7 stroke-[3]" />
          <span>{t('isFalse')}</span>
        </button>
      </div>
    </div>
  );
}
