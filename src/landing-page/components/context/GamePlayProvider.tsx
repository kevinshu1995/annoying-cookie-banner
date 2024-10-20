import { createContext, useContext, ReactElement } from 'react';
import useGameLife, { GameLife } from '@/lib/useGameLife';
import useGameRound, { GameRound } from '@/lib/useGameRound';

export type GamePlay = GameLife & GameRound;

export const GamePlayContext = createContext<GamePlay | null>(null);

export const useGamePlay = (): GamePlay =>
  useContext(GamePlayContext) as GamePlay;

export const GamePlayProvider = ({ children }: { children: ReactElement }) => {
  const gameLife = useGameLife({
    maxLife: 3,
  });

  const gameRound = useGameRound({
    maxRound: 3,
  });

  return (
    <GamePlayContext.Provider
      value={{
        ...gameLife,
        ...gameRound,
      }}
    >
      {children}
    </GamePlayContext.Provider>
  );
};

