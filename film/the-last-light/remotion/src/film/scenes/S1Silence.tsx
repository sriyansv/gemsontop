import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {City, BRIDGE_NODES, WINDOWS} from '../City';
import {Fade, Finish} from '../fx';
import {motif, ramp} from '../lib';

// 0–8 s · 1A mote pulses in black · 1B pull-back reveals the city · 1C the lights die, beacon misses its third beat.
const HERO = WINDOWS.reduce((best, w, i) => (w.layer === 1 && Math.abs(w.x - 1040) + Math.abs(w.y - 470) < Math.abs(WINDOWS[best].x - 1040) + Math.abs(WINDOWS[best].y - 470) ? i : best), 0);

export const S1Silence: React.FC = () => {
	const f = useCurrentFrame();
	const mote = motif(f, 8);
	const zoom = ramp(f, 52, 175, 14, 1, Easing.out(Easing.cubic));
	const hero = WINDOWS[HERO];
	const ox = hero.x + hero.w / 2;
	const oy = hero.y + hero.h / 2;
	const dieAt = (d: number, r: number) => 172 + (1 - d) * 44 + r * 8;
	const life = (d: number, r: number) => ramp(f, dieAt(d, r), dieAt(d, r) + 6, 1, 0);
	const beacon = f < 205 ? 0.75 : f < 240 ? 0.75 * Math.max(motif(f, 206) * (f < 230 ? 1 : 0), 0.05) : 0;
	const sat = ramp(f, 160, 236, 1, 0.35);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${ox}px ${oy}px`, filter: `saturate(${sat})`}}>
				<City
					windowOn={(w, i) => (i === HERO ? Math.max(life(w.d, w.r), f < 60 ? mote : 0) : life(w.d, w.r) * (0.75 + 0.25 * Math.sin(i + f / 9)))}
					bridgeOn={(b, n) => ramp(f, 186 + ((b * BRIDGE_NODES + n) / (6 * BRIDGE_NODES)) * 28, 190 + ((b * BRIDGE_NODES + n) / (6 * BRIDGE_NODES)) * 28, 1, 0)}
					beacon={beacon}
					pan={{x: ramp(f, 60, 240, 40, -30), y: 0}}
				/>
			</AbsoluteFill>
			{/* Black holds until the pull-back begins; the hero window stays as the only light. */}
			<Fade o={ramp(f, 50, 90, 1, 0)} />
			{f < 90 ? (
				<AbsoluteFill>
					<div style={{position: 'absolute', left: ox - 9, top: oy - 9, width: 18, height: 18, borderRadius: 9, background: '#FFE3A0', opacity: mote * ramp(f, 60, 90, 1, 0), boxShadow: `0 0 ${30 + 60 * mote}px ${10 + 20 * mote}px rgba(255,200,100,${0.5 * mote})`}} />
				</AbsoluteFill>
			) : null}
			<Finish />
		</AbsoluteFill>
	);
};
