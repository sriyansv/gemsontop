import {Easing, interpolate} from 'remotion';
import {POSES, type Arm, type Pose} from '../rig/poses';
import type {P3} from '../rig/geometry';

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ramp = (f: number, a: number, b: number, from = 0, to = 1, ease = Easing.inOut(Easing.cubic)) =>
	interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** One light beat between frames a..b with a soft attack and release. */
const beat = (f: number, a: number, b: number) =>
	f < a || f > b ? 0 : Math.min(clamp01((f - a) / 2), clamp01((b - f) / 3));

/** The film's motif: short – long – short. Matches the chimes in scripts/score.py. */
export const motif = (f: number, start: number) =>
	Math.max(beat(f, start, start + 6), beat(f, start + 12, start + 30), beat(f, start + 36, start + 42));

export const mulberry = (seed: number) => () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const lp = (a: P3, b: P3, t: number): P3 => ({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t});
const la = (a: Arm, b: Arm, t: number): Arm => ({elbow: lp(a.elbow, b.elbow, t), hand: lp(a.hand, b.hand, t), hand2: t < 0.5 ? a.hand2 : b.hand2});

/** Blend two rig poses (used for every gesture so motion stays on-model). */
export const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
	left: la(a.left, b.left, t),
	right: la(a.right, b.right, t),
	legL: {knee: lp(a.legL.knee, b.legL.knee, t), ankle: lp(a.legL.ankle, b.legL.ankle, t)},
	legR: {knee: lp(a.legR.knee, b.legR.knee, t), ankle: lp(a.legR.ankle, b.legR.ankle, t)},
	bodyDy: a.bodyDy + (b.bodyDy - a.bodyDy) * t,
	legsFront: t < 0.5 ? a.legsFront : b.legsFront,
});

/** Hand raised high, holding Pip up to the city (Scene 4C). */
export const RAISE: Pose = {
	...POSES.pockets,
	left: {elbow: {x: 78, y: -20, z: 40}, hand: {x: 96, y: -150, z: 70}, hand2: 'mitt'},
};

/** Same arm maths as the rig: where a hand lands in rig units. */
export const handPoint = (pose: Pose, turn: number, side: -1 | 1) => {
	const arm = side === -1 ? pose.left : pose.right;
	const r = (d: number) => (d * Math.PI) / 180;
	const sh = {x: 150 * Math.sin(r(side * 75)), y: 282, z: 150 * Math.cos(r(75))};
	const h = {x: sh.x + side * arm.hand.x, y: sh.y + arm.hand.y + pose.bodyDy, z: sh.z + arm.hand.z};
	const t = r(turn);
	return {x: 200 + h.x * Math.cos(t) + h.z * Math.sin(t), y: h.y};
};
