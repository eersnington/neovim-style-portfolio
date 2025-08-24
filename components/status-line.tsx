type StatusLineProps = {
  mode: string;
  file: string;
  position: { line: number; col: number };
  filetype: string;
  theme: {
    statusLine: string;
    statusLineText: string;
    normalMode: string;
    normalModeText: string;
  };
  helpText?: string;
  currentTheme?: string;
};

export function StatusLine({
  mode,
  file,
  position,
  filetype,
  theme,
  helpText,
  currentTheme,
}: StatusLineProps) {
  return (
    <div
      className="flex h-8 items-center text-xs"
      style={{
        backgroundColor: theme.statusLine,
        color: theme.statusLineText,
      }}
    >
      <div
        className="flex h-full items-center px-3 font-bold"
        style={{
          backgroundColor: theme.normalMode,
          color: theme.normalModeText,
        }}
      >
        {mode}
      </div>
      <div className="px-3">{file}</div>
      {helpText && (
        <div className="ml-4 hidden px-3 opacity-70 md:flex">{helpText}</div>
      )}
      <div className="ml-auto flex items-center gap-4 px-3">
        {currentTheme && <span>Theme: {currentTheme}</span>}
        <span>{filetype}</span>
        <span>
          {position.line}:{position.col}
        </span>
      </div>
    </div>
  );
}
