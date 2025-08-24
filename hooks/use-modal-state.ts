import { useCallback, useState } from 'react';
import type { UseModalStateReturn } from '@/lib/types';

/**
 * Hook for managing modal visibility states
 * @returns Modal state and control functions
 */
export const useModalState = (): UseModalStateReturn => {
  const [showHelp, setShowHelp] = useState(false);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

  const toggleHelp = useCallback(() => {
    setShowHelp((prev) => !prev);
    setShowThemeSwitcher(false);
  }, []);

  const toggleThemeSwitcher = useCallback(() => {
    setShowThemeSwitcher((prev) => !prev);
    setShowHelp(false);
  }, []);

  const closeModals = useCallback(() => {
    setShowHelp(false);
    setShowThemeSwitcher(false);
  }, []);

  const isAnyModalOpen = showHelp || showThemeSwitcher;

  return {
    showHelp,
    showThemeSwitcher,
    toggleHelp,
    toggleThemeSwitcher,
    closeModals,
    isAnyModalOpen,
  };
};
