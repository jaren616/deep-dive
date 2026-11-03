import type { DiveRecord } from '../types';
import { TIER_BY_ID } from '../config/rarity';
import { dayNumber } from './daily';
import { formatDepth } from './scoring';
import { MAX_SCORE } from '../config/game';

export function roundEmoji(r: DiveRecord['rounds'][number]): string {
  if (r.outcome === 'correct' && r.tier) return TIER_BY_ID[r.tier].emoji;
  if (r.outcome === 'timeout') return '⏱️';
  if (r.outcome === 'pass') return '⏭️';
  return '✖️';
}

export function shareText(d: DiveRecord): string {
  const title =
    d.mode === 'daily' && d.date ? `Deep Dive #${dayNumber(d.date)}` : d.mode === 'archive' && d.date ? `Deep Dive #${dayNumber(d.date)} (archive)` : d.mode === 'endless' ? 'Deep Dive — Endless' : 'Deep Dive';
  const score = d.mode === 'endless' ? `${d.score} pts` : `${d.score}/${MAX_SCORE}`;
  return `${title} 🌊 ${formatDepth(d.depth)}\n${d.rounds.map(roundEmoji).join('')}\nScore ${score}`;
}

/** Copy with the async Clipboard API, falling back to a hidden textarea. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
