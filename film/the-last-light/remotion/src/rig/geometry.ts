// Rig space: 400 x 620 units, character centred on x = 200, feet at y ≈ 590.
// The body is treated as a set of vertical "cylinders". A point is described by
// azimuth (deg, 0 = facing camera) and the character's turn (deg, +90 = facing screen-right).

export const CX = 200;
export const rad = (d: number) => (d * Math.PI) / 180;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// --- Head -------------------------------------------------------------------
export const HEAD_TOP = 86;
export const HEAD_BOTTOM = 275;
export const HEAD_HW = 150;
// Rounded gumdrop (refs A/E): flat crown, wide corner radius, convex sides flaring to ±150.
const CROWN = 62;
const CORNER = 58;
const SIDE_Y = HEAD_TOP + CORNER;
const SIDE_HW = CROWN + CORNER;

/** Half-width of the head silhouette at height y. */
export const headHW = (y: number) => {
	if (y < HEAD_TOP) return 0;
	if (y < SIDE_Y) return CROWN + Math.sqrt(Math.max(0, CORNER ** 2 - (SIDE_Y - y) ** 2));
	return SIDE_HW + (HEAD_HW - SIDE_HW) * Math.pow(Math.min(1, (y - SIDE_Y) / (HEAD_BOTTOM - SIDE_Y)), 0.55);
};

/** Top edge of the head at horizontal offset u (inverse of headHW). */
const headTop = (u: number) => {
	const a = Math.abs(u);
	if (a <= CROWN) return HEAD_TOP;
	if (a <= SIDE_HW) return SIDE_Y - Math.sqrt(Math.max(0, CORNER ** 2 - (a - CROWN) ** 2));
	return SIDE_Y + Math.pow((a - SIDE_HW) / (HEAD_HW - SIDE_HW), 1 / 0.55) * (HEAD_BOTTOM - SIDE_Y);
};

/** Forward-projecting muzzle (sheet side view): lower face pushes out toward the lips. */
const smoothstep = (v: number) => {
	const t = clamp(v);
	return t * t * (3 - 2 * t);
};
// Rises from just under the lenses, stays full through the lips, tucks into the collar.
export const snout = (y: number) => 88 * smoothstep((y - 158) / 48) * (1 - smoothstep((y - 236) / 36));
const profile = (y: number, sinFacing: number, sinTurn: number) =>
	snout(y) * sinTurn * Math.pow(Math.max(0, sinFacing * Math.sign(sinTurn)), 1.5);

/** Screen x and facing (cos) of a head feature at azimuth phi, height y. */
export const onHead = (phi: number, y: number, turn: number, out = 0) => {
	const a = rad(phi + turn);
	return {x: CX + (headHW(y) + out) * Math.sin(a) + profile(y, Math.sin(a), Math.sin(rad(turn))), c: Math.cos(a)};
};

/** Head outline with the two brow bumps from the sheet, offset by (dx, dy). */
export const headPath = (turn: number, dx = 0, dy = 0) => {
	const bumps = [-24, 24].map((phi) => ({
		u: 80 * Math.sin(rad(phi + turn)),
		h: 12 * (0.5 + 0.5 * Math.abs(Math.cos(rad(phi + turn)))),
	}));
	const pts: string[] = [];
	for (let u = -HEAD_HW; u <= HEAD_HW; u += 1.5) {
		let y = headTop(u);
		for (const b of bumps) y -= b.h * Math.exp(-(((u - b.u) / 22) ** 2));
		const px = u + profile(y, u / HEAD_HW, Math.sin(rad(turn)));
		pts.push(`${(CX + px + dx).toFixed(1)},${(y + dy).toFixed(1)}`);
	}
	return `M${pts.join(' L')} L${CX + HEAD_HW + dx},${HEAD_BOTTOM + 20 + dy} L${CX - HEAD_HW + dx},${HEAD_BOTTOM + 20 + dy} Z`;
};

// --- Torso ------------------------------------------------------------------
export const TORSO_TOP = 250;
export const TORSO_BOTTOM = 468;
export const torsoHW = (y: number) => {
	const t = clamp((y - TORSO_TOP) / (TORSO_BOTTOM + 10 - TORSO_TOP));
	// Stocky pear: fullest low in the belly, rounding in at the hem.
	const belly = 42 * Math.exp(-(((t - 0.62) / 0.38) ** 2));
	const tuck = t > 0.8 ? 34 * ((t - 0.8) / 0.2) ** 2 : 0;
	return 138 + belly - tuck;
};

export const torsoPath = (dx = 0, dy = 0) => {
	const right: string[] = [];
	const left: string[] = [];
	for (let y = TORSO_TOP; y <= TORSO_BOTTOM; y += 6) {
		right.push(`${(CX + torsoHW(y) + dx).toFixed(1)},${(y + dy).toFixed(1)}`);
		left.unshift(`${(CX - torsoHW(y) + dx).toFixed(1)},${(y + dy).toFixed(1)}`);
	}
	return `M${CX - 60 + dx},${TORSO_TOP - 14 + dy} L${right.join(' L')} L${left.join(' L')} Z`;
};

export const onTorso = (phi: number, y: number, turn: number, out = 0) => {
	const a = rad(phi + turn);
	return {x: CX + (torsoHW(y) + out) * Math.sin(a), c: Math.cos(a)};
};

// --- 3D points (arms / legs) -------------------------------------------------
export type P3 = {x: number; y: number; z: number};
/** Project a body-space point (x right, y down, z toward camera at turn 0). */
export const project = (p: P3, turn: number) => {
	const t = rad(turn);
	return {
		x: CX + p.x * Math.cos(t) + p.z * Math.sin(t),
		y: p.y,
		depth: p.z * Math.cos(t) - p.x * Math.sin(t),
	};
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
