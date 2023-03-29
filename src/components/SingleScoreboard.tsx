
import React, { useState, useEffect } from 'react';
import { Score } from '@/pages/api/scores';
import { GoalDetails } from './GoalDetails';
import Image from 'next/image';

interface SingleScoreboardProps {
  score: Score;
}

export const SingleScoreboard: React.FC<SingleScoreboardProps> = ({ score }) => {
  const [gameFeed, setGameFeed] = useState<any>(null);
  const [clicked, setClicked] = useState(false);
  const [containerHeight, setContainerHeight] = useState('0');

  useEffect(() => {
    const fetchGameFeed = async () => {
      try {
        const response = await fetch(`/api/game-feed/${score.id}`);
        const data = await response.json();
        setGameFeed(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGameFeed();
  }, [score.id]);
  const [animationClass, setAnimationClass] = useState('animate-slideDown');

  const handleScoreboardClick = async (gameId: number) => {
    if (clicked) {
      setAnimationClass('animate-slideUp');
      setTimeout(() => {
        setClicked(false);
        setContainerHeight('0')
      }, 200);
    } else {
      setAnimationClass('animate-slideDown');
      setClicked(true);
      setContainerHeight('auto')
    }
    try {
      const response = await fetch(`/api/game-feed/${gameId}`);
      const data = await response.json();
      setGameFeed(data);
    } catch (error) {
      console.error(error);
    }
  };
  const renderGoalDetails = () => {
    if (!gameFeed || !clicked) {
      return null;
    }

    return (
      <div
        className={animationClass + " h-[" + containerHeight + "] " + " scrollbar-hide z-0 duration-75 bg-gray-800 p-4 space-x-2 w-full lg:w-1/3 md:w-1/2 overflow-x-scroll grid grid-flow-col text-white  border-white rounded-md"}
        style={{ height: containerHeight, transition: 'height 400ms' }}
      >
        {gameFeed.liveData && gameFeed.liveData.plays.allPlays
          .filter((play: any) => play.result.eventTypeId === 'GOAL')
          .map((goal: any, index: number) => {
            const scorer = goal.players.find((player: any) => player.playerType === 'Scorer').player.fullName;
            const assists = goal.players
              .filter((player: any) => player.playerType === 'Assist')
              .map((assist: any) => assist.player.fullName);
            const score = `${goal.about.goals.home}-${goal.about.goals.away}`;
            const time = goal.about.periodTime;
            const shotType = goal.result.secondaryType;
            const special = goal.result.strength.code !== 'EVEN' ? goal.result.strength.name : '';
            const team = goal.team.triCode;

            return (
              <GoalDetails
                key={index}
                scorer={scorer}
                assists={assists}
                score={score}
                time={time}
                shotType={shotType}
                special={special}
                team={team}
                className={animationClass}
              />
            );
          })}
      </div>
    );
  };

  const nhlTeamIds: Record<string, number> = {
    "Anaheim Ducks": 24,
    "Arizona Coyotes": 53,
    "Boston Bruins": 6,
    "Buffalo Sabres": 7,
    "Calgary Flames": 20,
    "Carolina Hurricanes": 12,
    "Chicago Blackhawks": 16,
    "Colorado Avalanche": 21,
    "Columbus Blue Jackets": 29,
    "Dallas Stars": 25,
    "Detroit Red Wings": 17,
    "Edmonton Oilers": 22,
    "Florida Panthers": 13,
    "Los Angeles Kings": 26,
    "Minnesota Wild": 30,
    "Montréal Canadiens": 8,
    "Nashville Predators": 18,
    "New Jersey Devils": 1,
    "New York Islanders": 2,
    "New York Rangers": 3,
    "Ottawa Senators": 9,
    "Philadelphia Flyers": 4,
    "Pittsburgh Penguins": 5,
    "San Jose Sharks": 28,
    "Seattle Kraken": 55,
    "St. Louis Blues": 19,
    "Tampa Bay Lightning": 14,
    "Toronto Maple Leafs": 10,
    "Vancouver Canucks": 23,
    "Vegas Golden Knights": 54,
    "Washington Capitals": 15,
    "Winnipeg Jets": 52
  };
  return (
    <div className="w-full flex flex-col justify-center align-middle">
      <div className="bg-gray-800 text-white rounded-lg p-4 w-full md:w-1/2 lg:w-1/3" >
        {/* ...existing scoreboard code... */}

        <div
          key={score.id}
          className="p-2 border flex flex-col border-white text-white rounded w-full mb-1 mt-1 h-[130px] cursor-pointer"
          onClick={() => handleScoreboardClick(score.id)}
        >
          <div className="flex flex-row justify-between" >
            <div className="w-[100%] flex flex-col justify-between items-middle align-middle text-justify">
              <div>
                <p>
                  {!(score.currentPeriodOrdinal) ? (
                    "Game not started"
                  ) : (
                    <>
                      {(score.currentPeriodOrdinal)}{" "}
                      {(score.currentPeriodTimeRemaining)}
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-row justify-between">
                <div className="w-full text-xl">
                  {/* Display images of teams */}
                  <div className="flex flex-row">
                    <Image
                      className="w-10 h-10"
                      src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${nhlTeamIds[score.awayTeam]}.svg`}
                      alt={(score.awayTeam)}
                      width={10}
                      height={10}
                    />
                    <p className="mt-2 mb-2">{(score.awayTeam)}</p>
                    <p className="mt-4 text-gray-500 ml-2 mb-2 text-sm">
                      {(score.awayShots)} SOG
                    </p>
                  </div>
                  <div className="flex flex-row">
                    <Image
                      className="w-10 h-10"
                      src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${nhlTeamIds[score.homeTeam]}.svg`}
                      alt={(score.homeTeam)}
                      width={10}
                      height={10}
                    />
                    <p className="s">{(score.homeTeam)}</p>
                    <p className="mt-2 text-gray-500 ml-2 mb-2 text-sm">
                      {(score.homeShots)} SOG
                    </p>
                  </div>
                </div>
                <div className="text-4xl">
                  <p className="mb-1 s">{(score.awayScore)}</p>
                  <p className="s">{(score.homeScore)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      {renderGoalDetails()}
    </div>
  );
};
