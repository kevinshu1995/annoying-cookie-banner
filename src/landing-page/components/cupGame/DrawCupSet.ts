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
};
type DrawPathArg = {
  x: number;
  y: number;
  height: number;
};
type DrawCupPathArg = DrawPathArg;
type DrawCupShadowPathArg = DrawPathArg & { xOffset: number };

export default function SetupDrawingCupSet({
  cupHeight,
  cupTopWidth,
  cupBottomWidth,
  cupShadowHeight,
}: SetupDrawingCupArg) {
  const widthDifference = Math.abs(cupBottomWidth - cupTopWidth);
  const curve = 10;

  const drawCupSet = ({ x, y, ctx, rotate }: DrawCupSetArg) => {
    const rotateSettings = {
      max: 60,
      min: 0,
    };
    const shadowAlpha = {
      min: 0.3,
      max: 0.4,
    };
    const scale = {
      min: 0.6,
    };

    rotate =
      Math.max(rotateSettings.min, Math.min(rotateSettings.max, rotate)) * -1;
    const rotateStepPercentage = (Math.abs(rotate) - rotateSettings.min) / 60;

    const hasRotate = rotate !== 0;
    const [pathX, pathY] = hasRotate ? [0, 0] : [x, y];

    ctx.restore();
    ctx.save();

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

    ctx.save();

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

