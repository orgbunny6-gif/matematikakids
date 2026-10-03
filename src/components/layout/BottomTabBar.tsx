/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useT } from '../../i18n/I18nContext.tsx';
import { Compass, MapPin, BookOpen, Gamepad2, TrendingUp } from 'lucide-react';
import { soundService } from '../../services/soundService.ts';

interface BottomTabBarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export function BottomTabBar({ activeRoute, onNavigate }: BottomTabBarProps) {
  const { t } = useT();

  const tabs = [
    { route: '/', label: t('home'), icon: Compass },
    { route: '/map', label: t('map'), icon: MapPin },
    { route: '/lessons', label: t('lessons'), icon: BookOpen },
    { route: '/games', label: t('games'), icon: Gamepad2 },
    { route: '/progress', label: t('progress'), icon: TrendingUp },
  ];

  return (
    <nav
      aria-label="Pastki mobil menyu"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeRoute === tab.route ||
            (tab.route !== '/' && activeRoute.startsWith(tab.route));

          return (
            <button
              key={tab.route}
              type="button"
              onClick={() => {
                soundService.playClick();
                onNavigate(tab.route);
              }}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
