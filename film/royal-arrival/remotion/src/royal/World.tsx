import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {Room} from './Room';
import {Throne, GOLD_LIGHT} from './props';
import {Actor, type ActorState} from './Actor';
import {BEAT, HIPS, RAISE, P, beatHit, blend, hop, lerp, perspH, ramp, spring1, squash, walk} from './anim';
import {Burst, Confetti, Finish, Flash, NameCard, Ring, Spiral} from './fx';
import {POSES, walkPose} from '../rig/poses';
import type {ExpressionName} from '../rig/expressions';
import {FONT} from './Sheet';

// Whole film as one continuous world: every actor, the camera and the FX are functions of the frame.
// Beat grid: 120 BPM → a beat every 15 frames. Key hits: crown 240 · reveal 420 · sit 570 ·
// Chef 600 · Exec 690 · Vision 780 · Boss 870 (drop) · dance 960–1200 · final pose 1200.

const DOOR = {x: 300, y: 665};
const SEAT = {x: 960, y: 725};
const STAND = {chef: {x: 470, y: 960}, exec: {x: 720, y: 905}, vision: {x: 1210, y: 905}, boss: {x: 1470, y: 960}};
const LINE = {chef: 320, exec: 640, king: 960, vision: 1280, boss: 1600};
const LINE_Y = 1000;
const DANCE_H = 450;
const ORDER = ['chef', 'exec', 'king', 'vision', 'boss'] as const;

type Cam = {x: number; y: number; z: number; blur?: number; shake?: number};

// ---------------------------------------------------------------- the king (Casual → Royal)
const king = (f: number): ActorState | null => {
	if (f < 30) return null;
	let s: ActorState;
	if (f < 300) {
		const w = walk(f, 30, 170, DOOR, {x: 960, y: 940}, 30);
		const look = f < 176 ? 50 : f < 196 ? ramp(f, 176, 192, 50, -30) : ramp(f, 196, 210, -30, 0);
		const sq = squash(f, 240, 0.12);
		const lean = f >= 212 && f < 242 ? ramp(f, 212, 226, 0, -4) : ramp(f, 242, 256, -4, 0);
		const stretch = f >= 212 && f < 240 ? ramp(f, 212, 226, 1, 1.035) : 1;
		const expr: ExpressionName = f < 214 ? 'neutral' : f < 248 ? 'surprised' : 'warm';
		const drop = f < 222 ? 900 : f < 240 ? ramp(f, 222, 240, 900, 0, Easing.in(Easing.quad)) : 0;
		const crot = f < 240 ? ramp(f, 222, 240, -540, 0, Easing.in(Easing.quad)) : 8 * spring1(f, 240);
		s = {
			key: 'king', x: w.x, y: w.y, h: w.h, pose: w.pose, turn: f < 170 ? 50 : look, rot: w.sway + lean,
			sx: sq.sx, sy: sq.sy * stretch, look: 'casual', expression: expr,
			crown: f >= 222 ? {drop, rot: crot, sy: 1 - 0.18 * Math.max(0, spring1(f, 240)), shine: ramp(f, 240, 250, 1, 0.3)} : null,
		};
		return s;
	}
	if (f < 450) {
		// spin (two turns) with a lift, light-wipe outfit swap 385–420, reveal 420
		const turn = ramp(f, 300, 412, 0, 720, Easing.inOut(Easing.cubic));
		const lift = 46 * Math.sin(Math.PI * ramp(f, 300, 420, 0, 1, Easing.inOut(Easing.sin)));
		const sq = squash(f, 420, 0.1);
		const pose = f < 420 ? blend('pockets', RAISE, ramp(f, 330, 380) - ramp(f, 395, 418)) : blend('pockets', HIPS, ramp(f, 420, 430, 0, 1, Easing.out(Easing.back(2))));
		return {
			key: 'king', x: 960, y: 940, h: perspH(940), pose, turn, lift, sx: sq.sx, sy: sq.sy, look: 'casual',
			expression: f < 420 ? 'surprised' : 'smirk', crown: {shine: 0.4 + 0.6 * ramp(f, 400, 420) * ramp(f, 420, 445, 1, 0.3)},
		};
	}
	if (f < 960) {
		if (f < 556) {
			const pre = blend(HIPS, 'pockets', ramp(f, 450, 462));
			const w = walk(f, 462, 540, {x: 960, y: 940}, SEAT, 30);
			const turn = f < 462 ? ramp(f, 452, 462, 0, 180) : f < 540 ? 180 : ramp(f, 540, 554, 180, 360);
			return {key: 'king', x: w.x, y: w.y, h: lerp(perspH(w.y), 400, ramp(f, 462, 540)), pose: f < 462 ? pre : w.pose, turn: turn % 360, rot: w.sway, look: 'royal', expression: 'smirk', crown: {}};
		}
		// sit: anticipation dip, drop into the seat on 570, then idle on the beat and watch each entrant
		const dip = ramp(f, 552, 558, 0, 1) - ramp(f, 558, 562, 0, 1);
		const sit = ramp(f, 558, 570, 0, 1, Easing.inOut(Easing.quad));
		const sq = squash(f, 570, 0.08);
		const watch = f < 600 ? 0 : f < 690 ? ramp(f, 600, 615, 0, -22) : f < 780 ? ramp(f, 690, 705, -22, -14) : f < 870 ? ramp(f, 780, 795, -14, 22) : ramp(f, 870, 890, 22, 28);
		const bob = f > 600 ? 1 - 0.018 * beatHit(f, 600) : 1;
		return {
			key: 'king', x: SEAT.x, y: SEAT.y, h: 400, pose: blend('pockets', 'sit', sit), turn: watch, sx: sq.sx, sy: sq.sy * bob * (1 - 0.04 * dip), look: 'royal',
			expression: f > 872 && f < 900 ? 'surprised' : f > 600 ? 'warm' : 'smirk', crown: {shine: 0.25},
		};
	}
	return null;
};

