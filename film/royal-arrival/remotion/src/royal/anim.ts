import {Easing, interpolate} from 'remotion';
import {POSES, walkPose, type Arm, type Pose, type PoseName} from '../rig/poses';
import type {P3} from '../rig/geometry';

export const BEAT = 15; // 120 BPM at 30 fps
export const ramp = (f: number, a: number, b: number, from = 0, to = 1, ease: (t: number) => number = Easing.inOut(Easing.cubic)) =>
	interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Damped spring after a hit: 1 at impact, oscillating to 0. */
export const spring1 = (f: number, hit: number, freq = 0.6, decay = 0.17) => (f < hit ? 0 : Math.exp(-(f - hit) * decay) * Math.cos((f - hit) * freq));
/** Squash on impact (sy down, sx out), stretch on the rebound. */
export const squash = (f: number, hit: number, amt = 0.1) => {
	const s = spring1(f, hit);
	return {sx: 1 + amt * 0.7 * s, sy: 1 - amt * s};
};
/** 1 on every beat, decaying fast; offset in frames. */
export const beatHit = (f: number, from = 0) => {
	if (f < from) return 0;
	const p = ((f - from) % BEAT) / BEAT;
	return Math.exp(-p * 7);
};

/** Perspective: rendered rig height at floor y (door ≈ 372, front ≈ 530). */
export const perspH = (y: number) => 400 + (y - 725) * (130 / 275);

const lp = (a: P3, b: P3, t: number): P3 => ({x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t)});
const la = (a: Arm, b: Arm, t: number): Arm => ({elbow: lp(a.elbow, b.elbow, t), hand: lp(a.hand, b.hand, t), hand2: t < 0.5 ? a.hand2 : b.hand2});
export const P = (p: PoseName | Pose): Pose => (typeof p === 'string' ? POSES[p] : p);
export const blend = (a: PoseName | Pose, b: PoseName | Pose, t: number): Pose => {
	const A = P(a);
	const B = P(b);
	const k = Math.min(1, Math.max(0, t));
	return {
		left: la(A.left, B.left, k),
		right: la(A.right, B.right, k),
		legL: {knee: lp(A.legL.knee, B.legL.knee, k), ankle: lp(A.legL.ankle, B.legL.ankle, k)},
		legR: {knee: lp(A.legR.knee, B.legR.knee, k), ankle: lp(A.legR.ankle, B.legR.ankle, k)},
		bodyDy: lerp(A.bodyDy, B.bodyDy, k),
		legsFront: k < 0.5 ? A.legsFront : B.legsFront,
	};
};

/** Arm raised overhead (wave / celebration). */
export const RAISE: Pose = {...POSES.pockets, left: {elbow: {x: 60, y: -40, z: 30}, hand: {x: 70, y: -170, z: 50}, hand2: 'mitt'}, right: {elbow: {x: 60, y: -40, z: 30}, hand: {x: 70, y: -170, z: 50}, hand2: 'mitt'}};
/** Hands on hips (royal confidence). */
export const HIPS: Pose = {
	...POSES.pockets,
	left: {elbow: {x: 70, y: 70, z: -10}, hand: {x: 6, y: 150, z: 20}, hand2: 'mitt'},
	right: {elbow: {x: 70, y: 70, z: -10}, hand: {x: 6, y: 150, z: 20}, hand2: 'mitt'},
};

/** Where a hand lands in rig units (same arm maths as the rig). */
export const handPoint = (pose: Pose, turn: number, side: -1 | 1) => {
	const arm = side === -1 ? pose.left : pose.right;
	const r = (d: number) => (d * Math.PI) / 180;
	const sh = {x: 150 * Math.sin(r(side * 75)), y: 282, z: 150 * Math.cos(r(75))};
	const h = {x: sh.x + side * arm.hand.x, y: sh.y + arm.hand.y + pose.bodyDy, z: sh.z + arm.hand.z};
	const t = r(turn);
	return {x: 200 + h.x * Math.cos(t) + h.z * Math.sin(t), y: h.y};
};

/**
 * Walk from a to b between frames f0..f1. Feet cycle with the travel so nobody slides:
 * cycle = frames per two steps. Returns position, perspective height, pose, sway.
 */
export const walk = (f: number, f0: number, f1: number, a: {x: number; y: number}, b: {x: number; y: number}, cycle = 30, end: PoseName | Pose = 'pockets') => {
	const t = ramp(f, f0, f1, 0, 1, Easing.inOut(Easing.sin));
	const x = lerp(a.x, b.x, t);
	const y = lerp(a.y, b.y, t);
	const moving = f > f0 && f < f1;
	const phase = ((f - f0) / cycle) % 1;
	const settle = ramp(f, f1 - 6, f1 + 6);
	const pose = f <= f0 ? P(end) : blend(walkPose(phase), end, settle);
	const sway = moving ? 2.2 * Math.sin(phase * Math.PI * 4) * (1 - settle) : 0;
	return {x, y, h: perspH(y), pose, sway, moving, phase};
};

/** Parabolic hop height between f0..f1, peak px. */
export const hop = (f: number, f0: number, f1: number, peak: number) => (f <= f0 || f >= f1 ? 0 : peak * 4 * ((f - f0) / (f1 - f0)) * (1 - (f - f0) / (f1 - f0)));

export const mulberry = (seed: number) => () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
