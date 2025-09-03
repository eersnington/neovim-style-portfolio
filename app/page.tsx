'use client';

import { useCallback, useEffect, useState } from 'react';
import { AsciiTitle } from '@/components/ascii-title';
import { BackgroundTildes } from '@/components/background-tildes';
import { KeybindHelp } from '@/components/keybind-help';
import { LineNumbers } from '@/components/line-numbers';
import { NavigationLinks } from '@/components/navigation-links';
import { StatusLine } from '@/components/status-line';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { VimStatusDisplay } from '@/components/vim-status-display';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { useModalState } from '@/hooks/use-modal-state';
import { useThemeManager } from '@/hooks/use-theme-manager';
import config from '@/lib/config';
import { DEFAULTS, LAYOUT } from '@/lib/constants';

const DEFAULT_WINDOW_HEIGHT = 800;

import { themes } from '@/lib/themes';
import type { Link } from '@/lib/types';

export default function Home() {
  const { currentTheme, currentThemeIndex, setTheme } = useThemeManager();
  const {
    showHelp,
    showThemeSwitcher,
    toggleHelp,
    toggleThemeSwitcher,
    closeModals,
    isAnyModalOpen,
  } = useModalState();

  const handleLinkActivate = useCallback((link: Link) => {
    if (typeof window !== 'undefined') {
      window.open(link.url, '_blank');
    }
  }, []);

  const { selectedIndex, keyBuffer, setSelectedIndex } = useKeyboardNavigation({
    links: config.links,
    onLinkActivate: handleLinkActivate,
    onToggleHelp: toggleHelp,
    onToggleTheme: toggleThemeSwitcher,
    isModalOpen: isAnyModalOpen,
  });

  const [windowHeight, setWindowHeight] = useState(DEFAULT_WINDOW_HEIGHT);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);

      const handleResize = () => {
        setWindowHeight(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const theme = currentTheme.colors;

  return (
    <div
      className="relative flex min-h-screen flex-col font-mono text-sm"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
      }}
    >
      <LineNumbers
        color={theme.lineNumbers}
        count={Math.floor(
          (windowHeight - LAYOUT.STATUS_LINE_HEIGHT) / LAYOUT.LINE_HEIGHT
        )}
        currentLine={DEFAULTS.LINE}
      />

      <main
        className="relative p-4 pl-12"
        style={{ height: `calc(100vh - ${LAYOUT.STATUS_LINE_HEIGHT}px)` }}
      >
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6">
          <AsciiTitle color={theme.accent} />

          <div
            className="mb-8 px-4 py-2 text-center text-lg"
            style={{
              backgroundColor: theme.selection,
              color: theme.foreground,
            }}
          >
            {config.subtitle} <span className="animate-pulse text-xl">▲</span>
          </div>

          <NavigationLinks
            links={config.links}
            onLinkActivate={handleLinkActivate}
            onSelectIndex={setSelectedIndex}
            selectedIndex={selectedIndex}
            theme={theme}
          />

          <VimStatusDisplay keyBuffer={keyBuffer} mode={DEFAULTS.MODE} />
        </div>

        <BackgroundTildes color={theme.lineNumbers} />
      </main>

      <StatusLine
        currentTheme={currentTheme.name}
        file={DEFAULTS.FILE}
        filetype={DEFAULTS.FILETYPE}
        helpText="Press Shift + ? for help | Shift + T for themes"
        mode={DEFAULTS.MODE}
        position={{ line: DEFAULTS.LINE, col: DEFAULTS.COLUMN }}
        theme={theme}
      />

      {showHelp && (
        <KeybindHelp
          keybinds={config.keybinds}
          links={config.links}
          onClose={closeModals}
          theme={theme}
        />
      )}

      {showThemeSwitcher && (
        <ThemeSwitcher
          currentThemeIndex={currentThemeIndex}
          onClose={closeModals}
          onSelectTheme={setTheme}
          theme={theme}
          themes={themes}
        />
      )}
    </div>
  );
}