// ---------------------------------------------------------------- entrances
const chef = (f: number): ActorState | null => {
	if (f < 600) return null;
	const flicker = 0.5 + 0.5 * Math.sin(f * 0.9);
	const flare = beatHit(f, 600);
	if (f < 960) {
		// slide in: fast, stretched, leaning; skid-stop squash at 630
		const t = ramp(f, 600, 630, 0, 1, Easing.out(Easing.quad));
		const x = lerp(DOOR.x, STAND.chef.x, t);
		const y = lerp(DOOR.y, STAND.chef.y, t);
		const sq = squash(f, 630, 0.14);
		const stretch = f < 630 ? 1 + 0.12 * (1 - t) : 1;
		const raise = ramp(f, 634, 646, 0, 1, Easing.out(Easing.back(1.6)));
		const toss = hop(f, 648, 668, 150);
		const turn = f < 880 ? 30 : ramp(f, 880, 900, 30, 55);
		return {
			key: 'chef', x, y, h: perspH(y), turn, pose: f < 632 ? walkPose(0.25) : blend('pockets', 'point', raise), rot: f < 630 ? 10 * (1 - t) : 0,
			sx: sq.sx * stretch, sy: sq.sy / stretch, look: 'chef', expression: 'warm', glow: 0.9,
			pan: {flicker, flare: f < 700 ? flare : 0.3 * flare, lift: toss, rot: f > 648 && f < 668 ? ramp(f, 648, 668, 0, -360) : 0},
		};
	}
	return null;
};

const exec = (f: number): ActorState | null => {
	if (f < 690) return null;
	if (f < 960) {
		// glide: no bob, perfectly smooth; the room dims so the eye-glow carries the shot
		const t = ramp(f, 690, 735, 0, 1, Easing.inOut(Easing.sin));
		const x = lerp(DOOR.x, STAND.exec.x, t);
		const y = lerp(DOOR.y, STAND.exec.y, t);
		const face = f < 735 ? 40 : f < 880 ? ramp(f, 735, 750, 40, 0, Easing.out(Easing.back(1.4))) : ramp(f, 880, 900, 0, 40);
		const glow = 0.6 + 0.4 * beatHit(f, 690) + 0.4 * ramp(f, 735, 742) * ramp(f, 742, 770, 1, 0);
		return {key: 'exec', x, y, h: perspH(y), turn: face, pose: P('clasped'), look: 'exec', expression: 'neutral', glow: Math.min(1, glow), rot: f < 735 ? -2 * Math.sin(t * Math.PI) : 0};
	}
	return null;
};

