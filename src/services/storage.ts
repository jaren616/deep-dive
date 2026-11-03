import { GAME } from '../config/game';
import type { DiveRecord, SaveData, Settings } from '../types';

export const SAVE_VERSION = 1;

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  music: false,
  reducedMotion: false,
  colorBlind: false,
  textSize: 'normal',
  avatar: '🤿',
};

export const emptySave = (): SaveData => ({
  version: SAVE_VERSION,
  dives: [],
  dailyResults: {},
  inProgress: null,
  achievements: {},
  settings: { ...DEFAULT_SETTINGS },
  flagged: [],
  discoveredTiers: [],
});

/** Minimal storage interface so tests can pass an in-memory fake. */
export interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

function safeStorage(): KV | null {
  try {
    const ls = globalThis.localStorage;
    const probe = '__dd_probe__';
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return ls;
  } catch {
    return null; // private mode, blocked cookies, or no window
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

const validDive = (d: unknown): d is DiveRecord =>
  isObj(d) && typeof d.id === 'string' && typeof d.score === 'number' && Array.isArray(d.rounds) && typeof d.finishedAt === 'number';

/** Accepts anything and returns a valid save, keeping whatever parts are sound. */
export function sanitize(raw: unknown): SaveData {
  const base = emptySave();
  if (!isObj(raw)) return base;
  const dives = Array.isArray(raw.dives) ? raw.dives.filter(validDive) : [];
  const dailyResults: Record<string, DiveRecord> = {};
  if (isObj(raw.dailyResults)) {
    for (const [k, v] of Object.entries(raw.dailyResults)) if (/^\d{4}-\d{2}-\d{2}$/.test(k) && validDive(v)) dailyResults[k] = v;
  }
  const settings = { ...DEFAULT_SETTINGS, ...(isObj(raw.settings) ? raw.settings : {}) } as Settings;
  const ip = raw.inProgress;
  const inProgress =
    isObj(ip) && isObj(ip.setup) && Array.isArray((ip.setup as Record<string, unknown>).questionIds) && Array.isArray(ip.rounds) && typeof ip.current === 'number'
      ? (ip as unknown as SaveData['inProgress'])
      : null;
  return {
    version: SAVE_VERSION,
    dives,
    dailyResults,
    inProgress,
    achievements: isObj(raw.achievements) ? (raw.achievements as Record<string, number>) : {},
    settings,
    flagged: Array.isArray(raw.flagged) ? (raw.flagged as SaveData['flagged']).slice(-GAME.maxFlagged) : [],
    discoveredTiers: Array.isArray(raw.discoveredTiers) ? (raw.discoveredTiers as SaveData['discoveredTiers']) : [],
  };
}

export interface LoadResult {
  data: SaveData;
  recovered: boolean; // true when a corrupt save was found and reset
}

export function loadSave(store: KV | null = safeStorage()): LoadResult {
  if (!store) return { data: emptySave(), recovered: false };
  const text = store.getItem(GAME.storageKey);
  if (!text) return { data: emptySave(), recovered: false };
  try {
    return { data: sanitize(JSON.parse(text)), recovered: false };
  } catch {
    try {
      store.setItem(`${GAME.storageKey}-corrupt-backup`, text);
    } catch {
      /* ignore */
    }
    return { data: emptySave(), recovered: true };
  }
}

export function writeSave(data: SaveData, store: KV | null = safeStorage()): boolean {
  if (!store) return false;
  try {
    store.setItem(GAME.storageKey, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clearSave(store: KV | null = safeStorage()) {
  try {
    store?.removeItem(GAME.storageKey);
  } catch {
    /* ignore */
  }
}

export const storageAvailable = () => safeStorage() !== null;
