import { useRef, useEffect } from 'react';
import SetupDrawingCupSet from './cupGame/DrawCupSet';
import GameInfoPanel from './cupGame/GameInfoPanel';
import useElementSize from '@/lib/useElementSize';
import { GameMessageLayer, useGameMessage } from './cupGame/GameMessageLayer';

type DrawEverythingArg = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
};

function hold(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function CupGameCanvas() {
  const gameCanvas = useRef<HTMLCanvasElement>(null);
  const { size: canvasSize, setRef: setCanvasRef } = useElementSize();
  const cupHeight = 120;
  const cupTopWidth = 80;
  const cupBottomWidth = 100;

  const { gameState, setGameState } = useGameMessage();

  const cupCurrentPosition = {
    cup1: { x: 0, y: 0 },
    cup2: { x: 0, y: 0 },
    cup3: { x: 0, y: 0, rotate: 0 },
  };

  function getCupPositions() {
    const [canvasWidth, canvasHeight] = canvasSize;
    if (canvasWidth === 0 || canvasHeight === 0) {
      return {
        topLeft: {
          x: 0,
          y: 0,
        },
        topRight: {
          x: 0,
          y: 0,
        },
        bottom: {
          x: 0,
          y: 0,
          rotate: 0,
        },
      };
    }
    return {
      topLeft: {
        x: (canvasWidth / 7) * 2 - cupBottomWidth / 2,
        y: (canvasHeight / 5) * 2,
      },
      topRight: {
        x: (canvasWidth / 7) * 5 - cupBottomWidth / 2,
        y: (canvasHeight / 5) * 2,
      },
      bottom: {
        x: (canvasWidth - cupBottomWidth) / 2,
        y: (canvasHeight / 5) * 4,
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
    console.log('drawEverything rotate', cupCurrentPosition.cup3.rotate);
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

    drawCupSet({
      x: cupCurrentPosition.cup1.x,
      y: cupCurrentPosition.cup1.y,
      rotate: 0,
      ctx,
    });

    drawCupSet({
      x: cupCurrentPosition.cup2.x,
      y: cupCurrentPosition.cup2.y,
      rotate: 0,
      ctx,
    });

    drawCupSet({
      x: cupCurrentPosition.cup3.x,
      y: cupCurrentPosition.cup3.y,
      rotate: cupCurrentPosition.cup3.rotate,
      ctx,
      hasBall: true,
      log: true,
    });
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
        const canvas = gameCanvas.current;
        if (canvas === null || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        if (ctx === null) return;

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

  function toggleDisplayTheBall() {
    initCupState();
    return new Promise<void>(resolve => {
      let startTime: number;
      const beforeRotateDegree = cupCurrentPosition.cup3.rotate;
      const targetRotateDegree = beforeRotateDegree === 0 ? 60 : 0;

      function animate(time: number) {
        const canvas = gameCanvas.current;
        if (canvas === null || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        if (ctx === null) return;

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

  async function moveCupSeveralTimes(times: number) {
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
      await moveCup(firstCup, secondCup);
      await move(times - 1);
    }
    await move(times);
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

  // Step 3 - game flow start
  useEffect(() => {
    if (gameState === 'countdown') {
      // reset game states
      return;
    }

    if (gameState === 'gameStart') {
      // game start
      (async () => {
        await toggleDisplayTheBall();
        await hold(1500);
        await toggleDisplayTheBall();
        await hold(1000);
        await moveCupSeveralTimes(10);
        // await toggleDisplayTheBall();
      })();
    }
  }, [gameState]);

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full p-4 flex items-center">
        <GameInfoPanel />
      </div>
      <GameMessageLayer state={gameState} setState={setGameState} />
      <div ref={setCanvasRef} className="w-full">
        <canvas ref={gameCanvas} className="w-full h-screen object-contain" />
      </div>
    </div>
  );
}

export const GameFrame = () => {
  return (
    <>
      <CupGameCanvas />
    </>
  );
};

export default GameFrame;

