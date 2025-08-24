'use client';

import { memo } from 'react';
import { LAYOUT } from '@/lib/constants';
import type { BackgroundTildesProps } from '@/lib/types';

export const BackgroundTildes = memo(
  ({ lineCount = LAYOUT.LINE_COUNT, color }: BackgroundTildesProps) => (
    <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
      {Array.from({ length: lineCount }, (_, i) => (
        <div
          className="h-6 select-none opacity-50"
          key={`tilde-line-${i + 1}`}
          style={{ color }}
        >
          ~
        </div>
      ))}
    </div>
  )
);

BackgroundTildes.displayName = 'BackgroundTildes';
