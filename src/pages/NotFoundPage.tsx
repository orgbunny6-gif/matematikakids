/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useT } from '../i18n/I18nContext.tsx';
import { Tengo } from '../components/mascot/Tengo.tsx';
import { soundService } from '../services/soundService.ts';
import { Home } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (route: string) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  const { t } = useT();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 gap-6">
      <Tengo mood="thinking" size="xl" />

      <div className="flex flex-col gap-2 max-w-md">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('notFoundTitle')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {t('notFoundDesc')}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          soundService.playClick();
          onNavigate('/');
        }}
        className="py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
      >
        <Home className="w-5 h-5" />
        <span>{t('goHome')}</span>
      </button>
    </div>
  );
}
