import { GAME } from '../config/game';
import { QUESTIONS } from '../data/questions';

/**
 * Custom challenge codes: "DD-" + two base-36 chars per question index.
 * Questions are only ever appended to the bank, so codes stay valid.
 */
export function encodeChallenge(ids: string[]): string {
  const body = ids
    .map((id) => QUESTIONS.findIndex((q) => q.id === id))
    .filter((i) => i >= 0)
    .map((i) => i.toString(36).padStart(2, '0'))
    .join('');
  return `DD-${body.toUpperCase()}`;
}

export function decodeChallenge(code: string): string[] | null {
  const clean = code.trim().toUpperCase().replace(/\s+/g, '');
  const m = /^DD-?([0-9A-Z]+)$/.exec(clean);
  if (!m || m[1].length % 2 !== 0) return null;
  const ids: string[] = [];
  for (let i = 0; i < m[1].length; i += 2) {
    const q = QUESTIONS[parseInt(m[1].slice(i, i + 2), 36)];
    if (!q || ids.includes(q.id)) return null;
    ids.push(q.id);
  }
  if (ids.length < 1 || ids.length > GAME.questionsPerDive) return null;
  return ids;
}
