"use client"

import React from "react"

interface KeystrokeDisplayProps {
  keyBuffer: string
  theme: {
    background: string
    foreground: string
    selection: string
  }
}

export function KeystrokeDisplay({ keyBuffer, theme }: KeystrokeDisplayProps) {
  const [visible, setVisible] = React.useState(false)
  const [displayText, setDisplayText] = React.useState("")

  React.useEffect(() => {
    if (keyBuffer) {
      setDisplayText(keyBuffer)
      setVisible(true)

      // Hide the display after 1.5 seconds of inactivity
      const timer = setTimeout(() => {
        setVisible(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [keyBuffer])

  if (!visible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
      <div
        className="px-6 py-3 rounded-md text-2xl font-mono"
        style={{
          backgroundColor: `${theme.selection}99`, // Add transparency
          color: theme.foreground,
          border: `1px solid ${theme.foreground}33`,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {displayText}
      </div>
    </div>
  )
}

