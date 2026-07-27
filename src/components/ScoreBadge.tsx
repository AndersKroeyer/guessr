interface ScoreBadgeProps {
  score: number;
  children?: React.ReactNode;
}

export function ScoreBadge({
  score,
  children,
}: ScoreBadgeProps) {
  return (
    <span
      className={`score-${score}`}
    >
      {children ?? score}
    </span>
  );
}