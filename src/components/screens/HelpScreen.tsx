import type { Settings } from '../../types';
import { TIERS } from '../../config/rarity';
import { GAME, MAX_DEPTH, MAX_SCORE, ZONES } from '../../config/game';
import { formatDepth } from '../../services/scoring';
import { Screen, TierBadge } from '../ui';

export default function HelpScreen({ settings, onBack }: { settings: Settings; onBack: () => void }) {
  return (
    <Screen title="How to play" onBack={onBack}>
      <section className="card prose">
        <ol>
          <li>Each dive has {GAME.questionsPerDive} questions like “Name a country in Africa”.</li>
          <li>Type <b>one</b> answer before the {GAME.secondsPerQuestion}-second air supply runs out. Wrong guesses cost nothing — keep trying.</li>
          <li>Common answers score a little; rare answers score a lot. Every point takes you {GAME.metresPerPoint} m deeper.</li>
          <li>You can’t use the same answer twice in one dive. Pass if you’re stuck.</li>
          <li>
            A perfect dive is {MAX_SCORE} points — {formatDepth(MAX_DEPTH)}, the bottom of the trench.
          </li>
        </ol>
        <p className="muted small">Spelling is forgiving: capitals, accents and punctuation don’t matter, and close typos get a “Did you mean…?” prompt. If a correct answer is rejected, flag it.</p>
      </section>
      <section className="card">
        <h2>Rarity tiers</h2>
        <ul className="tier-help">
          {TIERS.map((t) => (
            <li key={t.id}>
              <TierBadge tier={t.id} colorBlind={settings.colorBlind} />
              <span className="muted small">{t.blurb}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h2>Ocean zones</h2>
        <ul className="zone-help">
          {ZONES.map((z) => (
            <li key={z.name}>
              <span className="swatch" style={{ background: `linear-gradient(${z.top}, ${z.bottom})` }} />
              <b>{z.name}</b>
              <span className="muted small">
                {formatDepth(z.from)}+
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className="card prose">
        <h2>Modes</h2>
        <ul>
          <li><b>Daily Dive</b> — the same 7 questions for everyone, one per theme. One official attempt per day; leaving mid-question counts it as missed.</li>
          <li><b>Quick Dive</b> — 7 random questions, play as often as you like.</li>
          <li><b>Endless</b> — keep going until you’ve timed out or passed 3 times.</li>
          <li><b>Themes</b> — 7 questions from one category.</li>
          <li><b>Challenges</b> — pick questions, share the code, compare depths with friends.</li>
          <li><b>Archive</b> — replay the last 30 daily dives for practice.</li>
        </ul>
      </section>
    </Screen>
  );
}
