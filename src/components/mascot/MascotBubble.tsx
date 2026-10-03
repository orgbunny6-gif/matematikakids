/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Tengo } from './Tengo.tsx';
import { TengoMood } from '../../types.ts';
import { useT } from '../../i18n/I18nContext.tsx';
import { speechService } from '../../services/speechService.ts';
import { soundService } from '../../services/soundService.ts';
import { Volume2 } from 'lucide-react';

interface MascotBubbleProps {
  mood?: TengoMood;
  message: string;
  accessory?: string;
  className?: string;
}

export function MascotBubble({
  mood = 'idle',
  message,
  accessory,
  className = '',
}: MascotBubbleProps) {
  const { locale, t } = useT();

  const handleSpeak = () => {
    soundService.playClick();
    speechService.speak(message, locale);
  };

  return (
    <aside
      aria-label="Tengo"
      className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm ${className}`}
    >
      <div className="shrink-0">
        <Tengo mood={mood} size="sm" accessory={accessory} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-black tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            Tengo
          </span>
          {speechService.isSupported() && (
            <button
              onClick={handleSpeak}
              type="button"
              className="p-1 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
              title={t('helpAudio')}
              aria-label={t('helpAudio')}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 leading-snug">
          {message}
        </p>
      </div>
    </aside>
  );
}
