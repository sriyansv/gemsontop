import React from 'react';
import {C, INK} from './tokens';
import {CX, TORSO_TOP, onHead, onTorso, rad} from './geometry';
import type {Look} from './looks';

// Costume layers for the shared rig. Everything here is drawn on the same body geometry.

const V = (turn: number, phi: number, yTop: number, yTip: number, fill: string) =>
	`M${onTorso(-phi, yTop, turn).x},${yTop} L${onTorso(0, yTip, turn).x},${yTip} L${onTorso(phi, yTop, turn).x},${yTop} Z`;

const Tie: React.FC<{turn: number; to: number}> = ({turn, to}) => (
	<path
		d={`M${onTorso(-4, 298, turn).x},298 L${onTorso(4, 298, turn).x},298 L${onTorso(7, to - 14, turn).x},${to - 14} L${onTorso(0, to, turn).x},${to} L${onTorso(-7, to - 14, turn).x},${to - 14} Z`}
		fill={C.tie}
	/>
);

const Buttons: React.FC<{turn: number; phi: number; ys: number[]; fill: string; r?: number}> = ({turn, phi, ys, fill, r = 7}) => (
	<>
		{ys.map((y) => {
			const b = onTorso(phi, y, turn);
			return b.c > 0.15 ? <ellipse key={y} cx={b.x} cy={y} rx={r * b.c} ry={r} fill={fill} stroke={C.ink} strokeWidth={3} /> : null;
		})}
	</>
);

/** Torso costume, drawn inside the torso clip. */
export const Outfit: React.FC<{look: Look; turn: number; front: boolean; vest: React.ReactNode}> = ({look, turn, front, vest}) => {
	const base = <rect x={0} y={TORSO_TOP - 30} width={400} height={260} fill={look.body} />;
	switch (look.torso) {
		case 'vest':
			return (
				<>
					{base}
					{vest}
					{front ? <path d={V(turn, 40, 255, 352, C.shirt)} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 2} /> : null}
					{front ? <Tie turn={turn} to={360} /> : null}
					{front ? <Buttons turn={turn} phi={0} ys={[370, 400, 430]} fill={C.button} /> : null}
				</>
			);
		case 'tee':
			return (
				<>
					{base}
					{[-50, 40].map((phi) => {
						const a = onTorso(phi, 330, turn);
						const b = onTorso(phi * 0.7, 440, turn);
						return a.c > 0 ? <path key={phi} d={`M${a.x},330 Q${(a.x + b.x) / 2 + 14},385 ${b.x},440`} stroke="#3F4A36" strokeWidth={8} fill="none" strokeLinecap="round" /> : null;
					})}
				</>
			);
		case 'jacket':
			return (
				<>
					{base}
					{front ? (
						<>
							<path d={V(turn, 36, 255, 404, C.shirt)} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 2} />
							<Tie turn={turn} to={398} />
							{[-1, 1].map((s) => (
								<path
									key={s}
									d={`M${onTorso(s * 36, 258, turn).x},258 L${onTorso(s * 50, 320, turn).x},318 L${onTorso(s * 30, 330, turn).x},336 L${onTorso(s * 6, 404, turn).x},404`}
									fill="none"
									stroke={C.ink}
									strokeWidth={5}
									strokeLinejoin="round"
								/>
							))}
							<Buttons turn={turn} phi={0} ys={[420, 448]} fill="#111" />
						</>
					) : null}
				</>
			);
		case 'chef': {
			const shift = (-rad(turn) * 160) % 60;
			return (
				<>
					{base}
					{Array.from({length: 14}, (_, i) =>
						Array.from({length: 8}, (_, j) => {
							const x = i * 30 - 30 + shift;
							const y = TORSO_TOP + j * 30;
							return <path key={`${i}-${j}`} d={`M${x},${y + 14} L${x + 12},${y} L${x + 24},${y + 14}`} stroke="#3FA0A8" strokeOpacity={0.45} strokeWidth={4} fill="none" />;
						}),
					)}
					{front ? (
						<>
							<path d={V(turn, 22, 258, 300, C.shirt)} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 2} />
							<path
								d={`M${onTorso(-58, 372, turn).x},372 Q${onTorso(0, 366, turn).x},364 ${onTorso(58, 372, turn).x},372 L${onTorso(50, 470, turn).x},470 L${onTorso(-50, 470, turn).x},470 Z`}
								fill="#9AA0A2"
								stroke={C.ink}
								strokeWidth={INK - 1}
								strokeLinejoin="round"
							/>
							<Buttons turn={turn} phi={-18} ys={[398, 432]} fill="#C9CED0" r={6} />
							<Buttons turn={turn} phi={18} ys={[398, 432]} fill="#C9CED0" r={6} />
						</>
					) : null}
				</>
			);
		}
		case 'royal': {
			const trim = look.trim ?? '#E9B949';
			return (
				<>
					{base}
					{front ? (
						<>
							{[-7, 7].map((phi) => (
								<line key={phi} x1={onTorso(phi, 262, turn).x} y1={262} x2={onTorso(phi, 470, turn).x} y2={470} stroke={trim} strokeWidth={7} />
							))}
							<Buttons turn={turn} phi={-22} ys={[340, 375, 410, 445]} fill={trim} r={7} />
							<Buttons turn={turn} phi={22} ys={[340, 375, 410, 445]} fill={trim} r={7} />
							{/* jabot */}
							{[292, 312, 332].map((y, k) => {
								const c = onTorso(0, y, turn);
								return c.c > 0.2 ? <path key={y} d={`M${c.x - 26 + k * 4},${y} Q${c.x},${y + 28} ${c.x + 26 - k * 4},${y}`} fill={C.shirt} stroke={C.ink} strokeWidth={4} /> : null;
							})}
						</>
					) : null}
					<line x1={0} y1={458} x2={400} y2={458} stroke={trim} strokeWidth={8} />
					{[-60, 60].map((phi) => {
						const c = onTorso(phi, 380, turn);
						return c.c > 0.1 ? <path key={phi} d={`M${c.x - 14},370 q14,-24 28,0 q-14,24 -28,0`} fill="none" stroke={trim} strokeWidth={4} opacity={0.8} /> : null;
					})}
				</>
			);
		}
	}
};

