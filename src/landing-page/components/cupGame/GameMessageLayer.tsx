import clsx from 'clsx';
import { useEffect, useState, useMemo } from 'react';
import { BlueButton } from './../Button';

type GameMessageState = null | 'countdown' | 'gameOver';

const useCountDownText = (startCountdown: boolean) => {
  const [countdownText, setCountdownText] = useState(3);
  const isCountdownEnd = countdownText === 0;

  useEffect(() => {
    if (startCountdown && countdownText > 0) {
      const timer = setTimeout(() => {
        setCountdownText(countdownText - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startCountdown, countdownText]);

  return {
    countdownText,
    isCountdownEnd,
    setCountdownText,
  };
};

export const useGameMessage = () => {
  const [gameState, setGameState] = useState<GameMessageState>(null);
  return {
    gameState,
    setGameState,
  };
};

const gameOverMessages = [
  'Whoopsie-daisy!',
  'Nice try, butterfingers!',
  'So close, yet so far!',
  'Better luck next time, champ!',
  'Oops! Ball: 1, You: 0',
  'Aww, snap!',
  'Not your day, huh?',
  'Gotcha! (The ball, not you)',
  'Swing and a miss!',
  'Tough cookies!',
];

export const GameMessageLayer = ({
  state = null,
  setState,
}: {
  state: GameMessageState;
  setState: (state: GameMessageState) => void;
}) => {
  const { countdownText, isCountdownEnd, setCountdownText } = useCountDownText(
    state === 'countdown'
  );
  const gameStartText = 'START!';

  // if state changes to countdown, set countdownText to 3
  useEffect(() => {
    if (state === 'countdown') {
      setCountdownText(3);
      return;
    }
  }, [state]);

  // if countdownText reaches 0, set state to null (Game start)
  useEffect(() => {
    if (isCountdownEnd) {
      setTimeout(() => {
        setState(null);
      }, 500);
      return;
    }
  }, [countdownText]);

  const randomGameOverMessage = useMemo(() => {
    return gameOverMessages[
      Math.floor(Math.random() * gameOverMessages.length)
    ];
  }, [state]);

  return (
    <div
      className={clsx(
        'absolute w-full h-full left-0 top-0',
        state === null && 'hidden'
      )}
    >
      <div className="w-full h-full flex items-center justify-center bg-gray-900/30">
        <div className="bg-white py-16 px-2 shadow-xl w-full flex justify-center">
          <h2
            className={clsx(
              'font-bold text-4xl flex flex-col gap-8 items-center',
              state !== 'countdown' && 'hidden'
            )}
          >
            <span>Find the Ball!</span>
            <span
              className={clsx(
                'relative text-8xl text-blue-500',
                !isCountdownEnd && 'animate-spin-shrink-fade-in'
              )}
              key={countdownText}
            >
              {isCountdownEnd && (
                <span
                  className={clsx(
                    'absolute w-full h-full left-0 top-0',
                    'text-8xl text-blue-500 animate-ping'
                  )}
                >
                  {gameStartText}
                </span>
              )}
              {isCountdownEnd ? gameStartText : countdownText}
            </span>
          </h2>
          <div
            className={clsx(
              'flex flex-col items-center justify-center gap-4',
              state !== 'gameOver' && 'hidden'
            )}
          >
            <h2 className={clsx('font-bold text-6xl sm:text-9xl text-red-500')}>
              Game Over
            </h2>
            <p className="text-lg">{randomGameOverMessage}</p>
            <BlueButton
              className="px-8 py-2 text-xl"
              onClick={() => setState('countdown')}
            >
              Try again?
            </BlueButton>
          </div>
        </div>
      </div>
    </div>
  );
};

