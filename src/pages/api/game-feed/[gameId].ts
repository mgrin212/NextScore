
import { NextApiRequest, NextApiResponse } from 'next';
import { getCachedGameFeed } from '@/pages/api/scores';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gameId } = req.query;

  try {
    const gameFeed = await getCachedGameFeed(Number(gameId));
    res.status(200).json(gameFeed);
  } catch (error) {
    console.error(`Failed to fetch game feed for gameId ${gameId}:`, error);
    res.status(500).json({ message: 'Failed to fetch game feed data' });
  }
}

