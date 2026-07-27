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
      showResult: false,
    });

    navigate("/quiz", {
      replace: true,
    });
  }


  return (
    <main className="start-page">
      <section className="start-content">
        <h1>
          Wedding Guessr
        </h1>

        <ul className="rules">
          <li>Find stedet på kortet</li>
          <li>Gæt året billedet er fra</li>
          <li>Få point for afstand og årstal</li>
          <li>Opnå en højere score end de andre ved bordet</li>
        </ul>
      </section>


      <button
        className="start-button"
        onClick={startGame}
      >
        Start spil
      </button>

    </main>
  );
}