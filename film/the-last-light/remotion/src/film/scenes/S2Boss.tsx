import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {Boss, Fade, Finish} from '../fx';
import {ramp, mulberry} from '../lib';
import {POSES} from '../../rig/poses';
import {Office, ChairBack} from './Office';
import type {Win} from '../City';

// 8–16 s · 2A back view in the chair against the dying city · 2B 3/4 MCU over the hologram map, calculating.
const dimCity = (f: number) => (w: Win, i: number) => (w.r < 0.16 ? ramp(f, 40 + w.d * 300 + w.r * 400, 60 + w.d * 300 + w.r * 400, 0.9, 0.08) : 0);

const mr = mulberry(21);
const TILES = Array.from({length: 42}, (_, i) => {
	const col = i % 7;
	const row = Math.floor(i / 7);
	return {col, row, up: (col + row) % 2 === 0, off: 30 + mr() * 120};
});

const Hologram: React.FC<{f: number}> = ({f}) => (
	<svg width={760} height={620} viewBox="0 0 760 620" style={{position: 'absolute', left: 90, top: 250}}>
		<defs>
			<linearGradient id="beam" x1="0" y1="1" x2="0" y2="0">
				<stop offset="0" stopColor="#7FE3E0" stopOpacity={0.35} />
				<stop offset="1" stopColor="#7FE3E0" stopOpacity={0} />
			</linearGradient>
		</defs>
		<path d="M250,600 L510,600 L700,120 L60,120 Z" fill="url(#beam)" opacity={0.45} />
		<g transform="translate(120,140) skewX(-12)">
			{TILES.map((t, i) => {
				const x = t.col * 70;
				const y = t.row * 64;
				const alive = ramp(f, t.off, t.off + 10, 1, 0);
				const d = t.up ? `M${x},${y + 64} L${x + 35},${y} L${x + 70},${y + 64} Z` : `M${x},${y} L${x + 35},${y + 64} L${x + 70},${y} Z`;
				return (
					<path key={i} d={d} fill={alive > 0.5 ? '#46D8D2' : '#C73A32'} fillOpacity={0.08 + 0.22 * alive} stroke="#9FF3EE" strokeOpacity={0.25 + 0.5 * alive} strokeWidth={2} />
				);
			})}
		</g>
		<ellipse cx={380} cy={600} rx={140} ry={16} fill="#7FE3E0" opacity={0.35} />
	</svg>
);

export const S2Boss: React.FC = () => {
	const f = useCurrentFrame();
	const A = f < 96;
	if (A) {
		const push = ramp(f, 0, 96, 1, 1.12, Easing.inOut(Easing.sin));
		return (
			<AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 62%'}}>
				<Office city={{windowOn: dimCity(f + 240), bridgeOn: () => 0, beacon: 0.08 + 0.06 * Math.sin(f / 5), pan: {x: -30, y: 0}}}>
					<Boss x={790} y={430} h={560} turn={180} pose="sit" breathe={1} css={{filter: 'drop-shadow(0 0 22px rgba(70,200,200,0.35))'}} />
					<ChairBack x={760} y={840} w={400} />
				</Office>
				<Finish vignette={0.7} />
				<Fade o={ramp(f, 0, 10, 1, 0)} />
			</AbsoluteFill>
		);
	}
	const g = f - 96;
	const glow = ramp(g, 45, 85, 0.45, 1) - ramp(g, 110, 140, 0, 0.35);
	const expression = g < 40 ? 'smirk' : g < 105 ? 'calculating' : 'serious';
	const blink = Math.max(ramp(g, 28, 31, 0, 1, Easing.linear) - ramp(g, 31, 35, 0, 1, Easing.linear), 0);
	const drift = ramp(g, 0, 144, 0, -40, Easing.inOut(Easing.sin));
	return (
		<AbsoluteFill>
			<Office city={{windowOn: dimCity(f + 240), bridgeOn: () => 0, beacon: 0.06, pan: {x: 60, y: 0}}} cityScale={1.5}>
				<AbsoluteFill style={{backdropFilter: 'blur(3px)'}} />
				<Hologram f={g} />
				<Boss x={930 + drift} y={110} h={1250} turn={-28} pose={POSES.clasped} expression={expression} glow={glow} blink={blink} breathe={1} />
				<AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 55%, rgba(90,230,225,0.18), transparent 55%)', mixBlendMode: 'screen'}} />
			</Office>
			<Finish vignette={0.65} />
			<Fade o={ramp(g, 0, 6, 0.6, 0)} />
		</AbsoluteFill>
	);
};
