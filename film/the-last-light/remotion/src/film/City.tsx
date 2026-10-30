import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {mulberry} from './lib';
import {C} from '../rig/tokens';

// The floating-island city. Deterministic layout; every light is addressable so scenes
// can kill or rekindle it on a schedule.

export const BEACON = {x: 960, y: 292};

type Island = {x: number; top: number; w: number; layer: 0 | 1 | 2};
const ISLANDS: Island[] = [
	{x: 230, top: 560, w: 250, layer: 0}, {x: 600, top: 540, w: 210, layer: 0},
	{x: 1330, top: 548, w: 240, layer: 0}, {x: 1700, top: 566, w: 270, layer: 0},
	{x: 110, top: 650, w: 360, layer: 1}, {x: 520, top: 628, w: 300, layer: 1},
	{x: 960, top: 560, w: 420, layer: 1},
	{x: 1430, top: 636, w: 330, layer: 1}, {x: 1830, top: 664, w: 300, layer: 1},
	{x: 290, top: 880, w: 640, layer: 2}, {x: 1640, top: 900, w: 660, layer: 2},
];
const DEPTH = [0.25, 0.55, 1] as const;
const TOWER = [
	{fill: '#0F2D33', win: [3, 4], step: [9, 10], hmax: 150},
	{fill: '#0B2429', win: [4, 6], step: [12, 13], hmax: 250},
	{fill: '#07191C', win: [7, 10], step: [18, 20], hmax: 330},
];

export type Win = {x: number; y: number; w: number; h: number; d: number; r: number; layer: number};
type Tower = {x: number; y: number; w: number; h: number; layer: number; cap: number};

const rnd = mulberry(7);
const towers: Tower[] = [];
const windows: Win[] = [];
for (const isl of ISLANDS) {
	const T = TOWER[isl.layer];
	let x = isl.x - isl.w / 2 + 10;
	while (x < isl.x + isl.w / 2 - 20) {
		const w = (14 + rnd() * 34) * (isl.layer + 1) * 0.7;
		const central = isl.layer === 1 && Math.abs(x - 960) < 80;
		const h = central ? 0 : (0.35 + rnd() * 0.65) * T.hmax * (1 - Math.abs(x - isl.x) / isl.w);
		if (h > 20 && x + w < isl.x + isl.w / 2) {
			towers.push({x, y: isl.top - h, w, h, layer: isl.layer, cap: rnd()});
			for (let wy = isl.top - h + T.step[1]; wy < isl.top - 8; wy += T.step[1]) {
				for (let wx = x + 4; wx < x + w - T.win[0]; wx += T.step[0]) {
					if (rnd() < 0.62) {
						const d = Math.min(1, Math.hypot(wx - BEACON.x, (wy - BEACON.y) * 1.6) / 1150);
						windows.push({x: wx, y: wy, w: T.win[0], h: T.win[1], d, r: rnd(), layer: isl.layer});
					}
				}
			}
		}
		x += w + 4 + rnd() * 10;
	}
}
export const WINDOWS = windows;

const islandPath = (i: Island) => {
	const l = i.x - i.w / 2;
	const r = i.x + i.w / 2;
	const depth = i.w * 0.55;
	return `M${l},${i.top} L${r},${i.top} Q${r - i.w * 0.08},${i.top + depth * 0.35} ${i.x + i.w * 0.18},${i.top + depth * 0.7} L${i.x + 6},${i.top + depth} L${i.x - i.w * 0.12},${i.top + depth * 0.62} Q${l + i.w * 0.06},${i.top + depth * 0.3} ${l},${i.top} Z`;
};

