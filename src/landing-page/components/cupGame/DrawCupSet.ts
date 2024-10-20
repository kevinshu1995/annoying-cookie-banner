import useCheater from '@/lib/useCheater';

type SetupDrawingCupArg = {
  cupHeight: number;
  cupTopWidth: number;
  cupBottomWidth: number;
  cupShadowHeight: number;
};
type DrawCupSetArg = {
  x: number;
  y: number;
  rotate: number;
  ctx: CanvasRenderingContext2D;
  hasBall?: boolean;
};
type DrawPathArg = {
  x: number;
  y: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  color: string;
};
type DrawCupPathArg = DrawPathArg;
type DrawCupShadowPathArg = DrawPathArg & { xOffset: number };
type DrawBallPath = {
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
  color: string;
};
type DrawBallPathArg = DrawBallPath;

export default function SetupDrawingCupSet({
  cupHeight,
  cupTopWidth,
  cupBottomWidth,
  cupShadowHeight,
}: SetupDrawingCupArg) {
  const { isCheaterModeActivate } = useCheater();
  const widthDifference = Math.abs(cupBottomWidth - cupTopWidth);
  const cupBezierCurve = 10;
  const ballWidth = 20;
  const rotateSettings = {
    max: 60,
    min: 0,
  };
  const shadowAlpha = {
    min: 0.3,
    max: 0.4,
  };

  const drawCupSet = ({ x, y, ctx, rotate, hasBall }: DrawCupSetArg) => {
    ctx.save();

    const fixedRotate =
      Math.max(rotateSettings.min, Math.min(rotateSettings.max, rotate)) * -1;
    const rotateStepPercentage =
      (Math.abs(fixedRotate) - rotateSettings.min) / 60;
    const hasRotate = rotate !== 0;
    const [cupX, cupY] = hasRotate ? [0, 0] : [x, y];

    // draw ball shadow
    if (hasBall) {
      drawBallShadowPath({ x, y, ctx, color: 'gray' });
      ctx.restore();
      ctx.save();
    }

    // draw cup shadow
    ctx.globalAlpha = shadowAlpha.max;
    if (hasRotate) {
      ctx.globalAlpha =
        shadowAlpha.max - shadowAlpha.min * rotateStepPercentage;

      // move canvas
      ctx.translate(x, y);

      const shadowRotate = (Math.PI / 180) * 10 * rotateStepPercentage * -1;
      ctx.rotate(shadowRotate);

      const scale = {
        min: 0.6,
      };
      const shadowScale = 1 - (1 - scale.min) * rotateStepPercentage;
      ctx.scale(shadowScale, shadowScale);

      // shadow skew
      ctx.transform(
        1,
        0,
        Math.tan((Math.PI / 180) * fixedRotate * -1 * rotateStepPercentage),
        1,
        0,
        0
      );
    }
    drawCupShadowPath({
      x: cupX,
      y: cupY,
      height: cupShadowHeight,
      xOffset: 50,
      color: '#999',
      ctx,
    });
    ctx.restore();
    ctx.save();

    // draw ball
    if (hasBall) {
      drawBallPath({ x, y, ctx, color: '#dc2626' });
      ctx.restore();
      ctx.save();
    }

    // draw cup
    if (hasRotate) {
      ctx.translate(x, y);
      ctx.rotate((Math.PI / 180) * fixedRotate);
    }
    // cheat mode
    if (isCheaterModeActivate('transparent')) {
      ctx.globalAlpha = 0.3;
    }
    drawCupPath({
      x: cupX,
      y: cupY,
      height: cupHeight,
      color: '#FFA500',
      ctx,
    });
    ctx.restore();
    ctx.save();

    return {};
  };

  const drawBallShadowPath = ({ x, y, ctx, color }: DrawBallPathArg) => {
    ctx.beginPath();
    ctx.ellipse(
      x + cupBottomWidth / 2,
      y,
      ballWidth / 4,
      (ballWidth / 7) * 6,
      Math.PI / 2,
      0,
      Math.PI * 2
    );
    ctx.globalAlpha = shadowAlpha.max;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  };

  const drawBallPath = ({ x, y, ctx, color }: DrawBallPathArg) => {
    ctx.beginPath();
    ctx.arc(x + cupBottomWidth / 2, y - 20, ballWidth, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  };

  const drawCupPath = ({ x, y, height, ctx, color }: DrawCupPathArg) => {
    const cup = new Path2D();
    const [rightBottomX, rightBottomY] = [x + cupBottomWidth, y];
    const [rightTopX, rightTopY] = [
      x + cupTopWidth + widthDifference / 2,
      y - height,
    ];
    const [leftTopX, leftTopY] = [x + widthDifference / 2, y - height];
    cup.moveTo(x, y); // draw line from left bottom counterclockwise
    cup.bezierCurveTo(
      x,
      y + cupBezierCurve,
      rightBottomX,
      rightBottomY + cupBezierCurve,
      rightBottomX,
      rightBottomY
    );
    cup.lineTo(rightTopX, rightTopY);
    cup.bezierCurveTo(
      rightTopX,
      rightTopY - cupBezierCurve,
      leftTopX,
      leftTopY - cupBezierCurve,
      leftTopX,
      leftTopY
    );

    ctx.fillStyle = color;
    ctx.fill(cup);
    return cup;
  };

  const drawCupShadowPath = ({
    x,
    y,
    height,
    xOffset,
    color,
    ctx,
  }: DrawCupShadowPathArg) => {
    const cup = new Path2D();
    const [rightBottomX, rightBottomY] = [x + cupBottomWidth, y];
    const [rightTopX, rightTopY] = [
      x + cupTopWidth + widthDifference / 2 + xOffset,
      y - height,
    ];
    const [leftTopX, leftTopY] = [
      x + widthDifference / 2 + xOffset,
      y - height,
    ];
    cup.moveTo(x, y); // draw line from left bottom counterclockwise
    cup.bezierCurveTo(
      x,
      y + cupBezierCurve,
      rightBottomX,
      rightBottomY + cupBezierCurve,
      rightBottomX,
      rightBottomY
    );
    cup.lineTo(rightTopX, rightTopY);
    cup.bezierCurveTo(
      rightTopX + cupBezierCurve,
      rightTopY - cupBezierCurve,
      leftTopX + cupBezierCurve,
      leftTopY - cupBezierCurve,
      leftTopX,
      leftTopY
    );

    ctx.fillStyle = color;
    ctx.fill(cup);
    return cup;
  };

  return {
    drawCupSet,
  };
}

