
import React from 'react';

interface GoalDetailsProps {
  scorer: string;
  assists: string[];
  score: string;
  time: string;
  shotType: string;
  special: string;
  team: string;
  className: string;
}

export const GoalDetails: React.FC<GoalDetailsProps> = ({ scorer, assists, score, time, shotType, special, team, className }) => {
  const assist1 = assists[0]
  const assist2 = assists[1]
  return (

    <div className={"w-[250px] h-[100px] border border-white rounded-lg overflow-y-hidden" + className}>
      <div className="mt-1 ml-1">
        {team} {time} {score}  {special}    </div>
      <div className="h-[20px] ml-1">
        <span className="font-bold">{scorer + '. '}</span>
        {assist1 && !assist2 && (
          <>
            Assists: <span className="font-semibold">{assist1}</span>
          </>
        )}
        {assist1 && assist2 && (
          <>
            Assists:{' '}
            <span className="font-semibold">
              {assist1 + ', ' + assist2 + '. '}
            </span>
          </>
        )}

        {shotType}
      </div>
    </div>

  );
};
