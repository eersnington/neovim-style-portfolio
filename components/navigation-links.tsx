'use client';

import { memo } from 'react';
import type { NavigationLinksProps } from '@/lib/types';
import { getIconForLink } from '@/lib/utils/icon-utils';

export const NavigationLinks = memo(
  ({
    links,
    selectedIndex,
    theme,
    onSelectionChange,
    onLinkActivate,
  }: NavigationLinksProps) => (
    <div className="grid w-full max-w-md gap-4">
      {links.map((link, index) => (
        <a
          aria-label={`${link.title} - Press ${link.keybind} or Enter`}
          className="flex items-center justify-between px-4 py-2 transition-colors"
          href={link.url}
          key={link.id}
          onClick={(e) => {
            e.preventDefault();
            onLinkActivate(link);
          }}
          onMouseEnter={() => onSelectionChange(index)}
          rel="noopener noreferrer"
          style={{
            backgroundColor:
              index === selectedIndex ? theme.selection : 'transparent',
            color: theme.foreground,
            borderLeft: `2px solid ${index === selectedIndex ? theme.accent : 'transparent'}`,
            transition: 'background-color 0.2s ease',
          }}
          tabIndex={index === selectedIndex ? 0 : -1}
          target="_blank"
        >
          <div className="flex items-center gap-3 text-lg">
            {getIconForLink({ id: link.id })}
            <span>{link.title}</span>
          </div>
          <span className="text-lg opacity-70">{link.keybind}</span>
        </a>
      ))}
    </div>
  )
);

NavigationLinks.displayName = 'NavigationLinks';