const vision = (f: number): ActorState | null => {
	if (f < 780) return null;
	if (f < 960) {
		// strut: bouncy 20-frame cycle with hip sway; stops on 830, lens flash + "ta-da" on 840
		const w = walk(f, 780, 830, DOOR, STAND.vision, 20);
		const bounce = w.moving ? 12 * Math.abs(Math.sin(w.phase * Math.PI * 2)) : 0;
		const sq = squash(f, 840, 0.1);
		const pop = ramp(f, 838, 846, 0, 1, Easing.out(Easing.back(2))) - ramp(f, 870, 880);
		const turn = f < 830 ? 55 : f < 880 ? ramp(f, 830, 840, 55, -10) : ramp(f, 880, 900, -10, 30);
		return {key: 'vision', x: w.x, y: w.y, h: w.h, pose: f < 836 ? w.pose : blend('pockets', 'shrug', pop), turn, lift: bounce, rot: w.sway * 2.4, sx: sq.sx, sy: sq.sy, look: 'vision', expression: 'smirk'};
	}
	return null;
};

const boss = (f: number): ActorState | null => {
	if (f < 866) return null;
	if (f < 960) {
		// the drop: blackout, spotlight in the doorway, slow heavy walk, glasses adjust on 930
		const w = walk(f, 870, 916, DOOR, STAND.boss, 40);
		const turn = f < 916 ? 45 : ramp(f, 916, 926, 45, -12);
		const adjust = ramp(f, 920, 930, 0, 1, Easing.out(Easing.cubic)) - ramp(f, 942, 954);
		const pose = f < 918 ? w.pose : blend('pockets', 'adjustGlasses', adjust);
		const silhouette = ramp(f, 870, 900, 0.3, 1);
		const sq = squash(f, 930, 0.05);
		return {key: 'boss', x: w.x, y: w.y, h: w.h, pose, turn, rot: w.sway * 0.6, sx: sq.sx, sy: sq.sy, look: 'boss', expression: f < 930 ? 'neutral' : 'smirk', glow: f >= 930 ? 0.95 : 0.5, filter: `brightness(${silhouette}) drop-shadow(0 0 ${18 * (1 - ramp(f, 900, 930))}px rgba(255,227,154,0.95))`};
	}
	return null;
};

// ---------------------------------------------------------------- dance (960–1200)
const BASE_TURN = {chef: 16, exec: 8, king: 0, vision: -8, boss: -16};
const LOOK = {chef: 'chef', exec: 'exec', king: 'royal', vision: 'vision', boss: 'boss'} as const;
const FROM = (k: (typeof ORDER)[number]) => (k === 'king' ? SEAT : STAND[k]);

