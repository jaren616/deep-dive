import { useState } from 'react';
import type { SaveData, Settings } from '../../types';
import { QUESTION_BY_ID } from '../../data/questions';
import { audio } from '../../services/audio';
import { copyText } from '../../services/share';
import { Screen } from '../ui';

const AVATARS = ['🤿', '🐙', '🦈', '🐢', '🐬', '🦑', '🐡', '🦀', '🐳', '🪼', '🧜', '🚤'];

interface Props {
  save: SaveData;
  update: (fn: (s: SaveData) => SaveData) => void;
  canStore: boolean;
  onReset: () => void;
  onBack: () => void;
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <span>
        <b>{label}</b>
        {desc && <small className="muted">{desc}</small>}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch" aria-hidden="true" />
    </label>
  );
}

export default function SettingsScreen({ save, update, canStore, onReset, onBack }: Props) {
  const s = save.settings;
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => update((d) => ({ ...d, settings: { ...d.settings, [k]: v } }));
  const [confirm, setConfirm] = useState('');
  const [copied, setCopied] = useState(false);

  return (
    <Screen title="Settings" onBack={onBack}>
      <section className="card">
        <h2>Sound</h2>
        <Toggle
          label="Sound effects"
          checked={s.sound}
          onChange={(v) => {
            set('sound', v);
            audio.setSound(v);
            if (v) audio.click();
          }}
        />
        <Toggle
          label="Ambient music"
          desc="A low, calm ocean drone"
          checked={s.music}
          onChange={(v) => {
            audio.unlock();
            set('music', v);
          }}
        />
      </section>

      <section className="card">
        <h2>Accessibility</h2>
        <Toggle label="Reduce motion" desc="Stills the ocean and turns off effects. Follows your device setting too." checked={s.reducedMotion} onChange={(v) => set('reducedMotion', v)} />
        <Toggle label="Colour-blind palette" desc="Rarity colours that are easier to tell apart" checked={s.colorBlind} onChange={(v) => set('colorBlind', v)} />
        <div className="field">
          <b>Text size</b>
          <div className="segmented" role="radiogroup" aria-label="Text size">
            {(['normal', 'large', 'xlarge'] as const).map((t) => (
              <button key={t} role="radio" aria-checked={s.textSize === t} className={s.textSize === t ? 'on' : ''} onClick={() => set('textSize', t)}>
                {t === 'normal' ? 'A' : t === 'large' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Diver</h2>
        <div className="avatar-grid" role="radiogroup" aria-label="Avatar">
          {AVATARS.map((a) => (
            <button key={a} role="radio" aria-checked={s.avatar === a} className={s.avatar === a ? 'on' : ''} onClick={() => set('avatar', a)}>
              {a}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Flagged answers ({save.flagged.length})</h2>
        <p className="muted small">Answers you think should have counted. Copy the list to send to whoever runs the game so it can be added.</p>
        {save.flagged.length > 0 && (
          <>
            <ul className="flag-list">
              {[...save.flagged].reverse().map((f) => (
                <li key={f.questionId + f.typed + f.at}>
                  <b>“{f.typed}”</b> <span className="muted small">for “{QUESTION_BY_ID[f.questionId]?.prompt ?? f.questionId}”</span>
                </li>
              ))}
            </ul>
            <div className="row wrap">
              <button
                className="btn ghost small"
                onClick={async () => {
                  const text = save.flagged.map((f) => `${f.questionId}\t${f.typed}`).join('\n');
                  setCopied(await copyText(text));
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? '✅ Copied' : '📋 Copy list'}
              </button>
              <button className="btn ghost small" onClick={() => update((d) => ({ ...d, flagged: [] }))}>
                Clear list
              </button>
            </div>
          </>
        )}
      </section>

      <section className="card danger-zone">
        <h2>Reset progress</h2>
        <p className="muted small">
          Deletes every dive, daily result, streak, badge and flagged answer saved in this browser. Settings are kept. This can’t be undone.
          {!canStore && ' (Saving is currently blocked in this browser.)'}
        </p>
        <label htmlFor="confirm-reset" className="small">
          Type <b>RESET</b> to confirm
        </label>
        <div className="answer-form">
          <input id="confirm-reset" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
          <button className="btn danger" disabled={confirm.trim().toUpperCase() !== 'RESET'} onClick={onReset}>
            Reset everything
          </button>
        </div>
      </section>
    </Screen>
  );
}
