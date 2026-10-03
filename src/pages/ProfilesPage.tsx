/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useT } from '../i18n/I18nContext.tsx';
import { soundService } from '../services/soundService.ts';
import { Users, Plus, Check, Trash2 } from 'lucide-react';

const AVATAR_OPTIONS = ['🚀', '🪐', '👾', '🐱', '🐻', '🦁', '🦊', '🤖'];

export function ProfilesPage() {
  const { profiles, activeProfile, switchProfile, createProfile, deleteProfile } = useApp();
  const { t } = useT();

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🚀');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    soundService.playCorrect();
    createProfile(newName.trim(), selectedAvatar);
    setNewName('');
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            <span>{t('profilesManager')}</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Bir qurilmada bir nechta o‘quvchi alohida o‘rganishi mumkin
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createProfile')}</span>
        </button>
      </div>

      {/* New Profile Form Modal / Box */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col gap-4 animate-bounce-gentle"
        >
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
            Yangi o‘quvchi ma’lumotlari:
          </h3>
          <input
            type="text"
            required
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="O‘quvchi ismi"
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100"
          />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {t('chooseAvatar')}
            </span>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    selectedAvatar === av
                      ? 'bg-indigo-600 text-white scale-110 shadow-md'
                      : 'bg-white dark:bg-slate-800 border'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md"
            >
              Saqlash
            </button>
          </div>
        </form>
      )}

      {/* Profiles list */}
      <div className="flex flex-col gap-3">
        {profiles.map((p) => {
          const isActive = p.id === activeProfile.id;

          return (
            <div
              key={p.id}
              className={`p-4 rounded-3xl border-2 flex items-center justify-between gap-4 transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{p.avatarId}</span>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    {p.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Qo‘shilgan: {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isActive ? (
                  <span className="flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                    <span>Faol profil</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      switchProfile(p.id);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    Tanlash
                  </button>
                )}

                {profiles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`${p.name} profilini o‘chirmoqchimisiz?`)) {
                        deleteProfile(p.id);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
