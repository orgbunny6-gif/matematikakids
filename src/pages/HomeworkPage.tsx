/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { decodeHomework } from '../engine/homeworkCode.ts';
import { soundService } from '../services/soundService.ts';
import { FileText, Plus, Printer, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface HomeworkPageProps {
  onNavigate: (route: string) => void;
}

export function HomeworkPage({ onNavigate }: HomeworkPageProps) {
  const { homework, addHomework } = useApp();
  const { t } = useT();

  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState(false);

  const handleImportCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const decoded = decodeHomework(inputCode);
    if (decoded) {
      soundService.playCorrect();
      addHomework(decoded);
      setInputCode('');
      setCodeError(false);
    } else {
      soundService.playWrong();
      setCodeError(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            {t('homeworkTitle')}
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            O‘qituvchi yoki ota-ona tomonidan berilgan vazifalar
          </p>
        </div>

        {/* Print Worksheet action */}
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm shadow-sm hover:bg-slate-50 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Printer className="w-4 h-4 text-indigo-500" />
          <span>{t('printWorksheet')}</span>
        </button>
      </div>

      {/* Code Import Card */}
      <form
        onSubmit={handleImportCode}
        className="no-print p-4 sm:p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={inputCode}
          onChange={(e) => {
            setInputCode(e.target.value);
            setCodeError(false);
          }}
          placeholder={t('enterHomeworkCode')}
          className="flex-1 w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
        >
          {t('importCode')}
        </button>
      </form>

      {codeError && (
        <span className="text-xs font-bold text-rose-500 -mt-3">
          Vazifa kodi noto‘g‘ri yoki eskirgan. Iltimos, qayta tekshirib ko‘ring.
        </span>
      )}

      {/* Homework List */}
      <div className="flex flex-col gap-3">
        {homework.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
            Hozircha faol uyga vazifalar yo‘q. Vazifa kodini kiritishingiz yoki kattalar bo‘limida yangi vazifa yaratishingiz mumkin!
          </div>
        ) : (
          homework.map((hw) => (
            <div
              key={hw.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0">
                  📝
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    {hw.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{hw.config.count} ta savol</span>
                    <span>•</span>
                    <span className="capitalize">{hw.config.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {hw.status === 'completed' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                    <CheckCircle className="w-4 h-4" />
                    <span>{hw.score}% Bajarildi</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      onNavigate(`/homework/${hw.id}`);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Bajarish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Printable Worksheet section (hidden on screen, formatted for printing) */}
      <div className="print-only hidden pt-8">
        <h2 className="text-xl font-bold text-center border-b pb-2 mb-4">
          Tenglama Olami — 2-Sinf Matematika Ishchi Varaqasi
        </h2>
        <div className="flex justify-between text-sm mb-6">
          <span>O‘quvchi: _______________________</span>
          <span>Sana: _______________</span>
          <span>Baho: ________</span>
        </div>
        <div className="grid grid-cols-2 gap-6 text-lg">
          <div>1) x + 3 = 8 &nbsp;&nbsp;&nbsp;&nbsp; x = ____</div>
          <div>2) 4 + x = 9 &nbsp;&nbsp;&nbsp;&nbsp; x = ____</div>
          <div>3) x - 2 = 6 &nbsp;&nbsp;&nbsp;&nbsp; x = ____</div>
          <div>4) 10 - x = 7 &nbsp;&nbsp;&nbsp;&nbsp; x = ____</div>
          <div>5) x + 5 = 12 &nbsp;&nbsp;&nbsp;&nbsp; x = ____</div>
          <div>6) x - 4 = 8 &nbsp;&nbsp;&nbsp;&nbsp; x = ____</div>
        </div>
      </div>
    </div>
  );
}
