import { GAME } from '../config/game';
import { QUESTIONS } from '../data/questions';
import type { ThemeId } from '../types';
import { hashString, mulberry32, shuffle } from './random';

/** Local calendar date as YYYY-MM-DD (the daily resets at the player's midnight). */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const toUTC = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

export const dayNumber = (key: string) => Math.floor((toUTC(key) - toUTC(GAME.epoch)) / 86400000) + 1;

export function addDays(key: string, delta: number): string {
  const dt = new Date(toUTC(key) + delta * 86400000);
  return dt.toISOString().slice(0, 10);
}

/**
 * The daily set: one question per theme (7 themes = 7 questions), chosen and
 * ordered by a seed derived from the date, so it is the same for everyone.
 */
export function dailyQuestionIds(key: string): string[] {
  const rand = mulberry32(hashString(`deep-dive:${key}`));
  const themes = Array.from(new Set(QUESTIONS.map((q) => q.theme))) as ThemeId[];
  const picks = themes.map((t) => {
    const pool = QUESTIONS.filter((q) => q.theme === t);
    return pool[Math.floor(rand() * pool.length)].id;
  });
  const ids = shuffle(picks, rand);
  // Top up from the whole bank if there are ever fewer themes than questions per dive.
  const rest = shuffle(QUESTIONS.map((q) => q.id).filter((id) => !ids.includes(id)), rand);
  return [...ids, ...rest].slice(0, GAME.questionsPerDive);
}

/** Past days available in the archive, most recent first (excludes today). */
export function archiveDates(today: string): string[] {
  const out: string[] = [];
  for (let i = 1; i <= GAME.archiveDays; i++) {
    const k = addDays(today, -i);
    if (dayNumber(k) >= 1) out.push(k);
  }
  return out;
}
