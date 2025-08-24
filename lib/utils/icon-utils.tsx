/**
 * Centralized icon mapping utilities
 */

import { Github, Linkedin, Mail, Twitter, Youtube } from 'lucide-react';
import type { IconComponent, LinkIconProps } from '../types';

const ICON_MAP = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  email: Mail,
} as const;

/**
 * Get the appropriate icon component for a link ID
 * @param id - The link identifier
 * @param className - Optional CSS classes to apply
 * @returns Icon component or null if not found
 */
export const getIconForLink = ({ id, className = 'size-6' }: LinkIconProps): IconComponent => {
  const Icon = ICON_MAP[id as keyof typeof ICON_MAP];
  
  if (!Icon) {
    return null;
  }

  return <Icon className={className} />;
};

/**
 * Check if a link ID has a corresponding icon
 * @param id - The link identifier to check
 * @returns true if icon exists, false otherwise
 */
export const hasIcon = (id: string): boolean => {
  return id in ICON_MAP;
};

/**
 * Get all available icon IDs
 * @returns Array of supported icon identifiers
 */
export const getAvailableIconIds = (): readonly string[] => {
  return Object.keys(ICON_MAP);
};