/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useT } from '../i18n/I18nContext.tsx';
import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

export function PrivacyPage() {
  const { t } = useT();

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-emerald-500" />
          <span>{t('privacy')}</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Bolalar xavfsizligi va shaxsiy ma’lumotlar daxlsizligi kafolati
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-1">
              100% Mahalliy Saqlash (Local-First)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              O‘quvchining ismi, natijalari, ballari va yutuqlari faqat sizning qurilmangizning xotirasida (localStorage) saqlanadi.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 shrink-0">
            <ServerOff className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-1">
              Hech qanday tashqi server yoki kuzatuvchi yo‘q
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Platforma hech qanday tashqi serverga ma’lumot yubormaydi, cookie yoki analitika orqali foydalanuvchini kuzatmaydi.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 shrink-0">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-1">
              Reklama va pulli xaridlar mutlaqo yo‘q
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Ilova 2-sinf o‘quvchilari uchun xavfsiz ta’lim muhitini ta’minlaydi. Hech qanday chalg‘ituvchi banner yoki reklamalar mavjud emas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
