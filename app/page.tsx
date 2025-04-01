"use client"

import { useEffect, useState, useRef } from "react"
import config from "@/lib/config"
import { LineNumbers } from "@/components/line-numbers"
import { StatusLine } from "@/components/status-line"
import { KeybindHelp } from "@/components/keybind-help"
import { AsciiTitle } from "@/components/ascii-title"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Github, Twitter, Linkedin, Youtube, Mail } from "lucide-react"
import { themes, type Theme, defaultTheme } from "@/lib/themes"

export default function Home() {
  const [keysPressed, setKeysPressed] = useState<string[]>([])
  const [keyBuffer, setKeyBuffer] = useState<string>("")
  const [showHelp, setShowHelp] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const [currentMode, setCurrentMode] = useState("NORMAL")
  const [currentFile, setCurrentFile] = useState("~/index.html")
  const [currentLine, setCurrentLine] = useState(1)
  const [currentCol, setCurrentCol] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false)
  const keyBufferTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get icon component based on link id
  const getIconForLink = (id: string) => {
    switch (id) {
      case "github":
        return <Github className="size-6" />
      case "twitter":
        return <Twitter className="size-6" />
      case "linkedin":
        return <Linkedin className="size-6" />
      case "youtube":
        return <Youtube className="size-6" />
      case "email":
        return <Mail className="size-6" />
      default:
        return null
    }
  }

  // Cycle to the next theme
  const cycleTheme = () => {
    const nextIndex = (currentThemeIndex + 1) % themes.length
    setCurrentThemeIndex(nextIndex)
    setCurrentTheme(themes[nextIndex])
  }

  // Set a specific theme
  const setTheme = (index: number) => {
    setCurrentThemeIndex(index)
    setCurrentTheme(themes[index])
    setShowThemeSwitcher(false)
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip handling if modals are open
      if (showThemeSwitcher || showHelp) {
        return
      }

      // Don't capture keys if in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Prevent default for navigation keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault()
      }

      // Add the key to the keys pressed array
      setKeysPressed((prev) => {
        const newKeys = [...prev, e.key]
        // Only keep the last 5 keys
        if (newKeys.length > 5) {
          return newKeys.slice(newKeys.length - 5)
        }
        return newKeys
      })

      // Update key buffer for display - reset it first to avoid growing
      setKeyBuffer((prev) => {
        // Map arrow keys to vim-style notation
        let keyToAdd = e.key
        if (e.key === "ArrowUp") keyToAdd = "k"
        if (e.key === "ArrowDown") keyToAdd = "j"
        if (e.key === "ArrowLeft") keyToAdd = "h"
        if (e.key === "ArrowRight") keyToAdd = "l"

        // Reset the buffer if it's getting too long
        if (prev.length > 10) {
          return keyToAdd
        }

        return prev + keyToAdd
      })

      // Reset key buffer after delay
      if (keyBufferTimeoutRef.current) {
        clearTimeout(keyBufferTimeoutRef.current)
      }

      keyBufferTimeoutRef.current = setTimeout(() => {
        setKeyBuffer("")
      }, 1500)

      // Navigation with j/k keys or arrow keys
      if (e.key === "j" || e.key === "ArrowDown") {
        setSelectedIndex((prev) => Math.min(prev + 1, config.links.length - 1))
        return
      }

      if (e.key === "k" || e.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        return
      }

      // Navigate to selected link with Enter
      if (e.key === "Enter") {
        const selectedLink = config.links[selectedIndex]
        if (selectedLink) {
          window.open(selectedLink.url, "_blank")
        }
        return
      }

      // Check for help keybind (Shift + ?)
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault()
        setShowHelp((prev) => !prev)
        return
      }

      // Check for theme toggle keybind (Shift + t)
      if (e.key === "T" || (e.key === "t" && e.shiftKey)) {
        e.preventDefault()
        setShowThemeSwitcher((prev) => !prev)
        return
      }

      // Check for escape key
      if (e.key === config.keybinds.escape) {
        e.preventDefault()
        setKeysPressed([])
        setKeyBuffer("")
        setShowHelp(false)
        setShowThemeSwitcher(false)
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (keyBufferTimeoutRef.current) {
        clearTimeout(keyBufferTimeoutRef.current)
      }
    }
  }, [keysPressed, selectedIndex, showThemeSwitcher, showHelp])

  // Check for link keybinds
  useEffect(() => {
    // Skip if modals are open
    if (showThemeSwitcher || showHelp) {
      return
    }

    const keysString = keysPressed.join("")

    config.links.forEach((link) => {
      if (keysString.endsWith(link.keybind)) {
        window.open(link.url, "_blank")
        setKeysPressed([])
        setKeyBuffer("")
      }
    })
  }, [keysPressed, showThemeSwitcher, showHelp])

  // Get theme colors
  const theme = currentTheme.colors

  return (
    <div
      className="min-h-screen font-mono text-sm relative flex flex-col"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
      }}
    >
      {/* Line numbers */}
      <LineNumbers
        count={50} // Increased line count
        currentLine={currentLine}
        color={theme.lineNumbers}
      />

      {/* Main content */}
      <main className="flex-1 p-4 pl-12 relative">
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
          {/* ASCII Title */}
          <AsciiTitle title={config.title} color={theme.accent} />

          {/* Subtitle */}
          <div
            className="px-4 py-2 text-center mb-8 text-lg"
            style={{
              backgroundColor: theme.selection,
              color: theme.foreground,
            }}
          >
            {config.subtitle} <span className="animate-pulse">▲</span>
          </div>

          {/* Links */}
          <div className="grid gap-4 w-full max-w-md">
            {config.links.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2 px-4 transition-colors"
                style={{
                  backgroundColor: index === selectedIndex ? theme.selection : "transparent",
                  color: theme.foreground,
                  borderLeft: `2px solid ${index === selectedIndex ? theme.accent : "transparent"}`,
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => {
                  setSelectedIndex(index)
                }}
                onMouseLeave={() => {
                  // Don't reset the selection on mouse leave
                }}
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
          <div className="mt-8 text-sm opacity-50 text-center">
            <span className="mr-4">MODE: {currentMode}</span>
            {keyBuffer && <span>KEYS: {keyBuffer}</span>}
          </div>
        </div>

        {/* Tildes for empty lines */}
        <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="select-none opacity-50 h-6" style={{ color: theme.lineNumbers }}>
              ~
            </div>
          ))}
        </div>
      </main>

      {/* Status line */}
      <StatusLine
        mode={currentMode}
        file={currentFile}
        position={{ line: currentLine, col: currentCol }}
        filetype="html"
        theme={theme}
        helpText="Press Shift + ? for help | Shift + T for themes"
        currentTheme={currentTheme.name}
      />

      {/* Help modal */}
      {showHelp && (
        <KeybindHelp links={config.links} keybinds={config.keybinds} onClose={() => setShowHelp(false)} theme={theme} />
      )}

      {/* Theme switcher */}
      {showThemeSwitcher && (
        <ThemeSwitcher
          themes={themes}
          currentThemeIndex={currentThemeIndex}
          onSelectTheme={setTheme}
          onClose={() => setShowThemeSwitcher(false)}
          theme={theme}
        />
      )}
    </div>
  )
}

