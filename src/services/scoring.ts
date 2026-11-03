import type { RoundResult, TierId } from '../types';
import { TIER_BY_ID } from '../config/rarity';
import { GAME } from '../config/game';

export const pointsForTier = (tier: TierId) => TIER_BY_ID[tier].points;
export const totalScore = (rounds: RoundResult[]) => rounds.reduce((s, r) => s + r.points, 0);
export const depthForScore = (score: number) => score * GAME.metresPerPoint;
export const formatDepth = (m: number) => `${Math.round(m).toLocaleString('en-GB')} m`;
