import type { Answer, DiveRecord, DiveSetup, Question, RoundOutcome, RoundResult } from '../types';
import { QUESTION_BY_ID, QUESTIONS, questionsForTheme } from '../data/questions';
import { GAME } from '../config/game';
import { matchAnswer, compact } from './answers';
import { depthForScore, pointsForTier, totalScore } from './scoring';
import { dailyQuestionIds } from './daily';
import { shuffle } from './random';
import type { ModeId, ThemeId } from '../types';

export interface DiveState {
  setup: DiveSetup;
  rounds: RoundResult[];
  index: number;
  lives: number | null; // null = no lives (fixed-length dives)
  usedAnswers: string[]; // compact canonical names used this dive
  finished: boolean;
}

export function makeSetup(mode: ModeId, opts: { date?: string; theme?: ThemeId; ids?: string[]; code?: string } = {}): DiveSetup {
  const n = GAME.questionsPerDive;
  switch (mode) {
    case 'daily':
    case 'archive':
      return { mode, date: opts.date, questionIds: dailyQuestionIds(opts.date!) };
    case 'theme':
      return { mode, theme: opts.theme, questionIds: shuffle(questionsForTheme(opts.theme!).map((q) => q.id)).slice(0, n) };
    case 'custom':
      return { mode, customCode: opts.code, questionIds: opts.ids ?? [] };
    case 'endless':
      return { mode, questionIds: shuffle(QUESTIONS.map((q) => q.id)), lives: GAME.endlessLives };
    case 'classic':
    default:
      return { mode: 'classic', questionIds: shuffle(QUESTIONS.map((q) => q.id)).slice(0, n) };
  }
}

export function startDive(setup: DiveSetup, rounds: RoundResult[] = []): DiveState {
  const lives = setup.lives ?? null;
  const lost = rounds.filter((r) => r.outcome !== 'correct').length;
  const state: DiveState = {
    setup,
    rounds,
    index: rounds.length,
    lives: lives === null ? null : Math.max(0, lives - lost),
    usedAnswers: rounds.filter((r) => r.answer).map((r) => compact(r.answer!)),
    finished: false,
  };
  return checkFinished(state);
}

export const currentQuestion = (s: DiveState): Question | null => (s.finished ? null : QUESTION_BY_ID[s.setup.questionIds[s.index]] ?? null);

function checkFinished(s: DiveState): DiveState {
  const done = s.index >= s.setup.questionIds.length || (s.lives !== null && s.lives <= 0);
  return done ? { ...s, finished: true } : s;
}

function closeRound(s: DiveState, result: RoundResult): DiveState {
  const lostLife = s.lives !== null && result.outcome !== 'correct';
  return checkFinished({
    ...s,
    rounds: [...s.rounds, result],
    index: s.index + 1,
    lives: lostLife ? s.lives! - 1 : s.lives,
    usedAnswers: result.answer ? [...s.usedAnswers, compact(result.answer)] : s.usedAnswers,
  });
}

export type Feedback =
  | { kind: 'correct'; state: DiveState; result: RoundResult; answer: Answer }
  | { kind: 'suggest'; answer: Answer }
  | { kind: 'duplicate'; answer: Answer }
  | { kind: 'invalid' }
  | { kind: 'empty' };

/** Try an answer. Wrong answers don't end the round — the diver can keep guessing until time runs out. */
export function submitAnswer(s: DiveState, typed: string, timeTaken: number): Feedback {
  const q = currentQuestion(s);
  if (!q) return { kind: 'empty' };
  const m = matchAnswer(q, typed);
  if (m.kind === 'empty') return { kind: 'empty' };
  if (m.kind === 'none') return { kind: 'invalid' };
  if (s.usedAnswers.includes(compact(m.answer.name))) return { kind: 'duplicate', answer: m.answer };
  if (m.kind === 'suggest') return { kind: 'suggest', answer: m.answer };
  return acceptAnswer(s, m.answer, typed, timeTaken);
}

/** Accept a specific answer (used after the diver confirms a typo suggestion). */
export function acceptAnswer(s: DiveState, answer: Answer, typed: string, timeTaken: number): Feedback & { kind: 'correct' } {
  const q = currentQuestion(s)!;
  const result: RoundResult = { questionId: q.id, outcome: 'correct', answer: answer.name, typed, tier: answer.tier, points: pointsForTier(answer.tier), timeTaken };
  return { kind: 'correct', state: closeRound(s, result), result, answer };
}

export function skipRound(s: DiveState, outcome: Exclude<RoundOutcome, 'correct'>, timeTaken: number): DiveState {
  const q = currentQuestion(s);
  if (!q) return s;
  return closeRound(s, { questionId: q.id, outcome, points: 0, timeTaken });
}

export function toRecord(s: DiveState, finishedAt = Date.now()): DiveRecord {
  const score = totalScore(s.rounds);
  return {
    id: `${s.setup.mode}-${finishedAt}-${Math.floor(Math.random() * 1e6)}`,
    mode: s.setup.mode,
    date: s.setup.date,
    theme: s.setup.theme,
    finishedAt,
    rounds: s.rounds,
    score,
    depth: depthForScore(score),
  };
}
