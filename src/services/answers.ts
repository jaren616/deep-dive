import type { Answer, Question, QuestionDef, TierId } from '../types';
import { TIERS } from '../config/rarity';

const LEADING_ARTICLES = /^(the|a|an)\s+/;

/**
 * Normalise text for matching: lower-case, strip accents, '&' -> 'and',
 * drop punctuation and leading articles, collapse whitespace.
 */
export function normalize(input: string): string {
  let s = input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’‘`´.]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  s = s.replace(LEADING_ARTICLES, '');
  return s;
}

/** Compact form ignores spaces, so "spider man" == "spiderman". */
export const compact = (s: string) => normalize(s).replace(/\s+/g, '');

export function buildQuestion(def: QuestionDef): Question {
  const answers: Answer[] = [];
  for (const tier of TIERS) {
    for (const entry of def.answers[tier.id] ?? []) {
      const [name, ...aliases] = entry.split('|').map((x) => x.trim());
      const keys = Array.from(new Set([name, ...aliases].map(compact).filter(Boolean)));
      answers.push({ name, aliases, tier: tier.id as TierId, keys });
    }
  }
  return { id: def.id, theme: def.theme, prompt: def.prompt, hint: def.hint, open: !!def.open, answers };
}

/** Classic Levenshtein distance with an early exit once it exceeds max. */
export function editDistance(a: string, b: string, max = Infinity): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** How many typos we tolerate for a suggestion, by word length. */
export const typoAllowance = (len: number) => (len <= 3 ? 0 : len <= 6 ? 1 : len <= 10 ? 2 : 3);

export type MatchResult =
  | { kind: 'exact'; answer: Answer }
  | { kind: 'suggest'; answer: Answer }
  | { kind: 'none' }
  | { kind: 'empty' };

export function matchAnswer(question: Question, typed: string): MatchResult {
  const key = compact(typed);
  if (!key) return { kind: 'empty' };
  for (const a of question.answers) if (a.keys.includes(key)) return { kind: 'exact', answer: a };

  // Plural / singular leniency: "lungs" vs "lung", "boxes" vs "box".
  const variants = [key.replace(/es$/, ''), key.replace(/s$/, ''), key + 's'];
  for (const a of question.answers) if (variants.some((v) => v && a.keys.includes(v))) return { kind: 'exact', answer: a };

  // Typo suggestion: closest key within allowance.
  const allow = typoAllowance(key.length);
  if (allow === 0) return { kind: 'none' };
  let best: { answer: Answer; d: number } | null = null;
  for (const a of question.answers) {
    for (const k of a.keys) {
      const d = editDistance(key, k, allow);
      if (d <= allow && (!best || d < best.d)) best = { answer: a, d };
    }
  }
  return best ? { kind: 'suggest', answer: best.answer } : { kind: 'none' };
}
