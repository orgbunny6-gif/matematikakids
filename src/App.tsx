/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext.tsx';
import { I18nProvider } from './i18n/I18nContext.tsx';
import { AppShell } from './components/layout/AppShell.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { WelcomePage } from './pages/WelcomePage.tsx';
import { MapPage } from './pages/MapPage.tsx';
import { LessonsPage } from './pages/LessonsPage.tsx';
import { LessonDetailPage } from './pages/LessonDetailPage.tsx';
import { PracticePage } from './pages/PracticePage.tsx';
import { PracticeSessionPage } from './pages/PracticeSessionPage.tsx';
import { GamesPage } from './pages/GamesPage.tsx';
import { GameDetailPage } from './pages/GameDetailPage.tsx';
import { TestsPage } from './pages/TestsPage.tsx';
import { TestSessionPage } from './pages/TestSessionPage.tsx';
import { TestResultPage } from './pages/TestResultPage.tsx';
import { HomeworkPage } from './pages/HomeworkPage.tsx';
import { HomeworkSessionPage } from './pages/HomeworkSessionPage.tsx';
import { ProgressPage } from './pages/ProgressPage.tsx';
import { AchievementsPage } from './pages/AchievementsPage.tsx';
import { MistakesPage } from './pages/MistakesPage.tsx';
import { DailyPage } from './pages/DailyPage.tsx';
import { SandboxPage } from './pages/SandboxPage.tsx';
import { ClassroomPage } from './pages/ClassroomPage.tsx';
import { GrownupsPage } from './pages/GrownupsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { ProfilesPage } from './pages/ProfilesPage.tsx';
import { PrivacyPage } from './pages/PrivacyPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { GameId, LessonId } from './types.ts';

function AppRouter() {
  const { settings, setLocale, profiles } = useApp() as any;
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (hash) return hash;
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Handle URL change
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute(window.location.pathname || '/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (route: string) => {
    if (typeof window !== 'undefined') {
      window.location.hash = route;
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on /welcome
  if (currentRoute === '/welcome') {
    return <WelcomePage onFinish={() => navigate('/')} />;
  }

  // Routing Switcher
  const renderRoute = () => {
    if (currentRoute === '/' || currentRoute === '') {
      return <HomePage onNavigate={navigate} />;
    }
    if (currentRoute === '/map') {
      return <MapPage onNavigate={navigate} />;
    }
    if (currentRoute === '/lessons') {
      return <LessonsPage onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/lessons/')) {
      const lessonId = currentRoute.replace('/lessons/', '') as LessonId;
      return <LessonDetailPage lessonId={lessonId} onNavigate={navigate} />;
    }
    if (currentRoute === '/practice') {
      return <PracticePage onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/practice/')) {
      const pType = currentRoute.replace('/practice/', '');
      return <PracticeSessionPage practiceType={pType} onNavigate={navigate} />;
    }
    if (currentRoute === '/games') {
      return <GamesPage onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/games/')) {
      const gameId = currentRoute.replace('/games/', '') as GameId;
      return <GameDetailPage gameId={gameId} onNavigate={navigate} />;
    }
    if (currentRoute === '/tests') {
      return <TestsPage onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/tests/result/')) {
      const attemptId = currentRoute.replace('/tests/result/', '');
      return <TestResultPage attemptId={attemptId} onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/tests/')) {
      const testId = currentRoute.replace('/tests/', '');
      return <TestSessionPage testId={testId} onNavigate={navigate} />;
    }
    if (currentRoute === '/homework') {
      return <HomeworkPage onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/homework/')) {
      const hwId = currentRoute.replace('/homework/', '');
      return <HomeworkSessionPage homeworkId={hwId} onNavigate={navigate} />;
    }
    if (currentRoute === '/progress') {
      return <ProgressPage onNavigate={navigate} />;
    }
    if (currentRoute === '/achievements') {
      return <AchievementsPage onNavigate={navigate} />;
    }
    if (currentRoute === '/mistakes') {
      return <MistakesPage onNavigate={navigate} />;
    }
    if (currentRoute === '/daily') {
      return <DailyPage onNavigate={navigate} />;
    }
    if (currentRoute === '/sandbox') {
      return <SandboxPage />;
    }
    if (currentRoute === '/classroom') {
      return <ClassroomPage />;
    }
    if (currentRoute === '/grownups') {
      return <GrownupsPage />;
    }
    if (currentRoute === '/settings') {
      return <SettingsPage />;
    }
    if (currentRoute === '/profiles') {
      return <ProfilesPage />;
    }
    if (currentRoute === '/privacy') {
      return <PrivacyPage />;
    }

    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <AppShell activeRoute={currentRoute} onNavigate={navigate}>
      {renderRoute()}
    </AppShell>
  );
}

function InnerApp() {
  const { settings, updateSettings } = useApp();

  return (
    <I18nProvider
      locale={settings.language}
      setLocale={(l) => updateSettings({ language: l })}
    >
      <AppRouter />
    </I18nProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}
