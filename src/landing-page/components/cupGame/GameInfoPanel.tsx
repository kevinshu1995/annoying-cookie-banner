import useGameLife from '@/lib/useGameLife';
import useGameRound from '@/lib/useGameRound';
import { GameHeart } from './GameHeart';

const GameInfoPanel = () => {
  const { heartStates } = useGameLife({ maxLife: 5 });
  const { round, maxRound } = useGameRound({ maxRound: 99 });

  return (
    <>
      <div>
        <p className="font-bold text-lg flex items-center gap-2">
          <span className="text-gray-800">ROUND</span>
          <span className="text-gray-800 text-2xl">{round}</span>
          <span className="text-gray-800">/</span>
          <span className="text-gray-800 text-2xl">{maxRound}</span>
        </p>
      </div>
      <div className="ml-auto flex space-x-2">
        {heartStates.map((isFilled, index) => {
          return <GameHeart isFilled={isFilled} key={index} />;
        })}
      </div>
    </>
  );
};

export default GameInfoPanel;