type Bridge = {a: Island; b: Island; layer: number};
const pair = (a: number, b: number): Bridge => ({a: ISLANDS[a], b: ISLANDS[b], layer: ISLANDS[a].layer});
export const BRIDGES: Bridge[] = [pair(0, 1), pair(2, 3), pair(4, 5), pair(5, 6), pair(6, 7), pair(7, 8)];
export const BRIDGE_NODES = 14;
const bridgePoint = (br: Bridge, t: number) => {
	const x1 = br.a.x + br.a.w / 2 - 6;
	const x2 = br.b.x - br.b.w / 2 + 6;
	const y1 = br.a.top - 4;
	const y2 = br.b.top - 4;
	const cy = Math.min(y1, y2) - 36;
	const mx = (x1 + x2) / 2;
	return {
		x: (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t * t * x2,
		y: (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2,
	};
};

const srnd = mulberry(99);
const STARS = Array.from({length: 170}, () => ({x: srnd() * 1920, y: srnd() * 620, r: 0.6 + srnd() * 1.6, p: srnd() * 6.28}));

const MOSAIC: {d: string; cx: number; cy: number; c: string}[] = [];
{
	const W = 132;
	const H = 114;
	const cols = [C.vestPurple, C.vestTeal, C.vestGray, '#6E2F56'];
	const mr = mulberry(3);
	for (let j = -1; j < 8; j++) {
		for (let i = -2; i < 32; i++) {
			const x = i * (W / 2) - 40;
			const y = 60 + j * H;
			const up = (i + j) % 2 === 0;
			const d = up ? `M${x},${y + H} L${x + W / 2},${y} L${x + W},${y + H} Z` : `M${x},${y} L${x + W / 2},${y + H} L${x + W},${y} Z`;
			MOSAIC.push({d, cx: x + W / 2, cy: y + H / 2, c: cols[Math.floor(mr() * cols.length)]});
		}
	}
}

export type CityProps = {
	/** 0..1 brightness for each window. */
	windowOn: (w: Win, i: number) => number;
	/** 0..1 for each bridge light (bridge index, node index). */
	bridgeOn?: (b: number, n: number) => number;
	beacon?: number;
	/** 0..1 how far the vest-triangle mosaic has spread from the beacon. */
	mosaic?: number;
	/** 0..1 golden wave radius. */
	wave?: number;
	/** 0 = night, 1 = sunrise. */
	dawn?: number;
	/** Parallax camera offset in px. */
	pan?: {x: number; y: number};
};

export const City: React.FC<CityProps> = ({windowOn, bridgeOn = () => 1, beacon = 0.8, mosaic = 0, wave = 0, dawn = 0, pan = {x: 0, y: 0}}) => {
	const f = useCurrentFrame();
	const skyTop = interpolateColors(dawn, [0, 1], ['#03070A', '#2A1E3D']);
	const skyMid = interpolateColors(dawn, [0, 1], ['#0A2228', '#8A3B6B']);
	const skyLow = interpolateColors(dawn, [0, 1], ['#0F3A40', '#FFB27A']);
	const win = interpolateColors(dawn, [0, 1], ['#F2B45A', '#FFE3A0']);
	const layerG = (layer: number, children: React.ReactNode) => (
		<g transform={`translate(${pan.x * DEPTH[layer]}, ${pan.y * DEPTH[layer]})`}>{children}</g>
	);
	const renderLayer = (layer: number) => (
		<>
			{ISLANDS.filter((i) => i.layer === layer).map((i, k) => (
				<g key={k}>
					<path d={islandPath(i)} fill={TOWER[layer].fill} stroke="#05090B" strokeWidth={layer + 2} />
					<path d={`M${i.x - i.w / 2},${i.top} L${i.x + i.w / 2},${i.top}`} stroke="#2E9A9C" strokeOpacity={0.35} strokeWidth={2} />
				</g>
			))}
			{towers.filter((t) => t.layer === layer).map((t, k) => (
				<path
					key={k}
					d={t.cap > 0.6
						? `M${t.x},${t.y + t.h} L${t.x},${t.y + 10} L${t.x + t.w / 2},${t.y - t.w * 0.5} L${t.x + t.w},${t.y + 10} L${t.x + t.w},${t.y + t.h} Z`
						: `M${t.x},${t.y + t.h} L${t.x},${t.y + 6} Q${t.x},${t.y} ${t.x + 6},${t.y} L${t.x + t.w - 6},${t.y} Q${t.x + t.w},${t.y} ${t.x + t.w},${t.y + 6} L${t.x + t.w},${t.y + t.h} Z`}
					fill={TOWER[layer].fill}
					stroke="#05090B"
					strokeWidth={layer + 1.5}
				/>
			))}
			<g>
				{WINDOWS.map((w, i) => {
					if (w.layer !== layer) return null;
					const o = windowOn(w, i);
					return o > 0.02 ? <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} fill={win} opacity={o} /> : null;
				})}
			</g>
			<g style={{filter: `blur(${3 + layer * 3}px)`}} opacity={0.7}>
				{WINDOWS.map((w, i) => {
					if (w.layer !== layer || i % 3) return null;
					const o = windowOn(w, i);
					return o > 0.05 ? <rect key={i} x={w.x - w.w} y={w.y - w.h} width={w.w * 3} height={w.h * 3} fill={win} opacity={o * 0.5} /> : null;
				})}
			</g>
		</>
	);
	const bridges = (layer: number) =>
		BRIDGES.map((br, bi) => {
			if (br.layer !== layer) return null;
			const pts = Array.from({length: 25}, (_, k) => bridgePoint(br, k / 24));
			return (
				<g key={bi}>
					<polyline points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#05090B" strokeWidth={9} />
					<polyline points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#123238" strokeWidth={5} />
					{Array.from({length: BRIDGE_NODES}, (_, n) => {
						const p = bridgePoint(br, (n + 0.5) / BRIDGE_NODES);
						const o = bridgeOn(bi, n);
						return o > 0.02 ? (
							<g key={n} opacity={o}>
								<circle cx={p.x} cy={p.y - 6} r={9} fill={win} opacity={0.25} />
								<circle cx={p.x} cy={p.y - 6} r={3} fill="#FFF1C9" />
							</g>
						) : null;
					})}
				</g>
			);
		});
	const b = Math.max(0, beacon);

	return (
		<svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={skyTop} />
					<stop offset="0.55" stopColor={skyMid} />
					<stop offset="1" stopColor={skyLow} />
				</linearGradient>
				<radialGradient id="beaconGlow">
					<stop offset="0" stopColor="#FFF4CF" stopOpacity={1} />
					<stop offset="0.25" stopColor="#FFD36B" stopOpacity={0.6} />
					<stop offset="1" stopColor="#FFB23A" stopOpacity={0} />
				</radialGradient>
				<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#4B8B8A" stopOpacity={0} />
					<stop offset="1" stopColor="#4B8B8A" stopOpacity={0.18} />
				</linearGradient>
			</defs>
			<rect width={1920} height={1080} fill="url(#sky)" />
			{STARS.map((s, i) => (
				<circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#DDEFF2" opacity={(0.25 + 0.35 * Math.sin(f / 18 + s.p)) * (1 - dawn)} />
			))}
			{layerG(0, <>{renderLayer(0)}{bridges(0)}</>)}
			<rect y={420} width={1920} height={300} fill="url(#haze)" />
			{layerG(1, (
				<>
					{renderLayer(1)}
					{bridges(1)}
					{/* Beacon spire on the central island */}
					<path d={`M${BEACON.x - 26},560 L${BEACON.x - 7},${BEACON.y + 26} L${BEACON.x + 7},${BEACON.y + 26} L${BEACON.x + 26},560 Z`} fill="#0B2429" stroke="#05090B" strokeWidth={4} />
					{[380, 450, 510].map((y) => (
						<line key={y} x1={BEACON.x - 20 + (560 - y) * 0.06} y1={y} x2={BEACON.x + 20 - (560 - y) * 0.06} y2={y} stroke="#2E9A9C" strokeOpacity={0.5} strokeWidth={3} />
					))}
					<circle cx={BEACON.x} cy={BEACON.y} r={60 + 260 * b} fill="url(#beaconGlow)" opacity={Math.min(1, b)} />
					<circle cx={BEACON.x} cy={BEACON.y} r={14} fill={interpolateColors(Math.min(1, b), [0, 1], ['#1C3338', '#FFF4CF'])} stroke="#05090B" strokeWidth={4} />
				</>
			))}
			{mosaic > 0
				? layerG(1, (
						<g>
							{MOSAIC.map((m, i) => {
								const dist = Math.hypot(m.cx - BEACON.x, (m.cy - BEACON.y) * 1.4) / 1250;
								const rev = Math.min(1, Math.max(0, (mosaic - dist) * 6));
								// strongest over the city, fading out into the upper sky
								const sky = Math.min(1, Math.max(0, (m.cy - 120) / 380));
								return rev > 0.01 ? (
									<path key={i} d={m.d} fill={m.c} fillOpacity={0.1 * rev * sky} stroke="#FFD36B" strokeOpacity={0.3 * rev * sky * (1 - 0.5 * wave)} strokeWidth={2} />
								) : null;
							})}
						</g>
					))
				: null}
			{layerG(2, <>{renderLayer(2)}</>)}
			{wave > 0 ? (
				<g style={{mixBlendMode: 'screen'}}>
					<circle cx={BEACON.x + pan.x * 0.55} cy={BEACON.y} r={wave * 2300} fill="#FFD36B" opacity={0.18 * (1 - wave)} />
					<circle cx={BEACON.x + pan.x * 0.55} cy={BEACON.y} r={wave * 2300} fill="none" stroke="#FFE9A8" strokeWidth={70} opacity={0.6 * (1 - wave)} style={{filter: 'blur(18px)'}} />
				</g>
			) : null}
		</svg>
	);
};
