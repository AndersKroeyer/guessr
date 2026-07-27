import { Coordinates } from "./GameData";

export interface GameState {
  currentRound: number;
  score: number;
  started: boolean;
  
  currentGuess?: Coordinates;
  currentAnswer?: Coordinates;

  showResult: boolean;
}