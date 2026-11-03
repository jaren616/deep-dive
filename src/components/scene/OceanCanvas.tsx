import { useEffect, useRef } from 'react';
import { ZONES } from '../../config/game';

interface Props {
  depth: number; // target depth in metres; the camera eases toward it
  reducedMotion: boolean;
  /** Increment to trigger a discovery burst at the centre of the screen. */
  burst?: { id: number; color: string } | null;
}

type Creature = { kind: 'fish' | 'jelly' | 'angler' | 'glow'; x: number; y: number; vx: number; size: number; phase: number; hue: number };
type Particle = { x: number; y: number; r: number; speed: number; drift: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
};

/** Water colour at a depth, blending smoothly through the zones. */
function waterAt(depth: number): string {
  const d = Math.max(0, depth);
  const z = ZONES.find((zz) => d >= zz.from && d < zz.to) ?? ZONES[ZONES.length - 1];
  const t = Math.min(1, (d - z.from) / (z.to - z.from));
  return mix(z.top, z.bottom, t);
}

function creatureKindFor(depth: number): Creature['kind'] {
  const r = Math.random();
  if (depth < 300) return r < 0.85 ? 'fish' : 'jelly';
  if (depth < 1200) return r < 0.4 ? 'fish' : r < 0.85 ? 'jelly' : 'glow';
  if (depth < 3000) return r < 0.45 ? 'jelly' : r < 0.75 ? 'glow' : 'angler';
  return r < 0.35 ? 'jelly' : r < 0.7 ? 'glow' : 'angler';
}