/** Neckline: shirt collar + tie knot, ringer tee neck, or royal ermine. */
export const Collar: React.FC<{look: Look; turn: number; front: boolean; backness: number}> = ({look, turn, front, backness}) => {
	const band = (h: number) => `M${CX - 150},262 Q${CX},${262 + 22 * (1 - backness)} ${CX + 150},262 L${CX + 150},${262 + h} Q${CX},${284 + h - 26 * backness} ${CX - 150},${262 + h} Z`;
	if (look.collar === 'ringer') {
		return (
			<>
				<path d={band(20)} fill="#F5F5F5" stroke={C.ink} strokeWidth={INK - 1} strokeLinejoin="round" />
				<path d={`M${CX - 140},${270} Q${CX},${292 - 20 * backness} ${CX + 140},${270}`} fill="none" stroke="#BFC4C4" strokeWidth={4} />
			</>
		);
	}
	if (look.collar === 'ermine') {
		const spots = Array.from({length: 9}, (_, i) => -120 + i * 30);
		return (
			<>
				<path d={band(38)} fill="#FBF7EE" stroke={C.ink} strokeWidth={INK - 1} strokeLinejoin="round" />
				{spots.map((u, i) => (
					<path key={u} d={`M${CX + u},${276 + (i % 2) * 10 + 14 * (1 - (u / 150) ** 2) * (1 - backness)} l4,10 l-4,-3 l-4,3 Z`} fill="#111" />
				))}
				{front ? <circle cx={onTorso(0, 300, turn).x} cy={300} r={11} fill={look.trim ?? '#E9B949'} stroke={C.ink} strokeWidth={4} /> : null}
			</>
		);
	}
	return (
		<>
			<path d={band(22)} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 1} strokeLinejoin="round" />
			{front ? (
				<>
					<path d={`M${onTorso(-30, 270, turn).x},272 L${onTorso(-2, 290, turn).x},288 L${onTorso(-16, 318, turn).x},318 Z`} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 2} strokeLinejoin="round" />
					<path d={`M${onTorso(30, 270, turn).x},272 L${onTorso(2, 290, turn).x},288 L${onTorso(16, 318, turn).x},318 Z`} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 2} strokeLinejoin="round" />
					{look.tie ? <path d={`M${onTorso(-5, 286, turn).x},286 L${onTorso(5, 286, turn).x},286 L${onTorso(3, 302, turn).x},302 L${onTorso(-3, 302, turn).x},302 Z`} fill={C.tie} stroke={C.ink} strokeWidth={3} /> : null}
				</>
			) : null}
		</>
	);
};

