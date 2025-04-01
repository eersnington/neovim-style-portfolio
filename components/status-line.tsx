interface StatusLineProps {
  mode: string
  file: string
  position: { line: number; col: number }
  filetype: string
  theme: {
    statusLine: string
    statusLineText: string
    normalMode: string
    normalModeText: string
  }
  helpText?: string
  currentTheme?: string
}

export function StatusLine({ mode, file, position, filetype, theme, helpText, currentTheme }: StatusLineProps) {
  return (
    <div
      className="flex items-center h-8 text-xs"
      style={{
        backgroundColor: theme.statusLine,
        color: theme.statusLineText,
      }}
    >
      <div
        className="px-3 h-full flex items-center font-bold"
        style={{
          backgroundColor: theme.normalMode,
          color: theme.normalModeText,
        }}
      >
        {mode}
      </div>
      <div className="px-3">{file}</div>
      {helpText && <div className="px-3 ml-4 opacity-70">{helpText}</div>}
      <div className="ml-auto px-3 flex items-center gap-4">
        {currentTheme && <span>Theme: {currentTheme}</span>}
        <span>{filetype}</span>
        <span>
          {position.line}:{position.col}
        </span>
      </div>
    </div>
  )
}

