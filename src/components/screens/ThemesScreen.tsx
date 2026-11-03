import type { DiveSetup, ThemeId } from '../../types';
import { THEMES } from '../../config/game';
import { questionsForTheme } from '../../data/questions';
import { makeSetup } from '../../services/engine';
import { Screen } from '../ui';

export default function ThemesScreen({ onBack, onStart }: { onBack: () => void; onStart: (s: DiveSetup) => void }) {
  return (
    <Screen title="Theme dives" onBack={onBack}>
      <p className="muted">Seven questions from one category. Great for practising your weakest theme.</p>
      <div className="mode-grid">
        {(Object.keys(THEMES) as ThemeId[]).map((t) => (
          <button key={t} className="mode" onClick={() => onStart(makeSetup('theme', { theme: t }))}>
            <span className="mode-emoji">{THEMES[t].emoji}</span>
            <b>{THEMES[t].name}</b>
            <small>{questionsForTheme(t).length} questions</small>
          </button>
        ))}
      </div>
    </Screen>
  );
}
