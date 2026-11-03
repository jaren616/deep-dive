import { useState } from 'react';
import type { DiveRecord, DiveSetup, Settings } from '../../types';
import { QUESTION_BY_ID } from '../../data/questions';
import { MAX_SCORE, THEMES, zoneForDepth } from '../../config/game';
import { formatDepth } from '../../services/scoring';
import { copyText, shareText } from '../../services/share';
import { ACHIEVEMENTS } from '../../services/achievements';
import { makeSetup } from '../../services/engine';
import { dayNumber } from '../../services/daily';
import { TierBadge } from '../ui';

interface Props {
  dive: DiveRecord;
  newAchievements: string[];
  personalBest: boolean;
  settings: Settings;
  today: string;
  onHome: () => void;
  onAgain: (s: DiveSetup) => void;
}

const outcomeText = { timeout: '⏱️ Out of time', pass: '⏭️ Passed', missed: '✖️ Missed (left the dive)', correct: '' };

export default function ResultsScreen({ dive, newAchievements, personalBest, settings, today, onHome, onAgain }: Props) {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const text = shareText(dive);
  const zone = zoneForDepth(dive.depth);
  const correct = dive.rounds.filter((r) => r.outcome === 'correct').length;

  const again = (): DiveSetup | null => {
    if (dive.mode === 'classic') return makeSetup('classic');
    if (dive.mode === 'endless') return makeSetup('endless');
    if (dive.mode === 'theme' && dive.theme) return makeSetup('theme', { theme: dive.theme });
    return null;
  };
  const nextSetup = again();

  return (
    <main className="screen results">
      <section className="card results-hero">
        <span className="eyebrow">
          {dive.mode === 'daily' && dive.date ? `Daily Dive #${dayNumber(dive.date)}${dive.date !== today ? ` · ${dive.date}` : ''}` : dive.mode === 'archive' && dive.date ? `Archive · Daily #${dayNumber(dive.date)}` : dive.mode === 'endless' ? 'Endless dive' : dive.mode === 'theme' && dive.theme ? `${THEMES[dive.theme].name} dive` : dive.mode === 'custom' ? 'Custom challenge' : 'Quick dive'}
        </span>
        <h1 className="big-depth">{formatDepth(dive.depth)}</h1>
        <p className="zone-name">{zone.name}</p>
        <p className="muted">
          {dive.score}
          {dive.mode === 'endless' ? ' points' : ` / ${MAX_SCORE} points`} · {correct} of {dive.rounds.length} answered
        </p>
        {personalBest && <p className="pb">🎉 New personal best!</p>}
        <p className="zone-fact">🌊 {zone.fact}</p>
      </section>

      {newAchievements.length > 0 && (
        <section className="card achievements-new" aria-live="polite">
          <h2>Badges unlocked</h2>
          <ul>
            {newAchievements.map((id) => {
              const a = ACHIEVEMENTS.find((x) => x.id === id)!;
              return (
                <li key={id}>
                  <span className="ach-emoji">{a.emoji}</span>
                  <div>
                    <b>{a.name}</b>
                    <small>{a.description}</small>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="card share-card">
        <pre className="share-preview">{text}</pre>
        <button
          className="btn primary"
          onClick={async () => {
            setCopied((await copyText(text)) ? 'ok' : 'fail');
            setTimeout(() => setCopied('idle'), 2500);
          }}
        >
          {copied === 'ok' ? '✅ Copied!' : '📋 Copy result'}
        </button>
        {copied === 'fail' && <p className="msg bad small">Couldn’t copy automatically — select the text above and copy it.</p>}
      </section>

      <section className="card breakdown">
        <h2>Round by round</h2>
        <ol>
          {dive.rounds.map((r, i) => {
            const q = QUESTION_BY_ID[r.questionId];
            return (
              <li key={i}>
                <p className="muted small">{q?.prompt ?? r.questionId}</p>
                {r.outcome === 'correct' && r.tier ? (
                  <div className="row between">
                    <b>{r.answer}</b>
                    <TierBadge tier={r.tier} colorBlind={settings.colorBlind} small />
                  </div>
                ) : (
                  <p>{outcomeText[r.outcome]}</p>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="row center">
        <button className="btn ghost" onClick={onHome}>
          🏠 Home
        </button>
        {nextSetup && (
          <button className="btn primary" onClick={() => onAgain(nextSetup)}>
            Dive again
          </button>
        )}
      </div>
    </main>
  );
}
