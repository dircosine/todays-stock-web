import useDimension from './useDimension';
import { useEffect, useState } from 'react';

export default function useMobileLayoutCheck() {
  const [isMobile, setIsMobile] = useState(false);
  const [ref, { width }] = useDimension();

  useEffect(() => {
    if (!width) return;
    if (width >= 768) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, [width]);

  return [ref, isMobile] as [typeof ref, boolean];
}
