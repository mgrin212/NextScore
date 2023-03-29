
// pages/api/standings.ts

import { NextApiRequest, NextApiResponse } from 'next';

const NHL_API_BASE = 'https://statsapi.web.nhl.com/api/v1';

interface Standings {
  leagueStandings: any;
  divisionStandings: any;
  wildcardStandings: any;
}

let cachedStandings: Standings | null = null;

async function fetchStandings(): Promise<Standings> {
  try {
    const leagueStandingsResponse = await fetch(`${NHL_API_BASE}/standings`);
    const leagueStandings = await leagueStandingsResponse.json();

    const divisionStandingsResponse = await fetch(`${NHL_API_BASE}/standings/byDivision`);
    const divisionStandings = await divisionStandingsResponse.json();

    const wildcardStandingsResponse = await fetch(`${NHL_API_BASE}/standings/wildCardWithLeaders`);
    const wildcardStandings = await wildcardStandingsResponse.json();

    return {
      leagueStandings,
      divisionStandings,
      wildcardStandings,
    };
  } catch (error) {
    console.error('Failed to fetch standings:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!cachedStandings) {
    cachedStandings = await fetchStandings();
  }

  res.status(200).json(cachedStandings);
}
