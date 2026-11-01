import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GOLD, GOLD_LIGHT, BURGUNDY, TEAL, Sparkle} from './props';
import {mulberry, ramp} from './anim';
import {FONT} from './Sheet';

/** Radial sparkle burst from (x, y) at frame `hit`, with gravity. */
export const Burst: React.FC<{f: number; hit: number; x: number; y: number; n?: number; speed?: number; life?: number; seed?: number}> = ({f, hit, x, y, n = 24, speed = 22, life = 34, seed = 1}) => {
	const t = f - hit;
	if (t < 0 || t > life) return null;
	const r = mulberry(seed);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{Array.from({length: n}, (_, i) => {
				const a = r() * Math.PI * 2;
				const v = speed * (0.4 + r());
				const px = x + Math.cos(a) * v * t * (1 - t / (life * 2.2));
				const py = y + Math.sin(a) * v * t * (1 - t / (life * 2.2)) + 0.35 * t * t;
				return <Sparkle key={i} x={px} y={py} r={(6 + r() * 16) * (1 - t / life)} o={1 - t / life} rot={t * 8 + i * 30} />;
			})}
		</svg>
	);
};

/** Expanding gold shock ring. */
export const Ring: React.FC<{f: number; hit: number; x: number; y: number; max?: number; life?: number}> = ({f, hit, x, y, max = 700, life = 22}) => {
	const t = (f - hit) / life;
	if (t < 0 || t > 1) return null;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			<ellipse cx={x} cy={y} rx={max * Math.sqrt(t)} ry={max * Math.sqrt(t) * 0.45} fill="none" stroke={GOLD_LIGHT} strokeWidth={18 * (1 - t)} opacity={1 - t} style={{filter: 'blur(1px)'}} />
		</svg>
	);
};

/** Sparkles spiralling up around a figure (transformation). */
export const Spiral: React.FC<{f: number; a: number; b: number; x: number; y: number; r: number; hgt: number}> = ({f, a, b, x, y, r, hgt}) => {
	if (f < a || f > b + 20) return null;
	const k = ramp(f, a, a + 15) * ramp(f, b, b + 20, 1, 0);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			{Array.from({length: 36}, (_, i) => {
				const p = ((f - a) * 0.012 + i / 36) % 1;
				const ang = p * Math.PI * 6 + i;
				const px = x + Math.cos(ang) * r * (1 - 0.3 * p);
				const py = y - p * hgt;
				const front = Math.sin(ang) > 0;
				return <Sparkle key={i} x={px} y={py} r={(front ? 16 : 9) * k} o={k * (front ? 1 : 0.5)} rot={f * 6 + i * 40} />;
			})}
		</svg>
	);
};

const CONF = [GOLD, GOLD_LIGHT, BURGUNDY, TEAL, '#FFFFFF'];
/** Falling confetti from frame `start`. */
export const Confetti: React.FC<{f: number; start: number; n?: number}> = ({f, start, n = 140}) => {
	const t = f - start;
	if (t < 0) return null;
	const r = mulberry(11);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			{Array.from({length: n}, (_, i) => {
				const x0 = r() * 1920;
				const delay = r() * 40;
				const speed = 5 + r() * 6;
				const tt = t - delay;
				if (tt < 0) return null;
				const y = -40 + tt * speed;
				const x = x0 + Math.sin(tt * 0.08 + i) * 30;
				const rot = tt * (4 + r() * 8);
				const flip = Math.abs(Math.cos(tt * 0.15 + i));
				return y > 1120 ? null : <rect key={i} x={x} y={y} width={14} height={8 * flip + 2} fill={CONF[i % CONF.length]} transform={`rotate(${rot} ${x + 7} ${y + 4})`} />;
			})}
		</svg>
	);
};

/** Lower-third name card for each entrance. */
export const NameCard: React.FC<{f: number; start: number; end: number; label: string; sub: string; big?: boolean}> = ({f, start, end, label, sub, big}) => {
	if (f < start || f > end) return null;
	const inn = ramp(f, start, start + 8, 0, 1);
	const out = ramp(f, end - 6, end, 1, 0);
	const o = inn * out;
	return (
		<>
		<div style={{position: 'absolute', left: 0, bottom: 0, width: 1100, height: 300, background: 'linear-gradient(20deg, rgba(0,0,0,0.75), transparent 70%)', opacity: o}} />
		<div style={{position: 'absolute', left: 90, bottom: big ? 110 : 80, fontFamily: FONT, opacity: o, transform: `translateX(${(1 - inn) * -80}px)`}}>
			<div style={{height: 6, width: (big ? 520 : 380) * inn, background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD})`, marginBottom: 12}} />
			<div style={{fontSize: big ? 96 : 68, fontWeight: 900, letterSpacing: big ? 10 : 6, color: '#FFF4D6', textShadow: '0 4px 0 #6B4A0E, 0 0 30px rgba(255,190,90,0.6)'}}>{label}</div>
			<div style={{fontSize: big ? 30 : 26, letterSpacing: 6, color: GOLD_LIGHT, marginTop: 6}}>{sub}</div>
		</div>
		</>
	);
};

export const Flash: React.FC<{o: number; color?: string}> = ({o, color = '#FFF4CF'}) => (o > 0.001 ? <AbsoluteFill style={{background: color, opacity: o}} /> : null);

/** Grain + vignette over the whole frame. */
export const Finish: React.FC<{vignette?: number}> = ({vignette = 0.5}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,${vignette}) 100%)`}} />
			<svg width="1920" height="1080" style={{position: 'absolute', opacity: 0.06, mixBlendMode: 'overlay'}}>
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 24} />
				</filter>
				<rect width="1920" height="1080" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};
