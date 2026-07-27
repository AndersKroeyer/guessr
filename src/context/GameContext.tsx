import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { GameState } from "../types/GameState";

const STORAGE_KEY = "whoasked";

const initialState: GameState = {
  currentRound: 1,
  score: 0,
  started: false,
  showResult: false
};

interface GameContextValue {
  gameState: GameState;
  setGameState: (
    updater: React.SetStateAction<GameState>
  ) => void;
  resetGame: () => void;
}

export const GameContext =
  createContext<GameContextValue | null>(null);


interface GameProviderProps {
  children: ReactNode;
}


export function GameProvider({
  children,
}: GameProviderProps) {
  const [gameState, setGameStateInternal] =
    useState<GameState>(() => {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return initialState;
      }

      try {
        return JSON.parse(saved);
      } catch {
        return initialState;
      }
    });


  function setGameState(
    updater: React.SetStateAction<GameState>
  ) {
    setGameStateInternal(current => {
      const next =
        typeof updater === "function"
          ? updater(current)
          : updater;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next)
      );

      return next;
    });
  }


  function resetGame() {
    localStorage.removeItem(STORAGE_KEY);

    setGameStateInternal(initialState);
  }


  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}