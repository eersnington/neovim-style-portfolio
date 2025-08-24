import { useCallback, useEffect, useRef, useState } from 'react';
import { KEYBOARD } from '@/lib/constants';
import type {
  UseKeyboardNavigationProps,
  UseKeyboardNavigationReturn,
} from '@/lib/types';
import {
  isDownKey,
  isEnterKey,
  isEscapeKey,
  isHelpKeybind,
  isInputTarget,
  isThemeToggleKeybind,
  isUpKey,
  preventNavigationDefaults,
  toVimKey,
} from '@/lib/utils/keyboard-utils';

/**
 * Hook for managing keyboard navigation and shortcuts
 * @param props - Configuration options for keyboard navigation
 * @returns Navigation state and keyboard event data
 */
export const useKeyboardNavigation = ({
  links,
  onLinkActivate,
  onToggleHelp,
  onToggleTheme,
  isModalOpen,
}: UseKeyboardNavigationProps): UseKeyboardNavigationReturn => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [keysPressed, setKeysPressed] = useState<readonly string[]>([]);
  const [keyBuffer, setKeyBuffer] = useState('');
  const keyBufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearKeyBuffer = useCallback(() => {
    setKeyBuffer('');
    if (keyBufferTimeoutRef.current) {
      clearTimeout(keyBufferTimeoutRef.current);
      keyBufferTimeoutRef.current = null;
    }
  }, []);

  const resetKeyboardState = useCallback(() => {
    setKeysPressed([]);
    clearKeyBuffer();
  }, [clearKeyBuffer]);

  const addKeyToBuffer = useCallback((key: string) => {
    const vimKey = toVimKey(key);

    setKeyBuffer((prev) => {
      if (prev.length > KEYBOARD.MAX_BUFFER_LENGTH) {
        return vimKey;
      }
      return prev + vimKey;
    });

    if (keyBufferTimeoutRef.current) {
      clearTimeout(keyBufferTimeoutRef.current);
    }

    keyBufferTimeoutRef.current = setTimeout(() => {
      setKeyBuffer('');
    }, KEYBOARD.KEY_BUFFER_TIMEOUT);
  }, []);

  const addKeyPressed = useCallback((key: string) => {
    setKeysPressed((prev) => {
      const newKeys = [...prev, key];
      if (newKeys.length > KEYBOARD.MAX_KEYS_PRESSED) {
        return newKeys.slice(newKeys.length - KEYBOARD.MAX_KEYS_PRESSED);
      }
      return newKeys;
    });
  }, []);

  const handleNavigation = useCallback(
    (key: string) => {
      if (isDownKey(key)) {
        setSelectedIndex((prev) => Math.min(prev + 1, links.length - 1));
      } else if (isUpKey(key)) {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    [links.length]
  );

  const handleLinkActivation = useCallback(
    (key: string) => {
      if (isEnterKey(key)) {
        const selectedLink = links[selectedIndex];
        if (selectedLink) {
          onLinkActivate(selectedLink);
        }
      }
    },
    [links, selectedIndex, onLinkActivate]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModalOpen || isInputTarget(event.target)) {
        return;
      }

      preventNavigationDefaults(event);

      const { key } = event;

      if (isHelpKeybind(event)) {
        event.preventDefault();
        onToggleHelp();
        return;
      }

      if (isThemeToggleKeybind(event)) {
        event.preventDefault();
        onToggleTheme();
        return;
      }

      if (isEscapeKey(key)) {
        event.preventDefault();
        resetKeyboardState();
        return;
      }

      addKeyPressed(key);
      addKeyToBuffer(key);
      handleNavigation(key);
      handleLinkActivation(key);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyBufferTimeoutRef.current) {
        clearTimeout(keyBufferTimeoutRef.current);
      }
    };
  }, [
    isModalOpen,
    onToggleHelp,
    onToggleTheme,
    resetKeyboardState,
    addKeyPressed,
    addKeyToBuffer,
    handleNavigation,
    handleLinkActivation,
  ]);

  useEffect(() => {
    if (isModalOpen) {
      return;
    }

    const keysString = keysPressed.join('');

    for (const link of links) {
      if (keysString.endsWith(link.keybind)) {
        onLinkActivate(link);
        resetKeyboardState();
        break;
      }
    }
  }, [keysPressed, links, onLinkActivate, resetKeyboardState, isModalOpen]);

  return {
    selectedIndex,
    keyBuffer,
    keysPressed,
  };
};
