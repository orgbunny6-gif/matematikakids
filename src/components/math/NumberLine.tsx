/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NumberLineProps {
  max?: number;
  start?: number;
  end?: number;
  direction?: 'forward' | 'backward';
  className?: string;
}

export function NumberLine({
  max = 12,
  start = 7,
  end = 4,
  direction = 'backward',
  className = '',
}: NumberLineProps) {
  const points = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div className={`w-full overflow-x-auto py-4 select-none ${className}`}>
      <div className="relative min-w-[320px] max-w-lg mx-auto h-24 flex flex-col justify-end">
        {/* Jump Arc */}
        {start !== undefined && end !== undefined && (
          <svg className="absolute inset-0 w-full h-16 pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path
              d={`M ${(start / max) * 100} 35 Q ${((start + end) / (2 * max)) * 100} 5 ${(end / max) * 100} 35`}
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            {/* Arrow at end */}
            <circle cx={(end / max) * 100} cy="35" r="3" fill="#6366F1" />
          </svg>
        )}

        {/* Main Axis Line */}
        <div className="relative h-2 bg-slate-300 dark:bg-slate-700 rounded-full w-full">
          {points.map((pt) => {
            const isHighlight = pt === start || pt === end;
            const pct = (pt / max) * 100;
            return (
              <div
                key={pt}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${pct}%` }}
              >
                {/* Tick dot */}
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-transform ${
                    isHighlight
                      ? 'bg-indigo-600 border-white dark:border-slate-900 scale-125 shadow-md'
                      : 'bg-white dark:bg-slate-800 border-slate-400'
                  }`}
                />
                {/* Number label */}
                <span
                  className={`mt-2 text-xs font-black ${
                    isHighlight
                      ? 'text-indigo-600 dark:text-indigo-400 font-extrabold text-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {pt}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
        {direction === 'backward' ? 'Orqaga sakrash (ayirish)' : 'Oldinga sakrash (qo‘shish)'}
      </div>
    </div>
  );
}
