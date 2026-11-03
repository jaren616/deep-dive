import { normalize, compact, editDistance, matchAnswer, buildQuestion } from './answers';
import { dailyQuestionIds, dayNumber, addDays, archiveDates, todayKey } from './daily';
import { encodeChallenge, decodeChallenge } from './challenge';
import { makeSetup, startDive, submitAnswer, acceptAnswer, skipRound, currentQuestion, toRecord } from './engine';
import { sanitize, loadSave, writeSave, emptySave, type KV } from './storage';
import { computeStats, dailyStreaks } from './stats';
import { evaluateAchievements } from './achievements';
import { depthForScore, totalScore } from './scoring';
import { QUESTIONS } from '../data/questions';
import { GAME, MAX_SCORE, zoneForDepth } from '../config/game';
import type { DiveRecord } from '../types';

const q = buildQuestion({
  id: 't',
  theme: 'geography',
  prompt: 'test',
  answers: { plankton: ['United States|USA|America'], octopus: ['Côte d\'Ivoire|Ivory Coast'], krillion: ['Spider-Man|Spiderman'] },
});

class MemKV implements KV {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

describe('answer matching', () => {
  it('normalises case, accents, punctuation and articles', () => {
    expect(normalize('  The CÔTE d’Ivoire!! ')).toBe('cote divoire');
    expect(compact('Spider Man')).toBe('spiderman');
    expect(normalize('Tom & Jerry')).toBe('tom and jerry');
  });
  it('matches aliases exactly', () => {
    expect(matchAnswer(q, 'usa')).toMatchObject({ kind: 'exact', answer: { name: 'United States' } });
    expect(matchAnswer(q, 'cote divoire')).toMatchObject({ kind: 'exact' });
    expect(matchAnswer(q, 'spider-man')).toMatchObject({ kind: 'exact', answer: { tier: 'krillion' } });
  });
  it('accepts simple plurals', () => {
    expect(matchAnswer(q, 'americas')).toMatchObject({ kind: 'exact' });
  });
  it('suggests close typos but not for very short words', () => {
    expect(matchAnswer(q, 'Amerika')).toMatchObject({ kind: 'suggest', answer: { name: 'United States' } });
    expect(matchAnswer(q, 'usb')).toEqual({ kind: 'none' });
  });
  it('rejects unrelated and empty answers', () => {
    expect(matchAnswer(q, 'banana')).toEqual({ kind: 'none' });
    expect(matchAnswer(q, '   ')).toEqual({ kind: 'empty' });
  });
  it('computes edit distance', () => {
    expect(editDistance('kitten', 'sitting')).toBe(3);
    expect(editDistance('abc', 'abc')).toBe(0);
    expect(editDistance('abcdef', 'zzzzzz', 2)).toBeGreaterThan(2);
  });
});

describe('scoring', () => {
  it('converts points to depth', () => {
    expect(depthForScore(185)).toBe(1850);
    expect(MAX_SCORE).toBe(700);
    expect(zoneForDepth(0).name).toBe('Sunlight Zone');
    expect(zoneForDepth(7000).name).toBe('Hadal Trench');
  });
  it('sums round points', () => {
    expect(totalScore([{ questionId: 'a', outcome: 'correct', points: 10, timeTaken: 1 }, { questionId: 'b', outcome: 'timeout', points: 0, timeTaken: 25 }])).toBe(10);
  });
});

describe('daily dive', () => {
  it('is deterministic per date and has one question per theme', () => {
    const a = dailyQuestionIds('2026-11-03');
    expect(a).toEqual(dailyQuestionIds('2026-11-03'));
    expect(a).toHaveLength(GAME.questionsPerDive);
    expect(new Set(a).size).toBe(a.length);
    const themes = a.map((id) => QUESTIONS.find((x) => x.id === id)!.theme);
    expect(new Set(themes).size).toBe(7);
  });
  it('differs between days', () => {
    expect(dailyQuestionIds('2026-11-03')).not.toEqual(dailyQuestionIds('2026-11-04'));
  });
  it('numbers days and walks dates', () => {
    expect(dayNumber('2026-01-01')).toBe(1);
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(archiveDates('2026-11-03')).toHaveLength(30);
    expect(archiveDates('2026-01-03')).toEqual(['2026-01-02', '2026-01-01']);
    expect(todayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('challenge codes', () => {
  it('round-trips', () => {
    const ids = QUESTIONS.slice(0, 7).map((x) => x.id);
    const code = encodeChallenge(ids);
    expect(code).toMatch(/^DD-[0-9A-Z]{14}$/);
    expect(decodeChallenge(code.toLowerCase())).toEqual(ids);
  });
  it('rejects bad codes', () => {
    expect(decodeChallenge('hello')).toBeNull();
    expect(decodeChallenge('DD-ZZZ')).toBeNull();
    expect(decodeChallenge('DD-0000')).toBeNull(); // repeated question
  });
});

describe('engine', () => {
  const firstAnswer = (s: ReturnType<typeof startDive>) => currentQuestion(s)!.answers[0];

  it('plays a full 7-question dive', () => {
    let s = startDive(makeSetup('classic'));
    for (let i = 0; i < 7; i++) {
      const fb = submitAnswer(s, firstAnswer(s).name, 2);
      if (fb.kind === 'duplicate') { s = skipRound(s, 'pass', 2); continue; }
      expect(fb.kind).toBe('correct');
      if (fb.kind === 'correct') s = fb.state;
    }
    expect(s.finished).toBe(true);
    const rec = toRecord(s);
    expect(rec.depth).toBe(rec.score * 10);
  });

  it('keeps the round open on a wrong answer', () => {
    const s = startDive(makeSetup('classic'));
    expect(submitAnswer(s, 'zzzzzzzzqqq', 1).kind).toBe('invalid');
    expect(currentQuestion(s)).not.toBeNull();
  });

  it('blocks reusing an answer in the same dive', () => {
    const s0 = startDive(makeSetup('custom', { ids: ['gam-nintendo-char', 'gam-mario-kart'] }));
    const fb = submitAnswer(s0, 'Mario', 1);
    expect(fb.kind).toBe('correct');
    if (fb.kind !== 'correct') return;
    expect(submitAnswer(fb.state, 'mario', 1).kind).toBe('duplicate');
  });

  it('scores timeouts and passes as zero', () => {
    let s = startDive(makeSetup('classic'));
    s = skipRound(s, 'timeout', 25);
    s = skipRound(s, 'pass', 4);
    expect(s.rounds.map((r) => r.points)).toEqual([0, 0]);
    expect(s.index).toBe(2);
  });

  it('ends endless mode when lives run out', () => {
    let s = startDive(makeSetup('endless'));
    expect(s.lives).toBe(3);
    s = skipRound(skipRound(skipRound(s, 'timeout', 25), 'pass', 1), 'timeout', 25);
    expect(s.finished).toBe(true);
  });

  it('resumes with lives and used answers restored', () => {
    const s = startDive({ mode: 'endless', questionIds: QUESTIONS.map((x) => x.id), lives: 3 }, [
      { questionId: QUESTIONS[0].id, outcome: 'timeout', points: 0, timeTaken: 25 },
      { questionId: QUESTIONS[1].id, outcome: 'correct', answer: 'Texas', tier: 'plankton', points: 10, timeTaken: 3 },
    ]);
    expect(s.lives).toBe(2);
    expect(s.index).toBe(2);
    expect(s.usedAnswers).toContain('texas');
  });

  it('accepts a confirmed suggestion', () => {
    const s = startDive(makeSetup('custom', { ids: ['geo-us-state'] }));
    const fb = submitAnswer(s, 'Califonia', 3);
    expect(fb.kind).toBe('suggest');
    if (fb.kind !== 'suggest') return;
    const ok = acceptAnswer(s, fb.answer, 'Califonia', 3);
    expect(ok.result.points).toBe(10);
    expect(ok.state.finished).toBe(true);
  });
});

const dive = (over: Partial<DiveRecord> = {}): DiveRecord => ({
  id: Math.random().toString(),
  mode: 'classic',
  finishedAt: 1,
  rounds: [{ questionId: 'geo-us-state', outcome: 'correct', answer: 'Texas', tier: 'plankton', points: 10, timeTaken: 2 }],
  score: 10,
  depth: 100,
  ...over,
});

describe('storage', () => {
  it('round-trips a save', () => {
    const kv = new MemKV();
    const save = emptySave();
    save.dives.push(dive());
    expect(writeSave(save, kv)).toBe(true);
    expect(loadSave(kv).data.dives).toHaveLength(1);
  });
  it('recovers from corrupt JSON and keeps a backup', () => {
    const kv = new MemKV();
    kv.setItem(GAME.storageKey, '{not json');
    const r = loadSave(kv);
    expect(r.recovered).toBe(true);
    expect(r.data.dives).toEqual([]);
    expect(kv.getItem(`${GAME.storageKey}-corrupt-backup`)).toBe('{not json');
  });
  it('drops invalid parts but keeps valid ones', () => {
    const s = sanitize({ dives: [dive(), { bad: true }], dailyResults: { nope: dive(), '2026-11-01': dive() }, settings: { sound: false } });
    expect(s.dives).toHaveLength(1);
    expect(Object.keys(s.dailyResults)).toEqual(['2026-11-01']);
    expect(s.settings.sound).toBe(false);
    expect(s.settings.textSize).toBe('normal');
    expect(sanitize(null).dives).toEqual([]);
  });
  it('works without storage', () => {
    expect(loadSave(null).recovered).toBe(false);
    expect(writeSave(emptySave(), null)).toBe(false);
  });
});

describe('stats and achievements', () => {
  it('computes streaks', () => {
    expect(dailyStreaks(['2026-11-01', '2026-11-02', '2026-11-03'], '2026-11-03')).toEqual({ current: 3, longest: 3 });
    expect(dailyStreaks(['2026-11-01', '2026-11-02'], '2026-11-03').current).toBe(2); // today not played yet
    expect(dailyStreaks(['2026-10-01', '2026-11-02'], '2026-11-04')).toEqual({ current: 0, longest: 1 });
  });
  it('computes totals', () => {
    const save = emptySave();
    save.dives.push(dive({ score: 100, depth: 1000 }), dive({ score: 300, depth: 3000 }));
    const st = computeStats(save, '2026-11-03');
    expect(st.totalDives).toBe(2);
    expect(st.bestDepth).toBe(3000);
    expect(st.averageScore).toBe(200);
    expect(st.tierCounts.plankton).toBe(2);
  });
  it('unlocks achievements once', () => {
    const save = emptySave();
    const d = dive({ score: 700, depth: 7000, rounds: Array.from({ length: 7 }, () => ({ questionId: 'geo-us-state', outcome: 'correct' as const, tier: 'krillion' as const, points: 100, timeTaken: 2 })) });
    save.dives.push(d);
    const got = evaluateAchievements(save, d, '2026-11-03');
    expect(got).toEqual(expect.arrayContaining(['first-dive', 'perfect', 'krillion', 'hadal', 'quick', 'clean', 'rare-trio']));
    for (const id of got) save.achievements[id] = 1;
    expect(evaluateAchievements(save, d, '2026-11-03')).toEqual([]);
  });
});