const dancer = (f: number, k: (typeof ORDER)[number], i: number): ActorState => {
	const t = f - 960 - i * 2; // 2-frame offset per dancer = organic follow-through down the line
	const b = Math.floor(Math.max(0, t) / BEAT);
	const p = (Math.max(0, t) % BEAT) / BEAT;
	const hitP = Math.exp(-p * 6);
	let x = LINE[k];
	let y = LINE_Y;
	let h = DANCE_H;
	let pose = P('pockets');
	let turn: number = BASE_TURN[k];
	let lift = 0;
	let rot = 0;
	let sx = 1;
	let sy = 1;
	let expression: ExpressionName = k === 'king' ? 'warm' : 'smirk';
	if (t < 30) {
		// get into the line: the king hops off the throne, the others step over
		if (k === 'king') {
			const u = ramp(f, 968, 990, 0, 1, Easing.inOut(Easing.quad));
			x = SEAT.x;
			y = lerp(SEAT.y, LINE_Y, u);
			h = lerp(400, DANCE_H, u);
			lift = hop(f, 968, 990, 130);
			pose = blend('sit', RAISE, ramp(f, 960, 970));
		} else {
			const w = walk(f, 962, 988, FROM(k), {x: LINE[k], y: LINE_Y}, 26);
			x = w.x;
			y = w.y;
			h = lerp(perspH(FROM(k).y), DANCE_H, ramp(f, 962, 988));
			pose = w.pose;
			rot = w.sway;
		}
		const sq = squash(f, 990 + i * 2, 0.1);
		sx = sq.sx;
		sy = sq.sy;
	} else if (b < 6) {
		// step-touch + bob on every beat
		x += 34 * Math.sin((Math.PI * (t - 30)) / 30);
		pose = blend(walkPose(((t - 30) / 30) % 1), 'pockets', 0.35);
		sy = 1 - 0.06 * hitP;
		sx = 1 + 0.04 * hitP;
		rot = 4 * Math.sin((Math.PI * (t - 30)) / 30);
	} else if (b < 10) {
		// shoulder shrug + bounce
		const s = Math.sin(Math.PI * p);
		pose = blend('pockets', 'shrug', 0.25 + 0.75 * s);
		lift = 22 * s;
		rot = 6 * (b % 2 ? 1 : -1) * s;
		sy = 1 - 0.07 * hitP;
		sx = 1 + 0.05 * hitP;
	} else if (b < 12) {
		// the wave: a jump rolls down the line, arms up
		const j0 = 150 + i * 5;
		lift = hop(t, j0, j0 + 16, 90);
		pose = blend('pockets', RAISE, ramp(t, j0 - 4, j0 + 2) - ramp(t, j0 + 18, j0 + 26));
		const sq = squash(t, j0 + 16, 0.12);
		sx = sq.sx;
		sy = sq.sy;
	} else if (b < 14) {
		// point at the camera
		const k2 = ramp(t, 180, 186, 0, 1, Easing.out(Easing.back(2)));
		pose = blend('pockets', 'point', k2);
		turn = lerp(BASE_TURN[k], 20, k2);
		rot = -5 * k2;
		expression = 'smirk';
	} else {
		// spin + land on the final hit
		turn = BASE_TURN[k] + ramp(t, 210, 234, 0, 360, Easing.inOut(Easing.cubic));
		lift = hop(t, 210, 236, 40);
		pose = blend('point', RAISE, ramp(t, 210, 222));
		const sq = squash(t, 236, 0.12);
		sx = sq.sx;
		sy = sq.sy;
	}
	return {
		key: k, x, y, h, pose, turn: ((turn % 360) + 360) % 360, lift, rot, sx, sy, look: LOOK[k], expression,
		glow: k === 'exec' || k === 'chef' ? 0.8 + 0.2 * hitP : k === 'boss' ? 0.6 + 0.3 * hitP : undefined,
		crown: k === 'king' ? {shine: 0.3 + 0.4 * hitP} : null,
		pan: k === 'chef' ? {flicker: 0.5 + 0.5 * Math.sin(f * 0.9), flare: hitP} : null,
	};
};

// ---------------------------------------------------------------- final pose (1200–1350)
const finale = (f: number): ActorState[] => {
	const hb = beatHit(f, 1200) * ramp(f, 1290, 1300, 1, 0);
	const pop = (d: number) => ramp(f, 1200 + d, 1208 + d, 0, 1, Easing.out(Easing.back(2)));
	const pose = [
		{k: 'chef', x: 400, y: 1000, turn: 30, pose: blend('pockets', 'point', pop(0))},
		{k: 'exec', x: 690, y: 950, turn: 14, pose: P('clasped')},
		{k: 'vision', x: 1230, y: 950, turn: -14, pose: blend('pockets', 'shrug', pop(2))},
		{k: 'boss', x: 1520, y: 1000, turn: -24, pose: P('pockets')},
	] as const;
	return [
		{key: 'king', x: SEAT.x, y: SEAT.y + 12, h: 410, pose: blend('sit', HIPS, 0.25), turn: 0, look: 'royal', expression: 'warm', sy: 1 - 0.02 * hb, crown: {shine: 0.6 + 0.4 * hb}},
		...pose.map((c, i) => ({
			key: c.k, x: c.x, y: c.y, h: perspH(c.y), pose: c.pose, turn: c.turn, look: LOOK[c.k], expression: 'smirk' as ExpressionName,
			sy: 1 - 0.035 * hb, sx: 1 + 0.02 * hb, lift: hop(f, 1200 + i * 2, 1212 + i * 2, 34),
			glow: c.k === 'boss' ? 0.9 : 1,
			pan: c.k === 'chef' ? {flicker: 0.5 + 0.5 * Math.sin(f * 0.9), flare: 0.6 + 0.4 * hb} : null,
		})),
	];
};

