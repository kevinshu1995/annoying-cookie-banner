import { IconHeart, IconHeartFill } from './../Icon/IconHeart';
import { IconX } from './../Icon/IconX';
import clsx from 'clsx';

export const GameHeart = ({ isFilled = true }: { isFilled: boolean }) => {
  return (
    <div className="relative">
      <IconX
        strokeWidth={1.5}
        className={clsx(
          'text-gray-400 w-12 h-12 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 pb-px',
          isFilled && 'hidden'
        )}
      />
      <IconHeart
        className={clsx('text-gray-400 w-8 h-8', isFilled && 'hidden')}
      />
      <IconHeartFill
        className={clsx('text-red-500 w-8 h-8', !isFilled && 'hidden')}
      />
    </div>
  );
};

