'use client';

import { useEffect, useState } from 'react';

type KeystrokeDisplayProps = {
  keyBuffer: string;
  theme: {
    background: string;
    foreground: string;
    selection: string;
  };
};

const DISPLAY_TIMEOUT = 1500;

export function KeystrokeDisplay({ keyBuffer, theme }: KeystrokeDisplayProps) {
  const [visible, setVisible] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (keyBuffer) {
      setDisplayText(keyBuffer);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, DISPLAY_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [keyBuffer]);

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
      <div
        className="rounded-md px-6 py-3 font-mono text-2xl"
        style={{
          backgroundColor: `${theme.selection}99`, // Add transparency
          color: theme.foreground,
          border: `1px solid ${theme.foreground}33`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        {displayText}
      </div>
    </div>
  );
}
