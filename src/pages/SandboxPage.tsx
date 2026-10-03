/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useT } from '../i18n/I18nContext.tsx';
import { BalanceScale } from '../components/math/BalanceScale.tsx';
import { MascotBubble } from '../components/mascot/MascotBubble.tsx';
import { soundService } from '../services/soundService.ts';
import { FlaskConical, RotateCcw, Sparkles } from 'lucide-react';

export function SandboxPage() {
  const { t } = useT();
  const [unknownVal, setUnknownVal] = useState(4);
  const [knownLeft, setKnownLeft] = useState(3);
  const [rightBlocks, setRightBlocks] = useState(7);

  const isBalanced = unknownVal + knownLeft === rightBlocks;

  const handleReset = () => {
    soundService.playClick();
    setUnknownVal(4);
    setKnownLeft(3);
    setRightBlocks(7);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('sandbox')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Tenglama laboratoriyasida erkin tajriba o‘tkazing va tarozi qonuniyatlarini kashf qiling!
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col items-center gap-6">
        <BalanceScale
          leftUnknownSymbol="x"
          leftUnknownValue={unknownVal}
          leftKnownBlocks={knownLeft}
          rightBlocks={rightBlocks}
          interactive
          onUnknownChange={(v) => {
            soundService.playClick();
            setUnknownVal(v);
          }}
        />

        {/* Live Equation Display */}
        <div className="py-3 px-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center font-extrabold text-2xl sm:text-3xl text-slate-800 dark:text-slate-100">
          <span className="text-indigo-600 dark:text-indigo-400">x</span> + {knownLeft} = {rightBlocks}
          <span className="text-xs ml-3 font-bold text-slate-400">
            ({unknownVal} + {knownLeft} {isBalanced ? '=' : '≠'} {rightBlocks})
          </span>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <span className="text-xs font-black text-slate-500">
              Chap palladagi ma’lum toshlar (+{knownLeft})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setKnownLeft((v) => Math.max(0, v - 1))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border font-black text-lg active:scale-95"
              >
                -
              </button>
              <span className="flex-1 text-center font-black text-xl">{knownLeft}</span>
              <button
                type="button"
                onClick={() => setKnownLeft((v) => Math.min(15, v + 1))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border font-black text-lg active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <span className="text-xs font-black text-slate-500">
              O‘ng palladagi toshlar ({rightBlocks})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRightBlocks((v) => Math.max(0, v - 1))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border font-black text-lg active:scale-95"
              >
                -
              </button>
              <span className="flex-1 text-center font-black text-xl">{rightBlocks}</span>
              <button
                type="button"
                onClick={() => setRightBlocks((v) => Math.min(20, v + 1))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border font-black text-lg active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Boshlang‘ich holatga qaytarish</span>
        </button>

        <MascotBubble
          mood={isBalanced ? 'happy' : 'thinking'}
          message={
            isBalanced
              ? `Ajoyib! x = ${unknownVal} bo‘lganda tarozi to‘liq muvozanatda!`
              : `Hozircha teng emas. Tarozini tenglashtirish uchun x ni ${Math.max(0, rightBlocks - knownLeft)} qilish kerak.`
          }
        />
      </div>
    </div>
  );
}
