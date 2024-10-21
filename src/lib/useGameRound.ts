import { useState } from 'react';

export interface GameRound {
  addRound: () => boolean;
  minusRound: () => boolean;
  resetRound: () => void;
  startCountdown: (initialCountdown: number) => Promise<void>;
  setCountdown: (countdown: number) => void;
  setGameRoundInfoText: (text: string) => void;
  gameRoundInfoText: string;
  round: number;
  maxRound: number;
  countdown: number;
  isCountdownEnd: boolean;
}

const initRound = 1;

const useGameRound = ({ maxRound }: { maxRound: number }) => {
  const [round, setRound] = useState<GameRound['round']>(initRound);
  const [countdown, setCountdown] = useState<GameRound['countdown']>(0);
  const [isCountdownEnd, setIsCountdownEnd] = useState(false);
  const [gameRoundInfoText, setGameRoundInfoText] = useState('');

  const addRound = () => {
    if (round < maxRound) {
      setRound(round + 1);
      return true;
    }
    return false;
  };

  const minusRound = () => {
    if (round > 0) {
      setRound(round - 1);
      return true;
    }
    return false;
  };

  const resetRound = () => {
    setRound(initRound);
  };

  const startCountdown = (initialCountdown: number) => {
    return new Promise<void>(resolve => {
      setCountdown(initialCountdown);
      setIsCountdownEnd(false);
      setGameRoundInfoText('Find the Ball');
      const intervalId = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown < 0) {
            clearInterval(intervalId);
            setIsCountdownEnd(true);
            resolve();
            return -1;
          }
          if (prevCountdown === 1) {
            setGameRoundInfoText("Time's up!");
          }
          return prevCountdown - 1;
        });
      }, 1000);
    });
  };

  return {
    addRound,
    minusRound,
    resetRound,
    startCountdown,
    setCountdown,
    setGameRoundInfoText,
    gameRoundInfoText,
    round,
    maxRound,
    countdown,
    isCountdownEnd,
  };
};

export default useGameRound;

