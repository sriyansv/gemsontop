import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {FrogBoss} from '../rig/FrogBoss';
import {POSES} from '../rig/poses';
import {C} from '../rig/tokens';
import {FONT} from './Sheet';

// 12 s motion test: turnaround, blink + lip-sync, calculating glow, and the Scene 4 glasses-off beat.
export const RigTest: React.FC = () => {
	const f = useCurrentFrame();
	const ease = Easing.inOut(Easing.cubic);
	const turn = interpolate(f, [0, 120], [0, 360], {extrapolateRight: 'clamp', easing: ease}) % 360;
	const blink = [150, 230].reduce((b, s) => Math.max(b, interpolate(f, [s, s + 3, s + 6], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})), 0);
	const talk = f > 130 && f < 200 ? Math.abs(Math.sin(f * 0.55)) * 0.6 * Math.abs(Math.sin(f * 0.13 + 1)) : 0;
	const glow = interpolate(f, [200, 215, 250, 265], [0.35, 1, 1, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const reveal = f >= 300;
	const pose = f < 270 ? POSES.pockets : f < 300 ? POSES.adjustGlasses : POSES.holdGlasses;
	const label = f < 125 ? 'TURNAROUND' : f < 200 ? 'BLINK + LIP-SYNC' : f < 270 ? 'CALCULATING (GLOW)' : 'SCENE 4 · THE REVEAL';
	return (
		<AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<FrogBoss
					turn={turn}
					pose={pose}
					blink={blink}
					open={talk}
					glow={glow}
					glassesOff={reveal}
					expression={reveal ? 'heartbroken' : f > 200 && f < 270 ? 'calculating' : 'neutral'}
					style={{height: 960}}
				/>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 48, top: 36, color: '#9FB3B3', letterSpacing: 4, fontSize: 22}}>RIG TEST · {label}</div>
		</AbsoluteFill>
	);
};
