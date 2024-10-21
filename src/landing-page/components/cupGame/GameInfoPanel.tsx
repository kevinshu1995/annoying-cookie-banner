import { GameHeart } from './GameHeart';
import { useGamePlay } from './../context/GamePlayProvider';
import clsx from 'clsx';

const GameInfoPanel = () => {
  const {
    heartStates,
    round,
    maxRound,
    countdown: roundCountdown,
    gameRoundInfoText,
  } = useGamePlay();

  return (
    <div className="absolute top-0 left-0 w-full p-4 flex flex-wrap items-start">
      <div className="w-1/3">
        <p className="font-bold text-lg flex items-center gap-2">
          <span className="text-gray-800">ROUND</span>
          <span className="text-gray-800 text-2xl">{round}</span>
          <span className="text-gray-800">/</span>
          <span className="text-gray-800 text-2xl">{maxRound}</span>
        </p>
      </div>
      <div className="w-1/3">
        <div className="flex flex-col w-full items-center justify-center">
          <span
            className={clsx(
              'relative text-4xl font-bold',
              roundCountdown < 1 && 'opacity-0',
              roundCountdown <= 3 && 'text-red-500'
            )}
          >
            {roundCountdown}
            <span
              className={clsx(
                'absolute left-0 top-0 text-4xl font-bold',
                roundCountdown <= 3 && 'text-red-500 animate-ping'
              )}
            >
              {roundCountdown}
            </span>
          </span>
        </div>
      </div>
      <div className="w-1/3">
        <div className="flex space-x-2 justify-end">
          {heartStates.map((isFilled, index) => {
            return <GameHeart isFilled={isFilled} key={index} />;
          })}
        </div>
      </div>
      <div className="w-full text-center">
        <p
          className={clsx(
            'relative font-bold text-2xl animate-pulse h-8',
            !gameRoundInfoText && 'opacity-0'
          )}
        >
          {gameRoundInfoText}
        </p>
      </div>
    </div>
  );
};

export default GameInfoPanel;

