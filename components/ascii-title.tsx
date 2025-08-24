type AsciiTitleProps = {
  color: string;
};

export function AsciiTitle({ color }: AsciiTitleProps) {
  const asciiArt = `
███████╗██████╗ ███████╗███████╗    ███╗   ██╗ █████╗ ██████╗  █████╗ ██╗   ██╗ █████╗ ███╗   ██╗
██╔════╝██╔══██╗██╔════╝██╔════╝    ████╗  ██║██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║
███████╗██████╔╝█████╗  █████╗      ██╔██╗ ██║███████║██████╔╝███████║ ╚████╔╝ ███████║██╔██╗ ██║
╚════██║██╔══██╗██╔══╝  ██╔══╝      ██║╚██╗██║██╔══██║██╔══██╗██╔══██║  ╚██╔╝  ██╔══██║██║╚██╗██║
███████║██║  ██║███████╗███████╗    ██║ ╚████║██║  ██║██║  ██║██║  ██║   ██║   ██║  ██║██║ ╚████║
╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝`.trim();

  const shortAsciiArt = `
███████╗██████╗ ███████╗███████╗    ███╗   ██╗
██╔════╝██╔══██╗██╔════╝██╔════╝    ████╗  ██║
███████╗██████╔╝█████╗  █████╗      ██╔██╗ ██║
╚════██║██╔══██╗██╔══╝  ██╔══╝      ██║╚██╗██║
███████║██║  ██║███████╗███████╗    ██║ ╚████║
╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝  ╚═══╝`.trim();

  const mobileAsciiArt = `
███████╗██████╗ ███████╗███████╗
██╔════╝██╔══██╗██╔════╝██╔════╝
███████╗██████╔╝█████╗  █████╗  
╚════██║██╔══██╗██╔══╝  ██╔══╝  
███████║██║  ██║███████╗███████╗
╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝`.trim();

  return (
    <div className="relative flex h-[200px] w-full max-w-full items-center justify-center overflow-hidden text-center">
      <div className="overflow-x-auto">
        {/* Full ASCII art for larger screens */}
        <pre
          className="hidden font-mono text-lg leading-none lg:block"
          style={{ color }}
        >
          {asciiArt}
        </pre>

        {/* Short ASCII art for medium screens */}
        <pre
          className="hidden font-mono text-md leading-none sm:block sm:text-md md:text-base lg:hidden"
          style={{ color }}
        >
          {shortAsciiArt}
        </pre>

        {/* Mobile ASCII art for very small screens */}
        <pre
          className="block font-mono text-md leading-none sm:hidden"
          style={{ color }}
        >
          {mobileAsciiArt}
        </pre>
      </div>
    </div>
  );
}
