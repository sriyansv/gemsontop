import React from 'react';

const INK = '#0A0A0A';
export const GOLD = '#E9B949';
export const GOLD_LIGHT = '#FFE39A';
export const GOLD_DARK = '#A97A1E';
export const BURGUNDY = '#5E1838';
export const TEAL = '#0F6B6F';

/** Five-point gold crown. (x, y) = bottom centre, w = width in px. */
export const Crown: React.FC<{x: number; y: number; w: number; rot?: number; shine?: number}> = ({x, y, w, rot = 0, shine = 0}) => (
	<svg width={w * 1.4} height={w * 1.2} viewBox="-70 -90 140 120" style={{position: 'absolute', left: x - w * 0.7, top: y - w * 1.2 + w * 0.25, overflow: 'visible', transform: `rotate(${rot}deg)`, transformOrigin: '50% 80%'}}>
		{shine > 0 ? <circle cx={0} cy={-30} r={80} fill={GOLD_LIGHT} opacity={0.35 * shine} style={{filter: 'blur(12px)'}} /> : null}
		<path d="M-50,10 L-56,-50 L-30,-24 L-14,-66 L0,-30 L14,-66 L30,-24 L56,-50 L50,10 Z" fill={GOLD} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
		<path d="M-48,-4 L48,-4" stroke={GOLD_DARK} strokeWidth={5} />
		<rect x={-52} y={-2} width={104} height={16} rx={4} fill={GOLD_DARK} stroke={INK} strokeWidth={5} />
		{[-56, -14, 14, 56].map((cx, i) => <circle key={i} cx={cx} cy={i === 0 || i === 3 ? -50 : -66} r={6} fill={GOLD_LIGHT} stroke={INK} strokeWidth={3} />)}
		<path d="M0,-22 L10,-8 L0,6 L-10,-8 Z" fill={TEAL} stroke={INK} strokeWidth={3} />
		{[-30, 30].map((cx) => <circle key={cx} cx={cx} cy={-6} r={6} fill={BURGUNDY} stroke={INK} strokeWidth={3} />)}
		<path d="M-40,-30 L-34,-8" stroke="#fff" strokeOpacity={0.6} strokeWidth={4} strokeLinecap="round" />
	</svg>
);

/** Golden throne. (x, y) = seat front-centre, w = overall width. */
export const Throne: React.FC<{x: number; y: number; w: number; glow?: number}> = ({x, y, w, glow = 0.5}) => (
	<svg width={w} height={w * 1.5} viewBox="0 0 400 600" style={{position: 'absolute', left: x - w / 2, top: y - w * 1.05, overflow: 'visible'}}>
		<ellipse cx={200} cy={300} rx={260} ry={300} fill={GOLD_LIGHT} opacity={0.18 * glow} style={{filter: 'blur(30px)'}} />
		{/* back */}
		<path d="M70,420 L70,120 Q70,40 140,30 Q170,0 200,-10 Q230,0 260,30 Q330,40 330,120 L330,420 Z" fill={GOLD} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
		<path d="M105,400 L105,135 Q105,80 155,72 Q180,48 200,42 Q220,48 245,72 Q295,80 295,135 L295,400 Z" fill={BURGUNDY} stroke={INK} strokeWidth={6} />
		{/* tufted velvet */}
		{[150, 200, 250].map((cx) => [160, 230, 300, 370].map((cy) => <circle key={`${cx}-${cy}`} cx={cx + (cy % 140 === 20 ? 25 : 0)} cy={cy} r={5} fill="#3A0E22" />))}
		{/* crest: triangle gem (vest motif) */}
		<path d="M200,-6 L226,40 L174,40 Z" fill={TEAL} stroke={INK} strokeWidth={5} />
		<path d="M200,8 L212,32 L188,32 Z" fill="#4B8B8A" />
		{[110, 290].map((cx) => <circle key={cx} cx={cx} cy={44} r={14} fill={GOLD_LIGHT} stroke={INK} strokeWidth={5} />)}
		{/* seat + arms */}
		<rect x={40} y={400} width={320} height={70} rx={20} fill={BURGUNDY} stroke={INK} strokeWidth={8} />
		<path d="M20,360 Q20,330 60,330 L90,330 L90,560 L30,560 Q20,560 20,540 Z" fill={GOLD} stroke={INK} strokeWidth={8} />
		<path d="M380,360 Q380,330 340,330 L310,330 L310,560 L370,560 Q380,560 380,540 Z" fill={GOLD} stroke={INK} strokeWidth={8} />
		<rect x={70} y={470} width={260} height={90} fill={GOLD_DARK} stroke={INK} strokeWidth={8} />
		<path d="M110,500 q90,40 180,0" stroke={GOLD_LIGHT} strokeWidth={6} fill="none" />
		<path d="M90,120 L90,380" stroke="#fff" strokeOpacity={0.35} strokeWidth={8} />
	</svg>
);

/** The chef's pan with flames. (x, y) = handle grip. */
export const FlamePan: React.FC<{x: number; y: number; s: number; flicker: number}> = ({x, y, s, flicker}) => (
	<svg width={260 * s} height={300 * s} viewBox="-240 -260 260 300" style={{position: 'absolute', left: x - 240 * s, top: y - 260 * s, overflow: 'visible'}}>
		<path d={`M-150,-20 C-200,${-120 - 20 * flicker} -170,-190 -120,${-250 + 10 * flicker} C-110,-180 -80,-200 -60,${-230 - 14 * flicker} C-60,-150 -30,-140 -40,-20 Z`} fill="#FF7A1A" stroke={INK} strokeWidth={5} />
		<path d={`M-135,-25 C-160,-100 -140,-150 -112,${-190 + 8 * flicker} C-100,-130 -80,-150 -68,-170 C-70,-110 -55,-90 -60,-25 Z`} fill="#FFC23D" />
		<ellipse cx={-110} cy={-10} rx={95} ry={22} fill="#2A2C2E" stroke={INK} strokeWidth={6} />
		<line x1={-20} y1={-8} x2={10} y2={0} stroke={INK} strokeWidth={16} strokeLinecap="round" />
	</svg>
);

/** Four-point gold sparkle. */
export const Sparkle: React.FC<{x: number; y: number; r: number; o: number; rot?: number}> = ({x, y, r, o, rot = 0}) => (
	<path transform={`translate(${x},${y}) rotate(${rot})`} d={`M0,${-r} Q${r * 0.15},${-r * 0.15} ${r},0 Q${r * 0.15},${r * 0.15} 0,${r} Q${-r * 0.15},${r * 0.15} ${-r},0 Q${-r * 0.15},${-r * 0.15} 0,${-r} Z`} fill={GOLD_LIGHT} opacity={o} />
);
