import React, {useId} from 'react';
import {C, INK} from './tokens';
import {EXPRESSIONS, type Expression, type ExpressionName} from './expressions';
import {POSES, type Arm, type Pose, type PoseName} from './poses';
import {
	CX, TORSO_BOTTOM, TORSO_TOP, clamp, headPath, onHead, onTorso, project, rad, torsoPath, type P3,
} from './geometry';

export type FrogBossProps = {
	/** 0 = front, 45 = three-quarter, 90 = side (facing screen-right), 180 = back. */
	turn?: number;
	expression?: ExpressionName | Expression;
	pose?: PoseName | Pose;
	/** Overrides the expression's eye glow (0..1). */
	glow?: number;
	/** Mouth open override (0..1) for lip-sync. */
	open?: number;
	/** 0 = eyes open, 1 = closed. */
	blink?: number;
	/** Scene 13: sunglasses removed, full glowing eyes. */
	glassesOff?: boolean;
	toothpick?: boolean;
	crop?: 'full' | 'head';
	style?: React.CSSProperties;
};

const VIEWBOX = {full: '0 0 400 620', head: '35 55 330 290'};

/** Deterministic per-triangle colour so the vest pattern never "boils" between frames. */
const vestColor = (i: number, j: number) => {
	const h = Math.abs(Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1;
	const set = [C.vestPurple, C.vestTeal, C.vestGray, C.vestPurple, C.vestTeal, '#3E5354', '#6E2F56'];
	return set[Math.floor(h * set.length)];
};

const VestPattern: React.FC<{turn: number}> = ({turn}) => {
	const w = 44;
	const h = 38;
	// The pattern scrolls with the body as it turns; colours stay attached to their triangle.
	const scroll = -rad(turn) * 160;
	const k = Math.floor(scroll / (w / 2));
	const frac = scroll - k * (w / 2);
	const tris: React.ReactNode[] = [];
	for (let j = 0; j < 8; j++) {
		for (let i = -2; i < 22; i++) {
			const x = i * (w / 2) + frac - w;
			const y = TORSO_TOP - 20 + j * h;
			const ci = i - k;
			const up = (((ci + j) % 2) + 2) % 2 === 0;
			const d = up
				? `M${x},${y + h} L${x + w / 2},${y} L${x + w},${y + h} Z`
				: `M${x},${y} L${x + w / 2},${y + h} L${x + w},${y} Z`;
			tris.push(<path key={`${i}-${j}`} d={d} fill={vestColor(ci, j)} stroke="#1A2122" strokeWidth={1.6} />);
		}
	}
	return <g>{tris}</g>;
};

const Hand: React.FC<{x: number; y: number; kind: NonNullable<Arm['hand2']>; dirX: number; dirY: number; mirror: number}> = ({
	x, y, kind, dirX, dirY, mirror,
}) => {
	const ink = {stroke: C.ink, strokeWidth: INK - 1};
	if (kind === 'pocket') return null;
	if (kind === 'palmUp') {
		return (
			<g>
				<ellipse cx={x} cy={y} rx={25} ry={13} fill={C.skin} {...ink} />
				<ellipse cx={x - mirror * 18} cy={y - 10} rx={8} ry={10} fill={C.skin} {...ink} />
			</g>
		);
	}
	const len = Math.hypot(dirX, dirY) || 1;
	const ux = dirX / len;
	const uy = dirY / len;
	return (
		<g>
			{kind === 'point' ? (
				<line x1={x} y1={y} x2={x + ux * 44} y2={y + uy * 44} stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
			) : null}
			{kind === 'point' ? (
				<line x1={x} y1={y} x2={x + ux * 44} y2={y + uy * 44} stroke={C.skin} strokeWidth={12} strokeLinecap="round" />
			) : null}
			<ellipse cx={x} cy={y} rx={23} ry={20} fill={C.skin} {...ink} />
			<ellipse cx={x - mirror * 16} cy={y - 8} rx={8} ry={11} fill={C.skin} {...ink} />
			{kind === 'pinch' ? (
				<line x1={x + ux * 8} y1={y + uy * 8} x2={x + ux * 30} y2={y + uy * 30} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
			) : null}
			{kind === 'glasses' ? (
				<g transform={`translate(${x + 6}, ${y - 34})`}>
					<rect x={-46} y={-14} width={40} height={26} rx={9} fill={C.glasses} stroke={C.ink} strokeWidth={4} />
					<rect x={6} y={-14} width={40} height={26} rx={9} fill={C.glasses} stroke={C.ink} strokeWidth={4} />
					<line x1={-6} y1={-6} x2={6} y2={-6} stroke={C.ink} strokeWidth={4} />
					<path d="M-38,-6 L-26,-12" stroke="#fff" strokeOpacity={0.4} strokeWidth={3} />
				</g>
			) : null}
		</g>
	);
};

export const FrogBoss: React.FC<FrogBossProps> = ({
	turn = 0,
	expression = 'neutral',
	pose = 'pockets',
	glow,
	open,
	blink = 0,
	glassesOff = false,
	toothpick = true,
	crop = 'full',
	style,
}) => {
	const id = useId().replace(/:/g, '');
	const ex: Expression = typeof expression === 'string' ? EXPRESSIONS[expression] : expression;
	const ps: Pose = typeof pose === 'string' ? POSES[pose] : pose;
	const glowV = clamp(glow ?? ex.glow);
	const openV = clamp(open ?? ex.open);
	const dy = ps.bodyDy;
	const backness = clamp(-Math.cos(rad(turn)) * 2);

	// ---- Arms -------------------------------------------------------------
	const arms = ([-1, 1] as const).map((s) => {
		const arm = s === -1 ? ps.left : ps.right;
		const sh: P3 = {x: 150 * Math.sin(rad(s * 75)), y: 282, z: 150 * Math.cos(rad(75))};
		const off = (p: P3): P3 => ({x: sh.x + s * p.x, y: sh.y + p.y, z: sh.z + p.z});
		const P = [sh, off(arm.elbow), off(arm.hand)].map((p) => project(p, turn));
		return {s, arm, P, behind: P[0].depth < -60};
	});
	const clasp = arms[0].arm.hand2 === 'clasp';
	const drawArm = (a: (typeof arms)[number]) => {
		const [sh, el, hd] = a.P;
		const pts = `${sh.x},${sh.y} ${el.x},${el.y} ${hd.x},${hd.y}`;
		const kind = a.arm.hand2 ?? 'mitt';
		return (
			<g key={a.s}>
				<polyline points={pts} fill="none" stroke={C.ink} strokeWidth={38 + INK * 2} strokeLinejoin="round" strokeLinecap="round" />
				<polyline points={pts} fill="none" stroke={C.shirt} strokeWidth={38} strokeLinejoin="round" strokeLinecap="round" />
				<polyline points={`${(sh.x + el.x) / 2 + 8},${(sh.y + el.y) / 2} ${el.x + 6},${el.y + 4}`} fill="none" stroke={C.shirtShadow} strokeWidth={8} strokeLinecap="round" />
				{kind === 'pocket' ? (
					<path d={`M${hd.x - 30},${hd.y - 4} Q${hd.x},${hd.y + 10} ${hd.x + 30},${hd.y - 4} L${hd.x + 30},${hd.y + 26} L${hd.x - 30},${hd.y + 26} Z`} fill={C.pants} stroke={C.ink} strokeWidth={INK - 2} strokeLinejoin="round" />
				) : (
					<circle cx={hd.x} cy={hd.y} r={20} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 1} />
				)}
				{kind === 'clasp' || (clasp && a.s === 1) ? null : (
					<Hand x={hd.x} y={hd.y + 6} kind={kind} dirX={hd.x - el.x} dirY={hd.y - el.y} mirror={a.s * (Math.cos(rad(turn)) >= 0 ? 1 : -1)} />
				)}
			</g>
		);
	};
	const claspNode = clasp
		? (() => {
				const x = (arms[0].P[2].x + arms[1].P[2].x) / 2;
				const y = (arms[0].P[2].y + arms[1].P[2].y) / 2 + 6;
				return (
					<g>
						<rect x={x - 40} y={y - 26} width={80} height={52} rx={22} fill={C.skin} stroke={C.ink} strokeWidth={INK - 1} />
						{[-10, 2, 14].map((o) => (
							<path key={o} d={`M${x - 26},${y + o - 4} Q${x},${y + o + 2} ${x + 26},${y + o - 4}`} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
						))}
					</g>
				);
			})()
		: null;

	// ---- Legs -------------------------------------------------------------
	const legs = ([-1, 1] as const)
		.map((s) => {
			const leg = s === -1 ? ps.legL : ps.legR;
			const hip: P3 = {x: s * 48, y: 452 + dy, z: 0};
			const off = (p: P3): P3 => ({x: hip.x + s * p.x, y: hip.y + p.y, z: hip.z + p.z});
			const ankle = off(leg.ankle);
			const P = [hip, off(leg.knee), ankle].map((p) => project(p, turn));
			const toe = project({x: ankle.x, y: ankle.y + 20, z: ankle.z + 24}, turn);
			return {s, P, toe};
		})
		.sort((a, b) => a.toe.depth - b.toe.depth);
	const sinT = Math.abs(Math.sin(rad(turn)));

	// ---- Face -------------------------------------------------------------
	const mouthPhis = [-55, -27, 0, 27, 55];
	const mouthPts = mouthPhis
		.map((phi, i) => {
			const p = onHead(phi, 202, turn, 12);
			return {x: p.x, y: 202 + ex.mouth[i], c: p.c};
		})
		.filter((p) => p.c > -0.2);
	const smooth = (pts: {x: number; y: number}[]) => {
		if (pts.length < 2) return '';
		let d = `M${pts[0].x},${pts[0].y}`;
		for (let i = 1; i < pts.length - 1; i++) {
			const mx = (pts[i].x + pts[i + 1].x) / 2;
			const my = (pts[i].y + pts[i + 1].y) / 2;
			d += ` Q${pts[i].x},${pts[i].y} ${mx},${my}`;
		}
		const l = pts[pts.length - 1];
		return d + ` L${l.x},${l.y}`;
	};
	const shiftPts = (pts: typeof mouthPts, k: number) =>
		pts.map((p, i) => ({...p, y: p.y + k * Math.sin((Math.PI * (i + 0.5)) / pts.length)}));
	const upper = shiftPts(mouthPts, -openV * 7);
	const lower = shiftPts(mouthPts, openV * 20);

	const lenses = ([-1, 1] as const).map((s) => {
		const p = onHead(s * 32, 140, turn, 6);
		const w = 98 * Math.pow(Math.max(0, p.c), 0.85);
		return {s, x: p.x, y: 140, c: p.c, w};
	});
	const temples = ([-1, 1] as const).flatMap((s) => {
		const segs: string[] = [];
		for (let phi = 56; phi < 108; phi += 6) {
			const a = onHead(s * phi, 136, turn, 3);
			const b = onHead(s * (phi + 6), 136, turn, 3);
			if (a.c > -0.05 || b.c > -0.05) segs.push(`M${a.x},${136} L${b.x},${136}`);
		}
		return segs;
	});
	const toothTip = onHead(-55, 202, turn, 12);

	const lip = (d: string) => (
		<>
			<path d={d} fill="none" stroke={C.ink} strokeWidth={24 + INK * 2} strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} fill="none" stroke={C.lips} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} fill="none" stroke={C.lipsDark} strokeWidth={5} strokeLinecap="round" transform="translate(0,7)" opacity={0.7} />
			<path d={d} fill="none" stroke={C.lipsLight} strokeWidth={5} strokeLinecap="round" transform="translate(0,-6)" opacity={0.85} />
		</>
	);

	const eyeBar = (l: (typeof lenses)[number], width: number, core: number, halo: number) => {
		const h = ex.barH * (1 - 0.88 * clamp(blink));
		const inner = -l.s; // direction toward face centre
		const x1 = l.x - width / 2;
		const x2 = l.x + width / 2;
		const yIn = l.y + ex.tilt;
		const yOut = l.y - ex.tilt * 0.4;
		const [y1, y2] = inner > 0 ? [yOut, yIn] : [yIn, yOut];
		const d = `M${x1},${y1} Q${l.x},${l.y - ex.curve * 3} ${x2},${y2}`;
		return (
			<g>
				<path d={d} stroke={C.glow} strokeWidth={h + 14} strokeLinecap="round" fill="none" opacity={halo} filter={`url(#glow-${id})`} />
				<path d={d} stroke={C.glow} strokeWidth={h} strokeLinecap="round" fill="none" opacity={core} />
			</g>
		);
	};

	const legNodes = (
		<>
			{legs.map(({s, P, toe}) => {
				const pts = P.map((p) => `${p.x},${p.y}`).join(' ');
				const ankle = P[2];
				return (
					<g key={s}>
						<polyline points={pts} fill="none" stroke={C.ink} strokeWidth={74 + INK * 2} strokeLinejoin="round" strokeLinecap="round" />
						<polyline points={pts} fill="none" stroke={C.pants} strokeWidth={74} strokeLinejoin="round" strokeLinecap="round" />
						<polyline points={`${P[1].x + 14},${P[1].y - 10} ${ankle.x + 14},${ankle.y - 12}`} fill="none" stroke="#2A2C2E" strokeWidth={6} strokeLinecap="round" />
						<ellipse cx={toe.x} cy={toe.y + 4} rx={38 + 24 * sinT} ry={20} fill="#050505" stroke={C.ink} strokeWidth={INK - 1} />
						<ellipse cx={toe.x - 10} cy={toe.y - 3} rx={14 + 8 * sinT} ry={5} fill="#fff" opacity={0.45} />
					</g>
				);
			})}

		</>
	);

	const vX = onTorso(0, 300, turn);
	const front = vX.c > -0.15;

	return (
		<svg viewBox={VIEWBOX[crop]} style={{overflow: crop === 'head' ? 'hidden' : 'visible', ...style}}>
			<defs>
				<clipPath id={`head-${id}`}>
					<path d={headPath(turn)} />
				</clipPath>
				<clipPath id={`torso-${id}`}>
					<path d={torsoPath()} />
				</clipPath>
				{lenses.map((l) => (
					<clipPath key={l.s} id={`lens-${id}-${l.s}`}>
						<rect x={l.x - l.w / 2} y={l.y - 29} width={l.w} height={58} rx={Math.min(18, l.w / 2)} />
					</clipPath>
				))}
				<filter id={`glow-${id}`} x="-50%" y="-200%" width="200%" height="500%">
					<feGaussianBlur stdDeviation={glassesOff ? 9 : 6} />
				</filter>
			</defs>

			{/* Ground contact shadow */}
			<ellipse cx={CX} cy={598} rx={130 + 20 * sinT} ry={14} fill="#000" opacity={0.35} />

			{/* Far arms */}
			<g transform={`translate(0, ${dy})`}>{arms.filter((a) => a.behind).map(drawArm)}</g>

			{ps.legsFront ? null : legNodes}
			<g transform={`translate(0, ${dy})`}>
				{/* Hips */}
				<ellipse cx={CX} cy={470} rx={128} ry={36} fill={C.pants} stroke={C.ink} strokeWidth={INK} />

				{/* Torso: vest all round, cel shading */}
				<g clipPath={`url(#torso-${id})`}>
					<rect x={0} y={TORSO_TOP - 30} width={400} height={260} fill={C.vestGray} />
					<VestPattern turn={turn} />
					{front ? (
						<path
							d={`M${onTorso(-40, 255, turn).x},255 L${onTorso(0, 352, turn).x},352 L${onTorso(40, 255, turn).x},255 Z`}
							fill={C.shirt}
							stroke={C.ink}
							strokeWidth={INK - 2}
						/>
					) : null}
					{front ? (
						<path
							d={`M${onTorso(-4, 298, turn).x},298 L${onTorso(4, 298, turn).x},298 L${onTorso(7, 346, turn).x},346 L${onTorso(0, 356, turn).x},360 L${onTorso(-7, 346, turn).x},346 Z`}
							fill={C.tie}
						/>
					) : null}
					{front
						? [370, 400, 430].map((y) => {
								const b = onTorso(0, y, turn);
								return b.c > 0.15 ? <ellipse key={y} cx={b.x} cy={y} rx={7 * b.c} ry={7} fill={C.button} stroke={C.ink} strokeWidth={3} /> : null;
							})
						: null}
					{!front ? <line x1={CX - 70} y1={420} x2={CX + 70} y2={420} stroke="#1A2122" strokeWidth={6} opacity={0.6} /> : null}
					<path d={torsoPath() + torsoPath(8, 6)} fillRule="evenodd" fill="#fff" opacity={0.14} />
					<path d={torsoPath() + torsoPath(-30, -10)} fillRule="evenodd" fill="#000" opacity={0.3} />
				</g>
				<path d={torsoPath()} fill="none" stroke={C.ink} strokeWidth={INK} />
				{front
					? [-14, 14].map((phi) => {
							const a = onTorso(phi - 10, TORSO_BOTTOM - 2, turn);
							const b = onTorso(phi, TORSO_BOTTOM + 16, turn);
							const c2 = onTorso(phi + 10, TORSO_BOTTOM - 2, turn);
							return (
								<path key={phi} d={`M${a.x},${TORSO_BOTTOM - 2} L${b.x},${TORSO_BOTTOM + 16} L${c2.x},${TORSO_BOTTOM - 2} Z`} fill={vestColor(phi, 3)} stroke={C.ink} strokeWidth={INK - 2} strokeLinejoin="round" />
							);
						})
					: null}

				{ps.legsFront ? <g transform={`translate(0, ${-dy})`}>{legNodes}</g> : null}

				{/* Near arms (below the head) */}
				{arms.filter((a) => !a.behind && a.arm.hand2 !== 'pinch').map(drawArm)}
				{claspNode}

				{/* Head */}
				<g clipPath={`url(#head-${id})`}>
					<path d={headPath(turn)} fill={C.skin} />
					<path d={headPath(turn) + headPath(turn, 9, 8)} fillRule="evenodd" fill={C.skinLight} />
					<path d={headPath(turn) + headPath(turn, -30, -22)} fillRule="evenodd" fill={C.skinShadow} />
				</g>
				<path d={headPath(turn)} fill="none" stroke={C.ink} strokeWidth={INK} />

				{/* Collar band + collar points + tie knot */}
				<path d={`M${CX - 150},262 Q${CX},${262 + 22 * (1 - backness)} ${CX + 150},262 L${CX + 150},284 Q${CX},${306 - 26 * backness} ${CX - 150},284 Z`} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 1} strokeLinejoin="round" />
				{front ? (
					<>
						<path d={`M${onTorso(-30, 270, turn).x},272 L${onTorso(-2, 290, turn).x},288 L${onTorso(-16, 318, turn).x},318 Z`} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 2} strokeLinejoin="round" />
						<path d={`M${onTorso(30, 270, turn).x},272 L${onTorso(2, 290, turn).x},288 L${onTorso(16, 318, turn).x},318 Z`} fill={C.shirt} stroke={C.ink} strokeWidth={INK - 2} strokeLinejoin="round" />
						<path d={`M${onTorso(-5, 286, turn).x},286 L${onTorso(5, 286, turn).x},286 L${onTorso(3, 302, turn).x},302 L${onTorso(-3, 302, turn).x},302 Z`} fill={C.tie} stroke={C.ink} strokeWidth={3} />
					</>
				) : null}

				{/* Toothpick (static, subtle) */}
				{toothpick && toothTip.c > 0.1 ? (
					<g>
						<line x1={toothTip.x + 6} y1={212} x2={toothTip.x - 30 * toothTip.c} y2={224} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
						<line x1={toothTip.x + 6} y1={212} x2={toothTip.x - 30 * toothTip.c} y2={224} stroke={C.toothpick} strokeWidth={4} strokeLinecap="round" />
					</g>
				) : null}

				{/* Mouth */}
				{mouthPts.length >= 2 ? (
					openV > 0.02 ? (
						<g>
							<path d={smooth(upper) + ' ' + smooth([...lower].reverse()).replace('M', 'L') + ' Z'} fill="#3A0E0C" stroke={C.ink} strokeWidth={INK - 1} />
							{lip(smooth(upper))}
							{lip(smooth(lower))}
						</g>
					) : (
						lip(smooth(mouthPts))
					)
				) : null}

				{/* Eyes + sunglasses */}
				{glassesOff
					? lenses.filter((l) => l.c > 0.05).map((l) => <g key={l.s}>{eyeBar(l, 62 * l.c, 1, 0.95)}</g>)
					: (
						<g>
							{temples.map((d, i) => (
								<path key={i} d={d} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
							))}
							{lenses[0].c > 0.05 && lenses[1].c > 0.05 ? (
								<line x1={lenses[0].x + lenses[0].w / 2 - 4} y1={132} x2={lenses[1].x - lenses[1].w / 2 + 4} y2={132} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
							) : null}
							{lenses.filter((l) => l.c > 0.05).map((l) => (
								<g key={l.s}>
									<rect x={l.x - l.w / 2} y={l.y - 29} width={l.w} height={58} rx={Math.min(18, l.w / 2)} fill={C.glasses} />
									<g clipPath={`url(#lens-${id}-${l.s})`}>
										{eyeBar(l, 54 * l.c, Math.min(1, glowV * 1.1), glowV)}
										<path d={`M${l.x - l.w / 2},${l.y + 8} L${l.x - l.w / 2 + l.w * 0.4},${l.y - 29} L${l.x - l.w / 2 + l.w * 0.55},${l.y - 29} L${l.x - l.w / 2 + l.w * 0.12},${l.y + 29} Z`} fill="#fff" opacity={0.14} />
									</g>
									<rect x={l.x - l.w / 2} y={l.y - 29} width={l.w} height={58} rx={Math.min(18, l.w / 2)} fill="none" stroke={C.ink} strokeWidth={INK} />
								</g>
							))}
						</g>
					)}

				{/* Hands raised to the face draw on top */}
				{arms.filter((a) => !a.behind && a.arm.hand2 === 'pinch').map(drawArm)}
			</g>
		</svg>
	);
};

