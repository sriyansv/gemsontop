import React from 'react';
import {Frog, type FrogBossProps} from '../rig/FrogBoss';
import type {Pose} from '../rig/poses';
import {Crown, FlamePan} from './props';
import {handPoint, P} from './anim';

export type ActorState = Omit<FrogBossProps, 'pose'> & {
	key: string;
	x: number;
	y: number; // feet on floor
	h: number;
	pose: Pose;
	turn: number;
	sx?: number;
	sy?: number;
	rot?: number; // lean, degrees
	lift?: number; // px above the floor (hops)
	crown?: {drop?: number; rot?: number; sy?: number; shine?: number} | null;
	pan?: {flicker: number; flare?: number; lift?: number; rot?: number} | null;
	clip?: string;
	filter?: string;
	opacity?: number;
};

/** One character on stage: the approved rig plus crown/prop attachments that move with the body. */
export const Actor: React.FC<{a: ActorState}> = ({a}) => {
	const {key: _key, x: _x, y: _y, h: _h, pose: _pose, sx: _sx, sy: _sy, rot: _rot, lift: _lift, crown: _crown, pan: _pan, clip: _clip, filter: _filter, opacity: _op, ...rig} = a;
	const w = (a.h * 400) / 620;
	const k = a.h / 620;
	const pose = P(a.pose);
	const hand = handPoint(pose, a.turn, -1);
	const lift = a.lift ?? 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: a.x - w / 2,
				top: a.y - 598 * k - lift,
				width: w,
				height: a.h,
				transform: `rotate(${a.rot ?? 0}deg) scale(${a.sx ?? 1}, ${a.sy ?? 1})`,
				transformOrigin: `50% ${(598 / 620) * 100}%`,
				clipPath: a.clip,
				filter: a.filter,
				opacity: a.opacity ?? 1,
			}}
		>
			<Frog {...rig} pose={pose} style={{width: '100%', height: '100%'}} />
			{a.crown ? <Crown x={w / 2} y={(106 + pose.bodyDy) * k - (a.crown.drop ?? 0)} w={0.2 * a.h} rot={a.crown.rot ?? 0} sy={a.crown.sy ?? 1} shine={a.crown.shine ?? 0} /> : null}
			{a.pan ? <FlamePan x={hand.x * k + 6 * k} y={hand.y * k - (a.pan.lift ?? 0)} s={a.h / 560} flicker={a.pan.flicker} flare={a.pan.flare} rot={a.pan.rot} /> : null}
		</div>
	);
};
