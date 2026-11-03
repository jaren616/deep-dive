import { QUESTION_DEFS, QUESTIONS } from './questions';
import { compact } from '../services/answers';
import { TIERS } from '../config/rarity';

describe('question bank content', () => {
  it('has unique question ids', () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every question has a common answer and at least 4 answers', () => {
    for (const q of QUESTIONS) {
      expect(q.answers.length, q.id).toBeGreaterThanOrEqual(4);
      expect(q.answers.some((a) => a.tier === 'plankton' || a.tier === 'shrimp'), q.id).toBe(true);
    }
  });

  it('no answer key is shared by two different answers in a question', () => {
    const problems: string[] = [];
    for (const q of QUESTIONS) {
      const seen = new Map<string, string>();
      for (const a of q.answers) {
        for (const k of a.keys) {
          const prev = seen.get(k);
          if (prev && prev !== a.name) problems.push(`${q.id}: "${k}" in "${prev}" and "${a.name}"`);
          seen.set(k, a.name);
        }
      }
      const names = q.answers.map((a) => compact(a.name));
      names.forEach((n, i) => {
        if (names.indexOf(n) !== i) problems.push(`${q.id}: duplicate answer "${q.answers[i].name}"`);
      });
    }
    expect(problems).toEqual([]);
  });

  it('only uses known tiers and non-empty entries', () => {
    const ids = new Set(TIERS.map((t) => t.id));
    for (const d of QUESTION_DEFS) {
      for (const [tier, list] of Object.entries(d.answers)) {
        expect(ids.has(tier as never), `${d.id} tier ${tier}`).toBe(true);
        for (const e of list ?? []) expect(e.trim().length, d.id).toBeGreaterThan(0);
      }
    }
  });

  it('has enough questions for every theme', () => {
    const byTheme: Record<string, number> = {};
    for (const q of QUESTIONS) byTheme[q.theme] = (byTheme[q.theme] ?? 0) + 1;
    for (const n of Object.values(byTheme)) expect(n).toBeGreaterThanOrEqual(7);
  });
});
