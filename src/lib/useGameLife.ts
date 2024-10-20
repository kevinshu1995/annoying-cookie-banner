import { useState } from 'react';

export interface GameLife {
  addLife: () => boolean;
  minusLife: () => boolean;
  resetLife: () => void;
  life: number;
  heartStates: boolean[];
}

const useGameLife = ({ maxLife }: { maxLife: number }): GameLife => {
  const [life, setLife] = useState(maxLife);
  const heartStates = [...Array(maxLife)].map((_, index) => index + 1 <= life);

  const addLife = () => {
    if (life < maxLife) {
      setLife(life + 1);
      return true;
    }
    return false;
  };

  const minusLife = () => {
    if (life > 0) {
      setLife(life - 1);
      return true;
    }
    return false;
  };

  const resetLife = () => {
    setLife(maxLife);
  };

  return {
    addLife,
    minusLife,
    resetLife,
    life,
    heartStates,
  };
};

export default useGameLife;

