import { useContext } from "react";

import {
  GameContext,
} from "../context/GameContext";


export function useGameState() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGameState must be used inside GameProvider"
    );
  }

  return context;
}