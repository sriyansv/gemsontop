// Expressions only move the mouth and the eye-glow bars; the face itself never changes.
export type Expression = {
	/** Mouth droop per sample point, left → right (+ = down). */
	mouth: [number, number, number, number, number];
	/** 0..1 eye glow seen through the lenses. */
	glow: number;
	/** Eye-bar height, tilt (+ = inner ends lower, "focused") and curve (+ = smiling arcs). */
	barH: number;
	tilt: number;
	curve: number;
	/** 0..1 open mouth (dialogue / surprise). */
	open: number;
};

export const EXPRESSIONS = {
	neutral: {mouth: [16, 4, 0, 4, 16], glow: 0.45, barH: 10, tilt: 0, curve: 0, open: 0},
	calculating: {mouth: [10, 2, 0, 2, 10], glow: 0.85, barH: 6, tilt: 2, curve: 0, open: 0},
	smirk: {mouth: [-4, -2, 0, 5, 18], glow: 0.45, barH: 9, tilt: 0, curve: 1.5, open: 0},
	serious: {mouth: [20, 6, 0, 6, 20], glow: 0.6, barH: 8, tilt: 5, curve: 0, open: 0},
	surprised: {mouth: [8, 2, 0, 2, 8], glow: 0.9, barH: 15, tilt: -1, curve: 0, open: 0.7},
	heartbroken: {mouth: [28, 9, 0, 9, 28], glow: 0.22, barH: 8, tilt: -6, curve: 0, open: 0},
	warm: {mouth: [-10, -3, 0, -3, -10], glow: 0.6, barH: 8, tilt: 0, curve: 4, open: 0},
	talking: {mouth: [14, 3, 0, 3, 14], glow: 0.4, barH: 10, tilt: 0, curve: 0, open: 0.55},
} satisfies Record<string, Expression>;

export type ExpressionName = keyof typeof EXPRESSIONS;
