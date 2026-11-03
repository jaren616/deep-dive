import type { ReactNode } from 'react';
import type { TierId } from '../types';
import { TIER_BY_ID } from '../config/rarity';

export const tierColor = (tier: TierId, colorBlind: boolean) => (colorBlind ? TIER_BY_ID[tier].cbColor : TIER_BY_ID[tier].color);

export function TierBadge({ tier, colorBlind, small }: { tier: TierId; colorBlind: boolean; small?: boolean }) {
  const t = TIER_BY_ID[tier];
  return (
    <span className={`tier-badge${small ? ' small' : ''}`} style={{ ['--tier' as string]: tierColor(tier, colorBlind) }}>
      <span aria-hidden="true">{t.emoji}</span> {t.name} <b>+{t.points}</b>
    </span>
  );
}

export function Screen({ title, onBack, children, wide }: { title: string; onBack: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <main className={`screen panel-screen${wide ? ' wide' : ''}`}>
      <header className="screen-head">
        <button className="btn ghost back" onClick={onBack} aria-label="Back to home">
          ← Back
        </button>
        <h1>{title}</h1>
      </header>
      {children}
    </main>
  );
}
