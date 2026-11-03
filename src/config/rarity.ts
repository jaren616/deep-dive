import type { TierId } from '../types';

export interface Tier {
  id: TierId;
  name: string;
  points: number;
  emoji: string;
  /** Normal palette and a colour-blind-safe alternative (Okabe-Ito based). */
  color: string;
  cbColor: string;
  blurb: string;
}

// Ordered most common -> rarest. Edit points here to rescore the whole game.
export const TIERS: Tier[] = [
  { id: 'plankton', name: 'Plankton', points: 10, emoji: '🦠', color: '#8fd3c7', cbColor: '#bbbbbb', blurb: 'The answer almost everyone gives.' },
  { id: 'shrimp', name: 'Shrimp', points: 25, emoji: '🦐', color: '#7fb7ff', cbColor: '#56b4e9', blurb: 'Common, but not the first thing people say.' },
  { id: 'jellyfish', name: 'Jellyfish', points: 40, emoji: '🪼', color: '#c99bff', cbColor: '#cc79a7', blurb: 'A solid, less obvious pick.' },
  { id: 'octopus', name: 'Octopus', points: 60, emoji: '🐙', color: '#ff8fb1', cbColor: '#e69f00', blurb: 'Uncommon — you know your stuff.' },
  { id: 'anglerfish', name: 'Anglerfish', points: 80, emoji: '🐡', color: '#ffd166', cbColor: '#f0e442', blurb: 'Rare. Few divers reach this.' },
  { id: 'krillion', name: 'Krillion', points: 100, emoji: '✨', color: '#5ff5ff', cbColor: '#009e73', blurb: 'Legendary. Deep-trench knowledge.' },
];

export const TIER_BY_ID: Record<TierId, Tier> = Object.fromEntries(TIERS.map((t) => [t.id, t])) as Record<TierId, Tier>;

export const tierIndex = (id: TierId) => TIERS.findIndex((t) => t.id === id);
