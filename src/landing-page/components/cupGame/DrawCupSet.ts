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
};
type DrawCupPathArg = DrawPathArg;
type DrawCupShadowPathArg = DrawPathArg & { xOffset: number };
type DrawBallPath = {
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
};
type DrawBallPathArg = DrawBallPath;

export default function SetupDrawingCupSet({
  cupHeight,
  cupTopWidth,
  cupBottomWidth,
  cupShadowHeight,
}: SetupDrawingCupArg) {
  const widthDifference = Math.abs(cupBottomWidth - cupTopWidth);
  const curve = 10;
  const ballWidth = 20;
  const rotateSettings = {
    max: 60,
    min: 0,
  };
  const shadowAlpha = {
    min: 0.3,
    max: 0.4,
  };
  // for cup rotate
  const scale = {
    min: 0.6,
  };

  const drawCupSet = ({ x, y, ctx, rotate, hasBall }: DrawCupSetArg) => {
    ctx.save();

    // draw ball shadow
    if (hasBall) {
      drawBallShadowPath({ x, y, ctx });
    }

    rotate =
      Math.max(rotateSettings.min, Math.min(rotateSettings.max, rotate)) * -1;
    const rotateStepPercentage = (Math.abs(rotate) - rotateSettings.min) / 60;

    const hasRotate = rotate !== 0;
    const [pathX, pathY] = hasRotate ? [0, 0] : [x, y];

    // draw cup shadow
    ctx.globalAlpha = shadowAlpha.max;
    if (hasRotate) {
      ctx.globalAlpha =
        shadowAlpha.max - shadowAlpha.min * rotateStepPercentage;

      // move canvas
      ctx.translate(x, y);

      const shadowRotate = (Math.PI / 180) * 10 * rotateStepPercentage * -1;
      ctx.rotate(shadowRotate);

      const shadowScale = 1 - (1 - scale.min) * rotateStepPercentage;
      ctx.scale(shadowScale, shadowScale);

      // shadow skew
      ctx.transform(
        1,
        0,
        Math.tan((Math.PI / 180) * rotate * -1 * rotateStepPercentage),
        1,
        0,
        0
      );
    }

    const cupShadow = drawCupShadowPath({
      x: pathX,
      y: pathY,
      height: cupShadowHeight,
      xOffset: 50,
    });
    ctx.fillStyle = '#999';
    ctx.fill(cupShadow);
    ctx.restore();

    // draw ball
    if (hasBall) {
      drawBallPath({ x, y, ctx });
    }

    // draw cup
    if (hasRotate) {
      ctx.translate(x, y);
      ctx.rotate((Math.PI / 180) * rotate);
    }

    const cup = drawCupPath({
      x: pathX,
      y: pathY,
      height: cupHeight,
    });
    ctx.fillStyle = '#FFA500';
    ctx.fill(cup);

    ctx.restore();

    return {};
  };

  const drawBallShadowPath = ({ x, y, ctx }: DrawBallPathArg) => {
    ctx.save();
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
    ctx.fillStyle = 'gray';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };

  const drawBallPath = ({ x, y, ctx }: DrawBallPathArg) => {
    ctx.beginPath();
    ctx.arc(x + cupBottomWidth / 2, y - 20, ballWidth, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
  };

  const drawCupPath = ({ x, y, height }: DrawCupPathArg) => {
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
      y + curve,
      rightBottomX,
      rightBottomY + curve,
      rightBottomX,
      rightBottomY
    );
    cup.lineTo(rightTopX, rightTopY);
    cup.bezierCurveTo(
      rightTopX,
      rightTopY - curve,
      leftTopX,
      leftTopY - curve,
      leftTopX,
      leftTopY
    );
    return cup;
  };

  const drawCupShadowPath = ({
    x,
    y,
    height,
    xOffset,
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
      y + curve,
      rightBottomX,
      rightBottomY + curve,
      rightBottomX,
      rightBottomY
    );
    cup.lineTo(rightTopX, rightTopY);
    cup.bezierCurveTo(
      rightTopX + curve,
      rightTopY - curve,
      leftTopX + curve,
      leftTopY - curve,
      leftTopX,
      leftTopY
    );
    return cup;
  };

  return {
    drawCupSet,
  };
}

