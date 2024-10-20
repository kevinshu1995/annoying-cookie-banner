import { useState } from 'react';

export interface GameRound {
  addRound: () => boolean;
  minusRound: () => boolean;
  resetRound: () => void;
  startCountdown: (initialCountdown: number) => void;
  setCountdown: (countdown: number) => void;
  round: number;
  maxRound: number;
  countdown: number;
  isCountdownEnd: boolean;
}

const useGameRound = ({ maxRound }: { maxRound: number }) => {
  const [round, setRound] = useState<GameRound['round']>(1);
  const [countdown, setCountdown] = useState<GameRound['countdown']>(0);
  const [isCountdownEnd, setIsCountdownEnd] = useState(false);

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
    setRound(round);
  };

  const startCountdown = (initialCountdown: number) => {
    setCountdown(initialCountdown);
    setIsCountdownEnd(false);
    const intervalId = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown < 0) {
          clearInterval(intervalId);
          setIsCountdownEnd(true);
          return -1;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  return {
    addRound,
    minusRound,
    resetRound,
    startCountdown,
    setCountdown,
    round,
    maxRound,
    countdown,
    isCountdownEnd,
  };
};

export default useGameRound;