export default function OceanCanvas({ depth, reducedMotion, burst }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef(depth);
  const sparks = useRef<Spark[]>([]);
  const motion = useRef(reducedMotion);

  target.current = depth;
  motion.current = reducedMotion;

  useEffect(() => {
    if (!burst || reducedMotion) return;
    const c = canvasRef.current;
    if (!c) return;
    const cx = c.clientWidth / 2;
    const cy = c.clientHeight * 0.35;
    for (let i = 0; i < 60; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1 + Math.random() * 4;
      sparks.current.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color: burst.color });
    }
  }, [burst, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    let cam = target.current;
    let last = performance.now();
    const particles: Particle[] = [];
    const creatures: Creature[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      const n = Math.round((w * h) / 9000);
      for (let i = 0; i < n; i++) particles.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.3, speed: Math.random() * 0.3 + 0.1, drift: Math.random() * Math.PI * 2 });
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (fromSide: boolean) => {
      const kind = creatureKindFor(cam);
      const dir = Math.random() < 0.5 ? 1 : -1;
      creatures.push({
        kind,
        x: fromSide ? (dir > 0 ? -60 : w + 60) : Math.random() * w,
        y: h * (0.15 + Math.random() * 0.75),
        vx: dir * (kind === 'jelly' ? 0.08 : kind === 'glow' ? 0.15 : 0.3 + Math.random() * 0.5),
        size: kind === 'fish' ? 6 + Math.random() * 10 : kind === 'angler' ? 12 + Math.random() * 10 : 10 + Math.random() * 16,
        phase: Math.random() * Math.PI * 2,
        hue: kind === 'glow' ? 160 + Math.random() * 140 : kind === 'jelly' ? 260 + Math.random() * 80 : 190,
      });
    };
    for (let i = 0; i < 6; i++) spawn(false);

    const drawCreature = (c: Creature, t: number) => {
      const dark = Math.min(1, cam / 1500); // deeper = creatures glow instead of silhouette
      ctx.save();
      ctx.translate(c.x, c.y + Math.sin(t / 900 + c.phase) * 6);
      if (c.vx < 0) ctx.scale(-1, 1);
      if (c.kind === 'fish') {
        ctx.fillStyle = `rgba(${dark > 0.5 ? '120,200,255' : '10,40,70'},${0.55 - dark * 0.25})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, c.size, c.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-c.size * 0.8, 0);
        ctx.lineTo(-c.size * 1.5, -c.size * 0.45);
        ctx.lineTo(-c.size * 1.5, c.size * 0.45);
        ctx.closePath();
        ctx.fill();
      } else if (c.kind === 'jelly') {
        const pulse = 0.85 + Math.sin(t / 500 + c.phase) * 0.15;
        const glow = 0.25 + dark * 0.5;
        ctx.shadowColor = `hsla(${c.hue},90%,70%,${glow})`;
        ctx.shadowBlur = 18 * dark;
        ctx.fillStyle = `hsla(${c.hue},80%,75%,${0.18 + dark * 0.3})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, c.size * pulse, c.size * 0.7, 0, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = `hsla(${c.hue},80%,80%,${0.15 + dark * 0.3})`;
        ctx.lineWidth = 1.2;
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.moveTo(i * c.size * 0.3, 0);
          for (let k = 1; k <= 4; k++) ctx.lineTo(i * c.size * 0.3 + Math.sin(t / 400 + k + i) * 3, k * c.size * 0.45);
          ctx.stroke();
        }
      } else if (c.kind === 'glow') {
        const a = 0.4 + Math.sin(t / 300 + c.phase) * 0.35;
        ctx.shadowColor = `hsla(${c.hue},100%,65%,1)`;
        ctx.shadowBlur = 14;
        ctx.fillStyle = `hsla(${c.hue},100%,75%,${a})`;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(i * -c.size * 0.35, Math.sin(i + t / 600) * 2, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Anglerfish: dark body, glowing lure.
        ctx.fillStyle = 'rgba(20,30,45,0.9)';
        ctx.beginPath();
        ctx.ellipse(0, 0, c.size, c.size * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(60,80,100,0.8)';
        ctx.beginPath();
        ctx.moveTo(c.size * 0.4, -c.size * 0.6);
        ctx.quadraticCurveTo(c.size * 1.2, -c.size * 1.6, c.size * 1.4, -c.size * 0.8);
        ctx.stroke();
        const a = 0.6 + Math.sin(t / 250 + c.phase) * 0.4;
        ctx.shadowColor = 'rgba(255,240,150,1)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = `rgba(255,240,170,${a})`;
        ctx.beginPath();
        ctx.arc(c.size * 1.4, -c.size * 0.8, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const still = motion.current;
      // Ease camera toward the target depth.
      cam += still ? target.current - cam : (target.current - cam) * Math.min(1, dt / 900);
      const descending = target.current - cam;

      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, waterAt(cam - 60));
      g.addColorStop(1, waterAt(cam + 260));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Sun rays near the surface.
      const rayAlpha = Math.max(0, 1 - cam / 350) * 0.12;
      if (rayAlpha > 0.005) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 6; i++) {
          const x = ((i + 0.5) / 6) * w + Math.sin(now / 3000 + i) * 30 * (still ? 0 : 1);
          const rg = ctx.createLinearGradient(x, 0, x + 80, h);
          rg.addColorStop(0, `rgba(200,240,255,${rayAlpha})`);
          rg.addColorStop(1, 'rgba(200,240,255,0)');
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.moveTo(x - 25, 0);
          ctx.lineTo(x + 25, 0);
          ctx.lineTo(x + 160, h);
          ctx.lineTo(x + 40, h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Marine snow: drifts upward faster while descending.
      const snowAlpha = 0.25 + Math.min(0.35, cam / 6000);
      ctx.fillStyle = `rgba(220,240,255,${snowAlpha})`;
      for (const p of particles) {
        if (!still) {
          p.y -= (p.speed + Math.max(0, descending) * 0.004) * dt * 0.06 * 6;
          p.x += Math.sin(now / 2000 + p.drift) * 0.1;
          if (p.y < -5) {
            p.y = h + 5;
            p.x = Math.random() * w;
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!still) {
        for (const c of creatures) c.x += c.vx * dt * 0.06;
        for (let i = creatures.length - 1; i >= 0; i--) if (creatures[i].x < -120 || creatures[i].x > w + 120) creatures.splice(i, 1);
        if (creatures.length < 7 && Math.random() < 0.01) spawn(true);
      }
      for (const c of creatures) drawCreature(c, still ? 0 : now);

      // Discovery sparks.
      if (sparks.current.length) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const s of sparks.current) {
          s.x += s.vx;
          s.y += s.vy;
          s.vy -= 0.02;
          s.life -= dt / 1200;
          ctx.globalAlpha = Math.max(0, s.life);
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        sparks.current = sparks.current.filter((s) => s.life > 0);
      }

      // Vignette grows with depth.
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, `rgba(0,0,0,${0.2 + Math.min(0.5, cam / 8000)})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="ocean-canvas" aria-hidden="true" />;
}
