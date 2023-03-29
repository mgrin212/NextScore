
import { Score } from '@/pages/api/scores';
import React, { useState, useEffect } from 'react';
import { SingleScoreboard } from './SingleScoreboard';

interface ScoreboardProps {
  date: string;
}

export default function Scoreboard({ date }: ScoreboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/scores?date=${date}`)
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [date]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (scores.length === 0) {
    return <p>No scores found for {date}</p>;
  }

  return (
    <div className="w-full flex flex-col justify-center align-middle border border-gray-50">
      {scores.map((score: Score) => (
        <SingleScoreboard key={score.id} score={score} />
      ))}

    </div>
  );
}
