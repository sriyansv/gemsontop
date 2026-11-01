import React from 'react';
import {GOLD, GOLD_DARK, GOLD_LIGHT, BURGUNDY} from './props';

const INK = '#0A0A0A';

/**
 * The royal hall: teal-and-burgundy walls, gold pilasters, tall double doors (left back),
 * dais at centre, chequered marble floor in perspective, chandelier and window light shafts.
 * doors: 0 closed … 1 fully open. lights: 0 dim … 1 full.
 */
export const Room: React.FC<{doors?: number; lights?: number; carpet?: boolean}> = ({doors = 0, lights = 1, carpet = true}) => {
	const HZ = 640; // floor/wall line
	const vx = 960;
	const floor: React.ReactNode[] = [];
	for (let r = 0; r < 9; r++) {
		const y0 = HZ + (Math.pow(1.38, r) - 1) * 14;
		const y1 = HZ + (Math.pow(1.38, r + 1) - 1) * 14;
		for (let c = -12; c < 12; c++) {
			const k0 = (y0 - HZ) / (1080 - HZ);
			const k1 = (y1 - HZ) / (1080 - HZ);
			const w = 160;
			const x = (kk: number, cc: number) => vx + cc * w * (0.35 + kk * 1.6);
			floor.push(
				<path key={`${r}-${c}`} d={`M${x(k0, c)},${y0} L${x(k0, c + 1)},${y0} L${x(k1, c + 1)},${y1} L${x(k1, c)},${y1} Z`} fill={(r + c) % 2 === 0 ? '#E9E1CF' : '#0F4A4E'} />,
			);
		}
	}
	const open = doors * 150;
	return (
		<svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#081C1F" />
					<stop offset="1" stopColor="#0F3A40" />
				</linearGradient>
				<linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={GOLD_LIGHT} stopOpacity={0.35} />
					<stop offset="1" stopColor={GOLD_LIGHT} stopOpacity={0} />
				</linearGradient>
				<radialGradient id="doorLight">
					<stop offset="0" stopColor="#FFF4CF" />
					<stop offset="1" stopColor="#FFB23A" />
				</radialGradient>
				<linearGradient id="carpet" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#7A1F48" />
					<stop offset="1" stopColor={BURGUNDY} />
				</linearGradient>
			</defs>
			<rect width={1920} height={HZ} fill="url(#wall)" />
			{/* wall panels with burgundy damask */}
			{[180, 700, 1220, 1740].map((x) => (
				<rect key={x} x={x - 150} y={150} width={300} height={430} rx={12} fill={BURGUNDY} stroke={GOLD_DARK} strokeWidth={6} opacity={0.85} />
			))}
			{/* pilasters */}
			{[0, 440, 960, 1480, 1920].map((x) => (
				<g key={x}>
					<rect x={x - 34} y={60} width={68} height={HZ - 60} fill={GOLD_DARK} stroke={INK} strokeWidth={5} />
					<rect x={x - 22} y={80} width={44} height={HZ - 100} fill={GOLD} />
					<rect x={x - 44} y={50} width={88} height={22} fill={GOLD} stroke={INK} strokeWidth={5} />
				</g>
			))}
			<rect width={1920} height={60} fill={GOLD_DARK} />
			<rect y={56} width={1920} height={10} fill={GOLD} />
			{/* high windows + light shafts */}
			{[700, 1220].map((x) => (
				<g key={x}>
					<path d={`M${x - 70},120 L${x - 70},40 Q${x},-20 ${x + 70},40 L${x + 70},120 Z`} fill="#BFE7E6" opacity={0.25 * lights} />
					<path d={`M${x - 70},120 L${x + 70},120 L${x + 240},1080 L${x - 240},1080 Z`} fill="url(#shaft)" opacity={0.5 * lights} />
				</g>
			))}
			{/* the doors (back left) */}
			<g>
				<path d="M120,640 L120,300 Q300,150 480,300 L480,640 Z" fill={GOLD_DARK} stroke={INK} strokeWidth={6} />
				<path d="M150,640 L150,312 Q300,190 450,312 L450,640 Z" fill="url(#doorLight)" opacity={doors} />
				<path d={`M150,640 L150,312 Q${225 - open * 0.5},250 300,236 L${300 - open},${300 - open * 0.1} L${300 - open},640 Z`} fill="#3A1D16" stroke={INK} strokeWidth={5} />
				<path d={`M450,640 L450,312 Q${375 + open * 0.5},250 300,236 L${300 + open},${300 - open * 0.1} L${300 + open},640 Z`} fill="#3A1D16" stroke={INK} strokeWidth={5} />
				{doors < 0.1 ? <line x1={300} y1={236} x2={300} y2={640} stroke={GOLD} strokeWidth={4} /> : null}
			</g>
			{/* floor */}
			<rect y={HZ} width={1920} height={1080 - HZ} fill="#0B3236" />
			{floor}
			<rect y={HZ} width={1920} height={1080 - HZ} fill="#000" opacity={0.18} />
			{carpet ? <path d={`M${vx - 120},${HZ + 10} L${vx + 120},${HZ + 10} L${vx + 420},1080 L${vx - 420},1080 Z`} fill="url(#carpet)" stroke={GOLD} strokeWidth={6} /> : null}
			{/* dais */}
			<path d="M700,680 L1220,680 L1260,720 L660,720 Z" fill={GOLD_DARK} stroke={INK} strokeWidth={5} />
			<path d="M740,640 L1180,640 L1220,680 L700,680 Z" fill={GOLD} stroke={INK} strokeWidth={5} />
			{/* chandelier */}
			<g opacity={0.95}>
				<line x1={960} y1={0} x2={960} y2={110} stroke={GOLD_DARK} strokeWidth={6} />
				<path d="M860,120 Q960,170 1060,120" stroke={GOLD} strokeWidth={10} fill="none" />
				{[870, 915, 960, 1005, 1050].map((x) => (
					<g key={x}>
						<circle cx={x} cy={x === 960 ? 150 : 128} r={26} fill={GOLD_LIGHT} opacity={0.35 * lights} style={{filter: 'blur(8px)'}} />
						<circle cx={x} cy={x === 960 ? 150 : 128} r={7} fill="#FFF4CF" />
					</g>
				))}
			</g>
			<rect width={1920} height={1080} fill="#000" opacity={0.55 * (1 - lights)} />
		</svg>
	);
};
