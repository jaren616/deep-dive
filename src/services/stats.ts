import type { DiveRecord, SaveData, ThemeId, TierId } from '../types';
import { addDays } from './daily';
import { TIERS } from '../config/rarity';
import { QUESTION_BY_ID } from '../data/questions';

export interface Stats {
  totalDives: number;
  bestDepth: number;
  bestScore: number;
  averageScore: number;
  totalCorrect: number;
  totalRounds: number;
  accuracy: number; // 0..1
  tierCounts: Record<TierId, number>;
  currentStreak: number;
  longestStreak: number;
  dailiesPlayed: number;
  favouriteTheme: ThemeId | null;
  bestEndless: number; // correct answers in one endless dive
}

/** Consecutive-day streak of official Daily Dives ending today (or yesterday). */
export function dailyStreaks(dates: string[], today: string) {
  const set = new Set(dates);
  let longest = 0;
  const sorted = [...set].sort();
  let run = 0;
  let prev = '';
  for (const d of sorted) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  let current = 0;
  let cursor = set.has(today) ? today : addDays(today, -1);
  while (set.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }
  return { current, longest };
}

export function computeStats(save: SaveData, today: string): Stats {
  const dives: DiveRecord[] = save.dives;
  const tierCounts = Object.fromEntries(TIERS.map((t) => [t.id, 0])) as Record<TierId, number>;
  const themeCounts: Partial<Record<ThemeId, number>> = {};
  let totalCorrect = 0;
  let totalRounds = 0;
  let bestEndless = 0;
  for (const d of dives) {
    let correct = 0;
    for (const r of d.rounds) {
      totalRounds++;
      if (r.outcome === 'correct' && r.tier) {
        totalCorrect++;
        correct++;
        tierCounts[r.tier]++;
        const theme = QUESTION_BY_ID[r.questionId]?.theme;
        if (theme) themeCounts[theme] = (themeCounts[theme] ?? 0) + 1;
      }
    }
    if (d.mode === 'endless') bestEndless = Math.max(bestEndless, correct);
  }
  const scored = dives.filter((d) => d.mode !== 'endless');
  const { current, longest } = dailyStreaks(Object.keys(save.dailyResults), today);
  const fav = (Object.entries(themeCounts) as [ThemeId, number][]).sort((a, b) => b[1] - a[1])[0];
  return {
    totalDives: dives.length,
    bestDepth: Math.max(0, ...dives.map((d) => d.depth)),
    bestScore: Math.max(0, ...scored.map((d) => d.score)),
    averageScore: scored.length ? Math.round(scored.reduce((s, d) => s + d.score, 0) / scored.length) : 0,
    totalCorrect,
    totalRounds,
    accuracy: totalRounds ? totalCorrect / totalRounds : 0,
    tierCounts,
    currentStreak: current,
    longestStreak: longest,
    dailiesPlayed: Object.keys(save.dailyResults).length,
    favouriteTheme: fav ? fav[0] : null,
    bestEndless,
  };
}
