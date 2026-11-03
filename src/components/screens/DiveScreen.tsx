import { useCallback, useEffect, useRef, useState } from 'react';
import type { Answer, Question, RoundResult, Settings } from '../../types';
import { GAME, THEMES, zoneForDepth } from '../../config/game';
import { TIERS, TIER_BY_ID, tierIndex } from '../../config/rarity';
import { acceptAnswer, currentQuestion, skipRound, submitAnswer, type DiveState } from '../../services/engine';
import { depthForScore, formatDepth, totalScore } from '../../services/scoring';
import { audio } from '../../services/audio';
import { roundEmoji } from '../../services/share';
import { TierBadge, tierColor } from '../ui';

interface Props {
  initial: DiveState;
  settings: Settings;
  onShown: (index: number) => void;
  onRound: (s: DiveState) => void;
  onFinish: (s: DiveState) => void;
  onQuit: () => void;
  onFlag: (questionId: string, typed: string) => void;
  onDepth: (m: number) => void;
  onBurst: (color: string) => void;
}

type Msg = { tone: 'bad' | 'info'; text: string } | null;

interface Reveal {
  question: Question;
  result: RoundResult;
  examples: Answer[];
}

/** A few rarer answers to show after each round, so divers learn something. */
function pickExamples(q: Question, used?: string): Answer[] {
  const rare = q.answers.filter((a) => a.name !== used && tierIndex(a.tier) >= 3);
  const pool = rare.length >= 3 ? rare : q.answers.filter((a) => a.name !== used);
  const out: Answer[] = [];
  const copy = [...pool];
  while (out.length < 3 && copy.length) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out.sort((a, b) => tierIndex(b.tier) - tierIndex(a.tier));
}

