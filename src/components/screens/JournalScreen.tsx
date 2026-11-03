import { JOURNAL } from '../../services/journal';
import { formatDepth } from '../../services/scoring';
import { ZONES } from '../../config/game';
import { Screen } from '../ui';

export default function JournalScreen({ bestDepth, onBack }: { bestDepth: number; onBack: () => void }) {
  const found = JOURNAL.filter((e) => bestDepth >= e.depth).length;
  return (
    <Screen title="Ocean Journal" onBack={onBack}>
      <p className="muted">
        Creatures you’ve met on your deepest dive ({formatDepth(bestDepth)}). {found} of {JOURNAL.length} discovered.
      </p>
      <ul className="journal">
        {JOURNAL.map((e) => {
          const open = bestDepth >= e.depth;
          const zone = ZONES.find((z) => e.depth >= z.from && e.depth < z.to);
          return (
            <li key={e.name} className={`card journal-entry${open ? '' : ' locked'}`}>
              <span className="j-emoji" aria-hidden="true">
                {open ? e.emoji : '❔'}
              </span>
              <div>
                <b>{open ? e.name : 'Undiscovered'}</b>
                <small className="muted">
                  {formatDepth(e.depth)} · {zone?.name}
                </small>
                <p>{open ? e.fact : `Dive to ${formatDepth(e.depth)} to discover this creature.`}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Screen>
  );
}
