import type { SaveData } from '../../types';
import { ACHIEVEMENTS } from '../../services/achievements';
import { Screen } from '../ui';

export default function AchievementsScreen({ save, onBack }: { save: SaveData; onBack: () => void }) {
  const got = Object.keys(save.achievements).length;
  return (
    <Screen title="Badges" onBack={onBack}>
      <p className="muted">
        {got} of {ACHIEVEMENTS.length} unlocked
      </p>
      <ul className="badge-grid">
        {ACHIEVEMENTS.map((a) => {
          const at = save.achievements[a.id];
          return (
            <li key={a.id} className={`card badge${at ? ' unlocked' : ''}`}>
              <span className="ach-emoji" aria-hidden="true">
                {at ? a.emoji : '🔒'}
              </span>
              <b>{a.name}</b>
              <small>{a.description}</small>
              {at && <small className="muted">Unlocked {new Date(at).toLocaleDateString()}</small>}
            </li>
          );
        })}
      </ul>
    </Screen>
  );
}
