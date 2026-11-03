import type { DiveRecord, SaveData, Settings } from '../../types';
import type { Stats } from '../../services/stats';
import { TIERS } from '../../config/rarity';
import { THEMES } from '../../config/game';
import { formatDepth } from '../../services/scoring';
import { roundEmoji } from '../../services/share';
import { Screen, tierColor } from '../ui';

interface Props {
  save: SaveData;
  stats: Stats;
  settings: Settings;
  onBack: () => void;
  onOpen: (d: DiveRecord) => void;
}

const modeName: Record<string, string> = { daily: 'Daily', archive: 'Archive', classic: 'Quick', endless: 'Endless', theme: 'Theme', custom: 'Challenge' };

export default function StatsScreen({ save, stats, settings, onBack, onOpen }: Props) {
  const maxTier = Math.max(1, ...Object.values(stats.tierCounts));
  const recent = [...save.dives].reverse().slice(0, 15);
  const tiles: [string, string][] = [
    ['Dives', String(stats.totalDives)],
    ['Best depth', formatDepth(stats.bestDepth)],
    ['Best score', String(stats.bestScore)],
    ['Average score', String(stats.averageScore)],
    ['Answer rate', `${Math.round(stats.accuracy * 100)}%`],
    ['Daily streak', `${stats.currentStreak} (best ${stats.longestStreak})`],
    ['Dailies played', String(stats.dailiesPlayed)],
    ['Best Endless', `${stats.bestEndless} correct`],
    ['Favourite theme', stats.favouriteTheme ? `${THEMES[stats.favouriteTheme].emoji} ${THEMES[stats.favouriteTheme].name}` : '—'],
  ];
  return (
    <Screen title="Your stats" onBack={onBack}>
      <section className="stat-grid">
        {tiles.map(([label, value]) => (
          <div className="card stat" key={label}>
            <b>{value}</b>
            <small>{label}</small>
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Answers by rarity</h2>
        <div className="tier-bars">
          {TIERS.map((t) => (
            <div className="tier-bar" key={t.id}>
              <span className="label">
                {t.emoji} {t.name}
              </span>
              <div className="bar">
                <div style={{ width: `${(stats.tierCounts[t.id] / maxTier) * 100}%`, background: tierColor(t.id, settings.colorBlind) }} />
              </div>
              <span className="count">{stats.tierCounts[t.id]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Recent dives</h2>
        {recent.length === 0 ? (
          <p className="muted">No dives yet — your history will appear here.</p>
        ) : (
          <ul className="history">
            {recent.map((d) => (
              <li key={d.id}>
                <button className="history-row" onClick={() => onOpen(d)}>
                  <span className="mode-tag">{modeName[d.mode] ?? d.mode}</span>
                  <span className="emoji-mini">{d.rounds.slice(0, 10).map(roundEmoji).join('')}</span>
                  <b>{formatDepth(d.depth)}</b>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Screen>
  );
}
