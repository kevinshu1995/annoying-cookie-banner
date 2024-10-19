import { useState } from 'react';

const useGameRound = ({ maxRound }: { maxRound: number }) => {
  const [round, setRound] = useState(maxRound);

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

  return {
    addRound,
    minusRound,
    resetRound,
    round,
    maxRound,
  };
};

export default useGameRound;

