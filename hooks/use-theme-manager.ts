import { useCallback, useState } from 'react';
import { defaultTheme, themes } from '@/lib/themes';
import type { UseThemeManagerProps, UseThemeManagerReturn } from '@/lib/types';

/**
 * Hook for managing theme selection and state
 * @param props - Configuration options for the theme manager
 * @returns Theme state and control functions
 */
export const useThemeManager = ({
  themes: availableThemes = themes,
  defaultThemeIndex = 0,
}: UseThemeManagerProps = {}): UseThemeManagerReturn => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(defaultThemeIndex);
  const currentTheme = availableThemes[currentThemeIndex] ?? defaultTheme;

  const setTheme = useCallback(
    (index: number) => {
      if (index >= 0 && index < availableThemes.length) {
        setCurrentThemeIndex(index);
      }
    },
    [availableThemes.length]
  );

  return {
    currentTheme,
    currentThemeIndex,
    setTheme,
  };
};
