
// pages/standings.tsx

import React, { useEffect, useState } from 'react';
import StandingsTable from '../components/StandingsTable';

interface StandingsData {
  leagueStandings: any;
  divisionStandings: any;
  wildcardStandings: any;
}

export default function StandingsPage() {
  const [standingsData, setStandingsData] = useState<StandingsData | null>(null);

  useEffect(() => {
    async function fetchStandingsData() {
      try {
        const response = await fetch('/api/standings');
        const data: StandingsData = await response.json();
        setStandingsData(data);
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch standings data:', error);
      }
    }

    fetchStandingsData();
  }, []);

  return (
    <div>
      <h1>NHL Standings</h1>
      {standingsData && (
        <div>
          <StandingsTable
            title="League Standings"
            standings={standingsData.leagueStandings.records.flatMap((record: any) => record.teamRecords)}
          />
          {standingsData.divisionStandings.records.map((record: any) => (
            <StandingsTable
              key={record.division.id}
              title={`${record.division.name} Division Standings`}
              standings={record.teamRecords}
            />
          ))}
          {standingsData.wildcardStandings.records.map((record: any) => (
            <StandingsTable
              key={record.conference.id}
              title={`${record.conference.name} Conference Wild Card Standings`}
              standings={record.teamRecords}
            />
          ))}
        </div>
      )}
    </div>
  );
}


