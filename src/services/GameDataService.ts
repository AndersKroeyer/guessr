
import roskilde from "../assets/roskilde.jpg";
import whitehouse from "../assets/whitehouse.jpg";
import { GameData } from "../types/GameData";

export const QuizDataList: GameData[] = [
  {
    id: 1,
    image: roskilde,
    coords: {
        lat: 55.61796393636961,
        lng: 12.083538568270937,
    },
    year: 2020
  },
  {
    id: 2,
    image: whitehouse,
    coords: {
        lat: 56.61796393636961,
        lng: 13.083538568270937,
    },
    year: 2025
  }
];