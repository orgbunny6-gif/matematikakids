/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { encodeHomework } from '../engine/homeworkCode.ts';
import { TopicId } from '../types.ts';
import { soundService } from '../services/soundService.ts';
import {
  ShieldCheck,
  Lock,
  Download,
  Upload,
  Trash2,
  Share2,
  Users,
  Copy,
  Check,
  FileSpreadsheet,
} from 'lucide-react';

export function GrownupsPage() {
  const {
    profiles,
    activeProfile,
    switchProfile,
    progress,
    settings,
    verifyParentPin,
    setParentPin,
    resetAllData,
    exportDataJson,
    importDataJson,
    addHomework,
  } = useApp();
  const { t } = useT();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPinReset, setShowPinReset] = useState(false);
  const [adultMathAns, setAdultMathAns] = useState('');

  // Homework creation state
  const [hwTitle, setHwTitle] = useState('Uyga vazifa 1');
  const [hwCount, setHwCount] = useState(5);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  // New PIN state
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyParentPin(pinInput)) {
      soundService.playCorrect();
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      soundService.playWrong();
      setPinError(true);
    }
  };

  const handleMathResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Adult question: 17 + 26 = 43
    if (adultMathAns.trim() === '43') {
      soundService.playCorrect();
      setParentPin('0000');
      setIsAuthenticated(true);
      setShowPinReset(false);
      setPinError(false);
    } else {
      soundService.playWrong();
    }
  };

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    const seed = Date.now();
    const code = encodeHomework({
      title: hwTitle,
      config: {
        count: hwCount,
        difficulty: 'medium',
        hasTimer: false,
        topics: ['add_x_first', 'sub_x_first', 'concept_scale'],
      },
      seed,
    });
    setGeneratedCode(code);
    addHomework({
      id: `hw_${Date.now()}`,
      title: hwTitle,
      config: {
        count: hwCount,
        difficulty: 'medium',
        hasTimer: false,
        topics: ['add_x_first', 'sub_x_first', 'concept_scale'],
      },
      seed,
      status: 'new',
    });
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenglama_olami_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importDataJson(content)) {
        soundService.playCorrect();
        alert('Ma’lumotlar muvaffaqiyatli tiklandi!');
      } else {
        soundService.playWrong();
        alert('Fayl formati noto‘g‘ri!');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCsv = () => {
    let csv = 'Oquvchi,Daraja,XP,Yulduzlar,Jami Yechilgan,Togri Javoblar\n';
    profiles.forEach((p) => {
      csv += `"${p.name}",${progress.level},${progress.xp},${progress.stars},${progress.totalQuestionsSolved},${progress.totalCorrect}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenglama_olami_hisobot_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 max-w-md mx-auto">
        <div className="w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center text-3xl">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>

          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
            {t('grownupsPinTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('grownupsPinPrompt')}
          </p>

          {!showPinReset ? (
            <form onSubmit={handleVerifyPin} className="w-full flex flex-col gap-3">
              <input
                type="password"
                maxLength={4}
                required
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center text-3xl font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {pinError && (
                <span className="text-xs font-bold text-rose-500">
                  {t('grownupsPinIncorrect')}
                </span>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all"
              >
                Kirish
              </button>

              <button
                type="button"
                onClick={() => setShowPinReset(true)}
                className="text-xs font-bold text-indigo-500 hover:underline mt-2"
              >
                {t('grownupsResetPin')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMathResetPin} className="w-full flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Kattalar savoli: 17 + 26 = ?
              </span>
              <input
                type="number"
                required
                autoFocus
                value={adultMathAns}
                onChange={(e) => setAdultMathAns(e.target.value)}
                placeholder="Javob"
                className="w-full py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm shadow-md"
              >
                Tasdiqlash
              </button>
              <button
                type="button"
                onClick={() => setShowPinReset(false)}
                className="text-xs text-slate-400 hover:underline"
              >
                Bekor qilish
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-indigo-600" />
          <span>{t('grownupsPinTitle')}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('parentNotice')}
        </p>
      </div>

      {/* Profiles switcher for classroom/multi-child */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          <span>O‘quvchilar ro‘yxati (faol profilni tanlash)</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => switchProfile(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeProfile.id === p.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{p.avatarId}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pedagogical Advice for Parents */}
      <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col gap-3">
        <h3 className="font-extrabold text-base text-indigo-950 dark:text-indigo-200">
          💡 {t('pedagogicalAdviceTitle')}
        </h3>
        <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex flex-col gap-2 list-disc list-inside leading-relaxed">
          <li>
            <strong>Muvozanat tushunchasi:</strong> Uyda mevalar yoki qalamlar bilan tarozi o‘ynang. "Stolda 5 ta olma bor edi, yana bir nechta qo‘yildi va 8 ta bo‘ldi" kabi amaliy mashqlar bolaning tasavvurini tez o‘stiradi.
          </li>
          <li>
            <strong>Teskari amal siri:</strong> Agar bola qo‘shish tenglamasida xato qilib qo‘shib yuborsa (masalan, x + 3 = 7 ga 10 desa), qizil qalam bilan jazolamang. "Yashiringan son dastlabki 7 dan kichik bo‘lishi kerakmi yoki katta?" deb yo‘naltiring.
          </li>
          <li>
            <strong>Har doim tekshirish:</strong> Bola javob topgach, uni x o‘rniga qo‘yib ifodani qayta o‘qish odatini shakllantiring (4 + 3 = 7 ✓).
          </li>
        </ul>
      </div>

      {/* Homework Creator & Code Generator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
        <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
          Yangi Uyga Vazifa Yaratish va Kod Olish
        </h3>
        <form onSubmit={handleCreateHomework} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={hwTitle}
            onChange={(e) => setHwTitle(e.target.value)}
            placeholder="Vazifa nomi"
            className="px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs font-bold"
          />
          <select
            value={hwCount}
            onChange={(e) => setHwCount(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs font-bold"
          >
            <option value={5}>5 ta savol</option>
            <option value={10}>10 ta savol</option>
            <option value={15}>15 ta savol</option>
          </select>
          <button
            type="submit"
            className="sm:col-span-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            Vazifani Yaratish va Kod Olish
          </button>
        </form>

        {generatedCode && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-mono truncate text-slate-700 dark:text-slate-300">
              {generatedCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Nusxalandi' : 'Nusxalash'}</span>
            </button>
          </div>
        )}
      </div>

      {/* CSV Export & Data Backups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Natijalarni CSV yuklab olish (Excel)</span>
          </h4>
          <button
            type="button"
            onClick={handleExportCsv}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            CSV faylni saqlash
          </button>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Zaxira nusxa (JSON eksport / import)</span>
          </h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-xs text-slate-700 dark:text-slate-300"
            >
              Eksport
            </button>
            <label className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-xs text-slate-700 dark:text-slate-300 text-center cursor-pointer">
              Import
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Change PIN & Danger Zone */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
          PIN Kodni o‘zgartirish
        </h4>
        <div className="flex gap-3">
          <input
            type="password"
            maxLength={4}
            value={newPin}
            onChange={(e) => {
              setNewPin(e.target.value);
              setPinSuccess(false);
            }}
            placeholder="Yangi 4 xonali PIN"
            className="w-48 px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs font-bold"
          />
          <button
            type="button"
            onClick={() => {
              if (newPin.trim().length === 4) {
                setParentPin(newPin.trim());
                setPinSuccess(true);
                setNewPin('');
              }
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
          >
            Saqlash
          </button>
          {pinSuccess && <span className="text-xs text-emerald-500 font-bold self-center">Yangi PIN saqlandi! ✓</span>}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-rose-500 font-bold">
            Barcha ma’lumotlarni o‘chirish (tozalash)
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t('resetConfirm'))) {
                resetAllData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition-colors"
          >
            {t('resetAllData')}
          </button>
        </div>
      </div>
    </div>
  );
}