/** Tongue (casual / royal) or fangs (chef). Drawn over the lips. */
export const MouthExtra: React.FC<{look: Look; turn: number}> = ({look, turn}) => {
	const c = onHead(0, 214, turn, 14);
	if (c.c < 0.25) return null;
	if (look.mouth === 'tongue') {
		const w = 17 * c.c;
		return (
			<g>
				<path d={`M${c.x - w},210 L${c.x - w},236 Q${c.x - w},258 ${c.x},258 Q${c.x + w},258 ${c.x + w},236 L${c.x + w},210 Z`} fill="#FF8E8E" stroke={C.ink} strokeWidth={INK - 1} strokeLinejoin="round" />
				<line x1={c.x} y1={214} x2={c.x} y2={238} stroke="#C2545A" strokeWidth={3} strokeLinecap="round" />
			</g>
		);
	}
	if (look.mouth === 'fangs') {
		return (
			<g>
				{[-24, 24].map((phi) => {
					const p = onHead(phi, 214, turn, 14);
					return p.c > 0.2 ? <path key={phi} d={`M${p.x - 7},208 L${p.x + 7},208 L${p.x},230 Z`} fill="#FFFFFF" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" /> : null;
				})}
			</g>
		);
	}
	return null;
};

type Lens = {s: -1 | 1; x: number; y: number; c: number; w: number};

/** Eyewear other than the Frog Boss sunglasses (which stay in the rig itself). */
export const Eyewear: React.FC<{look: Look; lenses: Lens[]; temples: string[]; glowNode: (l: Lens, w: number) => React.ReactNode}> = ({look, lenses, temples, glowNode}) => {
	const vis = lenses.filter((l) => l.c > 0.05);
	if (look.eyes === 'glow' || look.eyes === 'glowPink') return <>{vis.map((l) => <g key={l.s}>{glowNode(l, 62 * l.c)}</g>)}</>;
	const both = lenses[0].c > 0.05 && lenses[1].c > 0.05;
	const temple = temples.map((d, i) => <path key={i} d={d} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />);
	if (look.eyes === 'round') {
		return (
			<g>
				{temple}
				{both ? <path d={`M${lenses[0].x + 30},132 Q${(lenses[0].x + lenses[1].x) / 2},122 ${lenses[1].x - 30},132`} stroke={C.ink} strokeWidth={8} fill="none" /> : null}
				{vis.map((l) => (
					<g key={l.s}>
						<ellipse cx={l.x} cy={140} rx={40 * Math.pow(l.c, 0.85)} ry={40} fill="#1E1E1E" stroke={C.ink} strokeWidth={INK + 1} />
						<path d={`M${l.x + 4 * l.c},116 Q${l.x + 26 * l.c},118 ${l.x + 32 * l.c},134`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.85} />
					</g>
				))}
			</g>
		);
	}
	// 3D glasses: red left, cyan right, softly glowing
	return (
		<g>
			{temple}
			{both ? <line x1={lenses[0].x + lenses[0].w / 2 - 4} y1={136} x2={lenses[1].x - lenses[1].w / 2 + 4} y2={136} stroke={C.ink} strokeWidth={10} /> : null}
			{vis.map((l) => {
				const col = l.s === -1 ? '#F0505A' : '#3FD8E8';
				const w = l.w * 0.98;
				return (
					<g key={l.s}>
						<rect x={l.x - w / 2} y={120} width={w} height={36} fill={col} opacity={0.6} style={{filter: 'blur(8px)'}} />
						<rect x={l.x - w / 2} y={120} width={w} height={36} rx={4} fill={col} stroke={C.ink} strokeWidth={INK + 2} />
						<rect x={l.x - w / 2 + 8} y={126} width={w * 0.35} height={6} rx={3} fill="#fff" opacity={0.55} />
					</g>
				);
			})}
		</g>
	);
};
