'use client';

import { Github, Linkedin, Mail, Twitter, Youtube } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AsciiTitle } from '@/components/ascii-title';
import { KeybindHelp } from '@/components/keybind-help';
import { LineNumbers } from '@/components/line-numbers';
import { StatusLine } from '@/components/status-line';
import { ThemeSwitcher } from '@/components/theme-switcher';
import config from '@/lib/config';
import { defaultTheme, type Theme, themes } from '@/lib/themes';

const MAX_KEYS_PRESSED = 5;
const KEY_BUFFER_TIMEOUT = 1500;

export default function Home() {
  const [keysPressed, setKeysPressed] = useState<string[]>([]);
  const [keyBuffer, setKeyBuffer] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState('NORMAL');
  const [currentFile, setCurrentFile] = useState('~/index.html');
  const [currentLine, setCurrentLine] = useState(1);
  const [currentCol, setCurrentCol] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const keyBufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get icon component based on link id
  const getIconForLink = (id: string) => {
    switch (id) {
      case 'github':
        return <Github className="size-6" />;
      case 'twitter':
        return <Twitter className="size-6" />;
      case 'linkedin':
        return <Linkedin className="size-6" />;
      case 'youtube':
        return <Youtube className="size-6" />;
      case 'email':
        return <Mail className="size-6" />;
      default:
        return null;
    }
  };

  // Set a specific theme
  const setTheme = (index: number) => {
    setCurrentThemeIndex(index);
    setCurrentTheme(themes[index]);
    setShowThemeSwitcher(false);
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip handling if modals are open
      if (showThemeSwitcher || showHelp) {
        return;
      }

      // Don't capture keys if in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Prevent default for navigation keys
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Add the key to the keys pressed array
      setKeysPressed((prev) => {
        const newKeys = [...prev, e.key];
        // Only keep the last 5 keys
        if (newKeys.length > MAX_KEYS_PRESSED) {
          return newKeys.slice(newKeys.length - MAX_KEYS_PRESSED);
        }
        return newKeys;
      });

      // Update key buffer for display - reset it first to avoid growing
      setKeyBuffer((prev) => {
        // Map arrow keys to vim-style notation
        let keyToAdd = e.key;
        if (e.key === 'ArrowUp') keyToAdd = 'k';
        if (e.key === 'ArrowDown') keyToAdd = 'j';
        if (e.key === 'ArrowLeft') keyToAdd = 'h';
        if (e.key === 'ArrowRight') keyToAdd = 'l';

        // Reset the buffer if it's getting too long
        if (prev.length > 10) {
          return keyToAdd;
        }

        return prev + keyToAdd;
      });

      // Reset key buffer after delay
      if (keyBufferTimeoutRef.current) {
        clearTimeout(keyBufferTimeoutRef.current);
      }

      keyBufferTimeoutRef.current = setTimeout(() => {
        setKeyBuffer('');
      }, KEY_BUFFER_TIMEOUT);

      // Navigation with j/k keys or arrow keys
      if (e.key === 'j' || e.key === 'ArrowDown') {
        setSelectedIndex((prev) => Math.min(prev + 1, config.links.length - 1));
        return;
      }

      if (e.key === 'k' || e.key === 'ArrowUp') {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      // Navigate to selected link with Enter
      if (e.key === 'Enter') {
        const selectedLink = config.links[selectedIndex];
        if (selectedLink) {
          window.open(selectedLink.url, '_blank');
        }
        return;
      }

      // Check for help keybind (Shift + ?)
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Check for theme toggle keybind (Shift + t)
      if (e.key === 'T' || (e.key === 't' && e.shiftKey)) {
        e.preventDefault();
        setShowThemeSwitcher((prev) => !prev);
        return;
      }

      // Check for escape key
      if (e.key === config.keybinds.escape) {
        e.preventDefault();
        setKeysPressed([]);
        setKeyBuffer('');
        setShowHelp(false);
        setShowThemeSwitcher(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyBufferTimeoutRef.current) {
        clearTimeout(keyBufferTimeoutRef.current);
      }
    };
  }, [keysPressed, selectedIndex, showThemeSwitcher, showHelp]);

  // Check for link keybinds
  useEffect(() => {
    // Skip if modals are open
    if (showThemeSwitcher || showHelp) {
      return;
    }

    const keysString = keysPressed.join('');

    config.links.forEach((link) => {
      if (keysString.endsWith(link.keybind)) {
        window.open(link.url, '_blank');
        setKeysPressed([]);
        setKeyBuffer('');
      }
    });
  }, [keysPressed, showThemeSwitcher, showHelp]);

  // Get theme colors
  const theme = currentTheme.colors;

  return (
    <div
      className="relative flex min-h-screen flex-col font-mono text-sm"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
      }}
    >
      {/* Line numbers */}
      <LineNumbers
        color={theme.lineNumbers} // Increased line count
        count={50}
        currentLine={currentLine}
      />

      {/* Main content */}
      <main className="relative flex-1 p-4 pl-12">
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6">
          {/* ASCII Title */}
          <AsciiTitle color={theme.accent} title={config.title} />

          {/* Subtitle */}
          <div
            className="mb-8 px-4 py-2 text-center text-lg"
            style={{
              backgroundColor: theme.selection,
              color: theme.foreground,
            }}
          >
            {config.subtitle} <span className="animate-pulse">▲</span>
          </div>

          {/* Links */}
          <div className="grid w-full max-w-md gap-4">
            {config.links.map((link, index) => (
              <a
                className="flex items-center justify-between px-4 py-2 transition-colors"
                href={link.url}
                key={link.id}
                onMouseEnter={() => {
                  setSelectedIndex(index);
                }}
                onMouseLeave={() => {
                  // Don't reset the selection on mouse leave
                }}
                rel="noopener noreferrer"
                style={{
                  backgroundColor:
                    index === selectedIndex ? theme.selection : 'transparent',
                  color: theme.foreground,
                  borderLeft: `2px solid ${index === selectedIndex ? theme.accent : 'transparent'}`,
                  transition: 'background-color 0.2s ease',
                }}
                target="_blank"
              >
                <div className="flex items-center gap-3 text-lg">
                  {getIconForLink(link.id)}
                  <span>{link.title}</span>
                </div>
                <span className="text-lg opacity-70">{link.keybind}</span>
              </a>
            ))}
          </div>

          {/* Vim Mode/Keybuffer Display */}
          <div className="mt-8 text-center text-sm opacity-50">
            <span className="mr-4">MODE: {currentMode}</span>
            {keyBuffer && <span>KEYS: {keyBuffer}</span>}
          </div>
        </div>

        {/* Tildes for empty lines */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              className="h-6 select-none opacity-50"
              key={i}
              style={{ color: theme.lineNumbers }}
            >
              ~
            </div>
          ))}
        </div>
      </main>

      {/* Status line */}
      <StatusLine
        currentTheme={currentTheme.name}
        file={currentFile}
        filetype="html"
        helpText="Press Shift + ? for help | Shift + T for themes"
        mode={currentMode}
        position={{ line: currentLine, col: currentCol }}
        theme={theme}
      />

      {/* Help modal */}
      {showHelp && (
        <KeybindHelp
          keybinds={config.keybinds}
          links={config.links}
          onClose={() => setShowHelp(false)}
          theme={theme}
        />
      )}

      {/* Theme switcher */}
      {showThemeSwitcher && (
        <ThemeSwitcher
          currentThemeIndex={currentThemeIndex}
          onClose={() => setShowThemeSwitcher(false)}
          onSelectTheme={setTheme}
          theme={theme}
          themes={themes}
        />
      )}
    </div>
  );
}
