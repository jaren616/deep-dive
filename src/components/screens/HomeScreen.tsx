import type { DiveRecord, DiveSetup, SaveData } from '../../types';
import type { Route } from '../../App';
import type { Stats } from '../../services/stats';
import { makeSetup } from '../../services/engine';
import { dayNumber } from '../../services/daily';
import { formatDepth } from '../../services/scoring';
import { roundEmoji } from '../../services/share';
import { GAME, MAX_DEPTH, THEMES } from '../../config/game';

interface Props {
  save: SaveData;
  stats: Stats;
  today: string;
  now: Date;
  onStart: (s: DiveSetup) => void;
  onResume: () => void;
  onAbandon: () => void;
  onViewDaily: (d: DiveRecord) => void;
  go: (r: Route) => void;
}

function untilMidnight(now: Date) {
  const m = new Date(now);
  m.setHours(24, 0, 0, 0);
  const mins = Math.max(0, Math.round((m.getTime() - now.getTime()) / 60000));
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const modeLabel = (s: DiveSetup) =>
  s.mode === 'daily' ? 'Daily Dive' : s.mode === 'archive' ? `Archive dive (${s.date})` : s.mode === 'endless' ? 'Endless dive' : s.mode === 'theme' && s.theme ? `${THEMES[s.theme].name} dive` : s.mode === 'custom' ? 'Custom challenge' : 'Quick dive';

export default function HomeScreen({ save, stats, today, now, onStart, onResume, onAbandon, onViewDaily, go }: Props) {
  const daily = save.dailyResults[today];
  const ip = save.inProgress;
  const dailyInProgress = ip?.setup.mode === 'daily' && ip.setup.date === today;

  return (
    <main className="screen home">
      <header className="hero">
        <div className="avatar" aria-hidden="true">
          {save.settings.avatar}
        </div>
        <h1>
          Deep <span>Dive</span>
        </h1>
        <p className="tagline">Name answers. The rarer the answer, the deeper you sink.</p>
      </header>

      {ip && (
        <section className="card resume-card">
          <div>
            <b>Dive in progress</b>
            <p className="muted small">
              {modeLabel(ip.setup)} · {ip.rounds.length} of {ip.setup.mode === 'endless' ? '∞' : ip.setup.questionIds.length} answered
            </p>
          </div>
          <div className="row">
            <button className="btn primary" onClick={onResume}>
              Resume
            </button>
            {ip.setup.mode !== 'daily' && (
              <button className="btn ghost small" onClick={onAbandon}>
                Discard
              </button>
            )}
          </div>
        </section>
      )}

      <section className="card daily-card">
        <div className="daily-head">
          <div>
            <span className="eyebrow">Daily Dive #{dayNumber(today)}</span>
            <h2>{daily ? `You reached ${formatDepth(daily.depth)}` : 'Today’s dive is ready'}</h2>
          </div>
          {stats.currentStreak > 0 && (
            <span className="streak" title="Daily streak">
              🔥 {stats.currentStreak}
            </span>
          )}
        </div>
        {daily ? (
          <>
            <p className="emoji-row" aria-label="Your rounds">
              {daily.rounds.map(roundEmoji).join(' ')}
            </p>
            <p className="muted small">Next dive in {untilMidnight(now)}. One official attempt per day.</p>
            <button className="btn ghost" onClick={() => onViewDaily(daily)}>
              View result & share
            </button>
          </>
        ) : (
          <>
            <p className="muted">7 questions · {GAME.secondsPerQuestion}s each · the same for everyone today. One attempt only.</p>
            <button className="btn primary big" onClick={() => (dailyInProgress ? onResume() : onStart(makeSetup('daily', { date: today })))}>
              {dailyInProgress ? 'Resume Daily Dive' : 'Start Daily Dive'}
            </button>
          </>
        )}
      </section>

      <section className="mode-grid" aria-label="Game modes">
        <button className="mode" onClick={() => onStart(makeSetup('classic'))}>
          <span className="mode-emoji">🤿</span>
          <b>Quick Dive</b>
          <small>7 random questions</small>
        </button>
        <button className="mode" onClick={() => onStart(makeSetup('endless'))}>
          <span className="mode-emoji">♾️</span>
          <b>Endless</b>
          <small>3 lives, how deep can you go?</small>
        </button>
        <button className="mode" onClick={() => go({ name: 'themes' })}>
          <span className="mode-emoji">🧭</span>
          <b>Themes</b>
          <small>Pick a category</small>
        </button>
        <button className="mode" onClick={() => go({ name: 'custom' })}>
          <span className="mode-emoji">🔗</span>
          <b>Challenges</b>
          <small>Make or play a code</small>
        </button>
        <button className="mode" onClick={() => go({ name: 'archive' })}>
          <span className="mode-emoji">🗓️</span>
          <b>Archive</b>
          <small>Last {GAME.archiveDays} days</small>
        </button>
        <button className="mode" onClick={() => go({ name: 'help' })}>
          <span className="mode-emoji">❓</span>
          <b>How to play</b>
          <small>Rules & rarity</small>
        </button>
      </section>

      <section className="card mini-stats">
        <div>
          <b>{formatDepth(stats.bestDepth)}</b>
          <small>Best depth</small>
        </div>
        <div>
          <b>{stats.totalDives}</b>
          <small>Dives</small>
        </div>
        <div>
          <b>{Object.keys(save.achievements).length}</b>
          <small>Badges</small>
        </div>
        <div className="depth-meter" aria-label={`Best depth ${Math.round((stats.bestDepth / MAX_DEPTH) * 100)}% of the trench`}>
          <div style={{ height: `${Math.min(100, (stats.bestDepth / MAX_DEPTH) * 100)}%` }} />
        </div>
      </section>

      <nav className="bottom-nav" aria-label="More">
        <button className="btn ghost" onClick={() => go({ name: 'stats' })}>
          📊 Stats
        </button>
        <button className="btn ghost" onClick={() => go({ name: 'achievements' })}>
          🏅 Badges
        </button>
        <button className="btn ghost" onClick={() => go({ name: 'journal' })}>
          📖 Journal
        </button>
        <button className="btn ghost" onClick={() => go({ name: 'settings' })}>
          ⚙️ Settings
        </button>
      </nav>
      <p className="footer-note">Scores and progress are saved in this browser only.</p>
    </main>
  );
}
