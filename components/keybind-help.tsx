'use client';

import { Github, Linkedin, Mail, Twitter, Youtube } from 'lucide-react';
import { useEffect } from 'react';
import type { Link } from '@/lib/config';

type KeybindHelpProps = {
  links: Link[];
  keybinds: {
    help: string;
    toggleTheme: string;
    escape: string;
  };
  onClose: () => void;
  theme: {
    background: string;
    foreground: string;
    selection: string;
    accent: string;
  };
};

export function KeybindHelp({
  links,
  keybinds,
  onClose,
  theme,
}: KeybindHelpProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    // Use capture phase to ensure our handler runs before the main page handler
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onClose]);

  const getIconForLink = (id: string) => {
    switch (id) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-md rounded-md p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.background,
          color: theme.foreground,
          border: `1px solid ${theme.accent}`,
        }}
      >
        <h2
          className="mb-4 pb-2 font-bold text-xl"
          style={{ borderBottom: `1px solid ${theme.selection}` }}
        >
          Keyboard Shortcuts
        </h2>

        <div className="grid gap-4">
          <div>
            <h3 className="mb-2 font-bold">Navigation</h3>
            <ul className="grid gap-2">
              {links.map((link) => (
                <li className="flex items-center justify-between" key={link.id}>
                  <div className="flex items-center gap-2">
                    {getIconForLink(link.id)}
                    <span>{link.title}</span>
                  </div>
                  <kbd
                    className="rounded px-2 py-1 text-xs"
                    style={{
                      backgroundColor: theme.selection,
                      color: theme.foreground,
                    }}
                  >
                    {link.keybind}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-bold">General</h3>
            <ul className="grid gap-2">
              <li className="flex justify-between">
                <span>Toggle Help</span>
                <kbd
                  className="rounded px-2 py-1 text-xs"
                  style={{
                    backgroundColor: theme.selection,
                    color: theme.foreground,
                  }}
                >
                  Shift + ?
                </kbd>
              </li>
              <li className="flex justify-between">
                <span>Toggle Theme</span>
                <kbd
                  className="rounded px-2 py-1 text-xs"
                  style={{
                    backgroundColor: theme.selection,
                    color: theme.foreground,
                  }}
                >
                  Shift + T
                </kbd>
              </li>
              <li className="flex justify-between">
                <span>Close/Cancel</span>
                <kbd
                  className="rounded px-2 py-1 text-xs"
                  style={{
                    backgroundColor: theme.selection,
                    color: theme.foreground,
                  }}
                >
                  {keybinds.escape}
                </kbd>
              </li>
            </ul>
          </div>
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
            Press Escape to close
          </div>
        </div>
      </div>
    </div>
  );
}
