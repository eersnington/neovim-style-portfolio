'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Theme } from '@/lib/themes';

type ThemeSwitcherProps = {
  themes: Theme[];
  currentThemeIndex: number;
  onSelectTheme: (index: number) => void;
  onClose: () => void;
  theme: {
    background: string;
    foreground: string;
    selection: string;
    accent: string;
  };
};

export function ThemeSwitcher({
  themes,
  currentThemeIndex,
  onSelectTheme,
  onClose,
  theme,
}: ThemeSwitcherProps) {
  const [focusedIndex, setFocusedIndex] = useState(currentThemeIndex);

  const handleKeyNavigation = useCallback(
    (key: string) => {
      if (key === 'ArrowDown' || key === 'j') {
        setFocusedIndex((prev) => Math.min(prev + 1, themes.length - 1));
        return true;
      }
      if (key === 'ArrowUp' || key === 'k') {
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        return true;
      }
      return false;
    },
    [themes.length]
  );

  const handleKeyAction = useCallback(
    (key: string) => {
      if (key === 'Escape') {
        onClose();
        return true;
      }
      if (key === 'Enter') {
        onSelectTheme(focusedIndex);
        return true;
      }
      return false;
    },
    [onClose, onSelectTheme, focusedIndex]
  );

  const shouldPreventDefault = useCallback((key: string) => {
    return ['ArrowDown', 'ArrowUp', 'j', 'k', 'Enter', 'Escape'].includes(key);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();

      if (shouldPreventDefault(e.key)) {
        e.preventDefault();
      }

      if (handleKeyAction(e.key)) {
        return;
      }
      handleKeyNavigation(e.key);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [shouldPreventDefault, handleKeyAction, handleKeyNavigation]);

  return (
    <div
      aria-labelledby="theme-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-md p-6 shadow-lg"
        style={{
          backgroundColor: theme.background,
          color: theme.foreground,
          border: `1px solid ${theme.accent}`,
        }}
      >
        <h2
          className="mb-4 pb-2 font-bold text-xl"
          id="theme-title"
          style={{ borderBottom: `1px solid ${theme.selection}` }}
        >
          Theme Selector
        </h2>

        <div className="grid gap-4">
          {themes.map((t, index) => (
            <button
              className="flex items-center justify-between rounded-md p-3 transition-colors"
              key={t.name}
              onClick={() => onSelectTheme(index)}
              onMouseEnter={() => setFocusedIndex(index)}
              style={{
                backgroundColor:
                  index === focusedIndex ? theme.selection : 'transparent',
                borderLeft: `2px solid ${
                  index === currentThemeIndex ? theme.accent : 'transparent'
                }`,
                outline: 'none',
              }}
              type="button"
            >
              <span className="font-medium">
                {index === currentThemeIndex && '✓ '}
                {t.name}
              </span>
              <div className="flex gap-2">
                <div
                  className="h-4 w-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: t.colors.background }}
                />
                <div
                  className="h-4 w-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: t.colors.accent }}
                />
                <div
                  className="h-4 w-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: t.colors.foreground }}
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            className="flex-1 rounded-md py-2 font-bold"
            onClick={onClose}
            style={{
              backgroundColor: theme.accent,
              color: theme.background,
            }}
            type="button"
          >
            Close
          </button>
          <div
            className="flex items-center rounded-md px-3 py-2 text-xs opacity-70"
            style={{ backgroundColor: theme.selection }}
          >
            Use ↑↓ and Enter to select
          </div>
        </div>
      </div>
    </div>
  );
}
