import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boss, Fade, Finish, rigToScreen} from '../fx';
import {Pip} from '../Pip';
import {handPoint, lerpPose, motif, ramp} from '../lib';
import {POSES} from '../../rig/poses';
import {onHead} from '../../rig/geometry';
import {Office} from './Office';
import type {Win} from '../City';

// 16–25 s · 3A Pip bumps the glass · 3B the Boss reaches out, Pip lands · 3C Pip's dying flash in his lenses.
// His near hand (screen-right) reaches toward the window.
const POINT_R = {...POSES.point, left: POSES.pockets.left, right: POSES.point.left};

const darkCity = () => (w: Win) => (w.r < 0.03 ? 0.25 : 0);

export const S3Signal: React.FC = () => {
	const f = useCurrentFrame();

	if (f < 90) {
		// Pip outside the glass, buffeted, two bumps at f 30 and 55, weak motif from 58.
		const px = interpolate(f, [0, 30, 40, 55, 70, 90], [1500, 1010, 1060, 980, 1010, 990], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
		const py = interpolate(f, [0, 30, 40, 55, 70, 90], [260, 420, 400, 450, 440, 445], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)}) + 6 * Math.sin(f / 3);
		const bump = Math.max(ramp(f, 30, 33, 1, 0, Easing.linear), ramp(f, 55, 58, 1, 0, Easing.linear));
		return (
			<AbsoluteFill>
				<Office city={{windowOn: darkCity(), bridgeOn: () => 0, beacon: 0.04}} cityScale={1.9}>
					<Pip x={px} y={py} size={46} intensity={0.25 + 0.55 * motif(f, 58) + 0.3 * bump} />
					{/* bump ripples on the glass */}
					<svg width={1920} height={1080} style={{position: 'absolute'}}>
						<circle cx={1010} cy={425} r={20 + 60 * (1 - ramp(f, 30, 44, 1, 0))} fill="none" stroke="#BEECEC" strokeOpacity={0.4 * ramp(f, 30, 44, 1, 0)} strokeWidth={3} />
						<circle cx={985} cy={455} r={20 + 60 * (1 - ramp(f, 55, 69, 1, 0))} fill="none" stroke="#BEECEC" strokeOpacity={0.4 * ramp(f, 55, 69, 1, 0)} strokeWidth={3} />
					</svg>
					{/* the Boss, out of focus in the foreground */}
					<Boss x={-260} y={260} h={1300} turn={120} pose="pockets" css={{filter: 'blur(7px) brightness(0.55)'}} />
				</Office>
				<Finish vignette={0.7} />
			</AbsoluteFill>
		);
	}

	if (f < 180) {
		const g = f - 90;
		// Anticipation: settle back, then reach.
		const reach = ramp(g, 12, 42, 0, 1, Easing.out(Easing.back(1.4)));
		const pose = lerpPose(POSES.pockets, POINT_R, reach);
		const turn = ramp(g, 0, 30, 10, 38);
		const B = {x: 380, y: 300, h: 760};
		const hp = handPoint(POINT_R, turn, 1);
		const tip = rigToScreen(B.x, B.y, B.h, hp.x + 30, hp.y - 6);
		const land = ramp(g, 40, 64, 0, 1, Easing.inOut(Easing.cubic));
		const px = interpolate(land, [0, 1], [1180, tip.x]) + (1 - land) * 30 * Math.sin(g / 4);
		const py = interpolate(land, [0, 1], [380, tip.y - 16]) - Math.sin(land * Math.PI) * 60;
		return (
			<AbsoluteFill>
				<Office city={{windowOn: darkCity(), bridgeOn: () => 0, beacon: 0.04, pan: {x: -40, y: 0}}} cityScale={1.2}>
					<Boss {...B} turn={turn} pose={pose} expression={g < 50 ? 'neutral' : 'serious'} glow={0.5 + 0.2 * land} breathe={1} />
					<Pip x={px} y={py} size={22} intensity={0.35 + 0.25 * Math.sin(g / 6)} flip={land > 0.6} />
					<AbsoluteFill style={{background: `radial-gradient(circle at ${(px / 1920) * 100}% ${(py / 1080) * 100}%, rgba(255,211,107,0.16), transparent 18%)`, mixBlendMode: 'screen'}} />
				</Office>
				<Finish vignette={0.68} />
				<Fade o={ramp(g, 0, 5, 0.7, 0)} />
			</AbsoluteFill>
		);
	}

	// 3C: close-up. Pip foreground right, motif weakening; gold glints in both lenses.
	const g = f - 180;
	const B = {x: 360, y: -120, h: 1900};
	const turn = 18;
	const pip = 0.15 + 0.7 * motif(g, 14) * 0.8 + 0.4 * motif(g, 58) * 0.5;
	const lens = [-1, 1].map((s) => rigToScreen(B.x, B.y, B.h, onHead(s * 32, 140, turn, 6).x, 140));
	return (
		<AbsoluteFill>
			<Office city={{windowOn: darkCity(), bridgeOn: () => 0, beacon: 0.03}} cityScale={2.4}>
				<Boss {...B} turn={turn} pose="pockets" expression={g < 50 ? 'neutral' : 'serious'} glow={0.45 + 0.25 * ramp(g, 50, 90)} breathe={1} />
				{lens.map((p, i) => (
					<div key={i} style={{position: 'absolute', left: p.x + 8, top: p.y - 30, width: 26, height: 26, borderRadius: 13, background: '#FFE3A0', opacity: 0.15 + 0.85 * pip, filter: 'blur(4px)'}} />
				))}
				<Pip x={1540} y={840} size={70} intensity={pip} flip />
				<AbsoluteFill style={{background: `radial-gradient(circle at 80% 78%, rgba(255,211,107,${0.25 * pip}), transparent 35%)`, mixBlendMode: 'screen'}} />
			</Office>
			<Finish vignette={0.72} />
		</AbsoluteFill>
	);
};
