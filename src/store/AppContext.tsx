/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  Achievement,
  AppDataEnvelope,
  Homework,
  Inventory,
  LessonId,
  MistakeRecord,
  Profile,
  Progress,
  QuestionResult,
  Settings,
  TestAttempt,
  TopicId,
} from '../types.ts';
import { defaultStorage } from '../storage/localStorageAdapter.ts';
import { updateTopicMastery } from '../engine/adaptive.ts';
import { calculateLevel, getXpForQuestion } from '../engine/xpRules.ts';
import { ACHIEVEMENTS } from '../data/achievementsList.ts';
import { soundService } from '../services/soundService.ts';
import { speechService } from '../services/speechService.ts';
import { fireCelebrationConfetti } from '../services/confettiService.ts';

const DEFAULT_SETTINGS: Settings = {
  language: 'uz-Latn',
  theme: 'light',
  soundEnabled: true,
  speechEnabled: true,
  reduceMotion: false,
  fontSize: 'normal',
  dyslexiaFont: false,
  timerEnabled: false,
  parentPinHash: '0000',
  restReminders: true,
  lowPowerMode: false,
};

const DEFAULT_PROFILE: Profile = {
  id: 'default_student',
  name: 'Yosh Matematik',
  avatarId: '🚀',
  createdAt: Date.now(),
  lastActive: Date.now(),
};

function createInitialProgress(): Progress {
  return {
    xp: 0,
    level: 1,
    stars: 0,
    streak: {
      current: 1,
      longest: 1,
      lastActiveDate: new Date().toISOString().split('T')[0]!,
      freezesAvailable: 1,
    },
    lessons: {
      l1_equality: { status: 'unlocked', stars: 0, bestScore: 0, attempts: 0 },
    },
    topics: {},
    games: {},
    daily: {},
    totalQuestionsSolved: 0,
    totalCorrect: 0,
  };
}

function createInitialInventory(): Inventory {
  return {
    unlockedStickers: ['st_mars', 'st_star'],
    unlockedAccessories: [],
    activeAccessory: '',
    unlockedThemes: ['light', 'dark'],
  };
}

