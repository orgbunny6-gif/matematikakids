/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Locale = 'uz-Latn' | 'uz-Cyrl' | 'ru';
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'normal' | 'large' | 'huge';

export type TengoMood =
  | 'idle'
  | 'happy'
  | 'thinking'
  | 'cheering'
  | 'encouraging'
  | 'sleepy'
  | 'celebrating';

export type EquationTemplate =
  | 'ADD_X_FIRST'     // x + a = b
  | 'ADD_X_SECOND'    // a + x = b
  | 'SUB_X_FIRST'     // x - a = b
  | 'SUB_X_SECOND'    // a - x = b
  | 'REVERSED_SIDES'  // b = x + a, etc.
  | 'BOX_VARIANT'     // □ + a = b or a + ? = b
  | 'CHAIN'           // x + a + c = b (0-20)
  | 'WORD_PROBLEM'    // story problems
  | 'BALANCE'         // scale representation
  | 'CHECK_SOLUTION'  // True/False: is x = 4 solution to x + 3 = 7?
  | 'FIND_ERROR';     // Fix Tengo's calculation error

export type ExerciseFormat =
  | 'mcq'
  | 'fill'
  | 'dnd'
  | 'tf'
  | 'find_equation'
  | 'balance'
  | 'find_error'
  | 'build_equation'
  | 'order'
  | 'match';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'adaptive';

export type TopicId =
  | 'concept_equality'
  | 'concept_scale'
  | 'concept_unknown'
  | 'concept_x'
  | 'add_x_first'
  | 'add_x_second'
  | 'sub_x_first'
  | 'sub_x_second'
  | 'check_solution'
  | 'word_problems'
  | 'equation_to_story'
  | 'mixed_super'
  | 'chain_equations';

export type LessonId =
  | 'l1_equality'
  | 'l2_scale'
  | 'l3_secret_box'
  | 'l4_letter_x'
  | 'l5_add_x_first'
  | 'l6_add_x_second'
  | 'l7_sub_x_first'
  | 'l8_sub_x_second'
  | 'l9_check'
  | 'l10_word_to_eq'
  | 'l11_eq_to_story'
  | 'l12_super_mixed'
  | 'l13_chain_bonus';

export type GameId =
  | 'rocket'
  | 'balance_master'
  | 'balloon_pop'
  | 'puzzle'
  | 'treasure'
  | 'memory'
  | 'fix_robot'
  | 'race'
  | 'mystery_box'
  | 'star_ladder'
  | 'target'
  | 'pass_play';

export interface Question {
  id: string;
  template: EquationTemplate;
  format: ExerciseFormat;
  difficulty: Difficulty;
  topicId: TopicId;
  lessonId?: LessonId;
  operands: {
    a: number;
    b: number;
    c?: number;
  };
  unknownPosition: 'first' | 'second' | 'result' | 'both';
  unknownSymbol: 'x' | 'box' | 'question';
  equationString: string; // e.g., "x + 4 = 9"
  answer: number | boolean | string;
  options?: (number | string)[]; // for MCQ or matching
  hintSteps: string[]; // 3 graded hints
  explanation: string;
  wordProblemText?: {
    uzLatn: string;
    uzCyrl: string;
    ru: string;
  };
  signature: string; // unique hash to avoid repeating identical problems in session
}

export interface Profile {
  id: string;
  name: string;
  avatarId: string;
  createdAt: number;
  lastActive: number;
}

export interface Settings {
  language: Locale;
  theme: ThemeMode;
  soundEnabled: boolean;
  speechEnabled: boolean;
  reduceMotion: boolean;
  fontSize: FontSize;
  dyslexiaFont: boolean;
  timerEnabled: boolean;
  parentPinHash: string; // 4-digit PIN hash (default "0000")
  restReminders: boolean;
  lowPowerMode: boolean;
}

export interface TopicMastery {
  mastery: number; // 0..100
  attempts: number;
  correct: number;
  avgTimeMs: number;
  recent: boolean[]; // last 10 outcomes
  lastSeenAt: number;
  nextReviewAt: number;
}

export interface LessonProgress {
  status: 'locked' | 'unlocked' | 'completed';
  stars: number; // 0..3
  bestScore: number;
  attempts: number;
  completedAt?: number;
}

export interface GameStats {
  timesPlayed: number;
  highScore: number;
  stars: number; // 0..3
  lastPlayedAt: number;
}

export interface DailyResult {
  completed: boolean;
  dateKey: string; // YYYY-MM-DD
  score: number;
  stars: number;
  xpEarned: number;
}

export interface Progress {
  xp: number;
  level: number;
  stars: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string; // YYYY-MM-DD
    freezesAvailable: number;
  };
  lessons: Record<string, LessonProgress>;
  topics: Record<string, TopicMastery>;
  games: Record<string, GameStats>;
  daily: Record<string, DailyResult>;
  totalQuestionsSolved: number;
  totalCorrect: number;
}

export interface QuestionResult {
  questionId: string;
  equationString: string;
  topicId: TopicId;
  givenAnswer: number | boolean | string;
  correctAnswer: number | boolean | string;
  isCorrect: boolean;
  hintsUsed: number;
  attempts: number;
  timeMs: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  titleKey: string;
  startedAt: number;
  finishedAt: number;
  questions: QuestionResult[];
  score: number; // 0..100
  stars: number; // 0..3
  xpEarned: number;
}

export interface HomeworkConfig {
  topics: TopicId[];
  count: number;
  difficulty: Difficulty;
  hasTimer: boolean;
}

export interface Homework {
  id: string;
  title: string;
  config: HomeworkConfig;
  seed: number;
  dueDate?: string;
  status: 'new' | 'in_progress' | 'completed';
  score?: number;
  stars?: number;
  completedAt?: number;
}

export interface Achievement {
  id: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

export interface Inventory {
  unlockedStickers: string[];
  unlockedAccessories: string[];
  activeAccessory: string;
  unlockedThemes: string[];
}

export interface MistakeRecord {
  id: string;
  question: Question;
  incorrectAnswer: number | boolean | string;
  timestamp: number;
  resolved: boolean;
  attemptsCount: number;
}

export interface AppDataEnvelope {
  version: number;
  activeProfileId: string;
  profiles: Profile[];
  settings: Settings;
  progressByProfile: Record<string, Progress>;
  homeworkByProfile: Record<string, Homework[]>;
  achievementsByProfile: Record<string, Achievement[]>;
  mistakesByProfile: Record<string, MistakeRecord[]>;
  inventoryByProfile: Record<string, Inventory>;
  testHistoryByProfile: Record<string, TestAttempt[]>;
}
