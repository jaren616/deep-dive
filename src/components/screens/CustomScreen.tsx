import { useMemo, useState } from 'react';
import type { DiveSetup, ThemeId } from '../../types';
import { GAME, THEMES } from '../../config/game';
import { QUESTIONS, QUESTION_BY_ID } from '../../data/questions';
import { decodeChallenge, encodeChallenge } from '../../services/challenge';
import { makeSetup } from '../../services/engine';
import { shuffle } from '../../services/random';
import { copyText } from '../../services/share';
import { Screen } from '../ui';

export default function CustomScreen({ initialCode, onBack, onStart }: { initialCode?: string; onBack: () => void; onStart: (s: DiveSetup) => void }) {
  const [code, setCode] = useState(initialCode ?? '');
  const [picked, setPicked] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const decoded = useMemo(() => (code.trim() ? decodeChallenge(code) : null), [code]);
  const myCode = picked.length ? encodeChallenge(picked) : '';
  const link = myCode ? `${window.location.origin}${window.location.pathname}#c=${myCode}` : '';

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= GAME.questionsPerDive ? p : [...p, id]));

  return (
    <Screen title="Challenges" onBack={onBack} wide>
      <section className="card">
        <h2>Play a challenge</h2>
        <p className="muted small">Got a code from a friend? Enter it to dive the same questions, then compare depths.</p>
        <form
          className="answer-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (decoded) onStart(makeSetup('custom', { ids: decoded, code: code.trim().toUpperCase() }));
          }}
        >
          <label htmlFor="code" className="sr-only">
            Challenge code
          </label>
          <input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="DD-…" autoComplete="off" autoCapitalize="characters" spellCheck={false} />
          <button className="btn primary" disabled={!decoded}>
            Play
          </button>
        </form>
        {code.trim() && !decoded && <p className="msg bad small">That code doesn’t look right — check for typos.</p>}
        {decoded && (
          <ol className="code-preview small">
            {decoded.map((id) => (
              <li key={id}>{QUESTION_BY_ID[id].prompt}</li>
            ))}
          </ol>
        )}
      </section>

      <section className="card">
        <div className="row between">
          <h2>Make a challenge</h2>
          <span className="muted small">
            {picked.length}/{GAME.questionsPerDive} picked
          </span>
        </div>
        <div className="row wrap">
          <button className="btn ghost small" onClick={() => setPicked(shuffle(QUESTIONS.map((q) => q.id)).slice(0, GAME.questionsPerDive))}>
            🎲 Random 7
          </button>
          <button className="btn ghost small" onClick={() => setPicked([])} disabled={!picked.length}>
            Clear
          </button>
        </div>
        {myCode && (
          <div className="made-code">
            <p>
              Your code: <b className="code">{myCode}</b>
            </p>
            <div className="row wrap">
              <button
                className="btn primary small"
                onClick={async () => {
                  setCopied(await copyText(`Can you out-dive me? Deep Dive challenge ${myCode}\n${link}`));
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? '✅ Copied' : '📋 Copy code & link'}
              </button>
              <button className="btn ghost small" onClick={() => onStart(makeSetup('custom', { ids: picked, code: myCode }))}>
                Play it myself
              </button>
            </div>
          </div>
        )}
        {(Object.keys(THEMES) as ThemeId[]).map((t) => (
          <details key={t} className="picker-group">
            <summary>
              {THEMES[t].emoji} {THEMES[t].name}
              <span className="muted small"> · {picked.filter((id) => QUESTION_BY_ID[id].theme === t).length} picked</span>
            </summary>
            <ul>
              {QUESTIONS.filter((q) => q.theme === t).map((q) => (
                <li key={q.id}>
                  <label className="check">
                    <input type="checkbox" checked={picked.includes(q.id)} onChange={() => toggle(q.id)} disabled={!picked.includes(q.id) && picked.length >= GAME.questionsPerDive} />
                    {q.prompt}
                  </label>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </section>
    </Screen>
  );
}
