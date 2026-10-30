import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {Boss, Fade, Finish, rigToScreen} from '../fx';
import {Pip} from '../Pip';
import {City, BRIDGE_NODES} from '../City';
import {RAISE, handPoint, lerpPose, motif, ramp} from '../lib';
import {POSES} from '../../rig/poses';
import {Office} from './Office';

// 25–38 s · 4A hand to the glasses · 4B the reveal — glasses off, total silence (27–32 s)
// · 4C eyes and Pip pulse the motif together; the city answers light by light into the vest mosaic.

export const S4Awakening: React.FC = () => {
	const f = useCurrentFrame();

	if (f < 210) {
		const B = {x: 360, y: -120, h: 1900};
		const push = ramp(f, 0, 210, 1, 1.18, Easing.inOut(Easing.sin));
		// anticipation dip, then the hand rises to the glasses; at 60 they come off and are lowered.
		const up = ramp(f, 8, 52, 0, 1, Easing.inOut(Easing.cubic)) - ramp(f, 2, 10, 0, 0.08) * (f < 10 ? 1 : 0);
		const down = ramp(f, 62, 92, 0, 1, Easing.inOut(Easing.cubic));
		const pose = f < 62 ? lerpPose(POSES.pockets, POSES.adjustGlasses, Math.max(0, up)) : lerpPose(POSES.adjustGlasses, POSES.holdGlasses, down);
		const off = f >= 60;
		const expression = !off ? 'serious' : f < 130 ? 'heartbroken' : f < 175 ? 'neutral' : 'calculating';
		const blink = Math.max(0, ramp(f, 132, 140, 0, 1, Easing.inOut(Easing.sin)) - ramp(f, 146, 156, 0, 1, Easing.inOut(Easing.sin)));
		const eyes = off ? ramp(f, 60, 74, 0.6, 1) : 0.6;
		return (
			<AbsoluteFill>
				<AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 30%'}}>
					<Office city={{windowOn: () => 0, bridgeOn: () => 0, beacon: 0.02}} cityScale={2.4}>
						<Boss {...B} turn={18} pose={pose} expression={expression} glassesOff={off} glow={eyes} blink={blink} breathe={off ? 0.5 : 1} />
						<Pip x={1540} y={860} size={70} intensity={0.12} flip />
					</Office>
				</AbsoluteFill>
				{/* In the silence the room falls away: everything but his eyes darkens. */}
				<AbsoluteFill style={{background: 'radial-gradient(ellipse at 52% 18%, transparent 18%, rgba(0,0,0,0.75) 60%)', opacity: ramp(f, 60, 110, 0, 1)}} />
				<Finish vignette={0.8} />
				{/* the instant the glasses clear his eyes: a single soft white bloom */}
				<Fade o={0.18 * ramp(f, 60, 64, 1, 0, Easing.linear) * (f >= 60 ? 1 : 0)} color="#FFFFFF" />
			</AbsoluteFill>
		);
	}

	// 4C — wide rooftop exterior. Boss small, lower-left, holding Pip up.
	const g = f - 210;
	const B = {x: 150, y: 590, h: 520};
	const raise = ramp(g, 0, 18, 0.4, 1, Easing.out(Easing.cubic));
	const pose = lerpPose(POSES.pockets, RAISE, raise);
	const hp = handPoint(RAISE, 20, -1);
	const hand = rigToScreen(B.x, B.y, B.h, hp.x, hp.y);
	const pulse = motif(g, 5);
	const answer = (d: number, r: number) => 40 + d * 120 + r * 22;
	const ring = ramp(g, 44, 110, 0, 1, Easing.out(Easing.quad));
	const rise = ramp(g, 0, 180, 0, -40, Easing.inOut(Easing.sin));
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `translateY(${rise}px) scale(1.06)`}}>
				<City
					windowOn={(w) => ramp(g, answer(w.d, w.r), answer(w.d, w.r) + 8, 0, 1)}
					bridgeOn={(b, n) => ramp(g, 70 + Math.abs(n - BRIDGE_NODES / 2) * 4 + b * 6, 76 + Math.abs(n - BRIDGE_NODES / 2) * 4 + b * 6, 0, 1)}
					beacon={0.05 + 0.25 * ramp(g, 120, 180)}
					mosaic={ramp(g, 70, 180, 0, 1.05, Easing.inOut(Easing.quad))}
					pan={{x: ramp(g, 0, 180, -20, 20), y: 0}}
				/>
			</AbsoluteFill>
			{/* the signal: a gold ring leaves Pip and rolls across the city */}
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				<circle cx={hand.x} cy={hand.y - 30} r={ring * 1700} fill="none" stroke="#FFE3A0" strokeWidth={6} opacity={(1 - ring) * 0.8} />
			</svg>
			{/* rooftop ledge */}
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				<path d="M0,1010 L720,1010 L760,1080 L0,1080 Z" fill="#05090B" />
				<path d="M0,1010 L720,1010" stroke="#2E9A9C" strokeOpacity={0.4} strokeWidth={3} />
			</svg>
			<Boss {...B} turn={20} pose={pose} glassesOff expression={g < 60 ? 'calculating' : 'warm'} glow={0.6 + 0.4 * pulse} breathe={1} css={{filter: 'drop-shadow(0 0 16px rgba(255,211,107,0.35))'}} />
			<Pip x={hand.x + 6} y={hand.y - 40} size={26} intensity={0.3 + 0.7 * Math.max(pulse, ramp(g, 50, 70))} />
			<Finish vignette={0.55} />
			<Fade o={ramp(g, 0, 4, 1, 0, Easing.linear)} />
		</AbsoluteFill>
	);
};
