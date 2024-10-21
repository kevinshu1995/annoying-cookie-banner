import { useRef, useEffect } from 'react';
import SetupDrawingCupSet from './cupGame/DrawCupSet';
import GameInfoPanel from './cupGame/GameInfoPanel';
import useElementSize from '@/lib/useElementSize';
import { GameMessageLayer, useGameMessage } from './cupGame/GameMessageLayer';
import { GamePlayProvider, useGamePlay } from './context/GamePlayProvider';
import useCheater from '@/lib/useCheater';

type DrawEverythingArg = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
};

function hold(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const cupCurrentPosition = {
  cup1: { x: 0, y: 0, isHovered: false, isClicked: false },
  cup2: { x: 0, y: 0, isHovered: false, isClicked: false },
  cup3: { x: 0, y: 0, isHovered: false, isClicked: false, rotate: 0 },
};

let cupPath1: Path2D | null = null;
let cupPath2: Path2D | null = null;
let cupPath3: Path2D | null = null;

let isCanvasInteractive = false;

function CupGameCanvas({ closeModal }: { closeModal: () => void }) {
  const gameCanvas = useRef<HTMLCanvasElement>(null);
  const { size: canvasSize, setRef: setCanvasRef } = useElementSize();
  const cupHeight = 120;
  const cupTopWidth = 80;
  const cupBottomWidth = 100;

  const {
    life,
    startCountdown: startRoundCountdown,
    setGameRoundInfoText,
    round,
    maxRound,
    minusLife,
    resetLife,
    resetRound,
    addRound,
  } = useGamePlay();

  const { isCheaterModeActivate } = useCheater();

  const { gameState, setGameState } = useGameMessage();

  function getCupPositions() {
    const [canvasWidth, canvasHeight] = canvasSize;
    if (canvasWidth === 0 || canvasHeight === 0) {
      return {
        topLeft: {
          x: 0,
          y: 0,
          isHovered: false,
          isClicked: false,
        },
        topRight: {
          x: 0,
          y: 0,
          isHovered: false,
          isClicked: false,
        },
        bottom: {
          x: 0,
          y: 0,
          isHovered: false,
          isClicked: false,
          rotate: 0,
        },
      };
    }
    return {
      topLeft: {
        x: (canvasWidth / 7) * 2 - cupBottomWidth / 2,
        y: (canvasHeight / 5) * 2,
        isHovered: false,
        isClicked: false,
      },
      topRight: {
        x: (canvasWidth / 7) * 5 - cupBottomWidth / 2,
        y: (canvasHeight / 5) * 2,
        isHovered: false,
        isClicked: false,
      },
      bottom: {
        x: (canvasWidth - cupBottomWidth) / 2,
        y: (canvasHeight / 5) * 4,
        isHovered: false,
        isClicked: false,
        rotate: 0,
      },
    };
  }

  function initCupState() {
    const { cup1, cup2, cup3 } = cupCurrentPosition;
    const hasNotInit =
      cup1.x === 0 &&
      cup1.y === 0 &&
      cup2.x === 0 &&
      cup2.y === 0 &&
      cup3.x === 0 &&
      cup3.y === 0 &&
      cup3.rotate === 0;
    if (hasNotInit === false) return;
    const initCupsPosition = getCupPositions();

    cupCurrentPosition.cup1.x = initCupsPosition.topLeft.x;
    cupCurrentPosition.cup1.y = initCupsPosition.topLeft.y;

    cupCurrentPosition.cup2.x = initCupsPosition.topRight.x;
    cupCurrentPosition.cup2.y = initCupsPosition.topRight.y;

    cupCurrentPosition.cup3.x = initCupsPosition.bottom.x;
    cupCurrentPosition.cup3.y = initCupsPosition.bottom.y;
    cupCurrentPosition.cup3.rotate = initCupsPosition.bottom.rotate;
  }

  function getCanvasInstance() {
    const canvas = gameCanvas.current;
    if (canvas === null || !canvas.getContext) return null;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return null;

    return { canvas, ctx };
  }

  function updateCanvasSize({
    canvas,
    ctx,
  }: {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  }) {
    const [canvasWidth, canvasHeight] = canvasSize;
    const scale = window.devicePixelRatio;
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
    ctx.scale(scale, scale);
  }

  function drawEverything({ ctx, canvas }: DrawEverythingArg) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // background color
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#FBFBF4';
    ctx.fillRect(0, 0, canvasSize[0], canvasSize[1]);
    ctx.restore();

    const { drawCupSet } = SetupDrawingCupSet({
      cupHeight,
      cupTopWidth,
      cupBottomWidth,
      cupShadowHeight: cupHeight / 3,
    });

    const { cupPath: _cup1Path } = drawCupSet({
      x: cupCurrentPosition.cup1.x,
      y: cupCurrentPosition.cup1.y,
      isLightStroke: cupCurrentPosition.cup1.isHovered,
      isDarkStroke: cupCurrentPosition.cup1.isClicked,
      rotate: 0,
      ctx,
    });
    cupPath1 = _cup1Path;

    const { cupPath: _cup2Path } = drawCupSet({
      x: cupCurrentPosition.cup2.x,
      y: cupCurrentPosition.cup2.y,
      isLightStroke: cupCurrentPosition.cup2.isHovered,
      isDarkStroke: cupCurrentPosition.cup2.isClicked,
      rotate: 0,
      ctx,
    });
    cupPath2 = _cup2Path;

    const { cupPath: _cup3Path } = drawCupSet({
      x: cupCurrentPosition.cup3.x,
      y: cupCurrentPosition.cup3.y,
      rotate: cupCurrentPosition.cup3.rotate,
      isLightStroke: cupCurrentPosition.cup3.isHovered,
      isDarkStroke: cupCurrentPosition.cup3.isClicked,
      ctx,
      hasBall: true,
    });
    cupPath3 = _cup3Path;
  }

  function moveCup(
    cupA: 'cup1' | 'cup2' | 'cup3',
    cupB: 'cup1' | 'cup2' | 'cup3',
    speed?: number
  ) {
    return new Promise<void>(resolve => {
      let startTime: number;
      const cupATarget = { ...cupCurrentPosition[cupB] };
      const cupBTarget = { ...cupCurrentPosition[cupA] };

      function animate(time: number) {
        const instance = getCanvasInstance();
        if (instance === null) return;
        const { canvas, ctx } = instance;

        if (!startTime) startTime = time;
        const timeElapsed = time - startTime;
        const duration = speed ?? 400; // 動畫持續時間，以毫秒為單位
        const fraction = Math.min(timeElapsed / duration, 1);

        // 計算新位置
        const newCupAX =
          cupCurrentPosition[cupA].x +
          (cupATarget.x - cupCurrentPosition[cupA].x) * fraction;
        const newCupAY =
          cupCurrentPosition[cupA].y +
          (cupATarget.y - cupCurrentPosition[cupA].y) * fraction;

        const newCupBX =
          cupCurrentPosition[cupB].x +
          (cupBTarget.x - cupCurrentPosition[cupB].x) * fraction;
        const newCupBY =
          cupCurrentPosition[cupB].y +
          (cupBTarget.y - cupCurrentPosition[cupB].y) * fraction;

        cupCurrentPosition[cupA].x = newCupAX;
        cupCurrentPosition[cupA].y = newCupAY;
        cupCurrentPosition[cupB].x = newCupBX;
        cupCurrentPosition[cupB].y = newCupBY;
        drawEverything({ ctx, canvas });

        if (fraction === 1) {
          resolve();
        } else {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    });
  }

  function toggleDisplayTheBall(forceState: boolean) {
    initCupState();
    return new Promise<void>(resolve => {
      let startTime: number;
      const cupRotateDegree = 60;

      const beforeRotateDegree = cupCurrentPosition.cup3.rotate;
      const targetRotateDegree = beforeRotateDegree === 0 ? cupRotateDegree : 0;

      const isCupRotated = beforeRotateDegree === cupRotateDegree;
      if (isCupRotated === forceState) {
        resolve();
        return;
      }

      function animate(time: number) {
        const instance = getCanvasInstance();
        if (instance === null) return;
        const { canvas, ctx } = instance;

        if (!startTime) startTime = time;
        const timeElapsed = time - startTime;
        const duration = 300; // 動畫持續時間，以毫秒為單位
        const fraction = Math.min(
          Math.round((timeElapsed / duration) * 100) / 100,
          1
        );

        // 計算新位置
        const newRotate =
          beforeRotateDegree +
          (targetRotateDegree - beforeRotateDegree) * fraction;

        cupCurrentPosition.cup3.rotate = Math.round(newRotate * 100) / 100;
        drawEverything({ ctx, canvas });

        if (fraction === 1) {
          resolve();
        } else {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    });
  }

  async function moveCupSeveralTimes(times: number, speed?: number) {
    initCupState();
    async function move(times: number) {
      type CupTag = 'cup1' | 'cup2' | 'cup3';
      const allCups: CupTag[] = ['cup1', 'cup2', 'cup3'];
      const randomTowCups = (cups: CupTag[]): CupTag[] => {
        const randomIndex = Math.floor(Math.random() * cups.length);
        const newCups = [...cups];
        newCups.splice(randomIndex, 1);
        return newCups;
      };
      const [firstCup, secondCup] = randomTowCups(allCups);
      if (times === 0) return;
      await moveCup(firstCup, secondCup, speed);
      await move(times - 1);
    }
    await move(times);
  }

  const isPointInCup = (x: number, y: number, cupPath: Path2D) => {
    const instance = getCanvasInstance();
    if (instance === null) return false;
    const { ctx } = instance;

    return ctx.isPointInPath(cupPath, x, y);
  };

  function onCanvasClick(event: React.MouseEvent<HTMLCanvasElement>) {
    if (isCanvasInteractive === false) return;
    const instance = getCanvasInstance();
    if (instance === null) return;
    const { canvas, ctx } = instance;

    if (cupPath1 === null || cupPath2 === null || cupPath3 === null) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    cupCurrentPosition.cup1.isClicked = isPointInCup(x, y, cupPath1);
    cupCurrentPosition.cup2.isClicked = isPointInCup(x, y, cupPath2);
    cupCurrentPosition.cup3.isClicked = isPointInCup(x, y, cupPath3);

    drawEverything({ ctx, canvas });
  }

  function onCanvasMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
    if (isCanvasInteractive === false) return;
    const instance = getCanvasInstance();
    if (instance === null) return;
    const { canvas, ctx } = instance;

    if (cupPath1 === null || cupPath2 === null || cupPath3 === null) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const isCup1Hovered = isPointInCup(x, y, cupPath1);
    const isCup2Hovered = isPointInCup(x, y, cupPath2);
    const isCup3Hovered = isPointInCup(x, y, cupPath3);

    cupCurrentPosition.cup1.isHovered =
      cupCurrentPosition.cup1.isClicked === false && isCup1Hovered;
    cupCurrentPosition.cup2.isHovered =
      cupCurrentPosition.cup2.isClicked === false && isCup2Hovered;
    cupCurrentPosition.cup3.isHovered =
      cupCurrentPosition.cup3.isClicked === false && isCup3Hovered;

    drawEverything({ ctx, canvas });
  }

  // Step 1 - setup everything on canvas & the welcome message will be shown immediately
  useEffect(() => {
    const canvas = gameCanvas.current;
    if (canvas === null || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return;

    initCupState();

    updateCanvasSize({ canvas, ctx });
    drawEverything({ ctx, canvas });
  }, [gameCanvas.current, canvasSize]);

  // Step 2 - game flow start
  useEffect(() => {
    // right before the game start
    if (gameState === 'resetGame') {
      // reset game states
      resetLife();
      resetRound();
      setGameState('countdown');
      return;
    }

    if (gameState === 'gameStart') {
      const easyMode = isCheaterModeActivate('easyAF');
      const easyModeSpeed = 500;
      const easyModeShuffleCounts = 1;
      const gameConfigs = [
        {
          speed: easyMode ? easyModeSpeed : 400,
          shuffleCounts: easyMode ? easyModeShuffleCounts : 5,
        },
        {
          speed: easyMode ? easyModeSpeed : 300,
          shuffleCounts: easyMode ? easyModeShuffleCounts : 10,
        },
        {
          speed: easyMode ? easyModeSpeed : 200,
          shuffleCounts: easyMode ? easyModeShuffleCounts : 15,
        },
        {
          // crazy mode
          speed: 100,
          shuffleCounts: 15,
        },
      ];
      // game start
      if (round > 0 && round < 4) {
        const { speed, shuffleCounts } = gameConfigs[round - 1];
        roundFlow({ speed, shuffleCounts });
      }
    }
  }, [gameState]);

  useEffect(() => {
    (async () => {
      if (life === 0) {
        await hold(500);
        setGameState('gameOver');
      }
    })();
  }, [life]);

  async function roundFlow({
    speed,
    shuffleCounts,
  }: {
    speed: number;
    shuffleCounts: number;
  }) {
    cupCurrentPosition.cup1.isClicked = false;
    cupCurrentPosition.cup2.isClicked = false;
    cupCurrentPosition.cup3.isClicked = false;
    cupCurrentPosition.cup1.isHovered = false;
    cupCurrentPosition.cup2.isHovered = false;
    cupCurrentPosition.cup3.isHovered = false;
    isCanvasInteractive = false;
    setGameRoundInfoText('');
    await toggleDisplayTheBall(true);
    await hold(1000);
    await toggleDisplayTheBall(false);
    await hold(100);
    setGameRoundInfoText('Shuffling...');
    await moveCupSeveralTimes(shuffleCounts, speed);
    isCanvasInteractive = true;
    await startRoundCountdown(3);
    isCanvasInteractive = false;
    await toggleDisplayTheBall(true);
    const userWin = cupCurrentPosition.cup3.isClicked;
    const userDidNotClick =
      cupCurrentPosition.cup1.isClicked === false &&
      cupCurrentPosition.cup2.isClicked === false &&
      cupCurrentPosition.cup3.isClicked === false;

    if (userDidNotClick) {
      setGameRoundInfoText('You know you have to click, right?');
    } else if (userWin) {
      setGameRoundInfoText('OK');
    } else {
      setGameRoundInfoText('Come on, you can do better than that!');
    }

    await hold(1000);
    setGameRoundInfoText('');

    if (userWin === false) {
      minusLife();
      if (life > 1) {
        setGameState('losingRound');
      }
    } else {
      if (round === maxRound) {
        setGameState('victory');
        return;
      }
      addRound();
      setGameState('winningRound');
    }
  }

  return (
    <div className="relative">
      <GameInfoPanel />
      <GameMessageLayer
        state={gameState}
        setState={setGameState}
        closeModal={closeModal}
      />
      <div ref={setCanvasRef} className="w-full">
        <canvas
          ref={gameCanvas}
          className="w-full h-screen object-contain"
          onClick={onCanvasClick}
          onMouseMove={onCanvasMouseMove}
        />
      </div>
    </div>
  );
}

export const GameFrame = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <>
      <GamePlayProvider>
        <CupGameCanvas closeModal={closeModal} />
      </GamePlayProvider>
    </>
  );
};

export default GameFrame;

