/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useT } from '../../i18n/I18nContext.tsx';
import {
  Compass,
  MapPin,
  BookOpen,
  Dumbbell,
  Gamepad2,
  FileCheck2,
  FileText,
  TrendingUp,
  Award,
  AlertCircle,
  Calendar,
  FlaskConical,
  ScreenShare,
  ShieldCheck,
  Settings as SettingsIcon,
} from 'lucide-react';
import { soundService } from '../../services/soundService.ts';

interface SideNavProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export function SideNav({ activeRoute, onNavigate }: SideNavProps) {
  const { t } = useT();

  const navItems = [
    { route: '/', label: t('home'), icon: Compass },
    { route: '/map', label: t('map'), icon: MapPin },
    { route: '/lessons', label: t('lessons'), icon: BookOpen },
    { route: '/practice', label: t('practice'), icon: Dumbbell },
    { route: '/games', label: t('games'), icon: Gamepad2 },
    { route: '/tests', label: t('tests'), icon: FileCheck2 },
    { route: '/homework', label: t('homework'), icon: FileText },
    { route: '/progress', label: t('progress'), icon: TrendingUp },
    { route: '/achievements', label: t('achievements'), icon: Award },
    { route: '/mistakes', label: t('mistakes'), icon: AlertCircle },
    { route: '/daily', label: t('daily'), icon: Calendar },
    { route: '/sandbox', label: t('sandbox'), icon: FlaskConical },
    { route: '/classroom', label: t('classroom'), icon: ScreenShare },
    { route: '/grownups', label: t('grownups'), icon: ShieldCheck },
    { route: '/settings', label: t('settings'), icon: SettingsIcon },
  ];

  return (
    <aside
      aria-label="Asosiy menyu"
      className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 p-4 min-h-[calc(100dvh-4rem)]"
    >
      <nav className="flex flex-col gap-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeRoute === item.route ||
            (item.route !== '/' && activeRoute.startsWith(item.route));

          return (
            <button
              key={item.route}
              type="button"
              onClick={() => {
                soundService.playClick();
                onNavigate(item.route);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.5]' : ''}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
