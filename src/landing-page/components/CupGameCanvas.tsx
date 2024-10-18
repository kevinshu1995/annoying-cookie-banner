import { useRef, useEffect } from 'react';
import SetupDrawingCupSet from './cupGame/DrawCupSet';
import useElementSize from '@/lib/useElementSize';

export default function CupGameCanvas() {
  const gameCanvas = useRef<HTMLCanvasElement>(null);
  const { size: canvasSize, setRef: setCanvasRef } = useElementSize();

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

  function drawEverything({ ctx }: { ctx: CanvasRenderingContext2D }) {
    // background color
    ctx.fillStyle = '#FBFBF4';
    ctx.fillRect(0, 0, canvasSize[0], canvasSize[1]);

    const cupHeight = 120;
    const cupTopWidth = 80;
    const cupBottomWidth = 100;

    const { drawCupSet } = SetupDrawingCupSet({
      cupHeight,
      cupTopWidth,
      cupBottomWidth,
      cupShadowHeight: cupHeight / 3,
    });

    const [canvasWidth, canvasHeight] = canvasSize;

    const topLeftCupX = (canvasWidth / 7) * 2 - cupBottomWidth / 2;
    const topLeftCupY = (canvasHeight / 5) * 2;
    drawCupSet({ x: topLeftCupX, y: topLeftCupY, rotate: 0, ctx });

    const topRightCupX = (canvasWidth / 7) * 5 - cupBottomWidth / 2;
    const topRightCupY = (canvasHeight / 5) * 2;
    drawCupSet({ x: topRightCupX, y: topRightCupY, rotate: 0, ctx });

    const bottomCupX = (canvasWidth - cupBottomWidth) / 2;
    const bottomCupY = (canvasHeight / 5) * 4;
    drawCupSet({ x: bottomCupX, y: bottomCupY, rotate: 0, ctx });
  }

  useEffect(() => {
    const canvas = gameCanvas.current;
    if (canvas === null || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return;

    updateCanvasSize({ canvas, ctx });

    drawEverything({ ctx });
  }, [gameCanvas.current, canvasSize]);

  return (
    <div ref={setCanvasRef} className="w-full">
      <canvas
        ref={gameCanvas}
        className="w-full h-[400px] border border-black object-contain"
      />
    </div>
  );
}

