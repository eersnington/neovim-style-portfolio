'use client';

import figlet from 'figlet';
// @ts-expect-error - Figlet font doesn't have type definitions
import ANSI from 'figlet/importable-fonts/ANSI Shadow.js';
import { useEffect, useState } from 'react';

type AsciiTitleProps = {
  title: string;
  color: string;
};

const SHORT_TITLE_LENGTH = 5;
const LOADING_DELAY = 400;
const TRANSITION_DELAY = 300;

export function AsciiTitle({ title, color }: AsciiTitleProps) {
  const [asciiArt, setAsciiArt] = useState('');
  const [shortAsciiArt, setShortAsciiArt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const generateAscii = async () => {
      try {
        // Load the ANSI Shadow font
        figlet.parseFont('ANSI Shadow', ANSI);

        // Generate full ASCII art
        const fullArt = await new Promise<string>((resolve, reject) => {
          figlet.text(
            title,
            {
              font: 'ANSI Shadow',
              horizontalLayout: 'default',
              verticalLayout: 'default',
            },
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              if (!result) {
                reject(new Error('No result generated'));
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
          title.split(' ')[0] ||
          title.substring(0, Math.min(title.length, SHORT_TITLE_LENGTH));
        const shortArt = await new Promise<string>((resolve, reject) => {
          figlet.text(
            shortTitle,
            {
              font: 'ANSI Shadow',
              horizontalLayout: 'default',
              verticalLayout: 'default',
            },
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              if (!result) {
                reject(new Error('No result generated'));
                return;
              }
              resolve(result);
            }
          );
        });
        setShortAsciiArt(shortArt);

        // Small delay before removing loading state
        await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY));
        setIsLoading(false);

        // Small delay before ending transition
        await new Promise((resolve) => setTimeout(resolve, TRANSITION_DELAY));
        setIsTransitioning(false);
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: this is useful
        console.error('Error generating ASCII art:', error);
        setAsciiArt(title);
        setShortAsciiArt(title.split(' ')[0] || title);
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
    <div className="relative h-[200px] w-full max-w-full overflow-hidden text-center">
      <div className="absolute inset-0 overflow-x-auto">
        {/* Loading state */}
        <pre
          className={`inline-block font-mono text-xs transition-opacity duration-300 sm:text-sm md:text-base ${
            isLoading ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color }}
        >
          {loadingArt}
        </pre>
      </div>
      <div className="absolute inset-0 overflow-x-auto">
        {/* Final content */}
        <pre
          className={`inline-block font-mono text-xs transition-opacity duration-300 sm:text-sm md:text-base ${
            isLoading || isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ color }}
        >
          {title.length > 10 ? shortAsciiArt : asciiArt}
        </pre>
      </div>
    </div>
  );
}
