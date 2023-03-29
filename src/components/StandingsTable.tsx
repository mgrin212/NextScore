
// components/StandingsTable.tsx

import React from 'react';

interface StandingsTableProps {
  title: string;
  standings: any[];
}

export default function StandingsTable({ title, standings }: StandingsTableProps) {
  return (
    <div className="border">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Games Played</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr key={standing.team.id + standing.points + title}>
              <td>{standing.team.name}</td>
              <td>{standing.gamesPlayed}</td>
              <td>{standing.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
