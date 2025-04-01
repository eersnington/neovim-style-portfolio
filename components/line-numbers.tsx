interface LineNumbersProps {
  count: number
  currentLine: number
  color: string
}

export function LineNumbers({ count, currentLine, color }: LineNumbersProps) {
  return (
    <div className="absolute left-0 top-0 h-full w-8 flex flex-col items-end pr-1 pt-4 select-none" style={{ color }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${i + 1 === currentLine ? "font-bold" : "opacity-70"} h-6`}>
          {i + 1 === currentLine ? i + 1 : i + 1}
        </div>
      ))}
    </div>
  )
}

