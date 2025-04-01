"use client";

import { useEffect } from "react";
import type { Link } from "@/lib/config";
import { Github, Twitter, Linkedin, Youtube, Mail } from "lucide-react";

interface KeybindHelpProps {
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
}

export function KeybindHelp({
  links,
  keybinds,
  onClose,
  theme,
}: KeybindHelpProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    // Use capture phase to ensure our handler runs before the main page handler
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onClose]);

  const getIconForLink = (id: string) => {
    switch (id) {
      case "github":
        return <Github className="w-4 h-4" />;
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-md p-6 rounded-md shadow-lg"
        style={{
          backgroundColor: theme.background,
          color: theme.foreground,
          border: `1px solid ${theme.accent}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-xl font-bold mb-4 pb-2"
          style={{ borderBottom: `1px solid ${theme.selection}` }}
        >
          Keyboard Shortcuts
        </h2>

        <div className="grid gap-4">
          <div>
            <h3 className="font-bold mb-2">Navigation</h3>
            <ul className="grid gap-2">
              {links.map((link) => (
                <li key={link.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getIconForLink(link.id)}
                    <span>{link.title}</span>
                  </div>
                  <kbd
                    className="px-2 py-1 text-xs rounded"
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
            <h3 className="font-bold mb-2">General</h3>
            <ul className="grid gap-2">
              <li className="flex justify-between">
                <span>Toggle Help</span>
                <kbd
                  className="px-2 py-1 text-xs rounded"
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
                  className="px-2 py-1 text-xs rounded"
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
                  className="px-2 py-1 text-xs rounded"
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
            className="flex-1 py-2 rounded-md font-bold"
            style={{
              backgroundColor: theme.accent,
              color: theme.background,
            }}
            onClick={onClose}
          >
            Close
          </button>
          <div
            className="px-3 py-2 rounded-md text-xs flex items-center opacity-70"
            style={{ backgroundColor: theme.selection }}
          >
            Press Escape to close
          </div>
        </div>
      </div>
    </div>
  );
}