// ---------------------------------------------------------------- camera
const camera = (f: number, k: ActorState | null): Cam => {
	if (f < 210) return {x: lerp(960, k?.x ?? 960, 0.35), y: ramp(f, 0, 170, 540, 600), z: ramp(f, 0, 170, 1.0, 1.14, Easing.inOut(Easing.sin))};
	if (f < 300) return {x: 960, y: 940 - 330, z: ramp(f, 210, 300, 2.0, 2.2, Easing.out(Easing.sin)), shake: 14 * Math.max(0, spring1(f, 240, 1.4, 0.3))};
	if (f < 450) return {x: 960 + 40 * Math.sin((f - 300) / 30), y: 700, z: ramp(f, 300, 420, 1.45, 1.75) - ramp(f, 420, 450, 0, 0.15), shake: 8 * Math.max(0, spring1(f, 420, 1.4, 0.3))};
	if (f < 600) return {x: 960, y: ramp(f, 450, 590, 640, 560), z: ramp(f, 450, 590, 1.25, 1.02, Easing.inOut(Easing.sin)), shake: 5 * Math.max(0, spring1(f, 570, 1.4, 0.3))};
	if (f < 690) return {x: ramp(f, 600, 612, 360, 900, Easing.out(Easing.cubic)), y: ramp(f, 600, 612, 640, 560), z: ramp(f, 600, 612, 1.5, 1.05), blur: ramp(f, 600, 604, 0, 8) - ramp(f, 604, 612, 0, 8)};
	if (f < 780) return {x: ramp(f, 728, 742, 900, 760) + ramp(f, 765, 778, 0, 160), y: ramp(f, 728, 742, 560, 690) - ramp(f, 765, 778, 0, 130), z: 1.05 + ramp(f, 728, 742, 0, 0.3) - ramp(f, 765, 778, 0, 0.3)};
	if (f < 870) return {x: 900 + ramp(f, 836, 840, 0, 250) - ramp(f, 856, 868, 0, 250), y: 560 + ramp(f, 836, 840, 0, 140) - ramp(f, 856, 868, 0, 140), z: 1.05 + ramp(f, 836, 840, 0, 0.35, Easing.out(Easing.cubic)) - ramp(f, 856, 868, 0, 0.35), shake: 10 * Math.max(0, spring1(f, 840, 1.4, 0.3))};
	if (f < 960) {
		const bx = k ? 0 : 0;
		const follow = ramp(f, 870, 916);
		return {x: lerp(560, STAND.boss.x - 60, follow) + bx, y: lerp(620, 760, follow), z: ramp(f, 870, 930, 1.25, 1.6, Easing.inOut(Easing.sin)) - ramp(f, 940, 958, 0, 0.5), shake: 10 * Math.max(0, spring1(f, 930, 1.4, 0.3))};
	}
	if (f < 1200) return {x: 960 + 24 * Math.sin((f - 960) / 40), y: 640, z: 1.08 + 0.015 * beatHit(f, 960)};
	return {x: 960, y: 560, z: ramp(f, 1200, 1300, 1.12, 1.0, Easing.out(Easing.cubic)), shake: 12 * Math.max(0, spring1(f, 1200, 1.4, 0.3))};
};

const TITLE: React.FC<{f: number}> = ({f}) => {
	const s = ramp(f, 1206, 1220, 0, 1, Easing.out(Easing.back(1.8)));
	return (
		<div style={{position: 'absolute', top: 36, width: '100%', textAlign: 'center', fontFamily: FONT, opacity: Math.min(1, s * 1.5)}}>
			<div style={{fontSize: 118, fontWeight: 900, letterSpacing: 24, color: '#FFE39A', transform: `scale(${0.6 + 0.4 * s})`, textShadow: '0 0 40px rgba(255,190,90,0.7), 0 6px 0 #6B4A0E'}}>ELYZIUMA</div>
			<div style={{fontSize: 26, letterSpacing: 14, color: '#FFF4D6', marginTop: 4, opacity: ramp(f, 1222, 1236)}}>THE ROYAL ARRIVAL</div>
		</div>
	);
};

