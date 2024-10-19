import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

type ButtonProps = HTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button {...props} className={clsx('transition-all rounded', className)}>
      {children}
    </button>
  );
}

export function BlueButton({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      {...props}
      className={clsx(
        'bg-blue-500 hover:bg-blue-600 text-white border border-blue-500',
        className
      )}
    >
      {children}
    </Button>
  );
}

export function GrayButton({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      {...props}
      className={clsx(
        'bg-white text-gray-400 hover:text-gray-500 border border-gray-400',
        className
      )}
    >
      {children}
    </Button>
  );
}

