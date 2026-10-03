/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store/AppContext.tsx';
import { GameId } from '../types.ts';
import { RocketLaunchGame } from '../games/RocketLaunchGame.tsx';
import { BalanceMasterGame } from '../games/BalanceMasterGame.tsx';
import { BalloonPopGame } from '../games/BalloonPopGame.tsx';
import { EquationPuzzleGame } from '../games/EquationPuzzleGame.tsx';
import { TreasureHuntGame } from '../games/TreasureHuntGame.tsx';
import { MemoryMatchGame } from '../games/MemoryMatchGame.tsx';
import { FixRobotGame } from '../games/FixRobotGame.tsx';
import { EquationRaceGame } from '../games/EquationRaceGame.tsx';
import { MysteryBoxGame } from '../games/MysteryBoxGame.tsx';
import { StarLadderGame } from '../games/StarLadderGame.tsx';
import { TargetPracticeGame } from '../games/TargetPracticeGame.tsx';
import { PassAndPlayGame } from '../games/PassAndPlayGame.tsx';

interface GameDetailPageProps {
  gameId: GameId;
  onNavigate: (route: string) => void;
}

export function GameDetailPage({ gameId, onNavigate }: GameDetailPageProps) {
  const { recordGameResult } = useApp();

  const handleFinish = (score: number, stars: number) => {
    recordGameResult(gameId, score, stars);
  };

  const handleBack = () => {
    onNavigate('/games');
  };

  switch (gameId) {
    case 'rocket':
      return <RocketLaunchGame onFinish={handleFinish} onBack={handleBack} />;
    case 'balance_master':
      return <BalanceMasterGame onFinish={handleFinish} onBack={handleBack} />;
    case 'balloon_pop':
      return <BalloonPopGame onFinish={handleFinish} onBack={handleBack} />;
    case 'puzzle':
      return <EquationPuzzleGame onFinish={handleFinish} onBack={handleBack} />;
    case 'treasure':
      return <TreasureHuntGame onFinish={handleFinish} onBack={handleBack} />;
    case 'memory':
      return <MemoryMatchGame onFinish={handleFinish} onBack={handleBack} />;
    case 'fix_robot':
      return <FixRobotGame onFinish={handleFinish} onBack={handleBack} />;
    case 'race':
      return <EquationRaceGame onFinish={handleFinish} onBack={handleBack} />;
    case 'mystery_box':
      return <MysteryBoxGame onFinish={handleFinish} onBack={handleBack} />;
    case 'star_ladder':
      return <StarLadderGame onFinish={handleFinish} onBack={handleBack} />;
    case 'target':
      return <TargetPracticeGame onFinish={handleFinish} onBack={handleBack} />;
    case 'pass_play':
      return <PassAndPlayGame onFinish={handleFinish} onBack={handleBack} />;
    default:
      return <RocketLaunchGame onFinish={handleFinish} onBack={handleBack} />;
  }
}
