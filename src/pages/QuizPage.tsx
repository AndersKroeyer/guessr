import { useState } from "react";
import GuessMap from "../components/GuessMap";
import { useGameState } from "../hooks/useGameState";
import { QuizDataList } from "../services/GameDataService";
import ImageHint from "../components/ImageHint";
import { Coordinates } from "../types/GameData";
import { ScoreBadge } from "../components/ScoreBadge";
import { useNavigate } from "react-router-dom";

export default function QuizPage() {
  const { gameState, setGameState } = useGameState();
  const navigate = useNavigate();

  const [mapResetKey, setMapResetKey] = useState(0);
  const currentRound = gameState.currentRound;
  const quizData = QuizDataList[currentRound - 1];
  const numberOfRounds = QuizDataList.length;

  const [yearGuessState, setYear] = useState("");
  const [yearError, setYearError] = useState(false);
  const [hintExpanded, setHintExpanded] = useState<boolean>(true);

  const [currentGuess, setCurrentGuess] = useState<Coordinates | null>(null);
  const [yearScoreState, setYearScore] = useState<number>(0);
  const [distanceScoreState, setDistanceScore] = useState<number>(0);
  const [distanceToTargetState, setDistanceToTarget] = useState<number>(0);

  function handleGuess(latitude: number, longitude: number) {
    console.log("Location guess:", {
      latitude,
      longitude,
    });
    setCurrentGuess({ lat: latitude, lng: longitude });
  }

  function submitGuess() {
    const parsedYear = Number(yearGuessState);

    const validYear =
      Number.isInteger(parsedYear) && parsedYear >= 1900 && parsedYear <= 2100;

    if (!validYear) {
      setYearError(true);
      return;
    }

    setYearError(false);

    console.log("Submitted guess:", {
      year: parsedYear,
      coors: currentGuess,
    });

    const yearDifference = Math.abs(parsedYear - quizData.year);
    const yearScore = Math.max(0, 5 - yearDifference);
    const distanceKm = haversineDistance(currentGuess!, quizData.coords);
    const distanceScore = getLocationScore(distanceKm);
    const totalScore = distanceScore + yearScore;

    console.log("stats", {
      yearDifference,
      yearScore,
      distanceKm,
      distanceScore,
      totalScore,
    });

    setDistanceScore(distanceScore);
    setYearScore(yearScore);
    setDistanceToTarget(Math.round(distanceKm * 10) / 10);

    setGameState((prev) => ({
      ...prev,
      currentGuess: currentGuess!,
      currentAnswer: quizData.coords,
      showResult: true,
    }));
  }

  function nextRound() {
    const nextScoreIncrease = yearScoreState + distanceScoreState;
    setYear("");
    setCurrentGuess(null);
    setMapResetKey((prev) => prev + 1);
    setHintExpanded(true);

    if (QuizDataList.length == currentRound) {
      navigate("/result", {
        replace: true,
      });
    }

    setGameState((prev) => ({
      ...prev,
      score: prev.score + nextScoreIncrease,
      currentRound: prev.currentRound + 1,
      currentGuess: undefined,
      currentAnswer: undefined,
      showResult: false,
    }));
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <h1>
          Runde {gameState.currentRound} / {numberOfRounds}
        </h1>

        <p>Score: {gameState.score}</p>
      </header>

      <section className="map-container">
        <GuessMap
          onGuessChange={handleGuess}
          showResult={gameState.showResult}
          answer={quizData.coords}
          guess={currentGuess ?? undefined}
          resetKey={mapResetKey}
        />
        <ImageHint
          src={quizData.image}
          expanded={hintExpanded}
          setExpanded={setHintExpanded}
        />
      </section>

      {gameState.showResult && (
        <div className="score-popup">
          <div className="score-content">
            <p>
              Du var <strong>{distanceToTargetState} km</strong> fra den
              korrekte lokation, hvilket giver dig{" "}
              <ScoreBadge score={distanceScoreState} /> point
            </p>

            <p>
              Billedet er fra{" "}
              <ScoreBadge score={yearScoreState}>{quizData.year}</ScoreBadge>,
              dit gæt var {Math.abs(Number(yearGuessState) - quizData.year)} år
              væk, det giver dig <ScoreBadge score={yearScoreState} /> point
            </p>
          </div>

          <button className="next-button" onClick={nextRound}>
            Videre
          </button>
        </div>
      )}

      <footer className="quiz-actions">
        <input
          className={yearError ? "year-input error" : "year-input"}
          type="number"
          placeholder="2026"
          value={yearGuessState}
          onChange={(event) => {
            setYear(event.target.value);
            setYearError(false);
          }}
          min="1900"
          max="2100"
        />

        <button
          disabled={currentGuess == null || gameState.showResult}
          onClick={submitGuess}
        >
          Gæt
        </button>
      </footer>
    </main>
  );
}

function getLocationScore(distanceKm: number): number {
  if (distanceKm < 2) return 5;
  if (distanceKm < 50) return 4;
  if (distanceKm < 200) return 3;
  if (distanceKm < 400) return 2;
  if (distanceKm < 800) return 1;
  return 0;
}

export function haversineDistance(a: Coordinates, b: Coordinates): number {
  const R = 6371; // km

  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;

  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * c;
}
