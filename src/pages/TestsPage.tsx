/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { soundService } from '../services/soundService.ts';
import { FileCheck2, Award, Clock, Star, History, ArrowRight } from 'lucide-react';

interface TestsPageProps {
  onNavigate: (route: string) => void;
}

export function TestsPage({ onNavigate }: TestsPageProps) {
  const { testHistory } = useApp();
  const { t } = useT();

  const testList = [
    {
      id: 'diagnostic',
      title: 'Boshlang‘ich Sinov Testi',
      desc: '10 ta savol orqali boshlang‘ich bilimlarni aniqlash',
      count: 10,
      badge: 'Tavsiya',
      color: 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30',
    },
    {
      id: 'planet1',
      title: '1-Sayyora Imtihoni',
      desc: 'Muvozanat va tenglik tushunchalari bo‘yicha 10 savol',
      count: 10,
      badge: 'Sayyora',
      color: 'border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30',
    },
    {
      id: 'planet2',
      title: '2-Sayyora Imtihoni',
      desc: 'Sirli quti va x harfi bo‘yicha 10 savol',
      count: 10,
      badge: 'Sayyora',
      color: 'border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30',
    },
    {
      id: 'super_exam',
      title: 'Super Imtihon (Barcha Mavzular)',
      desc: '20 ta aralash savol: barcha tenglama turlari bo‘yicha katta sinov',
      count: 20,
      badge: 'Katta Imtihon',
      color: 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30',
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          {t('tests')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Bilimlaringizni sinab ko‘ring va baholang
        </p>
      </div>

      {/* Available Tests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {testList.map((test) => (
          <div
            key={test.id}
            className={`p-5 rounded-3xl border-2 flex flex-col justify-between gap-4 shadow-sm hover:scale-102 transition-all ${test.color}`}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700">
                  {test.badge}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {test.count} ta savol
                </span>
              </div>
              <h3 className="font-black text-base text-slate-800 dark:text-slate-100 mt-1">
                {test.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {test.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onNavigate(`/tests/${test.id}`);
              }}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('start')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Test History List */}
      {testHistory.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            <span>So‘nggi topshirilgan testlar tarixi</span>
          </h3>

          <div className="flex flex-col gap-2">
            {testHistory.slice(0, 5).map((att) => (
              <div
                key={att.id}
                onClick={() => onNavigate(`/tests/result/${att.id}`)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {att.testId}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(att.finishedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= att.stars ? 'fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                    {att.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
