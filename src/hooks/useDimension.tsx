import { useState, useCallback, useLayoutEffect, Ref } from 'react';

function getDimensionObject(node: any) {
  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: 'x' in rect ? rect.x : rect.top,
    left: 'y' in rect ? rect.y : rect.left,
    x: 'x' in rect ? rect.x : rect.left,
    y: 'y' in rect ? rect.y : rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };
}

function useDimension({ liveMeasure = false, scrollEvent = true }) {
  const [dimensions, setDimensions] = useState({});
  const [node, setNode] = useState(null);

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      const measure = () => window.requestAnimationFrame(() => setDimensions(getDimensionObject(node)));
      measure();

      if (liveMeasure) {
        window.addEventListener('resize', measure);
        if (scrollEvent) window.addEventListener('scroll', measure);

        return () => {
          window.removeEventListener('resize', measure);
          if (scrollEvent) window.removeEventListener('scroll', measure);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  return [ref, dimensions, node] as [any, { [key: string]: number }, any];
}

export default useDimension;
