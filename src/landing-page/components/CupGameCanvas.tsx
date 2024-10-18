import { useRef, useState, useEffect } from 'react';

type SetRef<T> = (node: T | null) => void;
type Width = number;
type Height = number;
type Size = [Width, Height];

function useElementSize<T extends HTMLElement = HTMLDivElement>(): {
  setRef: SetRef<T>;
  size: Size;
} {
  const [size, setSize] = useState<Size>([0, 0]);
  const [ref, setRef] = useState<T | null>(null);
  useEffect(() => {
    if (ref === null) return;
    const element = ref;
    const handleResize = () => {
      const { width: canvasWidth, height: canvasHeight } =
        element.getBoundingClientRect();
      requestAnimationFrame(() => setSize([canvasWidth, canvasHeight]));
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return { size, setRef };
}

const drawCupPath = ({
  x,
  y,
  height,
  topWidth,
  bottomWidth,
}: {
  x: number;
  y: number;
  height: number;
  topWidth: number;
  bottomWidth: number;
}) => {
  let cup = new Path2D();
  cup.moveTo(x, y);
  cup.quadraticCurveTo(x + topWidth, y, x + topWidth, y);
  cup.lineTo(x + topWidth + (bottomWidth - topWidth) / 2, y + height);
  cup.lineTo(x - (bottomWidth - topWidth) / 2, y + height);
  return cup;
};

const drawCupShadowPath = ({
  x,
  y,
  height,
  topWidth,
  bottomWidth,
}: {
  x: number;
  y: number;
  height: number;
  topWidth: number;
  bottomWidth: number;
}) => {
  let cup = new Path2D();
  cup.moveTo(x, y);
  cup.quadraticCurveTo(x + topWidth, y, x + topWidth, y);
  cup.lineTo(x + topWidth + (bottomWidth - topWidth) / 2, y + height);
  cup.lineTo(x - (bottomWidth - topWidth) / 2, y + height);
  return cup;
};

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

  function draw({ ctx }: { ctx: CanvasRenderingContext2D }) {
    const cupHeight = 120;
    const cupTopWidth = 80;
    const cupBottomWidth = 100;

    const [canvasWidth, canvasHeight] = canvasSize;

    const topLeftX = (canvasWidth / 7) * 2 - cupBottomWidth / 2;
    const topLeftY = (canvasHeight / 5) * 1;

    const topRightX = (canvasWidth / 7) * 5 - cupBottomWidth / 2;
    const topRightY = (canvasHeight / 5) * 1;

    const bottomX = (canvasWidth - cupBottomWidth) / 2;
    const bottomY = (canvasHeight / 5) * 3;

    // const a = 50
    const cup1 = drawCupPath({
      x: topLeftX,
      y: topLeftY,
      height: cupHeight,
      topWidth: cupTopWidth,
      bottomWidth: cupBottomWidth,
    });
    const cup2 = drawCupPath({
      x: topRightX,
      y: topRightY,
      height: cupHeight,
      topWidth: cupTopWidth,
      bottomWidth: cupBottomWidth,
    });
    const cup3 = drawCupPath({
      x: bottomX,
      y: bottomY,
      height: cupHeight,
      topWidth: cupTopWidth,
      bottomWidth: cupBottomWidth,
    });
    ctx.fillStyle = '#FFA500';
    ctx.fill(cup1);
    ctx.fill(cup2);
    ctx.fill(cup3);
  }

  // function listenClickEventOnCanvasPath({
  //   canvas,
  //   ctx,
  //   path,
  //   callback,
  // }: {
  //   canvas: HTMLCanvasElement;
  //   ctx: CanvasRenderingContext2D;
  //   path: CanvasFillRule;
  //   callback: (event: MouseEvent) => void;
  // }) {
  //   canvas.addEventListener('click', function (event: MouseEvent) {
  //     if (ctx.isPointInPath(event.offsetX, event.offsetY, path)) {
  //       callback(event);
  //     }
  //   });
  // }

  useEffect(() => {
    const canvas = gameCanvas.current;
    if (canvas === null || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return;

    updateCanvasSize({ canvas, ctx });

    ctx.fillStyle = '#FBFBF4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    draw({ ctx });
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
