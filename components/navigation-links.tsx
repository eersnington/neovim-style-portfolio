'use client';

import { memo } from 'react';
import type { NavigationLinksProps } from '@/lib/types';
import { getIconForLink } from '@/lib/utils/icon-utils';

export const NavigationLinks = memo(
  ({
    links,
    selectedIndex,
    theme,
    onLinkActivate,
    onSelectIndex,
  }: NavigationLinksProps) => {
    return (
      <div className="grid w-full max-w-md gap-4">
        {links.map((link, index) => {
          const isActive = index === selectedIndex;
          const handleMouseEnter = () => {
            if (!isActive && onSelectIndex) {
              onSelectIndex(index); // sync selection with hover
            }
          };
          return (
            <a
              aria-current={isActive ? 'true' : undefined}
              aria-label={`${link.title} - Press ${link.keybind} or Enter`}
              className="flex items-center justify-between px-4 py-2"
              href={link.url}
              key={link.id}
              onClick={(e) => {
                e.preventDefault();
                onLinkActivate(link);
              }}
              onMouseEnter={handleMouseEnter}
              rel="noopener noreferrer"
              style={{
                backgroundColor: isActive ? theme.selection : 'transparent',
                color: theme.foreground,
                borderLeft: `2px solid ${isActive ? theme.accent : 'transparent'}`,
                cursor: 'pointer',
              }}
              tabIndex={isActive ? 0 : -1}
              target="_blank"
            >
              <div className="flex items-center gap-3 text-lg">
                {getIconForLink({ id: link.id })}
                <span>{link.title}</span>
              </div>
              <span className="text-lg opacity-70">{link.keybind}</span>
            </a>
          );
        })}
      </div>
    );
  }
);

NavigationLinks.displayName = 'NavigationLinks';
