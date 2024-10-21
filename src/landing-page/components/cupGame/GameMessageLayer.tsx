import clsx from 'clsx';
import { useEffect, useState, useMemo } from 'react';
import { BlueButton } from './../Button';
import { useGamePlay } from './../context/GamePlayProvider';

type GameMessageState =
  | 'welcome'
  | 'pause'
  | 'countdown'
  | 'gameOver'
  | 'gameStart'
  | 'victory'
  | 'winningRound'
  | 'losingRound'
  | 'resetGame';

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

const losingRoundMessages = [
  'Oops! This round slipped away!',
  "Not quite! The ball's still at large.",
  'Close call! But no cigar this time.',
  'Whoops! Did the ball outsmart you this time?',
  'Looks like someone needs to work on their ball-spotting skills!',
  'Oh dear, was that ball too sneaky for you?',
];

const winningRoundMessages = [
  "Hmph, not bad... I guess you're not completely hopeless after all.",
  'Oh? You actually won? I didn’t see that coming... Just lucky, I suppose.',
  'Wow, impressive... for a mere mortal.',
  "Pfft, that was just beginner's luck. Don’t get too comfortable!",
  "Congratulations, I suppose... but don't think you’ve mastered this yet.",
  'Heh, you got it right... but it’s not like I was trying, anyway.',
  'Hmm, not bad at all. I guess you’re worth a second look… for now.',
  'So you won... big deal. Let’s see if you can keep it up.',
  'Oh, you beat me? How quaint. I’m sure you’ll be bragging about this for a while.',
];

export const GameMessageLayer = ({
  state,
  setState,
  closeModal,
}: {
  state: GameMessageState;
  setState: (state: GameMessageState) => void;
  closeModal: () => void;
}) => {
  const { countdownText, isCountdownEnd, setCountdownText } = useCountDownText(
    state === 'countdown' || state === 'victory'
  );
  const gameStartText = 'START!';
  const { round } = useGamePlay();

  // if state changes to countdown, set countdownText to 3
  useEffect(() => {
    if (state === 'countdown') {
      setCountdownText(3);
      return;
    }
    if (state === 'victory') {
      setCountdownText(10);
      return;
    }
  }, [state]);

  // if countdownText reaches 0, set state to null (Game start)
  useEffect(() => {
    if (isCountdownEnd && state === 'countdown') {
      setTimeout(() => {
        setState('gameStart');
      }, 500);
      return;
    }

    if (isCountdownEnd && state === 'victory') {
      setTimeout(() => {
        closeModal();
      }, 500);
      return;
    }
  }, [countdownText]);

  const randomGameOverMessage = useMemo(() => {
    return gameOverMessages[
      Math.floor(Math.random() * gameOverMessages.length)
    ];
  }, [state]);

  const randomLosingRoundMessage = useMemo(() => {
    return losingRoundMessages[
      Math.floor(Math.random() * losingRoundMessages.length)
    ];
  }, [state]);

  const randomWinningRoundMessage = useMemo(() => {
    return winningRoundMessages[
      Math.floor(Math.random() * winningRoundMessages.length)
    ];
  }, [state]);

  return (
    <div
      className={clsx(
        'absolute w-full h-full left-0 top-0',
        [
          'gameOver',
          'countdown',
          'welcome',
          'losingRound',
          'winningRound',
          'victory',
        ].includes(state) === false && 'hidden'
      )}
    >
      {state === 'welcome' && (
        <WelcomeMessagePanel closePanel={() => setState('countdown')} />
      )}
      {state !== 'welcome' && (
        <div className="w-full h-full flex items-center justify-center bg-gray-900/30">
          <div className="bg-white py-16 px-2 shadow-xl w-full flex justify-center">
            {/* countdown (game is ready to start) */}
            <h2
              className={clsx(
                'font-bold  flex flex-col gap-8 items-center',
                state !== 'countdown' && 'hidden'
              )}
            >
              <span className="text-4xl">Round {round}</span>
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
            {/* between each round */}
            <div
              className={clsx(
                'flex flex-col items-center justify-center gap-12',
                ['losingRound', 'winningRound'].includes(state) === false &&
                  'hidden'
              )}
            >
              <h2
                className={clsx('font-bold text-6xl sm:text-3xl text-gray-500')}
              >
                {state === 'losingRound'
                  ? randomLosingRoundMessage
                  : randomWinningRoundMessage}
              </h2>
              <BlueButton
                className="px-8 py-2 text-xl"
                onClick={() => setState('countdown')}
              >
                Next Round
              </BlueButton>
            </div>
            {/* game over */}
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
                onClick={() => setState('resetGame')}
              >
                Try again?
              </BlueButton>
            </div>
            {/* user win */}
            <div
              className={clsx(
                'flex flex-col items-center justify-center gap-4',
                state !== 'victory' && 'hidden'
              )}
            >
              <h2
                className={clsx(
                  'font-bold text-6xl sm:text-9xl text-green-500'
                )}
              >
                Great Job!
              </h2>
              <p className="text-lg">
                Okay, I won't try to use cookies (wink).
              </p>
              {/* TODO countdown */}
              <p>This game will be closed in {countdownText} seconds.</p>
              <BlueButton
                className="px-8 py-2 text-xl"
                onClick={() => setState('resetGame')}
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

