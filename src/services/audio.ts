import type { TierId } from '../types';
import { tierIndex } from '../config/rarity';

/**
 * All sound is synthesised with the Web Audio API — no files to load.
 * Browsers block audio until the player interacts, so the context is created
 * lazily inside a click/keypress handler via unlock().
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: { stop: () => void } | null = null;
  soundOn = true;
  musicOn = false;

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      if (this.musicOn) this.startMusic();
    } catch {
      this.ctx = null; // no audio support: fail silently
    }
  }

  private tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.25) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + start;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private play(fn: () => void) {
    if (!this.soundOn) return;
    this.unlock();
    if (this.ctx) fn();
  }

  /** Rising arpeggio — longer and brighter for rarer tiers. */
  correct(tier: TierId) {
    this.play(() => {
      const steps = tierIndex(tier) + 2;
      const scale = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568, 2093];
      for (let i = 0; i < steps; i++) this.tone(scale[i], i * 0.07, 0.35, 'triangle', 0.18);
      if (tier === 'krillion') for (let i = 0; i < 6; i++) this.tone(2093 + i * 220, 0.5 + i * 0.05, 0.4, 'sine', 0.08);
    });
  }
  wrong() {
    this.play(() => {
      this.tone(196, 0, 0.18, 'square', 0.08);
      this.tone(146.8, 0.09, 0.25, 'square', 0.08);
    });
  }
  tick() {
    this.play(() => this.tone(880, 0, 0.05, 'sine', 0.06));
  }
  timeout() {
    this.play(() => {
      this.tone(392, 0, 0.3, 'sawtooth', 0.07);
      this.tone(261.6, 0.2, 0.5, 'sawtooth', 0.07);
    });
  }
  click() {
    this.play(() => this.tone(660, 0, 0.04, 'sine', 0.05));
  }
  achievement() {
    this.play(() => [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, i * 0.09, 0.5, 'triangle', 0.15)));
  }
  splash() {
    this.play(() => {
      const ctx = this.ctx!;
      const len = ctx.sampleRate * 0.6;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.6);
      const g = ctx.createGain();
      g.gain.value = 0.35;
      src.buffer = buf;
      src.connect(filter).connect(g).connect(this.master!);
      src.start();
    });
  }

  setSound(on: boolean) {
    this.soundOn = on;
  }

  setMusic(on: boolean) {
    this.musicOn = on;
    if (on) {
      this.unlock();
      this.startMusic();
    } else {
      this.music?.stop();
      this.music = null;
    }
  }

  /** A slow, low ambient pad: two detuned drones through a gently swept filter. */
  private startMusic() {
    if (!this.ctx || !this.master || this.music) return;
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, ctx.currentTime);
    out.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain).connect(filter.frequency);
    const oscs = [55, 82.4, 110.3, 164.8].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? 'triangle' : 'sawtooth';
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 6;
      o.connect(filter);
      o.start();
      return o;
    });
    filter.connect(out).connect(this.master);
    lfo.start();
    this.music = {
      stop: () => {
        const t = ctx.currentTime;
        out.gain.cancelScheduledValues(t);
        out.gain.setValueAtTime(out.gain.value, t);
        out.gain.exponentialRampToValueAtTime(0.0001, t + 1);
        [...oscs, lfo].forEach((o) => o.stop(t + 1.1));
      },
    };
  }
}

export const audio = new AudioEngine();
