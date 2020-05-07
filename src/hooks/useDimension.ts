import { useState, useCallback, useLayoutEffect } from 'react';

type Dimension = {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  x?: number;
  y?: number;
  right?: number;
  bottom?: number;
};

function getDimensionObject(node: HTMLElement): Dimension {
  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    x: rect.x,
    y: rect.y,
    right: rect.right,
    bottom: rect.bottom,
  };
}

type UseDimensionOptionType = {
  liveMeasure?: boolean;
  scrollEvent?: boolean;
};

export default function useDimension(options: UseDimensionOptionType = { liveMeasure: false, scrollEvent: false }) {
  const [dimensions, setDimensions] = useState<Dimension>({});
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      const measure = () => window.requestAnimationFrame(() => setDimensions(getDimensionObject(node)));
      measure();

      if (options.liveMeasure) {
        window.addEventListener('resize', measure);
        if (options.scrollEvent) window.addEventListener('scroll', measure);

        return () => {
          window.removeEventListener('resize', measure);
          if (options.scrollEvent) window.removeEventListener('scroll', measure);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  return [ref, dimensions] as [typeof ref, typeof dimensions];
}
