
import { NextApiRequest, NextApiResponse } from 'next';

export interface Score {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeShots?: number;
  awayShots?: number;
  currentPeriod?: number;
  currentPeriodOrdinal?: string;
  currentPeriodTimeRemaining?: string;
  link?: string;
}

const CACHE_UPDATE_INTERVAL = 500;

let cachedData: {
  [date: string]: {
    data: Score[];
    gameFeeds: {
      [gameId: number]: any;
    };
  };
} = {};


async function fetchAndCacheGameFeed(gameId: number) {
  try {
    const response = await fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`);
    const data = await response.json();

    // Cache the game feed data
    const currentDate = new Date().toISOString().split('T')[0];
    if (!cachedData[currentDate]) {
      cachedData[currentDate] = {
        data: [],
        gameFeeds: {},
      };
    }
    cachedData[currentDate].gameFeeds[gameId] = data;
  } catch (error) {
    console.error(`Failed to fetch game feed for gameId ${gameId}:`, error);
  }
}


// Update the cache for a specific date
async function updateCache(date: string) {
  try {
    const response = await fetch(`https://statsapi.web.nhl.com/api/v1/schedule?date=${date}&expand=schedule.linescore`);
    const data = await response.json();

    const scores: Score[] = data.dates[0].games.map((game: any) => {
      fetchAndCacheGameFeed(game.gamePk)
      return ({
        // ... the same as before
        id: game.gamePk,
        homeTeam: game.teams.home.team.name,
        awayTeam: game.teams.away.team.name,
        homeScore: game.teams.home.score,
        awayScore: game.teams.away.score,
        homeShots: game.teams.home.shots,
        awayShots: game.teams.away.shots,
        currentPeriod: game.linescore?.currentPeriod!,
        currentPeriodOrdinal: game.linescore?.currentPeriodOrdinal,
        currentPeriodTimeRemaining: game.linescore?.currentPeriodTimeRemaining,
        link: game.link,
      })
    });

    cachedData[date] = {
      data: scores,
      gameFeeds: cachedData[date]?.gameFeeds || {},
    };
  } catch (error) {
    console.error(`Failed to update cache for ${date}:`, error);
  }
}

// Function to start the background worker to update the cache
function startBackgroundCacheUpdate() {
  setInterval(async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    await updateCache(currentDate);
  }, CACHE_UPDATE_INTERVAL);
}

// Start the background cache update worker
startBackgroundCacheUpdate();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.query;

  // Check if the data for the specified date is already cached
  const cached = cachedData[date as string];
  if (cached) {
    // Return the cached data
    res.status(200).json(cached.data);
    return;
  }

  // If the data for the specified date is not cached, fetch and update the cache
  await updateCache(date as string);
  res.status(200).json(cachedData[date as string].data);
}

export async function getCachedGameFeed(gameId: number) {
  const currentDate = new Date().toISOString().split('T')[0];
  const cached = cachedData[currentDate]?.gameFeeds?.[gameId];

  if (!cached) {
    await fetchAndCacheGameFeed(gameId);
    return cachedData[currentDate]?.gameFeeds?.[gameId];
  }

  return cached;
}

export { cachedData }