interface AppContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  profiles: Profile[];
  activeProfile: Profile;
  switchProfile: (id: string) => void;
  createProfile: (name: string, avatarId: string) => Profile;
  deleteProfile: (id: string) => void;
  progress: Progress;
  homework: Homework[];
  achievements: Achievement[];
  mistakes: MistakeRecord[];
  inventory: Inventory;
  testHistory: TestAttempt[];
  recordQuestionResult: (res: QuestionResult) => void;
  completeLesson: (lessonId: LessonId, stars: number, score: number) => void;
  recordGameResult: (gameId: string, score: number, stars: number) => void;
  completeDailyChallenge: (score: number, stars: number) => void;
  resolveMistake: (id: string) => void;
  addHomework: (hw: Homework) => void;
  completeHomework: (id: string, score: number, stars: number) => void;
  recordTestAttempt: (attempt: TestAttempt) => void;
  equipAccessory: (accId: string) => void;
  buyShopItem: (accId: string, costStars: number) => boolean;
  verifyParentPin: (pin: string) => boolean;
  setParentPin: (pin: string) => void;
  resetAllData: () => Promise<void>;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [profiles, setProfiles] = useState<Profile[]>([DEFAULT_PROFILE]);
  const [activeProfileId, setActiveProfileId] = useState<string>(DEFAULT_PROFILE.id);
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({
    [DEFAULT_PROFILE.id]: createInitialProgress(),
  });
  const [homeworkMap, setHomeworkMap] = useState<Record<string, Homework[]>>({});
  const [achievementsMap, setAchievementsMap] = useState<Record<string, Achievement[]>>({});
  const [mistakesMap, setMistakesMap] = useState<Record<string, MistakeRecord[]>>({});
  const [inventoryMap, setInventoryMap] = useState<Record<string, Inventory>>({
    [DEFAULT_PROFILE.id]: createInitialInventory(),
  });
  const [testHistoryMap, setTestHistoryMap] = useState<Record<string, TestAttempt[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from storage once on mount
  useEffect(() => {
    async function load() {
      const stored = await defaultStorage.getItem<AppDataEnvelope | null>('root', null);
      if (stored && stored.profiles && stored.profiles.length > 0) {
        setSettings({ ...DEFAULT_SETTINGS, ...stored.settings });
        setProfiles(stored.profiles);
        setActiveProfileId(stored.activeProfileId || stored.profiles[0]!.id);
        setProgressMap(stored.progressByProfile || {});
        setHomeworkMap(stored.homeworkByProfile || {});
        setAchievementsMap(stored.achievementsByProfile || {});
        setMistakesMap(stored.mistakesByProfile || {});
        setInventoryMap(stored.inventoryByProfile || {});
        setTestHistoryMap(stored.testHistoryByProfile || {});
      }
      setIsLoaded(true);
    }
    load();
  }, []);

  // Sync settings with hardware services and DOM attributes
  useEffect(() => {
    soundService.enabled = settings.soundEnabled;
    speechService.enabled = settings.speechEnabled;

    // Theme class
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Dyslexia class & font size
    document.body.classList.toggle('font-dyslexic', settings.dyslexiaFont);
    document.body.classList.toggle('font-size-large', settings.fontSize === 'large');
    document.body.classList.toggle('font-size-huge', settings.fontSize === 'huge');

    // Sync HTML lang
    const langCode = settings.language === 'ru' ? 'ru' : 'uz';
    document.documentElement.setAttribute('lang', langCode);
  }, [settings]);

  // Persist state changes debounced
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isLoaded) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const envelope: AppDataEnvelope = {
        version: 1,
        activeProfileId,
        profiles,
        settings,
        progressByProfile: progressMap,
        homeworkByProfile: homeworkMap,
        achievementsByProfile: achievementsMap,
        mistakesByProfile: mistakesMap,
        inventoryByProfile: inventoryMap,
        testHistoryByProfile: testHistoryMap,
      };
      defaultStorage.setItem('root', envelope);
    }, 400);
  }, [
    isLoaded,
    settings,
    profiles,
    activeProfileId,
    progressMap,
    homeworkMap,
    achievementsMap,
    mistakesMap,
    inventoryMap,
    testHistoryMap,
  ]);

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILE;
  const progress = progressMap[activeProfile.id] || createInitialProgress();
  const homework = homeworkMap[activeProfile.id] || [];
  const achievements = achievementsMap[activeProfile.id] || [];
  const mistakes = mistakesMap[activeProfile.id] || [];
  const inventory = inventoryMap[activeProfile.id] || createInitialInventory();
  const testHistory = testHistoryMap[activeProfile.id] || [];

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const switchProfile = useCallback((id: string) => {
    setActiveProfileId(id);
  }, []);

  const createProfile = useCallback(
    (name: string, avatarId: string) => {
      const newP: Profile = {
        id: `p_${Date.now()}`,
        name: name.trim() || 'Yosh Matematik',
        avatarId,
        createdAt: Date.now(),
        lastActive: Date.now(),
      };
      setProfiles((prev) => [...prev, newP]);
      setActiveProfileId(newP.id);
      setProgressMap((prev) => ({ ...prev, [newP.id]: createInitialProgress() }));
      setInventoryMap((prev) => ({ ...prev, [newP.id]: createInitialInventory() }));
      return newP;
    },
    []
  );

  const deleteProfile = useCallback(
    (id: string) => {
      if (profiles.length <= 1) return;
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      if (activeProfileId === id) {
        const nextP = profiles.find((p) => p.id !== id);
        if (nextP) setActiveProfileId(nextP.id);
      }
    },
    [profiles, activeProfileId]
  );

  const checkStreakUpdate = useCallback((prevStreak: Progress['streak']) => {
    const today = new Date().toISOString().split('T')[0]!;
    if (prevStreak.lastActiveDate === today) {
      return prevStreak;
    }
    const lastDate = new Date(prevStreak.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / 86400000);

    if (diffDays === 1) {
      const nextCurr = prevStreak.current + 1;
      return {
        current: nextCurr,
        longest: Math.max(nextCurr, prevStreak.longest),
        lastActiveDate: today,
        freezesAvailable: prevStreak.freezesAvailable,
      };
    } else if (diffDays === 2 && prevStreak.freezesAvailable > 0) {
      // Use streak freeze
      return {
        current: prevStreak.current + 1,
        longest: Math.max(prevStreak.current + 1, prevStreak.longest),
        lastActiveDate: today,
        freezesAvailable: prevStreak.freezesAvailable - 1,
      };
    } else {
      // Reset streak
      return {
        current: 1,
        longest: prevStreak.longest,
        lastActiveDate: today,
        freezesAvailable: 1,
      };
    }
  }, []);

  const addXpAndStars = useCallback(
    (xpDelta: number, starsDelta: number) => {
      setProgressMap((prev) => {
        const curr = prev[activeProfile.id] || createInitialProgress();
        const newXp = curr.xp + xpDelta;
        const newStars = curr.stars + starsDelta;
        const { level } = calculateLevel(newXp);
        const updatedStreak = checkStreakUpdate(curr.streak);

        if (level > curr.level) {
          soundService.playFanfare();
          fireCelebrationConfetti();
        }

        return {
          ...prev,
          [activeProfile.id]: {
            ...curr,
            xp: newXp,
            level,
            stars: newStars,
            streak: updatedStreak,
          },
        };
      });
    },
    [activeProfile.id, checkStreakUpdate]
  );

  const recordQuestionResult = useCallback(
    (res: QuestionResult) => {
      const pid = activeProfile.id;
      if (res.isCorrect) {
        const xpEarned = getXpForQuestion(res.attempts <= 1, res.hintsUsed);
        addXpAndStars(xpEarned, 0);
      } else {
        // Record in mistakes notebook
        setMistakesMap((prev) => {
          const list = prev[pid] || [];
          const existing = list.find((m) => m.question.id === res.questionId);
          if (existing) {
            return {
              ...prev,
              [pid]: list.map((m) =>
                m.id === existing.id
                  ? { ...m, attemptsCount: m.attemptsCount + 1, resolved: false }
                  : m
              ),
            };
          }
          const newMistake: MistakeRecord = {
            id: `mistake_${Date.now()}`,
            question: {
              id: res.questionId,
              template: 'ADD_X_FIRST',
              format: 'mcq',
              difficulty: 'medium',
              topicId: res.topicId,
              operands: { a: 3, b: 7 },
              unknownPosition: 'first',
              unknownSymbol: 'x',
              equationString: res.equationString,
              answer: res.correctAnswer,
              hintSteps: [
                'Tarozining ikki tomoni teng bo‘lishi kerak.',
                'Teskari amalni qo‘llang.',
                `Javob: ${res.correctAnswer}`,
              ],
              explanation: `${res.equationString} tenglamasida x = ${res.correctAnswer}`,
              signature: `sig_${res.equationString}`,
            },
            incorrectAnswer: res.givenAnswer,
            timestamp: Date.now(),
            resolved: false,
            attemptsCount: 1,
          };
          return { ...prev, [pid]: [newMistake, ...list] };
        });
      }

      // Update topic mastery
      setProgressMap((prev) => {
        const curr = prev[pid] || createInitialProgress();
        const updatedTopic = updateTopicMastery(curr.topics[res.topicId], res.isCorrect, res.timeMs);
        return {
          ...prev,
          [pid]: {
            ...curr,
            totalQuestionsSolved: curr.totalQuestionsSolved + 1,
            totalCorrect: curr.totalCorrect + (res.isCorrect ? 1 : 0),
            topics: {
              ...curr.topics,
              [res.topicId]: updatedTopic,
            },
          },
        };
      });
    },
    [activeProfile.id, addXpAndStars]
  );

  const completeLesson = useCallback(
    (lessonId: LessonId, stars: number, score: number) => {
      const pid = activeProfile.id;
      setProgressMap((prev) => {
        const curr = prev[pid] || createInitialProgress();
        const existing = curr.lessons[lessonId];
        const newStars = Math.max(existing?.stars ?? 0, stars);
        const bestScore = Math.max(existing?.bestScore ?? 0, score);
        const attempts = (existing?.attempts ?? 0) + 1;

        // Auto unlock next lesson in sequence
        const lessonOrder: LessonId[] = [
          'l1_equality',
          'l2_scale',
          'l3_secret_box',
          'l4_letter_x',
          'l5_add_x_first',
          'l6_add_x_second',
          'l7_sub_x_first',
          'l8_sub_x_second',
          'l9_check',
          'l10_word_to_eq',
          'l11_eq_to_story',
          'l12_super_mixed',
          'l13_chain_bonus',
        ];
        const currIdx = lessonOrder.indexOf(lessonId);
        const nextId = currIdx >= 0 && currIdx < lessonOrder.length - 1 ? lessonOrder[currIdx + 1] : null;

        const updatedLessons = {
          ...curr.lessons,
          [lessonId]: {
            status: 'completed' as const,
            stars: newStars,
            bestScore,
            attempts,
            completedAt: Date.now(),
          },
        };

        if (nextId && (!updatedLessons[nextId] || updatedLessons[nextId]?.status === 'locked')) {
          updatedLessons[nextId] = {
            status: 'unlocked',
            stars: updatedLessons[nextId]?.stars ?? 0,
            bestScore: updatedLessons[nextId]?.bestScore ?? 0,
            attempts: updatedLessons[nextId]?.attempts ?? 0,
          };
        }

        const starsGained = Math.max(0, stars - (existing?.stars ?? 0));
        const newTotalStars = curr.stars + starsGained;
        const newXp = curr.xp + 50;

        return {
          ...prev,
          [pid]: {
            ...curr,
            lessons: updatedLessons,
            stars: newTotalStars,
            xp: newXp,
          },
        };
      });
      soundService.playFanfare();
      fireCelebrationConfetti();
    },
    [activeProfile.id]
  );

  const recordGameResult = useCallback(
    (gameId: string, score: number, stars: number) => {
      const pid = activeProfile.id;
      setProgressMap((prev) => {
        const curr = prev[pid] || createInitialProgress();
        const existing = curr.games[gameId];
        const newHigh = Math.max(existing?.highScore ?? 0, score);
        const newStars = Math.max(existing?.stars ?? 0, stars);
        const timesPlayed = (existing?.timesPlayed ?? 0) + 1;

        return {
          ...prev,
          [pid]: {
            ...curr,
            games: {
              ...curr.games,
              [gameId]: {
                timesPlayed,
                highScore: newHigh,
                stars: newStars,
                lastPlayedAt: Date.now(),
              },
            },
          },
        };
      });
      addXpAndStars(score * 2, stars);
    },
    [activeProfile.id, addXpAndStars]
  );

  const completeDailyChallenge = useCallback(
    (score: number, stars: number) => {
      const today = new Date().toISOString().split('T')[0]!;
      const pid = activeProfile.id;
      const xpBonus = 35;
      setProgressMap((prev) => {
        const curr = prev[pid] || createInitialProgress();
        return {
          ...prev,
          [pid]: {
            ...curr,
            daily: {
              ...curr.daily,
              [today]: {
                completed: true,
                dateKey: today,
                score,
                stars,
                xpEarned: xpBonus,
              },
            },
          },
        };
      });
      addXpAndStars(xpBonus, stars);
      soundService.playFanfare();
      fireCelebrationConfetti();
    },
    [activeProfile.id, addXpAndStars]
  );

  const resolveMistake = useCallback(
    (id: string) => {
      const pid = activeProfile.id;
      setMistakesMap((prev) => ({
        ...prev,
        [pid]: (prev[pid] || []).map((m) => (m.id === id ? { ...m, resolved: true } : m)),
      }));
      addXpAndStars(10, 0);
    },
    [activeProfile.id, addXpAndStars]
  );

  const addHomework = useCallback(
    (hw: Homework) => {
      const pid = activeProfile.id;
      setHomeworkMap((prev) => ({
        ...prev,
        [pid]: [hw, ...(prev[pid] || [])],
      }));
    },
    [activeProfile.id]
  );

  const completeHomework = useCallback(
    (id: string, score: number, stars: number) => {
      const pid = activeProfile.id;
      setHomeworkMap((prev) => ({
        ...prev,
        [pid]: (prev[pid] || []).map((h) =>
          h.id === id
            ? { ...h, status: 'completed' as const, score, stars, completedAt: Date.now() }
            : h
        ),
      }));
      addXpAndStars(40, stars);
      soundService.playFanfare();
      fireCelebrationConfetti();
    },
    [activeProfile.id, addXpAndStars]
  );

  const recordTestAttempt = useCallback(
    (attempt: TestAttempt) => {
      const pid = activeProfile.id;
      setTestHistoryMap((prev) => ({
        ...prev,
        [pid]: [attempt, ...(prev[pid] || [])].slice(0, 50),
      }));
      addXpAndStars(attempt.xpEarned, attempt.stars);
    },
    [activeProfile.id, addXpAndStars]
  );

  const equipAccessory = useCallback(
    (accId: string) => {
      const pid = activeProfile.id;
      setInventoryMap((prev) => {
        const curr = prev[pid] || createInitialInventory();
        return {
          ...prev,
          [pid]: {
            ...curr,
            activeAccessory: curr.activeAccessory === accId ? '' : accId,
          },
        };
      });
    },
    [activeProfile.id]
  );

  const buyShopItem = useCallback(
    (accId: string, costStars: number): boolean => {
      const pid = activeProfile.id;
      const currProg = progressMap[pid] || createInitialProgress();
      if (currProg.stars < costStars) return false;

      setProgressMap((prev) => ({
        ...prev,
        [pid]: { ...currProg, stars: currProg.stars - costStars },
      }));

      setInventoryMap((prev) => {
        const currInv = prev[pid] || createInitialInventory();
        if (currInv.unlockedAccessories.includes(accId)) return prev;
        return {
          ...prev,
          [pid]: {
            ...currInv,
            unlockedAccessories: [...currInv.unlockedAccessories, accId],
          },
        };
      });
      soundService.playStar();
      return true;
    },
    [activeProfile.id, progressMap]
  );

  const verifyParentPin = useCallback(
    (enteredPin: string): boolean => {
      return enteredPin.trim() === settings.parentPinHash.trim();
    },
    [settings.parentPinHash]
  );

  const setParentPin = useCallback((pin: string) => {
    setSettings((prev) => ({ ...prev, parentPinHash: pin.trim() }));
  }, []);

  const resetAllData = useCallback(async () => {
    await defaultStorage.clear();
    setSettings(DEFAULT_SETTINGS);
    setProfiles([DEFAULT_PROFILE]);
    setActiveProfileId(DEFAULT_PROFILE.id);
    setProgressMap({ [DEFAULT_PROFILE.id]: createInitialProgress() });
    setHomeworkMap({});
    setAchievementsMap({});
    setMistakesMap({});
    setInventoryMap({ [DEFAULT_PROFILE.id]: createInitialInventory() });
    setTestHistoryMap({});
  }, []);

  const exportDataJson = useCallback(() => {
    const envelope: AppDataEnvelope = {
      version: 1,
      activeProfileId,
      profiles,
      settings,
      progressByProfile: progressMap,
      homeworkByProfile: homeworkMap,
      achievementsByProfile: achievementsMap,
      mistakesByProfile: mistakesMap,
      inventoryByProfile: inventoryMap,
      testHistoryByProfile: testHistoryMap,
    };
    return JSON.stringify(envelope, null, 2);
  }, [
    activeProfileId,
    profiles,
    settings,
    progressMap,
    homeworkMap,
    achievementsMap,
    mistakesMap,
    inventoryMap,
    testHistoryMap,
  ]);

  const importDataJson = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as AppDataEnvelope;
      if (!data.profiles || data.profiles.length === 0) return false;
      setSettings(data.settings || DEFAULT_SETTINGS);
      setProfiles(data.profiles);
      setActiveProfileId(data.activeProfileId || data.profiles[0]!.id);
      setProgressMap(data.progressByProfile || {});
      setHomeworkMap(data.homeworkByProfile || {});
      setAchievementsMap(data.achievementsByProfile || {});
      setMistakesMap(data.mistakesByProfile || {});
      setInventoryMap(data.inventoryByProfile || {});
      setTestHistoryMap(data.testHistoryByProfile || {});
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        profiles,
        activeProfile,
        switchProfile,
        createProfile,
        deleteProfile,
        progress,
        homework,
        achievements,
        mistakes,
        inventory,
        testHistory,
        recordQuestionResult,
        completeLesson,
        recordGameResult,
        completeDailyChallenge,
        resolveMistake,
        addHomework,
        completeHomework,
        recordTestAttempt,
        equipAccessory,
        buyShopItem,
        verifyParentPin,
        setParentPin,
        resetAllData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
