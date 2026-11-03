import type { DiveRecord, SaveData } from '../types';
import { MAX_SCORE } from '../config/game';
import { computeStats } from './stats';
import { QUESTION_BY_ID } from '../data/questions';
import { THEMES } from '../config/game';

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** Evaluated after each dive with the save that already includes it. */
  test: (save: SaveData, dive: DiveRecord, today: string) => boolean;
}

const correctRounds = (d: DiveRecord) => d.rounds.filter((r) => r.outcome === 'correct');

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-dive', name: 'First Splash', emoji: '💦', description: 'Finish your first dive.', test: (s) => s.dives.length >= 1 },
  { id: 'twilight', name: 'Into the Twilight', emoji: '🌆', description: 'Reach 200 m in one dive.', test: (_s, d) => d.depth >= 200 },
  { id: 'midnight', name: 'Lights Out', emoji: '🌑', description: 'Reach 1,000 m — the Midnight Zone.', test: (_s, d) => d.depth >= 1000 },
  { id: 'abyss', name: 'Abyss Walker', emoji: '🕳️', description: 'Reach 4,000 m in one dive.', test: (_s, d) => d.mode !== 'endless' && d.depth >= 4000 },
  { id: 'hadal', name: 'Trench Explorer', emoji: '🌋', description: 'Reach the Hadal Trench at 6,000 m.', test: (_s, d) => d.mode !== 'endless' && d.depth >= 6000 },
  { id: 'perfect', name: 'Perfect Descent', emoji: '🏆', description: `Score the maximum ${MAX_SCORE} points.`, test: (_s, d) => d.mode !== 'endless' && d.score >= MAX_SCORE },
  { id: 'krillion', name: 'One in a Krillion', emoji: '✨', description: 'Give a Krillion-tier answer.', test: (_s, d) => d.rounds.some((r) => r.tier === 'krillion') },
  { id: 'rare-trio', name: 'Rare Collector', emoji: '🐡', description: 'Three Anglerfish-or-rarer answers in one dive.', test: (_s, d) => correctRounds(d).filter((r) => r.tier === 'anglerfish' || r.tier === 'krillion').length >= 3 },
  { id: 'quick', name: 'Quick Draw', emoji: '⚡', description: 'Answer correctly within 3 seconds.', test: (_s, d) => correctRounds(d).some((r) => r.timeTaken <= 3) },
  { id: 'clean', name: 'Clean Sweep', emoji: '🧹', description: 'Answer every question in a 7-question dive.', test: (_s, d) => d.mode !== 'endless' && d.rounds.length >= 7 && d.rounds.every((r) => r.outcome === 'correct') },
  { id: 'streak-3', name: 'Regular Diver', emoji: '📅', description: 'Play the Daily Dive 3 days in a row.', test: (s, _d, t) => computeStats(s, t).currentStreak >= 3 },
  { id: 'streak-7', name: 'Week Underwater', emoji: '🗓️', description: 'Play the Daily Dive 7 days in a row.', test: (s, _d, t) => computeStats(s, t).currentStreak >= 7 },
  { id: 'endless-15', name: 'Deep Lungs', emoji: '🫁', description: 'Get 15 correct in one Endless dive.', test: (_s, d) => d.mode === 'endless' && correctRounds(d).length >= 15 },
  {
    id: 'all-themes',
    name: 'Ocean Polymath',
    emoji: '🧭',
    description: 'Answer correctly in every theme.',
    test: (s) => {
      const seen = new Set<string>();
      for (const dv of s.dives) for (const r of correctRounds(dv)) seen.add(QUESTION_BY_ID[r.questionId]?.theme ?? '');
      return Object.keys(THEMES).every((t) => seen.has(t));
    },
  },
];

/** Returns ids newly unlocked by this dive. */
export function evaluateAchievements(save: SaveData, dive: DiveRecord, today: string): string[] {
  return ACHIEVEMENTS.filter((a) => !save.achievements[a.id] && a.test(save, dive, today)).map((a) => a.id);
}
