import { useNavigate } from "react-router-dom";
import { useGameState } from "../hooks/useGameState";

export default function StartPage() {
  const navigate = useNavigate();

  const {
    setGameState,
  } = useGameState();


  function startGame() {
    setGameState({
      currentRound: 1,
      score: 0,
      started: true,
      showResult: false
    });

    navigate("/quiz", {
      replace: true,
    });
  }


  return (
    <button onClick={startGame}>
      Start Game
    </button>
  );
}