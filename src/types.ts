export type TierId = 'plankton' | 'shrimp' | 'jellyfish' | 'octopus' | 'anglerfish' | 'krillion';

export type ThemeId = 'geography' | 'sports' | 'movies' | 'games' | 'music' | 'science' | 'brands';

/**
 * Answers are written grouped by tier. Each entry is "Canonical|alias|alias".
 * Matching is case/accent/punctuation-insensitive, so aliases only need to
 * cover genuinely different spellings (e.g. "United States|USA|America").
 */
export interface QuestionDef {
  id: string;
  theme: ThemeId;
  prompt: string;
  /** Shown under the prompt, e.g. clarifying what counts. */
  hint?: string;
  answers: Partial<Record<TierId, string[]>>;
  /** True when the list cannot be exhaustive (e.g. "name a band"). */
  open?: boolean;
}

export interface Answer {
  name: string;
  aliases: string[];
  tier: TierId;
  keys: string[]; // normalised forms used for matching
}

export interface Question {
  id: string;
  theme: ThemeId;
  prompt: string;
  hint?: string;
  open: boolean;
  answers: Answer[];
}

export type RoundOutcome = 'correct' | 'timeout' | 'pass' | 'missed';

export interface RoundResult {
  questionId: string;
  outcome: RoundOutcome;
  answer?: string; // canonical answer name
  typed?: string;
  tier?: TierId;
  points: number;
  timeTaken: number; // seconds
}

export type ModeId = 'daily' | 'classic' | 'endless' | 'theme' | 'custom' | 'archive';

export interface DiveSetup {
  mode: ModeId;
  questionIds: string[];
  /** For daily/archive dives: YYYY-MM-DD */
  date?: string;
  theme?: ThemeId;
  customCode?: string;
  /** Endless: lives remaining before the dive ends */
  lives?: number;
}

export interface DiveRecord {
  id: string;
  mode: ModeId;
  date?: string;
  theme?: ThemeId;
  finishedAt: number;
  rounds: RoundResult[];
  score: number;
  depth: number;
}

export interface Settings {
  sound: boolean;
  music: boolean;
  reducedMotion: boolean;
  colorBlind: boolean;
  textSize: 'normal' | 'large' | 'xlarge';
  avatar: string;
}

export interface FlaggedAnswer {
  questionId: string;
  typed: string;
  at: number;
}

export interface InProgressDive {
  setup: DiveSetup;
  rounds: RoundResult[];
  current: number;
  startedAt: number;
}

export interface SaveData {
  version: number;
  dives: DiveRecord[];
  dailyResults: Record<string, DiveRecord>; // official result per date
  inProgress: InProgressDive | null;
  achievements: Record<string, number>; // id -> unlocked timestamp
  settings: Settings;
  flagged: FlaggedAnswer[];
  discoveredTiers: TierId[];
}