export const World: React.FC = () => {
	const f = useCurrentFrame();
	const K = king(f);
	const raw = camera(f, K);
	const cam = {...raw, x: Math.min(1920 - 960 / raw.z, Math.max(960 / raw.z, raw.x)), y: Math.min(1080 - 540 / raw.z, Math.max(540 / raw.z, raw.y))};
	const final = f >= 1200;

	// lights + doors
	const blackout = ramp(f, 862, 870, 0, 1) * (1 - ramp(f, 928, 934, 0, 1));
	const execDim = ramp(f, 690, 700, 0, 0.55) - ramp(f, 765, 778, 0, 0.55);
	const lights = f < 30 ? 0.35 : f < 570 ? lerp(0.45, 0.7, ramp(f, 420, 440)) : 1;
	const roomLights = Math.max(0.05, lights - execDim - blackout * 0.95 + (final ? 0 : 0));
	const doors = f < 40 ? ramp(f, 4, 40, 0, 1, Easing.out(Easing.back(1.3))) : f < 600 ? ramp(f, 180, 230, 1, 0) : f < 606 ? ramp(f, 600, 606, 0, 1, Easing.out(Easing.cubic)) : 1;
	const throneRise = ramp(f, 450, 500, 1, 0, Easing.out(Easing.cubic));

	let actors: ActorState[] = [];
	if (final) actors = finale(f);
	else if (f >= 960) actors = ORDER.map((k, i) => dancer(f, k, i));
	else actors = [K, chef(f), exec(f), vision(f), boss(f)].filter((a): a is ActorState => !!a);
	if (blackout > 0 && !final && f < 960) actors = actors.map((a) => (a.key === 'boss' ? a : {...a, filter: `brightness(${1 - 0.8 * blackout})`}));
	actors.sort((a, b) => a.y - b.y);

	const shakeX = (cam.shake ?? 0) * Math.sin(f * 2.1);
	const shakeY = (cam.shake ?? 0) * Math.cos(f * 2.7);
	const showThrone = f >= 450;

	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `translate(${960 + shakeX}px, ${540 + shakeY}px) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`, transformOrigin: '0 0', filter: cam.blur ? `blur(${cam.blur}px)` : undefined}}>
				<Room doors={doors} lights={roomLights} />
				{/* spotlight for the Boss */}
				{blackout > 0 ? (
					<svg width={1920} height={1080} style={{position: 'absolute'}}>
						<path d={`M${DOOR.x - 40},0 L${DOOR.x + 40},0 L${DOOR.x + 220},${DOOR.y + 20} L${DOOR.x - 220},${DOOR.y + 20} Z`} fill={GOLD_LIGHT} opacity={0.4 * blackout} style={{filter: 'blur(10px)'}} />
						<ellipse cx={(boss(f)?.x ?? DOOR.x)} cy={(boss(f)?.y ?? DOOR.y) - 4} rx={140} ry={30} fill={GOLD_LIGHT} opacity={0.35 * blackout} style={{filter: 'blur(8px)'}} />
					</svg>
				) : null}
				{showThrone ? (
					<div style={{position: 'absolute', inset: 0, transform: `translateY(${throneRise * 260}px)`, opacity: 1 - throneRise * 0.6, filter: `brightness(${1 - blackout * 0.8})`}}>
						<Throne x={960} y={690} w={420} glow={f < 600 ? 1 - throneRise : 0.5 + 0.5 * beatHit(f, 600)} />
					</div>
				) : null}
				{/* the dais lip covers the throne as it rises */}
				{showThrone && throneRise > 0 ? (
					<svg width={1920} height={1080} style={{position: 'absolute'}}>
						<path d="M700,680 L1220,680 L1260,720 L660,720 Z" fill="#A97A1E" stroke="#0A0A0A" strokeWidth={5} />
					</svg>
				) : null}
				{f >= 300 && f < 450 ? <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 62%, rgba(255,227,154,0.55), rgba(255,170,60,0.12) 30%, rgba(0,0,0,0.55) 62%)', opacity: ramp(f, 300, 330) * ramp(f, 430, 450, 1, 0.2)}} /> : null}
				{actors.map((a) => {
					if (a.key === 'king' && f >= 300 && f < 450) {
						// light-wipe outfit swap, left → right across the body
						const wpos = ramp(f, 385, 420, 0, 100, Easing.inOut(Easing.quad));
						const royal = {...a, look: 'royal' as const, clip: `inset(0 ${100 - wpos}% 0 0)`};
						const casual = {...a, clip: `inset(0 0 0 ${wpos}%)`};
						const lineX = a.x - (a.h * 400) / 620 / 2 + ((a.h * 400) / 620) * (wpos / 100);
						return (
							<React.Fragment key="king">
								{wpos < 100 ? <Actor a={casual} /> : null}
								{wpos > 0 ? <Actor a={royal} /> : null}
								{wpos > 0 && wpos < 100 ? <div style={{position: 'absolute', left: lineX - 8, top: a.y - a.h - (a.lift ?? 0), width: 16, height: a.h * 1.05, background: '#FFF7DC', boxShadow: '0 0 40px 18px rgba(255,220,140,0.9)', borderRadius: 8}} /> : null}
							</React.Fragment>
						);
					}
					return <Actor key={a.key} a={a} />;
				})}
				{/* FX in world space */}
				{f >= 222 && f < 240 ? (
					<svg width={1920} height={1080} style={{position: 'absolute'}}>
						{[-30, 0, 30].map((dx) => <line key={dx} x1={960 + dx} y1={ramp(f, 222, 240, -200, 300)} x2={960 + dx} y2={ramp(f, 222, 240, -500, 0)} stroke={GOLD_LIGHT} strokeWidth={6} opacity={0.6} />)}
					</svg>
				) : null}
				<Ring f={f} hit={240} x={960} y={940 - 0.78 * perspH(940)} max={520} />
				<Burst f={f} hit={240} x={960} y={940 - 0.82 * perspH(940)} n={30} speed={16} seed={2} />
				<Spiral f={f} a={310} b={420} x={960} y={950} r={210} hgt={560} />
				<Burst f={f} hit={420} x={960} y={720} n={46} speed={26} seed={5} life={40} />
				<Ring f={f} hit={420} x={960} y={940} max={900} life={26} />
				<Ring f={f} hit={570} x={960} y={710} max={600} />
				<Burst f={f} hit={630} x={STAND.chef.x} y={STAND.chef.y - 10} n={16} speed={12} seed={7} />
				<Burst f={f} hit={930} x={STAND.boss.x + 20} y={STAND.boss.y - perspH(STAND.boss.y) * 0.72} n={18} speed={10} seed={9} life={26} />
				<Burst f={f} hit={1200} x={960} y={500} n={60} speed={30} seed={13} life={44} />
			</AbsoluteFill>
			{/* screen-space FX */}
			{f >= 600 && f < 612 ? <Flash o={0.25 * ramp(f, 600, 612, 1, 0)} color="#FF9A3C" /> : null}
			{f >= 838 && f < 848 ? (
				<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(240,80,90,0.45) 50%, rgba(63,216,232,0.45) 50%)', opacity: ramp(f, 838, 848, 1, 0)}} />
			) : null}
			<Flash o={0.65 * ramp(f, 240, 246, 1, 0) * (f >= 240 ? 1 : 0)} />
			<Flash o={0.8 * ramp(f, 420, 428, 1, 0) * (f >= 420 ? 1 : 0)} />
			<Flash o={0.4 * ramp(f, 930, 936, 1, 0) * (f >= 930 ? 1 : 0)} />
			<Flash o={0.9 * ramp(f, 1200, 1206, 1, 0) * (f >= 1200 ? 1 : 0)} />
			{final ? <Confetti f={f} start={1200} /> : null}
			{final ? <TITLE f={f} /> : null}
			<NameCard f={f} start={636} end={688} label="THE CHEF" sub="SIZZLES ON THE BEAT" />
			<NameCard f={f} start={740} end={778} label="THE SHADOW EXEC" sub="SILENT · ALWAYS WATCHING" />
			<NameCard f={f} start={842} end={866} label="THE 3D VISIONARY" sub="SEES IN EVERY DIMENSION" />
			<NameCard f={f} start={934} end={959} label="THE FROG BOSS" sub="CALM MIND · SHARP VISION" big />
			{final ? (
				<div style={{position: 'absolute', bottom: 22, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 16, letterSpacing: 4, color: '#FFF4D6', opacity: ramp(f, 1240, 1256) * 0.85}}>
					AN ORIGINAL FAN FILM INSPIRED BY ELYZIUMA · FAN LABELS, NOT OFFICIAL CHARACTER NAMES
				</div>
			) : null}
			<Finish vignette={blackout > 0 ? 0.7 : 0.45} />
			<Flash o={ramp(f, 0, 14, 1, 0)} color="#000" />
			<Flash o={ramp(f, 1330, 1349, 0, 1)} color="#000" />
		</AbsoluteFill>
	);
};
