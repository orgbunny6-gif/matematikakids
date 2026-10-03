/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationDictionary {
  // Navigation & General UI
  appName: string;
  appSubtitle: string;
  home: string;
  map: string;
  lessons: string;
  practice: string;
  games: string;
  tests: string;
  homework: string;
  progress: string;
  achievements: string;
  mistakes: string;
  daily: string;
  sandbox: string;
  classroom: string;
  grownups: string;
  settings: string;
  profiles: string;
  privacy: string;
  back: string;
  continue: string;
  next: string;
  finish: string;
  check: string;
  retry: string;
  start: string;
  cancel: string;
  save: string;
  close: string;
  delete: string;
  edit: string;
  restart: string;
  loading: string;
  congratulations: string;
  wellDone: string;
  awesome: string;
  tryAgain: string;
  goodEffort: string;
  skipToContent: string;
  helpAudio: string;

  // Mascot (Tengo)
  tengoGreeting: string;
  tengoHelp: string;
  tengoThinking: string;
  tengoExcited: string;
  tengoComfort: string;
  tengoSleepy: string;
  tengoNeedBreak: string;

  // Level & XP & Streak
  level: string;
  levelTitle1: string;
  levelTitle2: string;
  levelTitle3: string;
  levelTitle4: string;
  levelTitle5: string;
  levelTitle6: string;
  levelTitle7: string;
  levelTitle8: string;
  xp: string;
  streak: string;
  streakDays: string;
  stars: string;
  starCount: string;
  dailyGoal: string;

  // Planets
  planet1Title: string;
  planet1Desc: string;
  planet2Title: string;
  planet2Desc: string;
  planet3Title: string;
  planet3Desc: string;
  planet4Title: string;
  planet4Desc: string;
  planet5Title: string;
  planet5Desc: string;
  planet6Title: string;
  planet6Desc: string;

  // Math Concepts & Operations
  equation: string;
  balance: string;
  mysteryBox: string;
  unknownNumber: string;
  addition: string;
  subtraction: string;
  checkHabit: string;
  inverseOperation: string;
  leftSide: string;
  rightSide: string;
  isEqual: string;
  isNotEqual: string;
  findX: string;
  solveStepByStep: string;
  whyThisWorks: string;

  // Exercises
  selectAnswer: string;
  enterAnswer: string;
  dragNumberHere: string;
  trueOrFalse: string;
  isTrue: string;
  isFalse: string;
  hint: string;
  hintCount: string;
  giveHint: string;
  explanation: string;
  correctAnswerWas: string;
  nextQuestion: string;
  questionNumber: string;

  // Feedback phrases
  correct1: string;
  correct2: string;
  correct3: string;
  correct4: string;
  wrongSoft1: string;
  wrongSoft2: string;
  wrongSoft3: string;
  wrongAdditionConfused: string;
  wrongSubtractionConfused: string;

  // Games
  gameRocketTitle: string;
  gameRocketDesc: string;
  gameBalanceTitle: string;
  gameBalanceDesc: string;
  gameBalloonTitle: string;
  gameBalloonDesc: string;
  gamePuzzleTitle: string;
  gamePuzzleDesc: string;
  gameTreasureTitle: string;
  gameTreasureDesc: string;
  gameMemoryTitle: string;
  gameMemoryDesc: string;
  gameFixRobotTitle: string;
  gameFixRobotDesc: string;
  gameRaceTitle: string;
  gameRaceDesc: string;
  gameMysteryBoxTitle: string;
  gameMysteryBoxDesc: string;
  gameStarLadderTitle: string;
  gameStarLadderDesc: string;
  gameTargetTitle: string;
  gameTargetDesc: string;
  gamePassPlayTitle: string;
  gamePassPlayDesc: string;
  playAgain: string;
  score: string;
  bestScore: string;
  combo: string;

  // Tests & Evaluation
  miniTest: string;
  planetTest: string;
  superExam: string;
  customTest: string;
  diagnosticTest: string;
  testScore: string;
  accuracy: string;
  gradeExcellent: string;
  gradeVeryGood: string;
  gradeGood: string;
  gradePracticeMore: string;
  reviewAnswers: string;
  workOnMistakes: string;

  // Homework
  homeworkTitle: string;
  homeworkNew: string;
  homeworkInProgress: string;
  homeworkCompleted: string;
  shareCode: string;
  importCode: string;
  enterHomeworkCode: string;
  codeCopied: string;
  printWorksheet: string;
  answersKey: string;
  teacherStudentName: string;
  date: string;

  // Analytics & Grownups
  grownupsPinPrompt: string;
  grownupsPinIncorrect: string;
  grownupsResetPin: string;
  grownupsPinTitle: string;
  parentNotice: string;
  overallAccuracy: string;
  timeSpent: string;
  activeDays: string;
  weakTopics: string;
  strongTopics: string;
  practiceWeakNow: string;
  pedagogicalAdviceTitle: string;
  exportData: string;
  importData: string;
  resetAllData: string;
  resetConfirm: string;
  classroomModeTitle: string;
  teamA: string;
  teamB: string;
  showAnswer: string;

  // Settings & Accessibility
  language: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  sound: string;
  speech: string;
  reduceMotion: string;
  fontSize: string;
  fontSizeNormal: string;
  fontSizeLarge: string;
  fontSizeHuge: string;
  dyslexiaFont: string;
  timer: string;
  restReminder: string;
  profilesManager: string;
  createProfile: string;
  profileName: string;
  chooseAvatar: string;

  // Onboarding
  welcomeTitle: string;
  welcomeSubtitle: string;
  whatsYourName: string;
  chooseYourHero: string;
  letsBeginAdventure: string;
  skipIntro: string;

  // Not Found
  notFoundTitle: string;
  notFoundDesc: string;
  goHome: string;
}

export type TranslationKey = keyof TranslationDictionary;
