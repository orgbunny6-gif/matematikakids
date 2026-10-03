/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface EquationViewProps {
  equation: string;
  unknownSymbol?: string;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

export function EquationView({
  equation,
  unknownSymbol = 'x',
  size = 'lg',
  className = '',
}: EquationViewProps) {
  const sizeClasses = {
    md: 'text-2xl sm:text-3xl tracking-wide',
    lg: 'text-3xl sm:text-5xl tracking-wider',
    xl: 'text-4xl sm:text-6xl tracking-widest',
  }[size];

  // Tokenize and highlight unknown 'x', '□', '?', or '📦'
  const tokens = equation.split(' ');

  return (
    <div
      className={`inline-flex items-center justify-center font-extrabold ${sizeClasses} select-none ${className}`}
      aria-label={`Tenglama: ${equation}`}
    >
      {tokens.map((token, i) => {
        const isUnknown =
          token === unknownSymbol ||
          token === 'x' ||
          token === '□' ||
          token === '?' ||
          token === '📦';

        if (isUnknown) {
          return (
            <span
              key={i}
              className="inline-flex items-center justify-center mx-1 sm:mx-2 px-3 py-1 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-400 dark:border-indigo-500 shadow-sm animate-pulseGlow"
            >
              {token === 'box' || token === '□' ? '📦' : token}
            </span>
          );
        }

        return (
          <span key={i} className="mx-1 text-slate-800 dark:text-slate-100">
            {token}
          </span>
        );
      })}
    </div>
  );
}
