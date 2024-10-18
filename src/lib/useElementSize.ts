import { useState, useEffect } from 'react';

type SetRef<T> = (node: T | null) => void;
type Width = number;
type Height = number;
type Size = [Width, Height];

export default function useElementSize<
  T extends HTMLElement = HTMLDivElement
>(): {
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

