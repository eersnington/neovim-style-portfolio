"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/lib/themes";

interface ThemeSwitcherProps {
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
}

export function ThemeSwitcher({
  themes,
  currentThemeIndex,
  onSelectTheme,
  onClose,
  theme,
}: ThemeSwitcherProps) {
  const [focusedIndex, setFocusedIndex] = useState(currentThemeIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();

      // Prevent default browser behavior
      if (
        ["ArrowDown", "ArrowUp", "j", "k", "Enter", "Escape"].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown" || e.key === "j") {
        setFocusedIndex((prev) => Math.min(prev + 1, themes.length - 1));
        return;
      }

      if (e.key === "ArrowUp" || e.key === "k") {
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (e.key === "Enter") {
        onSelectTheme(focusedIndex);
        return;
      }
    };

    // Use capture phase to ensure our handler runs before the main page handler
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onClose, onSelectTheme, focusedIndex, themes.length]);

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
          Theme Selector
        </h2>

        <div className="grid gap-4">
          {themes.map((t, index) => (
            <button
              key={t.name}
              className="flex items-center justify-between p-3 rounded-md transition-colors"
              style={{
                backgroundColor:
                  index === focusedIndex ? theme.selection : "transparent",
                borderLeft: `2px solid ${
                  index === currentThemeIndex ? theme.accent : "transparent"
                }`,
                outline: "none", // Remove default focus outline
              }}
              onClick={() => onSelectTheme(index)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              <span className="font-medium">
                {index === currentThemeIndex && "✓ "}
                {t.name}
              </span>
              <div className="flex gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: t.colors.background }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: t.colors.accent }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: t.colors.foreground }}
                />
              </div>
            </button>
          ))}
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
            Use ↑↓ and Enter to select
          </div>
        </div>
      </div>
    </div>
  );
}
