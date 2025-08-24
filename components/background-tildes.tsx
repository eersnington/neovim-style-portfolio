'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { LAYOUT } from '@/lib/constants';
import type { BackgroundTildesProps } from '@/lib/types';

export const BackgroundTildes = memo(
  ({ color }: Omit<BackgroundTildesProps, 'lineCount'>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dynamicLineCount, setDynamicLineCount] = useState(0);

    useEffect(() => {
      const calculateLineCount = () => {
        if (containerRef.current) {
          const containerHeight = containerRef.current.clientHeight;
          const calculatedLines = Math.floor(
            containerHeight / LAYOUT.LINE_HEIGHT
          );
          setDynamicLineCount(calculatedLines);
        }
      };

      calculateLineCount();
      window.addEventListener('resize', calculateLineCount);
      return () => window.removeEventListener('resize', calculateLineCount);
    }, []);

    return (
      <div
        className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden font-bold text-lg"
        ref={containerRef}
      >
        {Array.from({ length: dynamicLineCount }, (_, i) => (
          <div
            className="h-6 select-none"
            key={`tilde-line-${i + 1}`}
            style={{ color }}
          >
            ~
          </div>
        ))}
      </div>
    );
  }
);

BackgroundTildes.displayName = 'BackgroundTildes';
