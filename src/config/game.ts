export const GAME = {
  title: 'Deep Dive',
  questionsPerDive: 7,
  secondsPerQuestion: 25,
  metresPerPoint: 10,
  endlessLives: 3,
  archiveDays: 30,
  /** Daily puzzles count from this date (day #1). */
  epoch: '2026-01-01',
  storageKey: 'deep-dive-save-v1',
  maxFlagged: 200,
} as const;

export const MAX_POINTS_PER_QUESTION = 100;
export const MAX_SCORE = GAME.questionsPerDive * MAX_POINTS_PER_QUESTION;
export const MAX_DEPTH = MAX_SCORE * GAME.metresPerPoint;

export interface Zone {
  name: string;
  from: number; // metres
  to: number;
  top: string; // water colours
  bottom: string;
  fact: string;
}

// Depth zones shown in the ocean scene. Real ocean zones, compressed to the game's 7,000 m.
export const ZONES: Zone[] = [
  { name: 'Sunlight Zone', from: 0, to: 200, top: '#2a9fd6', bottom: '#1173a8', fact: 'Almost all ocean photosynthesis happens in the top 200 m.' },
  { name: 'Twilight Zone', from: 200, to: 1000, top: '#11689a', bottom: '#083e64', fact: 'Lanternfish here make the biggest daily migration on Earth, rising to feed each night.' },
  { name: 'Midnight Zone', from: 1000, to: 2500, top: '#06324f', bottom: '#041d33', fact: 'No sunlight reaches below 1,000 m; most animals here make their own light.' },
  { name: 'Abyssal Plain', from: 2500, to: 4000, top: '#041a2d', bottom: '#030f1d', fact: 'The abyssal plains cover over half of Earth’s surface.' },
  { name: 'Abyss', from: 4000, to: 6000, top: '#030d19', bottom: '#020812', fact: 'Water pressure at 4,000 m is about 400 times that at the surface.' },
  { name: 'Hadal Trench', from: 6000, to: 7001, top: '#02070f', bottom: '#010308', fact: 'The hadal zone is named after Hades; the Mariana Trench reaches about 10,935 m.' },
];

export const zoneForDepth = (depth: number): Zone => ZONES.find((z) => depth >= z.from && depth < z.to) ?? ZONES[ZONES.length - 1];

export const THEMES = {
  geography: { name: 'Geography', emoji: '🌍' },
  sports: { name: 'Sports', emoji: '⚽' },
  movies: { name: 'Movies & TV', emoji: '🎬' },
  games: { name: 'Games', emoji: '🎮' },
  music: { name: 'Music', emoji: '🎵' },
  science: { name: 'Science', emoji: '🔬' },
  brands: { name: 'Brands', emoji: '🏷️' },
} as const;
