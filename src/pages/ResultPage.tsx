import { useNavigate } from "react-router-dom";
import { useGameState } from "../hooks/useGameState";
import { ScoreBadge } from "../components/ScoreBadge";

export default function ResultPage() {
  const navigate = useNavigate();

  const {
    gameState,
  } = useGameState();


  return (
    <div className="result-container">
        <h1 className="result-paragraph">Tillykke du fik <ScoreBadge score={5}>{gameState.score}</ScoreBadge> points</h1>
    </div>
  );
}