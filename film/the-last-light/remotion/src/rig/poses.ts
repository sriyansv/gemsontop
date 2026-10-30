import type {P3} from './geometry';

// Arm targets are offsets from the shoulder: x outward (mirrored per side), y down, z toward camera.
export type Arm = {elbow: P3; hand: P3; hand2?: 'pocket' | 'mitt' | 'point' | 'clasp' | 'palmUp' | 'pinch' | 'glasses'};
export type Leg = {knee: P3; ankle: P3};
export type Pose = {left: Arm; right: Arm; legL: Leg; legR: Leg; bodyDy: number; legsFront?: boolean};

const standLeg: Leg = {knee: {x: 0, y: 55, z: 4}, ankle: {x: -2, y: 108, z: 0}};
const pocket: Arm = {elbow: {x: 12, y: 88, z: -8}, hand: {x: -14, y: 172, z: 14}, hand2: 'pocket'};

// "left" = screen-left in front view (his right hand).
export const POSES = {
	pockets: {left: pocket, right: pocket, legL: standLeg, legR: standLeg, bodyDy: 0},
	clasped: {
		left: {elbow: {x: 28, y: 92, z: 70}, hand: {x: -112, y: 110, z: 160}, hand2: 'clasp'},
		right: {elbow: {x: 28, y: 92, z: 70}, hand: {x: -112, y: 110, z: 160}},
		legL: standLeg, legR: standLeg, bodyDy: 0,
	},
	point: {
		left: {elbow: {x: 46, y: 62, z: 70}, hand: {x: 48, y: 18, z: 170}, hand2: 'point'},
		right: pocket, legL: standLeg, legR: standLeg, bodyDy: 0,
	},
	adjustGlasses: {
		left: pocket,
		right: {elbow: {x: 34, y: 20, z: 120}, hand: {x: -100, y: -132, z: 150}, hand2: 'pinch'},
		legL: standLeg, legR: standLeg, bodyDy: 0,
	},
	holdGlasses: {
		left: pocket,
		right: {elbow: {x: 30, y: 82, z: 70}, hand: {x: -40, y: 60, z: 175}, hand2: 'glasses'},
		legL: standLeg, legR: standLeg, bodyDy: 0,
	},
	shrug: {
		left: {elbow: {x: 40, y: 72, z: 30}, hand: {x: 86, y: 44, z: 80}, hand2: 'palmUp'},
		right: {elbow: {x: 40, y: 72, z: 30}, hand: {x: 86, y: 44, z: 80}, hand2: 'palmUp'},
		legL: standLeg, legR: standLeg, bodyDy: 0,
	},
	sit: {
		left: {elbow: {x: 34, y: 80, z: 40}, hand: {x: 22, y: 120, z: 110}, hand2: 'mitt'},
		right: {elbow: {x: 34, y: 80, z: 40}, hand: {x: 22, y: 120, z: 110}, hand2: 'mitt'},
		legL: {knee: {x: 8, y: 26, z: 118}, ankle: {x: 10, y: 92, z: 122}},
		legR: {knee: {x: 8, y: 26, z: 118}, ankle: {x: 10, y: 92, z: 122}},
		bodyDy: 48,
		legsFront: true,
	},
} satisfies Record<string, Pose>;

export type PoseName = keyof typeof POSES;

/** Walk cycle, phase 0..1. Weighty and unhurried: small stride, low bob. */
export const walkPose = (phase: number): Pose => {
	const s = Math.sin(phase * Math.PI * 2);
	const lift = (v: number) => Math.max(0, v) * 14;
	const leg = (k: number): Leg => ({
		knee: {x: 0, y: 52, z: 18 * k + 6},
		ankle: {x: -2, y: 108 - lift(k), z: 30 * k},
	});
	const arm = (k: number): Arm => ({
		elbow: {x: 22, y: 84, z: 18 * k},
		hand: {x: 10, y: 150, z: 36 * k},
		hand2: 'mitt',
	});
	return {left: arm(-s), right: arm(s), legL: leg(s), legR: leg(-s), bodyDy: -4 * Math.abs(Math.cos(phase * Math.PI * 2))};
};