export default function DiveScreen({ initial, settings, onShown, onRound, onFinish, onQuit, onFlag, onDepth, onBurst }: Props) {
  const [state, setState] = useState(initial);
  const [phase, setPhase] = useState<'question' | 'reveal'>('question');
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<Msg>(null);
  const [suggestion, setSuggestion] = useState<Answer | null>(null);
  const [lastWrong, setLastWrong] = useState<string | null>(null);
  const [flagged, setFlagged] = useState(false);
  const [shake, setShake] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME.secondsPerQuestion);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const startedAt = useRef(performance.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const lastTick = useRef(99);

  const q = currentQuestion(state);
  const score = totalScore(state.rounds);
  const depth = depthForScore(score);
  const elapsed = () => Math.min(GAME.secondsPerQuestion, (performance.now() - startedAt.current) / 1000);

  useEffect(() => onDepth(depth), [depth, onDepth]);

  // Start of each question: reset the clock and tell the app it is on screen.
  useEffect(() => {
    if (phase !== 'question' || !q) return;
    startedAt.current = performance.now();
    lastTick.current = 99;
    setTimeLeft(GAME.secondsPerQuestion);
    setInput('');
    setMsg(null);
    setSuggestion(null);
    setLastWrong(null);
    setFlagged(false);
    onShown(state.index);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, state.index]);

  const closeRound = useCallback(
    (next: DiveState, result: RoundResult, question: Question) => {
      setState(next);
      onRound(next);
      setReveal({ question, result, examples: pickExamples(question, result.answer) });
      setPhase('reveal');
    },
    [onRound],
  );

  // Countdown. Uses wall-clock time so switching tabs doesn't pause it.
  useEffect(() => {
    if (phase !== 'question' || !q) return;
    const id = setInterval(() => {
      const left = Math.max(0, GAME.secondsPerQuestion - (performance.now() - startedAt.current) / 1000);
      setTimeLeft(left);
      const whole = Math.ceil(left);
      if (whole <= 5 && whole > 0 && whole < lastTick.current) {
        lastTick.current = whole;
        audio.tick();
      }
      if (left <= 0) {
        clearInterval(id);
        audio.timeout();
        const next = skipRound(state, 'timeout', GAME.secondsPerQuestion);
        closeRound(next, next.rounds[next.rounds.length - 1], q);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase, q, state, closeRound]);

  useEffect(() => {
    if (phase === 'reveal') setTimeout(() => nextRef.current?.focus(), 50);
  }, [phase]);

  const win = (fb: ReturnType<typeof acceptAnswer>) => {
    audio.correct(fb.answer.tier);
    onBurst(tierColor(fb.answer.tier, settings.colorBlind));
    closeRound(fb.state, fb.result, q!);
  };

  const submit = () => {
    if (phase !== 'question' || !q) return;
    audio.unlock();
    const typed = input.trim();
    const fb = submitAnswer(state, typed, elapsed());
    setSuggestion(null);
    switch (fb.kind) {
      case 'empty':
        return;
      case 'correct':
        return win(fb);
      case 'suggest':
        setSuggestion(fb.answer);
        setMsg({ tone: 'info', text: '' });
        return;
      case 'duplicate':
        audio.wrong();
        setShake((n) => n + 1);
        setMsg({ tone: 'bad', text: `You already used “${fb.answer.name}” this dive.` });
        return;
      case 'invalid':
        audio.wrong();
        setShake((n) => n + 1);
        setLastWrong(typed);
        setFlagged(false);
        setMsg({ tone: 'bad', text: `“${typed}” isn’t on our list. Try another!` });
        setInput('');
    }
  };

  const confirmSuggestion = () => {
    if (!suggestion || !q) return;
    win(acceptAnswer(state, suggestion, input.trim(), elapsed()));
  };

  const pass = () => {
    if (phase !== 'question' || !q) return;
    audio.click();
    const next = skipRound(state, 'pass', elapsed());
    closeRound(next, next.rounds[next.rounds.length - 1], q);
  };

  const advance = () => {
    audio.click();
    if (state.finished) onFinish(state);
    else {
      setReveal(null);
      setPhase('question');
    }
  };

  const total = state.setup.questionIds.length;
  const endless = state.lives !== null;
  const pct = timeLeft / GAME.secondsPerQuestion;
  const zone = zoneForDepth(depth);
  const rq = reveal?.question ?? q;
  const theme = rq ? THEMES[rq.theme] : null;

  return (
    <main className="screen dive-screen">
      <div className="dive-top">
        <button className="btn ghost small" onClick={() => setConfirmQuit(true)}>
          ✕ Leave
        </button>
        <div className="dive-progress" aria-label="Rounds">
          {endless ? (
            <span className="lives" aria-label={`${state.lives} lives left`}>
              {'🫧'.repeat(state.lives ?? 0)}
              <span className="lost">{'·'.repeat(Math.max(0, GAME.endlessLives - (state.lives ?? 0)))}</span>
              <span className="round-count">Q{state.rounds.length + (phase === 'question' ? 1 : 0)}</span>
            </span>
          ) : (
            Array.from({ length: total }, (_, i) => {
              const r = state.rounds[i];
              const isCur = i === state.rounds.length && phase === 'question';
              return (
                <span key={i} className={`pip${isCur ? ' current' : ''}${r ? ' done' : ''}`} title={r ? `${r.points} pts` : undefined}>
                  {r ? roundEmoji(r) : i + 1}
                </span>
              );
            })
          )}
        </div>
        <div className="depth-readout" aria-live="polite">
          <b>{formatDepth(depth)}</b>
          <small>{zone.name}</small>
        </div>
      </div>

      {phase === 'question' && q && (
        <section className="card question-card" aria-labelledby="prompt">
          <div className="q-meta">
            <span className="theme-chip">
              {theme?.emoji} {theme?.name}
            </span>
            {!endless && (
              <span>
                Question {state.index + 1} of {total}
              </span>
            )}
          </div>
          <h2 id="prompt" className="prompt">
            {q.prompt}
          </h2>
          {q.hint && <p className="hint">{q.hint}</p>}

          <div className={`timer${pct < 0.2 ? ' urgent' : ''}`} role="timer" aria-label={`${Math.ceil(timeLeft)} seconds left`}>
            <div className="timer-fill" style={{ transform: `scaleX(${pct})` }} />
            <span>{Math.ceil(timeLeft)}s</span>
          </div>

          <form
            className={`answer-form${shake ? ' shake' : ''}`}
            key={shake}
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <label htmlFor="answer" className="sr-only">
              Your answer
            </label>
            <input
              id="answer"
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (suggestion) setSuggestion(null);
              }}
              placeholder="Type an answer…"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              maxLength={80}
              enterKeyHint="go"
            />
            <button className="btn primary" type="submit" disabled={!input.trim()}>
              Dive
            </button>
          </form>

          <div className="feedback" aria-live="assertive">
            {suggestion ? (
              <div className="suggest">
                Did you mean <b>{suggestion.name}</b>?
                <div className="row">
                  <button className="btn primary small" onClick={confirmSuggestion}>
                    Yes, that
                  </button>
                  <button
                    className="btn ghost small"
                    onClick={() => {
                      setSuggestion(null);
                      setMsg(null);
                      inputRef.current?.focus();
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              msg?.text && <p className={`msg ${msg.tone}`}>{msg.text}</p>
            )}
            {lastWrong && !suggestion && (
              <button
                className="btn link small"
                disabled={flagged}
                onClick={() => {
                  onFlag(q.id, lastWrong);
                  setFlagged(true);
                }}
              >
                {flagged ? '🚩 Flagged for review — thanks!' : `🚩 Think “${lastWrong}” should count? Flag it`}
              </button>
            )}
          </div>

          <div className="q-actions">
            <button className="btn ghost" onClick={pass}>
              Pass ⏭️
            </button>
            <span className="muted small">Wrong answers cost nothing — keep guessing!</span>
          </div>
        </section>
      )}

      {phase === 'reveal' && reveal && (
        <section className="card reveal-card" aria-live="polite">
          <p className="muted">{reveal.question.prompt}</p>
          {reveal.result.outcome === 'correct' && reveal.result.tier ? (
            <div className={`reveal-hit tier-${reveal.result.tier}`} style={{ ['--tier' as string]: tierColor(reveal.result.tier, settings.colorBlind) }}>
              <div className="reveal-emoji" aria-hidden="true">
                {TIER_BY_ID[reveal.result.tier].emoji}
              </div>
              <h2>{reveal.result.answer}</h2>
              <TierBadge tier={reveal.result.tier} colorBlind={settings.colorBlind} />
              <p className="muted">{TIER_BY_ID[reveal.result.tier].blurb}</p>
              <p className="descent">
                ⬇ +{formatDepth(depthForScore(reveal.result.points))} · answered in {reveal.result.timeTaken.toFixed(1)}s
              </p>
            </div>
          ) : (
            <div className="reveal-miss">
              <div className="reveal-emoji" aria-hidden="true">
                {reveal.result.outcome === 'timeout' ? '⏱️' : '⏭️'}
              </div>
              <h2>{reveal.result.outcome === 'timeout' ? 'Out of air!' : 'Passed'}</h2>
              <p className="muted">{endless ? `You lost a life. ${state.lives} left.` : 'No points this round.'}</p>
            </div>
          )}
          {reveal.examples.length > 0 && (
            <div className="examples">
              <p className="muted small">Other divers found:</p>
              <ul>
                {reveal.examples.map((a) => (
                  <li key={a.name}>
                    <span>{a.name}</span> <TierBadge tier={a.tier} colorBlind={settings.colorBlind} small />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button ref={nextRef} className="btn primary big" onClick={advance}>
            {state.finished ? 'Surface & see results' : 'Next question →'}
          </button>
        </section>
      )}

      <aside className="tier-legend" aria-label="Rarity tiers">
        {TIERS.map((t) => (
          <span key={t.id} style={{ ['--tier' as string]: tierColor(t.id, settings.colorBlind) }} title={`${t.name}: ${t.points} points`}>
            {t.emoji}
            <b>{t.points}</b>
          </span>
        ))}
      </aside>

      {confirmQuit && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="quit-title">
          <div className="card modal">
            <h2 id="quit-title">Leave this dive?</h2>
            <p>Your dive is saved and you can resume it from the home screen. The question on screen now will count as missed.</p>
            <div className="row">
              <button className="btn ghost" onClick={() => setConfirmQuit(false)}>
                Keep diving
              </button>
              <button className="btn danger" onClick={onQuit}>
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
