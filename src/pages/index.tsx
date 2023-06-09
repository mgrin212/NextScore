

import React, { useState } from 'react';
import Scoreboard from '../components/Scoreboard';
import Link from 'next/link';

function formatDate(): string {
  const [month, day, year] = new Date().toLocaleDateString().split('/');

  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  return formattedDate;
}

function ScoresPage() {
  const [date, setDate] = useState(formatDate());

  function handleScroll(direction: any) {
    const currentDate = new Date(date);

    if (direction === 'left') {
      setTransitionClasses('duration-200 ease-in-out translate-x-full');
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (direction === 'right') {
      setTransitionClasses('duration-200 ease-in-out -translate-x-full');
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const newDate = currentDate.toISOString().slice(0, 10);
    setDate(newDate);
    setTimeout(() => {
      setTransitionClasses('');
    }, 170);
  }


  const [transitionClasses, setTransitionClasses] = useState('');

  return (
    <div className="h-screen">

      <div className="flex flex-col items-center justify-center">
        <div className="w-full flex flex-row fixed z-50 top-0 bg-black h-[50px]">
          <button
            className="bg-gray-500 text-white w-full rounded p-2 mr-2"
            onClick={() => handleScroll('left')}
          >
            &lt;
          </button>
          <button
            className="bg-gray-500 text-white rounded w-full p-2 ml-2"
            onClick={() => handleScroll('right')}
          >
            &gt;
          </button>
        </div>
        <div className="w-full py-[50px] flex flex-col justify-center items-center">
          <h1>NHL Scores for {date.replaceAll("-", " ").slice(4, 15)}</h1>
          <div className={`scoreboard-wrapper transform ${transitionClasses} w-full`}>
            <Scoreboard date={date} />
          </div>
        </div>
        <div className="w-full flex flex-row fixed z-50 bottom-0 bg-black h-[50px] text-center text-xl">
          <Link href="/" className=" bg-gray-500 text-white rounded w-full p-2 ml-2">Scores</Link>
          <Link href="/standings" className=" bg-gray-500 text-white rounded w-full p-2 ml-2"> Standings </Link>
        </div>
      </div>
    </div>
  );
}



export default ScoresPage;

