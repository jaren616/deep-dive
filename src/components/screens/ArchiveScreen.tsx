import type { DiveSetup, SaveData } from '../../types';
import { archiveDates, dayNumber } from '../../services/daily';
import { makeSetup } from '../../services/engine';
import { formatDepth } from '../../services/scoring';
import { Screen } from '../ui';

export default function ArchiveScreen({ save, today, onBack, onStart }: { save: SaveData; today: string; onBack: () => void; onStart: (s: DiveSetup) => void }) {
  const dates = archiveDates(today);
  const best = (date: string) => {
    const scores = save.dives.filter((d) => (d.mode === 'archive' || d.mode === 'daily') && d.date === date).map((d) => d.depth);
    return scores.length ? Math.max(...scores) : null;
  };
  return (
    <Screen title="Daily archive" onBack={onBack}>
      <p className="muted">Replay any of the last {dates.length} Daily Dives. Archive dives are for practice and don’t change your daily streak.</p>
      {dates.length === 0 ? (
        <p className="muted">No past dives yet — check back tomorrow.</p>
      ) : (
        <ul className="archive-list">
          {dates.map((d) => {
            const b = best(d);
            const official = save.dailyResults[d];
            return (
              <li key={d}>
                <button className="history-row" onClick={() => onStart(makeSetup('archive', { date: d }))}>
                  <span className="mode-tag">#{dayNumber(d)}</span>
                  <span>{new Date(d + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <b>{official ? `★ ${formatDepth(official.depth)}` : b !== null ? formatDepth(b) : 'Play'}</b>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Screen>
  );
}
