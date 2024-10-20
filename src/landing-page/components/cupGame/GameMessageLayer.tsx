import clsx from 'clsx';
import { useEffect, useState, useMemo } from 'react';
import { BlueButton } from './../Button';

type GameMessageState =
  | 'welcome'
  | 'pause'
  | 'countdown'
  | 'gameOver'
  | 'gameStart';

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
  const [gameState, setGameState] = useState<GameMessageState>('welcome');
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
  state,
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
        setState('gameStart');
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
        ['gameOver', 'countdown', 'welcome'].includes(state) === false &&
          'hidden'
      )}
    >
      {state === 'welcome' && (
        <WelcomeMessagePanel closePanel={() => setState('countdown')} />
      )}
      {state !== 'welcome' && (
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
              <h2
                className={clsx('font-bold text-6xl sm:text-9xl text-red-500')}
              >
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
      )}
    </div>
  );
};

const WelcomeMessagePanel = ({ closePanel }: { closePanel: () => void }) => {
  const welcomeMessages = [
    { text: 'Hey there, welcome!', class: 'text-4xl font-bold' },
    {
      text: "How about we play a little game? If you win, I promise I won't use your cookies! 😉",
      class: 'font-bold',
    },
    {
      text: "The rules are super simple: just find that mischievous little ball in each round! You've got three precious lives, and once they're gone, it's Game Over! ",
    },
    {
      text: "But don't worry, because I'm feeling generous, I've decided to let you have infinite retries! 🤗",
    },
    {
      text: "Got it? If you're ready, just hit that start button and let's get this party started!",
    },
    {
      text: "Oh, and if you want to bail halfway through, just tap the button at the bottom of the screen to escape.But I'll be pretty disappointed if you do! 😢",
      class: 'text-gray-400',
    },
  ];

  return (
    <div className="flex items-center justify-center bg-white/80 w-full h-full">
      <div className="space-y-4 max-w-[700px] w-full text-lg">
        {welcomeMessages.map((message, index) => (
          <p
            className={clsx(
              'animate-[fadeIn_0.5s_ease-in-out_both]',
              message?.class ?? ''
            )}
            style={{ animationDelay: `${index * 0.3}s` }}
            key={index}
          >
            {message.text}
          </p>
        ))}
        <BlueButton className="px-24 py-2" onClick={closePanel}>
          Start The Game!
        </BlueButton>
      </div>
    </div>
  );
};

