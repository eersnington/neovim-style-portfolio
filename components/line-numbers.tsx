type LineNumbersProps = {
  count: number;
  currentLine: number;
  color: string;
};

export function LineNumbers({ count, currentLine, color }: LineNumbersProps) {
  return (
    <div
      className="absolute top-0 left-0 hidden h-full w-8 select-none flex-col items-end pl-9 font-bold text-lg md:flex"
      style={{ color }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          className={`${i + 1 === currentLine ? 'font-bold' : 'opacity-70'} h-6`}
          key={`line-number-${i + 1}`}
        >
          {i + 1 === currentLine ? i + 1 : i + 1}
        </div>
      ))}
    </div>
  );
}
