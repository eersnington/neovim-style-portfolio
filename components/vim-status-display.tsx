'use client';

import { memo } from 'react';
import type { VimStatusDisplayProps } from '@/lib/types';

export const VimStatusDisplay = memo(
  ({ mode, keyBuffer }: VimStatusDisplayProps) => (
    <div className="mt-8 text-center text-sm opacity-50">
      <span className="mr-4">MODE: {mode}</span>
      {keyBuffer && <span>KEYS: {keyBuffer}</span>}
    </div>
  )
);

VimStatusDisplay.displayName = 'VimStatusDisplay';
