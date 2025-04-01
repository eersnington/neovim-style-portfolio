"use client";

import { useEffect, useState } from "react";
import figlet from "figlet";
// @ts-ignore - Figlet font doesn't have type definitions
import ANSI from "figlet/importable-fonts/ANSI Shadow.js";

interface AsciiTitleProps {
  title: string;
  color: string;
}

export function AsciiTitle({ title, color }: AsciiTitleProps) {
  const [asciiArt, setAsciiArt] = useState("");
  const [shortAsciiArt, setShortAsciiArt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const generateAscii = async () => {
      try {
        // Load the ANSI Shadow font
        figlet.parseFont("ANSI Shadow", ANSI);

        // Generate full ASCII art
        const fullArt = await new Promise<string>((resolve, reject) => {
          figlet.text(
            title,
            {
              font: "ANSI Shadow",
              horizontalLayout: "default",
              verticalLayout: "default",
            },
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              if (!result) {
                reject(new Error("No result generated"));
                return;
              }
              resolve(result);
            }
          );
        });

        // Start transition
        setIsTransitioning(true);

        // Set the new ASCII art
        setAsciiArt(fullArt);

        // Generate shorter version for mobile/smaller screens
        const shortTitle =
          title.split(" ")[0] || title.substring(0, Math.min(title.length, 5));
        const shortArt = await new Promise<string>((resolve, reject) => {
          figlet.text(
            shortTitle,
            {
              font: "ANSI Shadow",
              horizontalLayout: "default",
              verticalLayout: "default",
            },
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              if (!result) {
                reject(new Error("No result generated"));
                return;
              }
              resolve(result);
            }
          );
        });
        setShortAsciiArt(shortArt);

        // Small delay before removing loading state
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsLoading(false);

        // Small delay before ending transition
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsTransitioning(false);
      } catch (error) {
        console.error("Error generating ASCII art:", error);
        setAsciiArt(title);
        setShortAsciiArt(title.split(" ")[0] || title);
        setIsLoading(false);
      }
    };

    generateAscii();
  }, [title]);

  const loadingArt = `

██╗  ██╗██╗       ████████╗██╗  ██╗██╗███████╗    ██╗███████╗
██║  ██║██║       ╚══██╔══╝██║  ██║██║██╔════╝    ██║██╔════╝
███████║██║          ██║   ███████║██║███████╗    ██║███████╗
██╔══██║██║          ██║   ██╔══██║██║╚════██║    ██║╚════██║
██║  ██║██║▄█╗       ██║   ██║  ██║██║███████║    ██║███████║
╚═╝  ╚═╝╚═╝╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝╚══════╝    ╚═╝╚══════╝
                                                             

`.trim();

  return (
    <div className="relative text-center w-full max-w-full overflow-hidden h-[200px]">
      <div className="absolute inset-0 overflow-x-auto">
        {/* Loading state */}
        <pre
          className={`font-mono text-xs sm:text-sm md:text-base inline-block transition-opacity duration-300 ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
          style={{ color }}
        >
          {loadingArt}
        </pre>
      </div>
      <div className="absolute inset-0 overflow-x-auto">
        {/* Final content */}
        <pre
          className={`font-mono text-xs sm:text-sm md:text-base inline-block transition-opacity duration-300 ${
            !isLoading && !isTransitioning ? "opacity-100" : "opacity-0"
          }`}
          style={{ color }}
        >
          {title.length > 10 ? shortAsciiArt : asciiArt}
        </pre>
      </div>
    </div>
  );
}
