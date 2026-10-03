/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './TopBar.tsx';
import { SideNav } from './SideNav.tsx';
import { BottomTabBar } from './BottomTabBar.tsx';
import { useApp } from '../../store/AppContext.tsx';
import { useT } from '../../i18n/I18nContext.tsx';
import { MascotBubble } from '../mascot/MascotBubble.tsx';

interface AppShellProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
}

export function AppShell({ activeRoute, onNavigate, children }: AppShellProps) {
  const { settings } = useApp();
  const { t } = useT();
  const [showRestReminder, setShowRestReminder] = useState(false);

  // 20-minute rest reminder for kid's eyes
  useEffect(() => {
    if (!settings.restReminders) return;
    const timer = setTimeout(() => {
      setShowRestReminder(true);
    }, 20 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [settings.restReminders]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f1123] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Skip Link for A11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg"
      >
        {t('skipToContent')}
      </a>

      {/* Top Header */}
      <TopBar onNavigate={onNavigate} activeRoute={activeRoute} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <SideNav activeRoute={activeRoute} onNavigate={onNavigate} />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-12 focus:outline-none"
        >
          {children}
        </main>
      </div>

      {/* Bottom Bar for Mobile */}
      <BottomTabBar activeRoute={activeRoute} onNavigate={onNavigate} />

      {/* 20-min Eye Rest Reminder Modal */}
      {showRestReminder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-bounce-gentle">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 text-center">
            <MascotBubble mood="sleepy" message={t('tengoNeedBreak')} />
            <button
              type="button"
              onClick={() => setShowRestReminder(false)}
              className="mt-2 w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-md active:scale-95 transition-all"
            >
              {t('continue')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
